let allInstances = [];
class ParticleString {

    constructor(string, font, args) {

        let default_args = {
            colour : 255,
            fontSize : 40,
            font : font,
            id: string,
            //location of centre, as input:
            x : width/2,
            y : height/2
        };
        for (let k in default_args){
            this[k] = k in args ? args[k] : default_args[k];
        }

        this.textString  = string;

        let sampleScale = 13;
        this.sampleFactor = sampleScale in args? args.sampleFactor : sampleScale / this.fontSize;
        this.particleSize = 0.03 * this.fontSize;
        this.particleSize = Math.round(this.particleSize*10)/10;

        this.vehicleList = [];

        const bounds = this.font.textBounds(this.textString, 0, 0, this.fontSize);

        //actual location to start drawing at (corner), adjusted from input:
        this.posX = this.x - bounds.w / 2;
        this.posY = this.y + bounds.h / 2;

        const points = font.textToPoints(this.textString, this.posX, this.posY, this.fontSize, {
            sampleFactor: this.sampleFactor
        });

        for (let i = 0; i < points.length; i++) {
            //for (let i = 0; i <=1; i++) {
            const point = points[i];
            const newVehicle = new Vehicle(point.x, point.y, this.particleSize, this.colour);
            this.vehicleList.push(newVehicle);
        }
        allInstances.push(this);
    }


    draw(){
        this.apply();
    }

    apply() {
        for (let i = 0; i < this.vehicleList.length; i++) {
            const v = this.vehicleList[i];
            v.updateVehicleParams(this);
            v.behaviors();
            v.updateKinematics();
            v.show();
        }
    }


    updateText(string = this.textString) {
        const maxChangeForce = 0;
        //update the text string:
        this.textString = string;

        //update the bounds:
        const bounds = font.textBounds(this.textString, 0, 0, this.fontSize);
        this.posX = this.x - bounds.w / 2;
        this.posY = this.y + bounds.h / 2;

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


