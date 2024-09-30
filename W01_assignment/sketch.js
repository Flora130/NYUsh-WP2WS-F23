//the length of braches can be changed by GUI
// when the mouse is in the center red circle, the black seeds would tremble until they reach the side.


let petals1 = [];
let petals2 = [];
let flocks = [];
let branches = [];
let seeds = [];
let gui;
let ui = {
  length: 100,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  gui = new dat.GUI();
  gui.add(ui, "length", 100, 120, 1).onChange(updateBranches);

  updateBranches();

  for (let i = 0; i < 200; i++) {
    flocks.push(new Flock(windowWidth / 2, windowHeight / 2));
  }

  for (let deg = 30; deg <= 360; deg += 30) {
    let rad = radians(deg);
    rotate(rad);
    petals1.push(new Petal1(windowWidth / 2, windowHeight / 2, deg, -100));
  }

  for (let deg = 60; deg <= 360; deg += 60) {
    let rad = radians(deg);
    rotate(rad);
    petals2.push(new Petal2(windowWidth / 2, windowHeight / 2, deg, -50));
  }
  for (let i = 0; i < 10; i++) {
    seeds.push(new Seed(windowWidth / 2 + random(-10,10), windowHeight / 2 + random(-10, 10)));
  }
}

function draw() {
  background(171, 58, 50);

  for (let i = 0; i < flocks.length; i++) {
    let f = flocks[i];
    if (mouseIsPressed) {
      let target = createVector(mouseX, mouseY);
      f.seek(target);
    }
    f.separate(flocks);
    f.align(flocks);

    f.update();
    f.checkEdges();
    f.display();
  }

  push();
  fill(83, 128, 31);
  noStroke();
  circle(
    windowWidth / 2,
    windowHeight / 2,
    ui.length * 7 + sin(frameCount * 0.1) * 20
  );
  pop();

  for (let b of branches) {
    b.display();
  }

  for (let i = 0; i < petals1.length; i++) {
    let p1 = petals1[i];
    p1.display();
  }
  for (let i = 0; i < petals2.length; i++) {
    let p2 = petals2[i];
    p2.display();
  }
   push();
  stroke(220,78,47);
  strokeWeight(5)
  fill(194, 78, 47);
  circle(windowWidth/2,windowHeight/2,150);
  pop();

  for (i = 0; i < seeds.length; i++) {
    let s = seeds[i];
    s.display();
    if (dist(windowWidth / 2, windowHeight / 2, mouseX, mouseY) < 100) {
      s.zigzag();
    }
  }
}

function updateBranches() {
  branches = [];
  allGenerate(windowWidth / 2, windowHeight / 2, ui.length);
}
function allGenerate(x, y, length) {
  for (let i = 0; i <= 12; i++) {
    generateBranch(x, y, 0 + 30 * i, length);
  }
}
function generateBranch(x, y, deg, len, gen = 0) {
  let angle = radians(deg);
  let targetX = x + cos(angle) * len;
  let targetY = y + sin(angle) * len;
  let sw = map(len, 150, 30, 50, 0);
  branches.push(new Branch(x, y, targetX, targetY, sw, gen));

  if (gen <= 4) {
    gen++;
    generateBranch(
      targetX,
      targetY,
      deg - random(15, 30),
      len * random(0.75, 0.8),
      gen
    );
    generateBranch(
      targetX,
      targetY,
      deg + random(15, 30),
      len * random(0.75, 0.8),
      gen
    );
  }
}

class Flock {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.acc = createVector();
    this.mass = 1;

    this.maxSpeed = 3; 
    this.maxSteerForce = 0.05; 

