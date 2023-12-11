let cube;
let gui;
let params = {
  start: false,
  x: 0,
  y: 0,
  z: 0,
  color: 0xFFFF00
}

function setupThree() {

  cube = getBox();
  cube.position.set(1, 0, 0); //(x, y, z);
  cube.scale.x = 100;
  cube.scale.y = 100;
  cube.scale.z = 100;

  const gui = new dat.GUI();
  gui.add(params, 'start');


  gui.add(cube.scale, 'x')
  gui.add(cube.scale, 'y')
  gui.add(cube.scale, 'z')


  gui.add(params, 'x').min(-50).max(50).step(1);
  gui.add(params, 'y', -50, 50, 0.1);
  gui.add(params, 'z', -50, 50, 1).listen().onChange(resetPosition);
  gui.addColor(params, 'color').onChange(function () {
    console.log('Color Changed')

    //gui.addColor(cube.material, 'color')
  })
  //console.log(params.x);


}

function resetPosition() {
  cube.position.z = params.z
}


function updateThree() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // cube.position.set(params.x, params.y, params.z);
  cube.position.x = params.x;
  cube.position.y = params.y;
  cube.position.z += 3
  params.z = cube.position.z;
  cube.material.color.set(params.color)
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return mesh;
}