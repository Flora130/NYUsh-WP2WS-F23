let particles = [];
let gui;
let ui = {
  num: 100,
};
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(163, 196, 188);
  gui = new dat.GUI();
  gui.add(ui, "num", 100, 200, 5).onChange(updateNum);
}

function updateNum(){
  for (let i = 0; i < ui.num; i++) {
    particles[i] = new Particle(random(width), random(height));
  }
}

function draw() {

 for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.move();
    p.intersection(particles);
    p.display();
  }
}

class Particle {
  constructor(x, y) {
    this.dia = random(3, 5);
    this.c = random(255);
    this.pos = createVector(x, y);
    this.vel = createVector(random(-3, 3), random(-3, 3));
    this.acc = createVector();
    this.mass = this.dia;
  }

  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  slowDown() {
    this.vel.mult(0.97);
  }
  applyForce(f) {
    let force = p5.Vector.div(f, this.mass);
    this.acc.add(force);
  }
   intersection(array) {
    for (let i = 0; i < array.length; i++) {
      let other = array[i];
      if (this != other) {
        let distance = this.pos.dist(other.pos);
        if (distance < 10 && this.dia>other.dia) {
          this.dia+=2;
          other.dia-=2;
          
        }
      }
    }
  }
  bounce() {
    if (this.x < 0) {
      this.x = 0;
      this.xSpd = this.xSpd * -1;
    } else if (this.x > width) {
      this.x = width;
      this.xSpd = this.xSpd * -1;
    }
    if (this.y < 0) {
      this.y = 0;
      this.ySpd = this.ySpd * -1;
    } else if (this.y > height) {
      this.y = height;
      this.ySpd = this.ySpd * -1;
    }
  }
  display() {
    push();
    noStroke();
    fill(this.c);
    circle(this.pos.x, this.pos.y, this.dia);
    pop();
  }
}

