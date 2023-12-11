let mic;
let volume = 0;

function setup() {
    let canvas = createCanvas(640, 480);
    canvas.parent("container-p5");
    canvas.hide();

    mic = new p5.AudioIn();
    mic.start();

    initThree(); // ***
}

function draw() {
    background(100);

    volume = mic.getLevel(); // 0% to 100%

    // let dia = map(volume, 0, 1, 1, 500);
    // circle(width / 2, height / 2, dia);
    // fill(0, 255, 0);
    // text(volume, 10, 20);

}