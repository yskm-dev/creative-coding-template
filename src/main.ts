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

    if (this.position.y > this.p.height - this.r) {
      this.position.y = this.p.height - this.r
      this.velocity.y *= -0.8
    }
    if (this.position.x > this.p.width - this.r) {
      this.position.x = this.p.width - this.r
      this.velocity.x *= -0.8
    }
    if (this.position.x < this.r) {
      this.position.x = this.r
      this.velocity.x *= -0.8
    }
  }

  display() {
    this.p.fill('#ff4d00')
    this.p.noStroke()
    this.p.circle(this.position.x, this.position.y, this.r * 2)
  }
}

function sketch(p: p5) {
  const particles: Particle[] = []
  function setup() {
    p.createCanvas(p.windowWidth, p.windowHeight)
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(p, p.random(p.width), p.random(p.height)))
    }
  }

  function draw() {
    p.background(255)
    particles.forEach(particle => {
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
