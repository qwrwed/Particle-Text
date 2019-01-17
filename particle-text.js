let allInstances = []; // global variable containing all instances of ParticleString and ParticleClock

class ParticleString {

    //getters and setters

    get sampleFactor() {
        return this._sampleFactor;
    }
    set sampleFactor(value) {
        value = +(+value).toFixed(2);
        this._sampleFactor = value;
        if (typeof(this.vehicleList)!== 'undefined') {
            this.updateText();
        }
    }

    get particleSize() {
        return this._particleSize;
    }
    set particleSize(value) {
        value = +(+value).toFixed(1);
        this._particleSize = value;
    }

    get fontSize() {
        return this._fontSize;
    }
    set fontSize(value) {
        this._fontSize = value;
        if (typeof(this.vehicleList)!== 'undefined') {
            this.updateText();
        }
    }

    get colour() {
        const col = this._colour;
        return color(col).toString();
    }
    set colour(value) {
        this._colour = value;
    }

    constructor(string, font, args={}, renderer) {

        //define object with default arguments
        let default_args = {
            colour: 255,
            fontSize: 40,
            font: font,
            id: string,
            //location of centre of string as input:
            x: typeof(renderer)==='undefined'? width / 2 : renderer.width/2,
            y: typeof(renderer)==='undefined'? height / 2 : renderer.height/2,
        };

        // iterate through default arguments and add input arguments if they exist and default arguments if not
        for (let k in default_args) {
            this[k] = k in args ? args[k] : default_args[k];
        }

        //set textstring
        this.textString = string;

        //calculate attributes that depend on previous args, using input or default values; process using setters
        let sampleScale = 13;
        this.sampleFactor = typeof(args.sampleFactor)!=='undefined' ? +args.sampleFactor : sampleScale / this._fontSize;
        this.particleSize = typeof(args.particleSize)!=='undefined' ? +args.particleSize : 0.03 * +this._fontSize;

        this.vehicleList = [];
        const bounds = this.font.textBounds(this.textString, 0, 0, this._fontSize);

        //actual location to start drawing at (corner), adjusted from input:
        this.posX = this.x - bounds.w / 2;
        this.posY = this.y + bounds.h / 2;

        const points = font.textToPoints(this.textString, this.posX, this.posY, this._fontSize, {
            sampleFactor: this.sampleFactor
        });

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const newVehicle = new Vehicle(point.x, point.y, this._particleSize, this._colour);
            this.vehicleList.push(newVehicle);
        }

        // push this instance to allInstances array
        allInstances.push(this);
    }

    draw(renderer){
        this.drawCommon(renderer);  //draw code not called directly as it is also used in ParticleClock class extension
    }

    drawCommon(renderer) {
        for (let i = 0; i < this.vehicleList.length; i++) {
            const v = this.vehicleList[i];
            v.draw(this, renderer);
        }
    }

    updateText(string = this.textString) {
        const maxChangeForce = 0;
        // update the text string:
        this.textString = string;

        // update the bounds:
        const bounds = font.textBounds(this.textString, 0, 0, this._fontSize);
        this.posX = this.x - bounds.w / 2;
        this.posY = this.y + bounds.h / 2;

        // update the points
        const points = font.textToPoints(this.textString, this.posX, this.posY, this.fontSize, {
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
        // set new target locations and apply random force
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
    constructor(font, args={}, renderer) {
        args.fontSize = args.fontSize || 192;
        super(hour() + ':' + minute() + ':' + second(), font, args, renderer); //call ParticleText constructor
        this.prevSec = -1;
        this.id = '[Clock]'; // no constant string value, so set custom id
    }

    draw(renderer) {

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

        this.drawCommon(renderer);
    }
}
