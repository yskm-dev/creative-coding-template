import p5 from 'p5'

/**
 * DrawFn
 * p5インスタンスを受け取り描画する関数の型
 *
 * 「モチーフ」「変換」「対称性」を合成するための基本単位
 */
type DrawFn = (p: p5) => void

/**
 * 回転対称ラッパー
 *
 * n回回転させながら同じ描画を行う。
 *
 * 数学的には：
 * 回転行列
 *   [ cosθ  -sinθ ]
 *   [ sinθ   cosθ ]
 *
 * を n 分割して適用しているのと同じ。
 *
 * p.rotate() は現在の座標系自体を回転させるため、
 * 同じ描画を回転コピーできる。
 */
const withRotateSymmetry =
  (n: number) =>
  (draw: DrawFn): DrawFn =>
  p => {
    for (let i = 0; i < n; i++) {
      p.push()
      p.rotate((p.TWO_PI * i) / n) // 360° / n ずつ回転
      draw(p)
      p.pop()
    }
  }

/**
 * 鏡面写像（X軸方向）
 *
 * 数学的には
 *   x → -x
 *
 * つまり
 *   scale(-1, 1)
 *
 * これは線形代数でいう「反転行列」。
 */
const withMirrorX =
  () =>
  (draw: DrawFn): DrawFn =>
  p => {
    // 元の描画
    p.push()
    draw(p)
    p.pop()

    // 左右反転
    p.push()
    p.scale(-1, 1)
    draw(p)
    p.pop()
  }

/**
 * 鏡面写像（Y軸方向）
 *
 * 数学的には
 *   y → -y
 */
const withMirrorY =
  () =>
  (draw: DrawFn): DrawFn =>
  p => {
    p.push()
    draw(p)
    p.pop()

    p.push()
    p.scale(1, -1)
    draw(p)
    p.pop()
  }

/**
 * smoothstep
 *
 * 数学的には：
 * 0〜1の範囲で滑らかに変化する補間関数
 *
 * 公式：
 *   f(t) = t²(3 − 2t)
 *
 * 特徴：
 * - 端がなめらか（微分が0）
 * - ノイズの境界を自然にぼかせる
 *
 * 用途：
 * - 「主役領域」を柔らかく作る
 */
