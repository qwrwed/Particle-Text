//The code for the examples can be removed/added, but the general code is required for all.


//begin general (required) setup code:
let bgcolour = 51;
let blur_percent = 0;
let font;
let canvas;
const canvas_height = 500;
const canvas_width_min = 1000;

let chosenElement = '-1';
let instance;

function preload(){
    font = loadFont('AvenirNextLTPro-Demi.otf');
}
//end general

//begin example (non-required) setup variables
//Example 1: Title
let clockTitlePS;
//Example 2: Clock
let clock;
//Example 3: Dynamic sequence
let ltr;
let count = 0;
let alphaString = String.fromCharCode(65 + count);
let prevSec, currSec;
//Example 4: Loop
let texts = [];
//end example

function setup() {
    //begin required
    const canvas_div = select('#canvas_div');
    canvas = createCanvas(max(canvas_div.width, canvas_width_min), canvas_height);
    canvas.parent('canvas_div');
    background(bgcolour);
    //end required

    //begin example
    //Example 1: Title
    clockTitlePS = new ParticleString('Particle Text', font, {y: height / 6, colour : '#b987ff'});
    //Example 2: Clock
    clock = new ParticleClock(font, {colour : 'orange'});
    //Example 3: Dynamic sequence
    prevSec = second();
    ltr = new ParticleString(alphaString, font, {x : 60, y : 400, id : '[Sequence]'});
    //Example 4: Loop
    const cols = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
    let textsBounds = [1,6]; //min 1, max 6
    for (let i = textsBounds[0]; i <= textsBounds[1] ; i++) {
        texts.push(new ParticleString('loop'+(i), font, {x : 100+20*Math.pow(i,2), y : 400, fontSize : i*10, colour : cols[i-1]}));
    }
    //end example

    //required: code to run after everything else is set up
    const dropdown = document.getElementById('element');
    for (let i = 0; i < allInstances.length; i++){
        dropdown.options[dropdown.options.length] = new Option(allInstances[i].id, i.toString());
    }
    //dropdown.value = 0; //set to first element instead of starting with all elements selected
    windowResized(); //initial sizing happens too early to account for vertical scrollbars taking up width, so resize now
    //instance = allInstances[chosenElement];
}

function draw() {
    //begin required
    background(bgcolour, 255 *(1 - blur_percent/100));
    //end required

    //begin example
    //Example 1: Title
    clockTitlePS.draw();
    //Example 2: Clock
    clock.draw();
    //Example 3: Dynamic Sequence
    currSec = second();
    if (prevSec !== currSec){
        prevSec = currSec;
        count = (count + 1) % 26;
        alphaString = String.fromCharCode(65 + count);
        ltr.updateText(alphaString);
    }
    ltr.draw();
    //Example 4: Loop
    for (let i = 0; i < texts.length ; i++) {
        texts[i].draw();
    }
    //end example
}

function windowResized() {
    resizeCanvas(max(select('#canvas_div').width, canvas_width_min), canvas_height);
}



document.addEventListener('DOMContentLoaded', function() {
    let allChosen = true;

    const dropdown = document.getElementById('element');
    const colourField = document.getElementById('colour');
    const fontSizeField = document.getElementById('fontSize');
    const particleSizeField = document.getElementById('particleSize');


    dropdown.addEventListener('change',chooseElement);
    function chooseElement(){
        chosenElement = dropdown.value;
        if (chosenElement ==='-1') {
            allChosen = true;
            colourField.value = null;
            fontSizeField.value = '(Must be changed individually)';
            particleSizeField.value = null;
            document.getElementById('setFontSize').disabled = true;
            fontSizeField.disabled = true;
        } else {
            instance = allInstances[chosenElement];
            allChosen = false;
            colourField.value = instance.colour;
            fontSizeField.value = instance.fontSize;
            particleSizeField.value = instance.particleSize;
            document.getElementById('setFontSize').disabled = false;
            fontSizeField.disabled = false;
        }
    }

    document.getElementById('setParticleSize').addEventListener('click', changeParticleSize);
    particleSizeField.addEventListener('change', changeParticleSize);
    function changeParticleSize(){
        if (particleSizeField.value !== '') {
            if (allChosen) {
                for (let i = 0; i < allInstances.length; i++) {
                    allInstances[i].particleSize = particleSizeField.value;
                }
            } else {
                instance.particleSize = particleSizeField.value;
            }
        }
    }

    document.getElementById('setFontSize').addEventListener('click', changeFontSize);
    fontSizeField.addEventListener('change', changeFontSize);
    function changeFontSize(){
        if (fontSizeField.value !== '') {
            instance.fontSize = fontSizeField.value;
            instance.updateText();
        }
    }
    document.getElementById('setColour').addEventListener('click', changeColour);
    colourField.addEventListener('change', changeColour)
    function changeColour(){
        if (colourField.value !== '') {
            if (allChosen) {
                for (let i = 0; i < allInstances.length; i++) {
                    allInstances[i].colour = colourField.value;
                }
            } else {
                instance.colour = colourField.value;
            }
        }
    }

    document.getElementById('params_form').addEventListener('submit', function (event){
        event.preventDefault();
    });

});

