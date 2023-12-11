const params = {
  // (add)
};

const WORLD_HALF = 1000;
let plane;
let ring1, ring2, ring3
let particles = []

function setupThree() {
  ring1 = getRing(WORLD_HALF / 1.5, WORLD_HALF / 2)
  ring2 = getRing(WORLD_HALF / 4, WORLD_HALF / 3)
  ring3 = getRing(WORLD_HALF / 8, WORLD_HALF / 6)
  ring1.rotation.x = -PI / 2
  ring2.rotation.x = -PI / 2
  ring3.rotation.x = -PI / 2

  const ambiLight = new THREE.AmbientLight(0x333333, 5);
  scene.add(ambiLight);

  // enable shadow
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default 

  const lights = [];
  for (let i = 0; i < 5; i++) {
    let light_x = 100 + i * 200;
    let light_y = 300;
    let light_z = 100 + i * 200;
    lights.push(new Light(light_x, light_y, light_z));
  }
  scene.add(lights)

  let folderAmbiLight = gui.addFolder("AmbientLight");
  folderAmbiLight.open();
  folderAmbiLight.add(ambiLight.color, "r", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "g", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "b", 0.0, 1.0);
  //folderAmbiLight.add(ambiLight.intensity, "intensity", 1, 10);
  let folderSpotLight = gui.addFolder("SpotLight");
  folderSpotLight.open();
  // folderSpotLight.add(lights.SpotLight, "intensity", 0.1, 20).step(0.1);
  // folderSpotLight.add(lights.SpotLight, "distance", 0, 2000).step(1);
  // folderSpotLight.add(lights.SpotLight, "decay", 0, 0.5).step(0.01);
}

function updateThree() {
  let posArray1 = ring1.geometry.attributes.position.array;
  const dampingFactor = 0.1; // control the speed of the transition

  for (let i = 0; i < posArray1.length; i += 3) {
    let x1 = posArray1[i + 0];
    let y1 = posArray1[i + 1];

    let xOffset1 = (x1 + WORLD_HALF) * 0.1 + frame * 0.01;
    let yOffset1 = (y1 + WORLD_HALF) * 0.1 + frame * 0.01;
    let amp1 = volume * 100 + 1;
    let noiseValue1 = (map(noise(xOffset1, yOffset1), 0, 1, -1, 1) * amp1) ** 2;

    // Smoothly transition the z-coordinate using damping
    let currentZ1 = posArray1[i + 2];
    let targetZ1 = noiseValue1;
    posArray1[i + 2] += (targetZ1 - currentZ1) * dampingFactor;
  }

  let posArray2 = ring2.geometry.attributes.position.array;
  for (let i = 0; i < posArray2.length; i += 3) {
    let x2 = posArray2[i + 0];
    let y2 = posArray2[i + 1];

    let xOffset2 = (x2 + WORLD_HALF) * 0.1 + frame * 0.01;
    let yOffset2 = (y2 + WORLD_HALF) * 0.1 + frame * 0.01;
    let amp2 = volume * 100 + 1;
    let noiseValue2 = -1 * (map(noise(xOffset2, yOffset2), 0, 1, -1, 1) * amp2) ** 2;

    // Smoothly transition the z-coordinate using damping
    let currentZ2 = posArray2[i + 2];
    let targetZ2 = noiseValue2;
    posArray2[i + 2] += (targetZ2 - currentZ2) * dampingFactor;
  }

  ring1.geometry.attributes.position.needsUpdate = true;
  ring2.geometry.attributes.position.needsUpdate = true;

  let x = cos(frame * 0.01) * WORLD_HALF / 2.5;
  let z = sin(frame * 0.01) * WORLD_HALF / 2.5;
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(x, 0, z, 10, 255, 0, 0));
  }
  for (let p of particles) {
    p.move();
    p.slowDown();
    p.updateLifespan();
    p.update();
    p.bump();
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    if (p.isDone) {
      scene.remove(particles[i].mesh);
      particles.splice(i, 1);
    }
  }
}


function getRing(innerSet, outerSet) {
  const geometry = new THREE.RingGeometry(innerSet, outerSet, 256);
  let material = new THREE.MeshPhongMaterial({
    // color: 0xffffff,
    //wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  return mesh;
}

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

function getParticles() {
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return mesh;
}

class Particle {
  constructor(x, y, z, size, r, g, b) {
    this.pos = createVector(x, y, z);
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
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  bump() {
    if (volume > 0.2) {
      let jumpSpd = map(volume, 0.3, 1, 5, 10);
      this.acc.y += jumpSpd;
      this.vel.add(this.acc);
    } else {
      this.vel.mult(0.8);
    }
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
    this.mesh.position.x = this.pos.x
    this.mesh.position.y = this.pos.y
    this.mesh.position.z = this.pos.z
    this.mesh.scale.set(
      this.size * this.lifespan,
      this.size * this.lifespan,
      this.size * this.lifespan
    );
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
    this.intensity = 5
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