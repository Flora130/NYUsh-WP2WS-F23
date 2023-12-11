
let params = {
  color_of_tube: "#FFFFFF"
};

let lights = [];
let ceiling, floor;
let spotLightHelper;
let targetBox;

let particles1 = [];
let particles2 = [];
let particles3 = [];
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

  //ceiling and floor
  ceiling = getPlane(2000, 2000);
  ceiling.position.y = -500;
  ceiling.rotation.x = PI / 2;
  ceiling.color = 0xA0A0A0;//does not work?
  scene.add(ceiling);
  floor = getPlane(2000, 2000);
  floor.position.y = 500;
  floor.rotation.x = PI / 2;
  scene.add(floor);

  // enable shadow
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default 

  //targetBoX(how to set the default?)
  targetBox = getBox();
  targetBox.material.color.set(0xFF00FF);
  targetBox.scale.set(1, 1, 1);
  scene.add(targetBox);

  const ambiLight = new THREE.AmbientLight(0x333333);
  scene.add(ambiLight);

  const tLight = new Light();
  tLight.setPosition(1500, 350, 1500);

  lights.push(tLight);

  const tLight1 = new Light();
  tLight1.setPosition(-1500, -350, -1500);//the position x/z do not work
  lights.push(tLight1);

  tLight.light.target = targetBox;
  tLight1.light.target = targetBox;

  // how to hide the helper by GUI?
  spotLightHelper = new THREE.SpotLightHelper(tLight.light);
  scene.add(spotLightHelper);
  spotLightHelper1 = new THREE.SpotLightHelper(tLight1.light);
  scene.add(spotLightHelper1);

  //setup gui
  gui.add(cube1.scale, "x").min(0).max(300).step(0.1);
  gui.addColor(params, "color_of_tube");
  let folderAmbiLight = gui.addFolder("AmbientLight");
  folderAmbiLight.open();
  folderAmbiLight.add(ambiLight.color, "r", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "g", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "b", 0.0, 1.0);
  let folderSpotLight = gui.addFolder("SpotLight");
  folderSpotLight.open();
  folderSpotLight.add(tLight.light, "intensity", 0.1, 20).step(0.1);
  folderSpotLight.add(tLight.light, "distance", 0, 2000).step(1);
  folderSpotLight.add(tLight.light, "decay", 0, 0.5).step(0.01);
}

function updateThree() {

  cube2.scale.x = 300 - cube1.scale.x;
  cube1.material.color.set(params.color_of_tube);
  cube2.material.color.set(params.color_of_tube);
  tube.material.color.set(params.color_of_tube)

  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;
  cube1.rotation.z += 0.01;
  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.01;
  cube2.rotation.z += 0.01;
  tube.rotation.x += 0.01;
  //tube.rotation.y += 0.01;
  tube.rotation.z += 0.01;


  let x1 = cos(frame * 0.01) * 300;
  let x2 = sin(frame * 0.01) * 300;
  let y1 = cos(frame * 0.01) * 300;
  let y2 = sin(frame * 0.01) * 300;
  let z1 = cos(frame * 0.01) * 300;
  let z2 = sin(frame * 0.01) * 300;
  for (let i = 0; i < 10; i++) {
    particles1.push(new Particle(x1, y2, 0, 10, 255, 0, 0));
  }
  for (let i = 0; i < 10; i++) {
    particles2.push(new Particle(0, y1, z2, 10, 0, 255, 0));
  }
  for (let i = 0; i < 10; i++) {
    particles3.push(new Particle(x2, 0, z1, 10, 0, 0, 255));
  }

  // update & display
  for (let p of particles1) {
    p.move1();
    p.slowDown();
    p.updateLifespan();
    p.update1();
  }
  for (let p of particles2) {
    p.move2();
    p.slowDown();
    p.updateLifespan();
    p.update2();
  }
  for (let p of particles3) {
    p.move3();
    p.slowDown();
    p.updateLifespan();
    p.update3();
  }

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

  for (let i = particles3.length - 1; i >= 0; i--) {
    let p = particles3[i];
    if (p.isDone) {
      scene.remove(particles3[i].mesh);
      particles3.splice(i, 1);
    }
  }

  // update the lights
  for (let l of lights) {
    l.move();
    l.update();
  }

  // update the target position
  let frequency = frame * 0.01;
  let radialDistance = 150;
  targetBox.position.x = 0;
  targetBox.position.y = 0;
  targetBox.position.z = sin(frequency) * radialDistance;

  // update the helper
  spotLightHelper.update();
  spotLightHelper1.update();
}

function getPlane(w, h) {
  const geometry = new THREE.PlaneGeometry(w, h, 32);
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true; //default is false

  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    ///
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
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
  const material = new THREE.MeshPhongMaterial({
    ///
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function getParticles() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    ///
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

//light
function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getLight() {
  const light = new THREE.SpotLight(0xFFFFFF, 15, 1000, PI / 4, 0.5, 0.1); // (color, intensity, distance (0=infinite), angle, penumbra, decay)

  light.castShadow = true; // default false
  // can't manipulate the mapSize in realtime.
  light.shadow.mapSize.width = 1024; // default
  light.shadow.mapSize.height = 1024; // default

  return light;
}


class Particle {
  constructor(x, y, z, size, r, g, b) {
    this.pos1 = createVector(x, y, 0);
    this.pos2 = createVector(0, y, z);
    this.pos3 = createVector(x, 0, z);
    this.vel = p5.Vector.random3D();
    this.vel.mult(random(1, 1.2));
    this.acc = createVector();
    this.mass = 1;
    this.size = size;
    this.r = r
    this.g = g;
    this.b = b;
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
  move3() {
    this.vel.add(this.acc);
    this.pos3.add(this.vel);
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
  update1() {
    this.mesh.position.x = this.pos1.x
    this.mesh.position.y = this.pos1.y
    this.mesh.position.z = this.pos1.z
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
  update2() {
    this.mesh.position.x = this.pos2.x
    this.mesh.position.y = this.pos2.y
    this.mesh.position.z = this.pos2.z
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
  update3() {
    this.mesh.position.x = this.pos3.x
    this.mesh.position.y = this.pos3.y
    this.mesh.position.z = this.pos3.z
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

class Light {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();

    this.mesh = getSphere();
    this.light = getLight();
    this.mesh.scale.set(20, 20, 20);

    this.group = new THREE.Group();
    this.group.add(this.mesh);
    this.group.add(this.light);

    scene.add(this.group);
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  setRotationAngle(x, y, z) {
    this.rot = createVector(x, y, z);
    return this;
  }
  setRotationVelocity(x, y, z) {
    this.rotVel = createVector(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    return this;
  }
  move() {
    let freq = frame * 0.01; // also angle
    let radialDistance = 30;
    this.pos.x = cos(freq) * radialDistance;
    this.pos.z = sin(freq) * radialDistance;
  }
  update() {
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.group.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.group.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}

class Cube {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();
    this.mesh = getBox();
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setTranslation(x, y, z) {
    this.mesh.geometry.translate(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  setRotationAngle(x, y, z) {
    this.rot = createVector(x, y, z);
    return this;
  }
  setRotationVelocity(x, y, z) {
    this.rotVel = createVector(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    return this;
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.mult(0);
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.mesh.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}