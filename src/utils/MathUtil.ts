// 線形補間を行う関数
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t
}

// valueをminからmaxの範囲にクランプする関数
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

// valueをある範囲から別の範囲にマッピングする関数
// outMin以下、outMax以上にはみ出さないようにクランプも行う
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const clamped = clamp(value, inMin, inMax)
  return ((clamped - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

// 度をラジアンに変換する関数
export const degToRad = (deg: number): number => {
  return (deg * Math.PI) / 180
}

// ラジアンを度に変換する関数
export const radToDeg = (rad: number): number => {
  return (rad * 180) / Math.PI
}

// 正規化を行う関数
export const normalize = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min)
}

// 2Dベクトルクラス
export class Vector {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  // ベクトルの加算、減算、スカラー倍、除算メソッド
  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  subtract(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  divide(scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar)
  }
}

// 2つのベクトル間の距離を計算する関数
export const getDistance = (vector1: Vector, vector: Vector): number => {
  const dx = vector.x - vector1.x
  const dy = vector.y - vector1.y
  return Math.sqrt(dx * dx + dy * dy)
}

// 2つのベクトル間の角度を計算する関数（ラジアン単位）
export const getRad = (vector1: Vector, vector: Vector): number => {
  const dx = vector.x - vector1.x
  const dy = vector.y - vector1.y
  return Math.atan2(dy, dx)
}

// 2つのベクトル間の角度を計算する関数（度単位）
export const getDeg = (vector1: Vector, vector: Vector): number => {
  const rad = getRad(vector1, vector)
  return radToDeg(rad)
}

// Cubic Bezier曲線の計算を行う関数を生成する関数
export const getCubicBezierFunction = (
  p0: number,
  p1: number,
  p2: number,
  p3: number
): ((t: number) => number) => {
  return (t: number): number => {
    const u = 1 - t
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  }
}
