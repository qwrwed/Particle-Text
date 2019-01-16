let allInstances = [];
class ParticleString {
    get particleSize() {
        return this._particleSize;
    }

    set particleSize(value) {
        this._particleSize = value;
    }

    get fontSize() {
        return this._fontSize;
    }

    set fontSize(value) {
        this._fontSize = value;
        //this.updateText();
    }

    get colour() {
        return this._colour;
    }

    set colour(value) {
        this._colour = value;
        //this.updateText(); // gives error when called here
    }

    constructor(string, font, args={}, renderer) {

        let default_args = {
            colour: 255,
            fontSize: 40,
            font: font,
            id: string,
            //location of centre, as input:
            x: typeof(renderer)==='undefined'? width / 2 : renderer.width/2,
            y: typeof(renderer)==='undefined'? height / 2 : renderer.height/2,
        };
        for (let k in default_args) {
            this[k] = k in args ? args[k] : default_args[k];
        }

        this.textString = string;

        let sampleScale = 13;
        this.sampleFactor = sampleScale in args ? args.sampleFactor : sampleScale / this._fontSize;
        this._particleSize = 0.03 * this._fontSize;
        this._particleSize = Math.round(this._particleSize * 10) / 10;

        this.vehicleList = [];

        const bounds = this.font.textBounds(this.textString, 0, 0, this._fontSize);

        //actual location to start drawing at (corner), adjusted from input:
        this.posX = this.x - bounds.w / 2;
        this.posY = this.y + bounds.h / 2;

        const points = font.textToPoints(this.textString, this.posX, this.posY, this._fontSize, {
            sampleFactor: this.sampleFactor
        });

        for (let i = 0; i < points.length; i++) {
            //for (let i = 0; i <=1; i++) {
            const point = points[i];
            const newVehicle = new Vehicle(point.x, point.y, this._particleSize, this._colour);
            this.vehicleList.push(newVehicle);
        }
        allInstances.push(this);
    }

    //draw(g)
    // if g exists (g is renderer), draw to this renderer
    // g.doStuff()
    // OR just redefine function once
    // if no g, draw to canvas
    // doStuff
    // OR just redefine function once

    draw(renderer){
        this.apply(renderer)
    }

    apply(renderer) {
        for (let i = 0; i < this.vehicleList.length; i++) {
            const v = this.vehicleList[i];
            v.updateVehicleParams(this);
            v.behaviors(renderer);
            v.updateKinematics();
            v.show(renderer);
        }
    }


    updateText(string = this.textString) {
        const maxChangeForce = 0;
        //update the text string:
        this.textString = string;

        //update the bounds:
        const bounds = font.textBounds(this.textString, 0, 0, this._fontSize);
        this.posX = this.x - bounds.w / 2;
        this.posY = this.y + bounds.h / 2;

        const points = font.textToPoints(this.textString, this.posX, this.posY, this._fontSize, {
            sampleFactor: this.sampleFactor
        });

        if (points.length < this.vehicleList.length) {
            //if there are LESS points than existing vehicles (i.e. too many vehicles)
            const toSplice = this.vehicleList.length - points.length;
            //calculate the number of vehicles to remove
            this.vehicleList.splice(points.length - 1, toSplice);
            //remove the this number of vehicles, starting at the end of the list

        } else if (points.length > this.vehicleList.length) {

            //else, if there are MORE points than existing vehicles (not enough vehicles)
            for (let i = this.vehicleList.length; i < points.length; i++) {
                //for i starting at (length of vehicle list) up to (length of points list)
                const v = this.vehicleList[i - 1].clone();
                //make a clone the previous vehicle
                this.vehicleList.push(v);
                //and push it to the vehicle list
            }
        }
        for (let i = 0; i < points.length; i++) {
            this.vehicleList[i].target.x = points[i].x;
            this.vehicleList[i].target.y = points[i].y;
            const force = p5.Vector.random2D();
            force.mult(random(maxChangeForce));
            this.vehicleList[i].applyForce(force);
        }
    }
}

class ParticleClock extends ParticleString {
    constructor(font, args) {
        args.fontSize = args.fontSize || 192;
        super(hour() + ':' + minute() + ':' + second(), font, args);
        this.prevSec = -1;
        this.id = '[Clock]';
    }

    draw() {

        let hours = hour();
        let minutes = minute();
        let seconds = second();

        if (seconds !== this.prevSec) {
            this.prevSec = seconds;
            hours = nf(hours, 2, 0);
            minutes = nf(minutes, 2, 0);
            seconds = nf(seconds, 2, 0);
            this.updateText(hours + ':' + minutes + ':' + seconds);
        }

        this.apply();
    }
}