    this.separateDistance = 50;
    this.neighborDistance = 50;
  }
  update() {
    this.vel.add(this.acc);
    //this.vel.limit(this.maxSpeed); 
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle = this.vel.heading();
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }
  flock(others) {
    let cForce = this.cohision(others);
    let sForce = this.separate(others);
    let aForce = this.align(others);

    cForce.mult(0.5);
    sForce.mult(1.5);
    aForce.mult(2.0);

    this.applyForce(cForce);
    this.applyForce(sForce);
    this.applyForce(aForce);
  }
  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed); 
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxSteerForce);

    this.applyForce(steer);
  
  }
  separate(others) {
    let vector = createVector();
    let count = 0;
    for (let other of others) {
      if (this != other) {
        let distance = this.pos.dist(other.pos);
        if (distance < this.separateDistance && distance > 0) {
          let diff = p5.Vector.sub(this.pos, other.pos);
          diff.normalize();
          diff.div(distance);
          
          vector.add(diff);
          count++;
        }
      }
    }
    
    if (count > 0) {
      vector.div(count); 
    }
   
    if (vector.mag() > 0) {
      //apply force
      vector.setMag(this.maxSpeed);
      vector.sub(this.vel);
      vector.limit(this.maxSteerForce);
      this.applyForce(vector);
    }
  }
  cohesion(others) {
    let position = createVector();
    let count = 0;
    for (let other of others) {
      if (this != other) {
        let distance = this.pos.dist(other.pos);
        if (distance > 0 && distance < this.neighborDistance) {
          position.add(other.pos); 
          count++;
        }
      }
    }
    if (count > 0) {
      position.div(count); 
      this.seek(position);
    }
    return position;
  }
  align(others) {
    let velocity = createVector();
    let count = 0;
    for (let other of others) {
      if (this != other) {
        let distance = this.pos.dist(other.pos);
        if (distance > 0 && distance < this.neighborDistance) {
          velocity.add(other.vel);
          count++;
        }
      }
    }
    if (count > 0) {
      velocity.div(count);
      velocity.setMag(this.maxSpeed);
      //steerting force
      let steer = p5.Vector.sub(velocity, this.vel);
      steer.limit(this.maxSteerForce);
      this.applyForce(steer);
    }
  }
  checkEdges() {
    if (this.pos.x < 0) {
      this.pos.x = windowWidth;
    } else if (this.pos.x > windowWidth) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = windowHeight;
    } else if (this.pos.y > windowHeight) {
      this.pos.y = 0;
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    stroke(204, 204, 0);
    strokeWeight(6);
    line(0, 0, 0, 20);
    line(0, 20, -10, 40);
    line(0, 20, 10, 40);
    pop();
  }
}

class Petal1 {
  constructor(x, y, angle, dis) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.dis = dis;
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));
    rotate(frameCount * 0.02);
    fill(240, 219, 129);
    stroke(123, 100, 143);
    strokeWeight(2.5);
    beginShape();
    vertex(0, -200 + this.dis);
    bezierVertex(-50, -150 + this.dis, -90, 30 + this.dis, 0, 0 + this.dis);
    bezierVertex(90, 30 + this.dis, 50, -150 + this.dis, 0, -200 + this.dis);
    endShape();
    stroke(123, 100, 143);
    for (let i = 0; i < 60; i += 10) {
      bezier(
        0,
        -200 + this.dis,
        -50 + i,
        -150 + this.dis,
        -60 + i,
        -20 + this.dis,
        0,
        0 + this.dis
      );
      bezier(
        0,
        -200 + this.dis,
        50 - i,
        -150 + this.dis,
        60 - i,
        -20 + this.dis,
        0,
        0 + this.dis
      );
    }
    pop();
  }
}

class Petal2 {
  constructor(x, y, angle, dis) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.dis = dis;
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));
    rotate(frameCount * 0.01);
    fill(240, 219, 129, 225);
    stroke(123, 100, 143);
    strokeWeight(2);
    beginShape();
    vertex(0, -200 + this.dis);
    bezierVertex(-50, -150 + this.dis, -90, 30 + this.dis, 0, 0 + this.dis);
    bezierVertex(90, 30 + this.dis, 50, -150 + this.dis, 0, -200 + this.dis);
    endShape();
    stroke(123, 100, 143);
    for (let i = 0; i < 60; i += 10) {
      bezier(
        0,
        -200 + this.dis,
        -50 + i,
        -150 + this.dis,
        -60 + i,
        -20 + this.dis,
        0,
        0 + this.dis
      );
      bezier(
        0,
        -200 + this.dis,
        50 - i,
        -150 + this.dis,
        60 - i,
        -20 + this.dis,
        0,
        0 + this.dis
      );
    }
    pop();
  }
}

class Branch {
  constructor(x, y, tx, ty, sw, gen) {
    this.x = x;
    this.y = y;
    this.tx = tx;
    this.ty = ty;
    this.thickness = sw;
    this.gen = gen;
  }
  display() {
    push();
    stroke(184, 176, 106);
    strokeWeight(this.thickness);
    line(this.x, this.y, this.tx, this.ty);
    pop();
  }
}

class Seed {
  constructor(x, y) {
    this.x=x;
    this.y=y;
  }
  zigzag(){
    if(dist(windowWidth/2,windowHeight/2,this.x,this.y)<65){
    this.x+=random(-3,3);
    this.y+=random(-3,3);
  }}
 
  display() {
    push();
    translate(this.x,this.y);
    noStroke();
    fill(0);
    circle(0, 0, 20);
    pop();
  }
}


