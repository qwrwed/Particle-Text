//minimal implementation of clock and text
let font;

function preload(){
    font = loadFont('AvenirNextLTPro-Demi.otf');
}

//Example 1: Title
let text;
//Example 2: Clock
let clock;

function setup() {
    canvas = createCanvas(1000,500);
    //Example 1: Title
    text = new ParticleString('Sample Text', font, {y: height / 6});
    //Example 2: Clock
    clock = new ParticleClock(font, {colour : '#00FFFF'});
}

function draw() {
    background(63);
    //Example 1: Title
    text.draw();
    //Example 2: Clock
    clock.draw();
}

