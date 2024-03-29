//The code for the examples can be removed/added, but the general code is required for all.

//begin general (required) setup code:
let bgcolour = 51;
let blur_percent = 0;
let font;
let canvas;
const canvas_height = 500;
const canvas_width_min = 1000;

let chosenElement = '-1';
let instance = allInstances;

function preload(){
    font = loadFont('AvenirNextLTPro-Demi.otf'); //must be loaded first
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
let alphaString = String.fromCharCode(65 + count); //convert 65 to ASCII => 'A'
let prevSec, currSec;
//Example 4: Loop
let texts = [];
//end example

function setup() {

    //begin required
    //create canvas in specified div element:
    const canvas_div = select('#canvas_div');
    canvas = createCanvas(max(canvas_div.width, canvas_width_min), canvas_height);
    canvas.parent('canvas_div');
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
        texts.push(new ParticleString('loop'+(i), font, {
            x : 100+20*Math.pow(i,2),
            y : 400,
            fontSize : i*10,
            colour : cols[i-1]
        }));
    }
    //end example

    //required: code to run after everything else is set up
    const dropdown = document.getElementById('element');
    for (let i = 0; i < allInstances.length; i++){
        dropdown.options[dropdown.options.length] = new Option(allInstances[i].id, i.toString());
    }

}

function draw() {
    //begin required
    background(bgcolour, 255 *(1 - blur_percent/100)); // bg opacity related to blur percent
    //end required

    //begin example
    //Example 1: Title
    clockTitlePS.draw();
    //Example 2: Clock
    clock.draw();
    //Example 3: Dynamic Sequence
    currSec = second();
    if (prevSec !== currSec){ //only run once per second
        prevSec = currSec;
        count = (count + 1) % 26; //loop through numbers (-> letters) 1 to 26
        alphaString = String.fromCharCode(65 + count);
        ltr.updateText(alphaString); //update with new letter
    }
    ltr.draw();
    //Example 4: Loop
    for (let i = 0; i < texts.length ; i++) {
        texts[i].draw();
    }
    //end example

}

document.addEventListener('DOMContentLoaded', function() {
    let allChosen = true; //initialise

    //reference elements in variablesL
    const dropdown = document.getElementById('element');

    const colourField = document.getElementById('colour');
    const fontSizeField = document.getElementById('fontSize');
    const particleSizeField = document.getElementById('particleSize');
    const sampleFactorField = document.getElementById('sampleFactor');

    const colourDisplay = document.getElementById('colourDisplay');
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    const particleSizeDisplay = document.getElementById('particleSizeDisplay');
    const sampleFactorDisplay = document.getElementById('sampleFactorDisplay');

    //associate elements, defaults with param names for later iteration and potential for further extension
    const fields = {
        colour : colourField,
        fontSize : fontSizeField,
        particleSize : particleSizeField,
        sampleFactor : sampleFactorField
    };

    const displays = {
        colour : colourDisplay,
        fontSize : fontSizeDisplay,
        particleSize : particleSizeDisplay,
        sampleFactor : sampleFactorDisplay
    };

    const defaults = {
        colour : '',
        fontSize : 0,
        particleSize : 0,
        sampleFactor : 0
    };

    // allInstances acts as a dummy element to remember values applied to all instances simultaneously
    // initialise values to defaults:
    for (let key in defaults){
        allInstances[key] = defaults[key];
    }

    dropdown.addEventListener('change',chooseElement);
    // set chosen instance, and thus get its current values for display:
    function chooseElement(){
        chosenElement = dropdown.value;
        if (chosenElement ==='-1') {
            instance = allInstances;
            allChosen = true;
        } else {
            instance = allInstances[chosenElement];
            allChosen = false;
        }
        for (let param in fields){
            fields[param].value = instance[param];
            displays[param].innerHTML = instance[param];
        }
    }

    colourField.addEventListener('change', function(){changeParam('colour');});
    fontSizeField.addEventListener('input', function(){changeParam('fontSize');});
    particleSizeField.addEventListener('input', function(){changeParam('particleSize');});
    sampleFactorField.addEventListener('input', function(){changeParam('sampleFactor');});

    function changeParam(paramName){
        if (fields[paramName].value !== '') {
            if (allChosen) { // iterate through and set allInstances[i].parameter for all i
                for (let i = 0; i < allInstances.length; i++) {
                    allInstances[i][paramName] = fields[paramName].value; //set parameter for current instance
                }
                // get the value to set from the first element because they now all have the same value
                displays[paramName].innerHTML = allInstances[0][paramName]; // change text to show value
            } else {
                displays[paramName].innerHTML = instance[paramName]; // change text to show value
            }
            instance[paramName] = fields[paramName].value; //set parameter for chosen instance
        }
    }

    document.getElementById('params_form').addEventListener('submit', function (event){
        event.preventDefault(); //prevent page refresh when pressing Enter
    });

});

