

let cube;

function setupTHREE() {
    knot = getKnot();
    cube = getBox();
    //change the position
    //cube.position.set(0, 0, 0)
    //change size
    cube.scale.x = 10;
    cube.scale.y = 2;
    cube.scale.z = 15;

    cube = getBox();
    //cube1.pos...

    ball = getSphere();
    ball1 = getSphere();
    ball2 = getSphere();
    ball1.position.set(10, 15, 0)
    ball2.position.set(-10, 15, 0)
    knot.position.y = 15;
    ball.position.y = 15;


    //change the view postion
    camera.position.z = 30;
    camera.position.x = 0;
    camera.position.y = 15
}

function updateTHREE() {
    knot.rotation.x += 0.1;
    knot.rotation.z += 0.1;
    ball1.position.y += 0.1
    ball2.position.y -= 0.1


}

function getBox() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial({
        color: 0xffff00,
        wireframe: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
}


function getSphere() {
    const geometry = new THREE.SphereGeometry(3, 32, 16);
    const material = new THREE.MeshNormalMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
}

function getKnot() {
    const geometry = new THREE.TorusKnotGeometry(10, 3, 10, 16);
    const material = new THREE.MeshNormalMaterial({
        color: 0xffff00,
        wireframe: true
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
}


function setup() {
    //let canvas = createCanvas(500, 400);
    // canvas.parent('container-p5');
    // canvas.hide();
    background(100);

    initTHREE();
}

function draw() {
    noLoop();
}


///theree.js///
let scene, camera, renderer;
let time, frame = 0;

function initTHREE() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);


    container = document.getElementById('container-three');
    container.appendChild(renderer.domElement);

    setupTHREE();
    animate();
}


function animate() {
    requestAnimationFrame(animate); //
    frame++;
    time = performance.now();
    updateTHREE();

    renderer.render(scene, camera);
}





