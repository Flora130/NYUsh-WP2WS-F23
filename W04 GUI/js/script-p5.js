function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  canvas.hide();

  initThree(); // ***
}

function draw() {
  background(100);

  noLoop();
}


class particle {
  constructor(x, y, rad) {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.mass = 1;
    this.rad = rad;
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.rad)
    pop();
  }
}