let clockTitlePS;
let clock;

//begin required setup variables:
let bounds = [1000, 500];
let bgColor = 51;
let blur_percent = 0;
let font;
let canvas;
function preload(){
    font = loadFont('AvenirNextLTPro-Demi.otf');
}
//end required setup variables

//begin non-required setup variables for example
let count = 0;
let alphaString = String.fromCharCode(65 + count);
let prevSec, currSec;
let texts = [];
const cols = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
//end non-required setup variables for example

function setup() {
    //begin required
    canvas = createCanvas(bounds[0], bounds[1]);
    background(bgColor);
    //end required

    //begin non-required for example
    prevSec = second();
    //end non-required for example

    //add particle strings/clocks below:
    clockTitlePS = new ParticleString("Particle Text", font, {y: height / 6});
    clock = new ParticleClock(font, {color : '#00FFFF'});
    //ltr = new ParticleString(alphaString, font, {x : 700, y : 100});
    //test2 = new ParticleString("test2", font, {x : 500, y : 200, fontSize : 100});
    //v = new Vehicle(width/2, height/2, 10, "red");
    //uses the empty texts array above to create ParticleStrings in loop
    let textsBounds = [1,6]; //min 1, max 6
    for (let i = textsBounds[0]; i <= textsBounds[1] ; i++) {
        //texts.push(new ParticleString("loop"+(i), font, {x : 20*i**2, y : 400, fontSize : i*10, color : cols[i-1]}));
    }
    var dropdown = document.getElementById("element");
    for (let i = 0; i < allInstances.length; i++){
        dropdown.options[dropdown.options.length] = new Option(allInstances[i].id,i.toString())
    }

}

function draw() {
    //begin required
    background(bgColor, 255 *(1 - blur_percent/100));
    //end required

    //begin non-required for example
    currSec = second();
    if (prevSec !== currSec){
        prevSec = currSec;
        count = (count + 1) % 26;
        alphaString = String.fromCharCode(65 + count);
        //ltr.updateText(alphaString);
    }
    //end non-required for example


    //v.behaviors();
    //v.update();
    //v.show();
    //add draw functions for created particle strings/clocks below:
    clockTitlePS.draw();
    clock.draw();
    //ltr.draw();
    //test2.draw();

    //draw from texts array in loop
    for (let i = 0; i < texts.length ; i++) {
        //texts[i].draw();
    }
}

/*
function windowResized() {
	resizeCanvas(bounds[0], bounds[1]);
}
*/

document.addEventListener("DOMContentLoaded", function(){

    let chosenElement = 0;

    const dropdown = document.getElementById("element");
    function chooseElement(){
        chosenElement = dropdown.value;
    }
    dropdown.addEventListener("change",chooseElement);


    function changeParams(event){
        let colour = document.getElementById("colour").value;
        let radius = document.getElementById("radius").value;
        if (Number(dropdown.value) === -1) {
            for (let i = 0; i < allInstances.length; i++){
                allInstances[i].setColour(colour);
                allInstances[i].setParticleSize(radius);
            }
        } else {
            allInstances[chosenElement].setColour(colour);
            allInstances[chosenElement].setParticleSize(radius);
        }
    }
    
    const form = document.getElementById("params_form");
    form.addEventListener("submit", function (event){
        event.preventDefault();
        changeParams();
    });
});
