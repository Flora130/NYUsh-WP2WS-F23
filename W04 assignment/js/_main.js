let params = {
  color: "#d42e2e"
};

let particles1 = [];
let particles2 = [];
let cube1, cube2;
let tube;

function setupThree() {
  cube1 = getBox();
  cube2 = getBox();

  cube1.position.set(0, 40, 0);
  cube1.scale.set(0, 10, 10);
  cube2.position.set(0, -40, 0);
  cube2.scale.x = 300;
  cube2.scale.y = 10;
  cube2.scale.z = 10;

  tube = getTube();
  //tube.position.set(0, 0, 0)

  //setup gui
  gui.add(cube1.scale, "x").min(0).max(300).step(0.1);
  gui.addColor(params, "color");
}

function updateThree() {
  cube2.scale.x = 300 - cube1.scale.x;
  cube1.material.color.set(params.color);
  cube2.material.color.set(params.color);
  tube.material.color.set(params.color)

  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;
  cube1.rotation.z += 0.01;
  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.01;
  cube2.rotation.z += 0.01;
  tube.rotation.x += 0.01;
  tube.rotation.y += 0.01;
  tube.rotation.z += 0.01;


  let x = cos(frame * 0.01) * 300;
  let y = sin(frame * 0.01) * 300;
  let z = cos(frame * 0.01) * 300;
  for (let i = 0; i < 10; i++) {
    particles1.push(new Particle(x, y, 0, 10));
    particles2.push(new Particle(0, y, z, 10));
    ///
  }


  // update & display
  for (let p of particles1) {
    p.move1();
    p.slowDown();
    p.updateLifespan();
    p.update();
  }
  for (let p of particles2) {
    p.move2();
    p.slowDown();
    p.updateLifespan();
    p.update();
  }

  while (particles1.length > 1500) {
    let index = 0;
    scene.remove(particles1[index].mesh);
    particles1.splice(index, 1); // (index, q);
  }

  while (particles2.length > 1500) {
    let index = 0;
    scene.remove(particles2[index].mesh);
    particles2.splice(index, 1); // (index, q);
  }
  // remove once they are done!
  for (let i = particles1.length - 1; i >= 0; i--) {
    let p = particles1[i];
    if (p.isDone) {
      scene.remove(particles1[i].mesh);
      particles1.splice(i, 1);
    }
  }
  for (let i = particles2.length - 1; i >= 0; i--) {
    let p = particles2[i];
    if (p.isDone) {
      scene.remove(particles2[i].mesh);
      particles2.splice(i, 1);
    }
  }
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function getTube() {
  class CustomSinCurve extends THREE.Curve {
    constructor(scale = 1) {
      super();
      this.scale = scale;
    }
    getPoint(t, optionalTarget = new THREE.Vector3()) {
      const tx = t * 3 - 1.5;
      const ty = Math.sin(2 * Math.PI * t);
      const tz = 0;
      return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
  }
  const path = new CustomSinCurve(120);
  const geometry = new THREE.TubeGeometry(path, 100, 3, 8, false);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.5
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function getParticles() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return mesh;
}

class Particle {
  constructor(x, y, z, size) {
    this.pos1 = createVector(x, y);
    this.pos2 = createVector(y, z);
    this.vel = p5.Vector.random3D();
    this.vel.mult(random(1, 1.2));
    this.acc = createVector();
    this.mass = 1;
    this.size = size;//where is the size?
    this.r = random(255);
    this.g = 0;
    this.b = 0;
    this.lifespan = 1.00;
    this.lifeReduction = random(0.005, 0.05);
    this.isDone = false;

    this.mesh = getParticles();
    this.mesh.scale.set(this.size, this.size, this.size);
  }
  move1() {
    this.vel.add(this.acc);
    this.pos1.add(this.vel);
    this.acc.mult(0);
  }
  move2() {
    this.vel.add(this.acc);
    this.pos2.add(this.vel);
    this.acc.mult(0);
  }
  slowDown() {
    this.vel.mult(0.9);
  }
  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  update() {
    this.mesh.position.x = this.pos1.x = this.pos2.x;
    this.mesh.position.y = this.pos1.y = this.pos2.y;
    this.mesh.position.z = this.pos1.z = this.pos2.z;
    this.mesh.scale.set(
      this.size * this.lifespan,
      this.size * this.lifespan,
      this.size * this.lifespan
    );

    // this.mesh.material.color = params.color
    this.mesh.material.color.r = this.r;
    this.mesh.material.color.g = this.g;
    this.mesh.material.color.b = this.b;
  }


}