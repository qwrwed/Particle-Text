//minimal example code
let bgcolour = 51;
let blur_percent = 0;
let font;
let canvas;
const canvas_height = 500;
const canvas_width_min = 1000;

function preload(){
    font = loadFont('AvenirNextLTPro-Demi.otf');
}
//end general

//begin example (non-required) setup variables
//Example 1: Title
let text;
//Example 2: Clock
let clock;

function setup() {
    canvas = createCanvas(1000,500);
    text = new ParticleString('Sample Text', font, {y: height / 6});
    clock = new ParticleClock(font, {colour : '#00FFFF'});
}

function draw() {
    background(63);
    text.draw();
    clock.draw();
}

