let params = {
  color: "#FFF"
};

let tube;

function setupThree() {
  tube1 = getTube();
  tube1.position.set(1, 0, 0); //(x, y, z);
  tube1.scale.x = 50;
  tube1.scale.y = 50;
  tube1.scale.z = 50;

  tube2 = getTube();
  tube2.position.set(1, 0, 0); //(x, y, z);
  tube2.scale.x = 50;
  tube2.scale.y = 50;
  tube2.scale.z = 50;
  tube2.rotation.x = PI / 2
}

function updateThree() {
  tube1.rotation.x += 0.01;
  tube2.rotation.x += 0.01;
}

function getTube() {
  class CustomSinCurve extends THREE.Curve {

    constructor(scale = 1) {
      super();
      this.scale = scale;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {

      const tx = t * 6 - 3;
      const ty = Math.sin(5 * Math.PI * t);
      const tz = 0;

      return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
  }

  const path = new CustomSinCurve(10);
  const geometry = new THREE.TubeGeometry(path, 25, 2, 8, false);
  const material = new THREE.MeshNormalMaterial({
    wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}