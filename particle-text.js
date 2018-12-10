
class ParticleString {

    //constructor(string, font, x, y){
    constructor(string, font, args) {
        let sampleScale = 13;
        this.textString = string || "No string set";
        this.font = font;
        this.vehicleList = [];
        this.fontSize = args.fontSize || 40;
		this.color = args.color || 255;
        this.particleSize = args.particleSize || 0.03 * this.fontSize;
        this.sampleFactor = args.sampleFactor || sampleScale / this.fontSize;
        //resolution; density using distances between particles.
        //static limiter for particles?
        //precalculate positions?
        console.log(this.sampleFactor);


        const bounds = this.font.textBounds(this.textString, 0, 0, this.fontSize);

        //location of centre, as input:
        this.x = (args.x || width / 2);
        this.y = (args.y || height / 2);

        //actual location to start drawing at (corner), adjusted from input:
        this.posX = this.x - bounds.w / 2;
        this.posY = this.y + bounds.h / 2;

        const points = font.textToPoints(this.textString, this.posX, this.posY, this.fontSize, {
            sampleFactor: this.sampleFactor
        });

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const newVehicle = new Vehicle(point.x, point.y, this.particleSize, this.color);
            this.vehicleList.push(newVehicle);
        }
    }


    draw() {
        for (let i = 0; i < this.vehicleList.length; i++) {
            const v = this.vehicleList[i];
            v.behaviors();
            v.update();
            v.show();
        }
    }

    updateText(string) {
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
        super(hour() + ":" + minute() + ":" + second(), font, args);
        this.prevSec = -1;
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
            this.updateText(hours + ":" + minutes + ":" + seconds);
        }

        for (let i = 0; i < this.vehicleList.length; i++) {
            const v = this.vehicleList[i];
            v.behaviors();
            v.update();
            v.show();
        }
    }
}


