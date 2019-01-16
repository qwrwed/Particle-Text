
class Vehicle {
    constructor(x, y, size, color) {
        const spawn_area = 0.0; // percentage of width/height (in both directions for each) away from middle that particles may spawn in
        this.pos = createVector(random(width*(0.5-spawn_area), width*(0.5+spawn_area)), random(height*(0.5-spawn_area), height*(0.5+spawn_area)));
        this.target = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.particleSize = typeof(size)==='undefined'? 8 : size;
        this.colour = color;
        this.maxspeed = 20;
        this.maxforce = 10;

    }

    behaviours(renderer) {
        //apply arrive/flee behaviours
        const arrive = this.arrive(this.target);

        const mousePos = typeof (renderer) === 'undefined' ? createVector(mouseX, mouseY) : createVector(renderer.mouseX, renderer.mouseY);
        //note: renderers do not appear to work with mouseX and mouseY functions, or have a usable equivalent
        let mouseForce = this.flee(mousePos);
        if (mouseIsPressed) {
            mouseForce.mult(-1);
        }
        this.applyForce(arrive);
        this.applyForce(mouseForce);
    };

    applyForce(f) {
        this.acc.add(f);
    };

    updateKinematics() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0);
    };

    show(renderer) {
        if (typeof (renderer) === 'undefined') {
            strokeWeight(this.particleSize);
            stroke(this.colour);
            point(this.pos.x, this.pos.y);
        } else {
            renderer.strokeWeight(this.particleSize);
            renderer.stroke(this.colour);
            renderer.point(this.pos.x, this.pos.y);
        }
    };

    updateVehicleParams(parent) {
        this.colour = parent.colour;
        this.particleSize = parent.particleSize;
    };

    arrive(target){
        //target: where the particle should be
        let desired = p5.Vector.sub(target, this.pos);
        //desired: vector pointing from the particle's current position to the particle's target position
        const d = desired.mag();
        //d: distance between current position and target position
        let speed = this.maxspeed;
        const r = 100
        if (d < r) {
            speed = map(d, 0, r, 0, this.maxspeed);
        }
        desired.setMag(speed); //velocity vector; magnitude is speed and direction is towards target
        let steer = p5.Vector.sub(desired, this.vel); // steering force = desired - velocity
        steer.limit(this.maxforce)
        return(steer);
    };

    flee(target){
        let desired = p5.Vector.sub(target, this.pos);
        const d = desired.mag();
        let r = 50
        let speed;
        if (d < r) {
            speed = map(d, 0, r, this.maxspeed, 0);
        } else {
            speed = 0
        }
        desired.setMag(speed); //velocity vector; magnitude is speed and direction is towards target
        desired.mult(-1);
        desired.limit(this.maxforce)
        return(desired);
    };


    /*
    arrive(target) {
        // target: where the particle should be (2-element vector)
        // this.pos: where the particle is (2-element vector)
        const desired = p5.Vector.sub(target, this.pos);
        //desired: position vector between current position and target position
        const d = desired.mag();
        //d: distance between current position and target position
        //desired.setMag(-Math.exp(-((d / 30)**2)));
        //return desired;
        let speed = this.maxspeed;
        //speed initially set to maximum speed, only change if d > 100
        if (d < 100) {
            speed = map(d, 0, 100, 0, this.maxspeed);
        }
        // if d < 100, speed is proportional to d
        desired.setMag(speed);
        const steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer;
    };

    flee(target) {
        // target: where the particle should be (2-element vector)
        // this.pos: where the particle is (2-element vector)
        const desired = p5.Vector.sub(target, this.pos);
        //desired: position vector between current position and target position
        const d = desired.mag();// * 2/ this.particleSize;
        //d: distance between current position and target position

        desired.setMag(-Math.exp(-(Math.pow((d / 30), 2))));
        return desired;

        if (d < 50) { //if mouse is closer than 50px:
            //let speed = -Math.exp(-(Math.pow((d / 30), 2)));
            //let speed = 1/(d**2);
            //frameRate(10)
            let speed = 1/(10**2)

            //console.log(speed)
            desired.setMag(speed);
            //
            //desired.mult(-1);
            const steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxforce);
            return steer;
        } else {
            //frameRate(144)
            return createVector(0, 0);
        }
    };
    */
    /*
    Vehicle.prototype.arrive = function (target) {
        // target: where the particle should be (2-element vector)
        // this.pos: where the particle is (2-element vector)
        const desired = p5.Vector.sub(target, this.pos);
        //desired: position vector between current position and target position
        const d = desired.mag();
        //d: distance between current position and target position
        //console.log(d);
        let mag = (d/30)**2;
        desired.setMag(mag);
        const steer = p5.Vector.sub(desired, this.vel);
        //steer.limit(this.maxforce);
        return steer;
    };
    Vehicle.prototype.arrive = function (target) {
        // target: where the particle should be (2-element vector)
        // this.pos: where the particle is (2-element vector)
        const desired = p5.Vector.sub(target, this.pos);
        //desired: position vector between current position and target position
        const d = desired.mag();
        //d: distance between current position and target position
        //desired.setMag(-Math.exp(-((d / 30)**2)));
        //return desired;
        let speed = this.maxspeed;
        if (d < 100) {
            speed = map(d, 0, 100, 0, this.maxspeed);
        }
        desired.setMag(speed);
        const steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer;
    };

    Vehicle.prototype.flee = function (target) {
        const desired = p5.Vector.sub(target, this.pos);
        const d = desired.mag();
        //desired.setMag(-Math.exp(-((d / 30) ** 2)));
        desired.setMag(-Math.exp(-((d/10)**2)));
        //desired.setMag(20/d);
        //desired.mult(-1);
        //const steer = p5.Vector.sub(desired, this.vel);
        //steer.limit(this.maxforce);
        //return steer;
        return desired;
    };

    Vehicle.prototype.flee = function (target) {
        // target: where the particle should be (2-element vector)
        // this.pos: where the particle is (2-element vector)
        const desired = p5.Vector.sub(target, this.pos);
        // desired
        const d = desired.mag();

        desired.setMag(-Math.exp(-((d / 30)**2)));
        return desired;
        if (d < 50) {

            desired.setMag(this.maxspeed);
            desired.mult(-1);
            const steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxforce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    };*/

    clone() {
        const v = new Vehicle(this.pos.x, this.pos.y, this.particleSize);

        v.pos.x = this.pos.x;
        v.pos.y = this.pos.y;

        v.vel.x = this.vel.x;
        v.vel.y = this.vel.y;

        v.acc.x = this.acc.x;
        v.acc.y = this.acc.y;

        v.r = this.particleSize;
        v.colour = this.colour;
        //make sure clone inherits radius and colour too

        return v;
    };
}
