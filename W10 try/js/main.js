let params = {
  drawCount: 0,
  particleColor: 0xFFFFFF
};

const WORLD_SIZE = 1000;
const WORLD_HALF = WORLD_SIZE / 2;
const MAX_PARTICLE_NUMBER = 1000;

let pointCloud;
let cloudParticles = [];
let cloudCubes = [];

function setupThree() {
  // floor
  const floor = getPlane();
  scene.add(floor);
  floor.position.y = -WORLD_HALF / 2;
  floor.rotation.x = -PI / 2;

  // create Points
  pointCloud = getPoints(600);

  // gui
  gui.add(params, "drawCount").min(0).max(MAX_PARTICLE_NUMBER).step(1).listen();
  gui.addColor(params, 'particleColor').onChange(updateParticleColor);
  updateParticleColor();
}

function updateThree() {
  // update the particles first
  for (let i = 0; i < cloudParticles.length; i++) {
    let p = cloudParticles[i];
    p.flow();
    p.rise(volume * 10);
    p.age();
    p.move();
    if (p.isDone) {
      cloudParticles.splice(i, 1);
      i--;
    }
  }

  while (cloudParticles.length > MAX_PARTICLE_NUMBER) {
    cloudParticles.splice(0, 1);
  }

  // then update the points
  const position = pointCloud.geometry.attributes.position;
  const color = pointCloud.geometry.attributes.color;
  const particleColor = new THREE.Color(params.particleColor);

  for (let i = 0; i < cloudParticles.length; i++) {
    let p = cloudParticles[i];
    let ptIndex = i * 3;

    // position
    position.array[ptIndex + 0] = p.pos.x;
    position.array[ptIndex + 1] = p.pos.y;
    position.array[ptIndex + 2] = p.pos.z;

    // color
    color.array[ptIndex + 0] = particleColor.r * p.lifespan;
    color.array[ptIndex + 1] = particleColor.g * p.lifespan;
    color.array[ptIndex + 2] = particleColor.b * p.lifespan;
  }

  position.needsUpdate = true;
  color.needsUpdate = true;
  pointCloud.geometry.setDrawRange(0, cloudParticles.length); // ***

  // update GUI
  params.drawCount = cloudParticles.length;
}

function updateParticleColor() {
  // Update particle color based on GUI value
  const particleColor = new THREE.Color(params.particleColor);

  for (let i = 0; i < cloudParticles.length; i++) {
    let p = cloudParticles[i];
    p.color = particleColor.clone(); // Clone to avoid reference issues
  }
}

function getPoints(number) {
  const vertices = new Float32Array(number * 3);
  const colors = new Float32Array(number * 3);

  // geometry
  const geometry = new THREE.BufferGeometry();
  // attributes
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  // draw range
  const drawCount = number; // draw the whole objects
  geometry.setDrawRange(0, drawCount);
  // geometry
  const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: 15,
    sizeAttenuation: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });

  // Update particle color based on GUI value
  updateParticleColor();

  // Points
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0x999999,
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}