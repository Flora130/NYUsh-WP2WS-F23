const params = {
  // (add)
};

const WORLD_HALF = 1000;
let plane;
let ring1, ring2

function setupThree() {
  ring1 = getRing(WORLD_HALF / 3, WORLD_HALF / 2)
  ring2 = getRing(WORLD_HALF / 6, WORLD_HALF / 4)
  ring3 = getRing(WORLD_HALF / 10, WORLD_HALF / 8)
  ring1.rotation.x = -PI / 2
  ring2.rotation.x = -PI / 2
  ring3.rotation.x = -PI / 2
}

function updateThree() {
  let posArray = ring1.geometry.attributes.position.array;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.1 + frame * 0.01;
    let yOffset = (y + WORLD_HALF) * 0.1 + frame * 0.01;
    let amp = 15;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 2;

    posArray[i + 2] = noiseValue; // update the z value.
  }
  ring1.geometry.attributes.position.needsUpdate = true;
}


function getRing(innerSet, outerSet) {
  const geometry = new THREE.RingGeometry(innerSet, outerSet, 512);
  let material = new THREE.MeshNormalMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  // let posArray = geometry.attributes.position.array;
  // for (let i = 0; i < posArray.length; i += 3) {
  //   let x = posArray[i + 0];
  //   let y = posArray[i + 1];
  //   let z = posArray[i + 2];

  //   let xOffset = (x + WORLD_HALF) * 0.005;
  //   let yOffset = (y + WORLD_HALF) * 0.005;
  //   let amp = 9;
  //   let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

  //   posArray[i + 2] = noiseValue; // update the z value.
  // }

  scene.add(mesh);
  return mesh;
}