const smoothstep = (p: p5, e0: number, e1: number, x: number) => {
  const t = p.constrain((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}

/**
 * モチーフに渡す情報
 *
 * ここに「数学的な場（field）」や「補助関数」をまとめることで
 * モチーフを完全に独立させられる
 */
type MotifContext = {
  tileSize: number
  radius: number

  /**
   * ノイズ場（0〜1）
   *
   * これは「2次元の高さマップ」のようなもの。
   * (x, y) に対して値が決まる関数。
   */
  field: (x: number, y: number) => number

  /**
   * ノイズから角度を作る
   *
   * これは
   *   θ = f(x, y)
   *
   * という「方向場（ベクトル場）」を作っている。
   */
  fieldAngle: (x: number, y: number) => number

  /**
   * 主役になる場所を決めるマスク
   *
   * smoothstep を使って
   * 値が高いところだけ強調する
   */
  bandValue: (x: number, y: number) => number

  /**
   * 円内に収まっているか判定
   *
   * 数学：
   *   x² + y² ≤ r²
   */
  inCircle: (x: number, y: number) => boolean

  beginMotif: (p: p5) => void
  endMotif: (p: p5) => void
}

new p5(p => {
  /**
   * タイルサイズ
   *
   * これがデザインの基本単位
   * 敷き詰めることで壁紙になる
   */
  const tileSize = 240

  /**
   * 回転対称の回数
   *
   * 8 → 万華鏡っぽい
   */
  const rotateN = 8

  const useMirrorX = true
  const useMirrorY = false

  /**
   * ノイズのスケール
   *
   * 小さいほど「ゆっくり変化」
   * 大きいほど「細かく変化」
   */
  const fieldScale = 0.007

  /**
   * 角度の振れ幅
   *
   * 小さいほど流れが揃う
   */
  const angleRange = 0.55

  /**
   * 主役領域の設定
   */
  const threshold = 0.56
  const feather = 0.09

  /**
   * 描画可能な半径
   */
  const radius = tileSize * 0.46

  /**
   * ノイズ場
   *
   * デカルト座標 (x, y) → 値
   */
  const field = (x: number, y: number) => p.noise(x * fieldScale, y * fieldScale)

  /**
   * ノイズから角度を生成
   */
  const fieldAngle = (x: number, y: number) => {
    const n = field(x, y)
    return p.map(n, 0, 1, -angleRange, angleRange)
  }

  /**
   * 主役マスク
   */
  const bandValue = (x: number, y: number) => {
    const n = field(x, y)
    return smoothstep(p, threshold - feather, threshold + feather, n)
  }

  /**
   * 円内判定
   */
  const inCircle = (x: number, y: number) => x * x + y * y <= radius * radius

  /**
   * 円形クリッピング
   *
   * タイル境界が見えるのを防ぐ
   */
  const beginMotif = (p: p5) => {
    p.push()
    p.drawingContext.save()
    p.drawingContext.beginPath()
    p.drawingContext.arc(0, 0, radius, 0, Math.PI * 2)
    p.drawingContext.clip()
  }

  const endMotif = (p: p5) => {
    p.drawingContext.restore()
    p.pop()
  }

  /**
   * ===== ここがモチーフ（自由に描く場所） =====
   *
   * 座標は中心基準：
   * (0,0) がタイル中心
   *
   * つまりデカルト座標系そのもの。
   */
  const drawMotif = (p: p5, ctx: MotifContext) => {
    ctx.beginMotif(p)

    const t = p.frameCount * 0.01
    const s = ctx.tileSize

    p.noStroke()

    p.fill(100, 150, 240)
    p.rect(-s * 0.2 * p.sin(t), -s * 0.2 * p.cos(t), s * 0.1, s * 0.1)

    p.fill(240, 100, 150)
    p.circle(s * 0.1, s * 0.1, s * 0.1)

    p.fill(150, 240, 100)
    p.rect(-s * 0.6 * p.cos(t + p.PI), -s * 0.6 * p.sin(t + p.PI), s * 0.21, s * 0.21)

    ctx.endMotif(p)
  }

  /**
   * 変換を合成する
   *
   * 回転対称 + 鏡面写像
   */
  const buildComposer = () => {
    let composer = (d: DrawFn) => d

    if (useMirrorX && useMirrorY) {
      composer = d => withMirrorY()(withMirrorX()(d))
    } else if (useMirrorX) {
      composer = d => withMirrorX()(d)
    } else if (useMirrorY) {
      composer = d => withMirrorY()(d)
    }

    composer = (
      prev => d =>
        withRotateSymmetry(rotateN)(prev(d))
    )(composer)

    return composer
  }

  /**
   * 1タイルを描画
   */
  const drawKaleidoscopeTile = () => {
    p.push()

    // 中心を原点に
    p.translate(tileSize / 2, tileSize / 2)

    const ctx: MotifContext = {
      tileSize,
      radius,
      field,
      fieldAngle,
      bandValue,
      inCircle,
      beginMotif,
      endMotif,
    }

    const motifFn: DrawFn = p => drawMotif(p, ctx)
    const composed = buildComposer()(motifFn)

    composed(p)

    p.pop()
  }

  /**
   * タイルを敷き詰める
   *
   * これはデカルト座標の反復
   * for x, for y で平面を埋めている
   */
  const drawTiling = () => {
    for (let y = 0; y < p.height; y += tileSize) {
      for (let x = 0; x < p.width; x += tileSize) {
        p.push()
        p.translate(x, y)
        drawKaleidoscopeTile()
        p.pop()
      }
    }
  }

  p.setup = () => {
    p.createCanvas(960, 640)
    p.noiseSeed(42)
  }

  p.draw = () => {
    p.background(245)
    drawTiling()
  }

  p.keyPressed = () => {
    if (p.key === 's') p.saveCanvas('pattern_template', 'png')

    if (p.key === 'r') {
      p.noiseSeed(Math.floor(p.random(1_000_000)) + 100000)
    }
  }
})
