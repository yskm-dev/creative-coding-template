import p5 from 'p5'

class Particle {
  position: p5.Vector
  velocity: p5.Vector
  acceleration: p5.Vector
  p: p5
  r: number

  constructor(p: p5, x: number, y: number) {
    this.p = p
    this.position = p.createVector(x, y)
    this.velocity = p5.Vector.random2D().mult(this.p.random(1, 3))
    this.acceleration = p.createVector(0, 0)
    this.r = 10
  }

  applyForce(force: p5.Vector) {
    this.acceleration.add(force)
  }

  update() {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.acceleration.mult(0)

    if (this.position.x < -this.r) this.position.x = this.p.width + this.r
    if (this.position.x > this.p.width + this.r) this.position.x = -this.r
    if (this.position.y < -this.r) this.position.y = this.p.height + this.r
    if (this.position.y > this.p.height + this.r) this.position.y = -this.r
  }

  display() {
    this.p.fill(0, 40) // 黒っぽい粒子（必要なら色を変える）
    this.p.noStroke()
    this.p.circle(this.position.x, this.position.y, this.r * 2)
  }
}

function sketch(p: p5) {
  const particles: Particle[] = []
  const noiseScale = 0.0025
  const noiseSpeed = 0.004
  let t = 0

  function setup() {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.pixelDensity(Math.min(window.devicePixelRatio, 2))
    p.background(255)

    const count = Math.floor((p.width * p.height) / 18000) // 画面サイズに応じて粒子数

    for (let i = 0; i < count; i++) {
      particles.push(new Particle(p, p.random(p.width), p.random(p.height)))
    }
  }

  function draw() {
    // p.background(255)
    p.background(255, 18)
    const mouse = p.createVector(p.mouseX, p.mouseY)

    t += noiseSpeed

    particles.forEach(particle => {
      const d = p5.Vector.dist(mouse, particle.position)
      const radius = 140 // 反応する距離（小さめが上品）
      if (d < radius) {
        // 近いほど強い（0〜1）
        const strength = p.map(d, 0, radius, 1, 0)

        // 避ける方向：particle <- mouse を反転
        const repel = p5.Vector.sub(mouse, particle.position)
          .normalize()
          .mult(0.8 * strength) // 力の強さ（ここで“ちょい”調整）

        particle.applyForce(repel)
      }

      const n = p.noise(particle.position.x * noiseScale, particle.position.y * noiseScale, t)
      const angle = n * Math.PI * 2 * 2 // 2周分くらいで変化強め
      const force = p.createVector(Math.cos(angle), Math.sin(angle)).mult(0.1)
      particle.applyForce(force)
      const gravity = p.createVector(0, 0.02)
      particle.applyForce(gravity)
      particle.update()
      particle.display()
    })
  }

  function windowResized(event?: object) {
    p.resizeCanvas(p.windowWidth, p.windowHeight, false)
  }

  p.setup = setup
  p.draw = draw
  p.windowResized = windowResized
}

new p5(sketch)
