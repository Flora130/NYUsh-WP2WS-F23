const params = {
  //
};


const WORLD_HALF = 1000;
let plane;
let ring1, ring2, ring3
let particles = []
let lights = []
//let pole;


function setupThree() {
  camera.position.y = 600;
  controls.update();

  const loader = new THREE.CubeTextureLoader();
  loader.setPath('assets/background/');
  textureCube = loader.load([
    'px.png', 'nx.png',
    'py.png', 'ny.png',
    'pz.png', 'nz.png'
  ]);
  scene.background = textureCube;

  // outer ring
  ring1 = getOuterRing(WORLD_HALF / 1, WORLD_HALF / 1.2)
  ring1.rotation.x = -PI / 2
  ring1.position.y = -100
  updateOuterRing();

  ring2 = getRing(WORLD_HALF / 3.5, WORLD_HALF / 1.5)
  ring2.rotation.x = -PI / 2

  ring3 = getRing(WORLD_HALF / 8, WORLD_HALF / 6)
  ring3.rotation.x = -PI / 2

  // enable shadow
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default 

  const ambiLight = new THREE.AmbientLight(0xffffff, 8);
  ambiLight.color.setRGB(0.03, 0.05, 0.03)
  scene.add(ambiLight);


  const stillLight = new Light();
  stillLight.setPosition(0, 750, 0);
  lights.push(stillLight);

  const movingLight = new Light();
  movingLight.setPosition(0, -550, 0);
  movingLight.scale = 1
  lights.push(movingLight);

  gui.add(camera.position, "y", -50, 2000).step(1);
  let folderAmbiLight = gui.addFolder("AmbientLight");
  folderAmbiLight.open();
  folderAmbiLight.add(ambiLight.color, "r", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "g", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "b", 0.0, 1.0);

}



let angle = 0;
function updateThree() {
  //updateAmbiLight(volume);


  ring1.rotation.z += 0.005;
  updateInnerRing();
  // generate more particles
  angle += 0.001 + volume;
  let x = cos(angle) * WORLD_HALF * 0.28;
  let z = sin(angle) * WORLD_HALF * 0.28;
  particles.push(new Particle(x, 200, z, 30));
  if (volume > 0.3) {
    camera.position.x = cos(angle) * WORLD_HALF * 0.1;
    camera.position.z = sin(angle) * WORLD_HALF * 0.1;
  } else {
    camera.position.x = cos(angle) * WORLD_HALF * 0.1;
    camera.position.z = sin(angle) * WORLD_HALF * 0.1;
  }
  camera.lookAt(0, 1, 0);
  let lookAtVector = new THREE.Vector3(0, 0, -5);
  lookAtVector.applyQuaternion(camera.quaternion);

  // update
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

  // light control
  let tLight = lights[1];
  let lightPosX = cos(frame * 0.02) * 350;
  let lightPosZ = sin(frame * 0.02) * 350;
  tLight.pos.x = lightPosX;
  tLight.pos.z = lightPosZ;

  for (let l of lights) {
    l.update();
  }
}

function updateInnerRing() {
  const dampingFactor = 0.2; // control the speed of the transition

  let posArray2 = ring2.geometry.attributes.position.array;
  for (let i = 0; i < posArray2.length; i += 3) {
    let x2 = posArray2[i + 0];
    let y2 = posArray2[i + 1];

    let xOffset2 = (x2 + WORLD_HALF) * 0.1 + frame * 0.01;
    let yOffset2 = (y2 + WORLD_HALF) * 0.1 + frame * 0.01;
    let amp2 = volume * 150 + 8;
    let noiseValue2 = -1 * (map(noise(xOffset2, yOffset2), 0, 1, -1, 1) * amp2) ** 2;

    let currentZ2 = posArray2[i + 2];
    let targetZ2 = noiseValue2;
    posArray2[i + 2] += (targetZ2 - currentZ2) * dampingFactor;
  }
  ring2.geometry.attributes.position.needsUpdate = true;

  let posArray3 = ring3.geometry.attributes.position.array;
  for (let i = 0; i < posArray3.length; i += 3) {
    let x3 = posArray2[i + 0];
    let y3 = posArray2[i + 1];

    let xOffset3 = (x3 + WORLD_HALF) * 0.1 + frame * 0.01;
    let yOffset3 = (y3 + WORLD_HALF) * 0.1 + frame * 0.01;
    let amp3 = volume * 100 + 10;
    let noiseValue3 = (map(noise(xOffset3, yOffset3), 0, 1, -1, 1) * amp3) ** 2;

    let currentZ3 = posArray3[i + 2];
    let targetZ3 = noiseValue3;
    posArray3[i + 2] += (targetZ3 - currentZ3) * dampingFactor;
  }
  ring3.geometry.attributes.position.needsUpdate = true;


}

function updateOuterRing() {
  let posArray1 = ring1.geometry.attributes.position.array;
  for (let i = 0; i < posArray1.length; i += 3) {
    let x1 = posArray1[i + 0];
    let y1 = posArray1[i + 1];
    let z1 = posArray1[i + 2];

    let xOffset = (x1 + WORLD_HALF) * 0.005;
    let yOffset = (y1 + WORLD_HALF) * 0.005;
    let amp = 12;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;
    posArray1[i + 2] = noiseValue;

  }
  ring1.geometry.attributes.position.needsUpdate = true;
}


function updateCamera() {
  camera.updateProjectionMatrix();
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

function getRing(innerSet, outerSet) {
  const geometry = new THREE.RingGeometry(innerSet, outerSet, 128, 10);
  let material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    // wireframe: true,
    //envMap: textureCube,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  //mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function getOuterRing(innerSet, outerSet) {
  const geometry = new THREE.RingGeometry(innerSet, outerSet * 2, 128, 10);
  let material = new THREE.MeshNormalMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  //mesh.castShadow = true;
  mesh.receiveShadow = true;
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
  const light = new THREE.SpotLight(0xCCE5FF, 15, 1200, PI / 4, 0.5, 0.1); // (color, intensity, distance (0=infinite), angle, penumbra, decay)
  light.castShadow = true; // default false
  // can't manipulate the mapSize in realtime.
  light.shadow.mapSize.width = 1024; // default
  light.shadow.mapSize.height = 1024; // default
  return light;
}

function getParticles() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial({
    ///
  });
  const cone = new THREE.Mesh(geometry, material); scene.add(cone);
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.rotation.x = PI / 2
  //mesh.receiveShadow = true;
  scene.add(mesh);

  return mesh;
}


class Particle {
  constructor(x, y, z, size) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D();
    this.vel.mult(random(1, 1.2));
    this.acc = createVector();
    this.mass = 1;
    this.size = size;
    this.sizeH = 100;
    this.lifespan = 1.00;
    this.lifeReduction = random(0.01, 0.02);
    this.isDone = false;
    this.mesh = getParticles();
    this.mesh.scale.set(this.size, this.sizeH, this.size);
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  bump() {
    if (volume > 0.1) {
      let height = map(volume, 0, 1, 0.2, 100);
      this.sizeH += height;
    }

  }
  slowDown() {
    this.vel.mult(0.1);
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
      this.sizeH * this.lifespan
    );
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
    let radialDistance = 40;
    this.pos.x = cos(freq) * radialDistance;
    this.pos.z = sin(freq) * radialDistance;
  }
  update() {
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.group.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.group.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}

