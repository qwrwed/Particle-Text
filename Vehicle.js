// Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// Video: [coming soon]

function Vehicle(x, y, size, color) {
    this.pos = createVector(random(width), random(height));
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = size || 8;
    this.colour = color;
    this.maxspeed = 20;
    this.maxforce = 2;
}

Vehicle.prototype.behaviors = function () {
    const arrive = this.arrive(this.target);
    const mouse = createVector(mouseX, mouseY);
    const flee = this.flee(mouse);
    if (mouseIsPressed) { flee.mult(-1); } else{ flee.mult(5); }
    //arrive.mult(1);
    this.applyForce(arrive);
    this.applyForce(flee);
};

Vehicle.prototype.applyForce = function (f) {
    this.acc.add(f);
};

Vehicle.prototype.updateKinematics = function () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
};

Vehicle.prototype.show = function () {
    stroke(this.colour);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
};

Vehicle.prototype.updateVehicleParams = function (parent) {
    this.colour = parent.colour;
    this.r = parent.particleSize;
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

Vehicle.prototype.flee = function (target) {
    // target: where the particle should be (2-element vector)
    // this.pos: where the particle is (2-element vector)
    const desired = p5.Vector.sub(target, this.pos);
    // desired
    const d = desired.mag();// * 2/ this.r;

    desired.setMag(-Math.exp(-(Math.pow((d / 30),2))));
    return desired;
    /*
    if (d < 50) {

        desired.setMag(this.maxspeed);
        desired.mult(-1);
        const steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer;
    } else {
        return createVector(0, 0);
    }*/
};

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

Vehicle.prototype.clone = function () {
    const v = new Vehicle(this.pos.x, this.pos.y, this.r);

    v.pos.x = this.pos.x;
    v.pos.y = this.pos.y;

    v.vel.x = this.vel.x;
    v.vel.y = this.vel.y;

    v.acc.x = this.acc.x;
    v.acc.y = this.acc.y;

    v.r = this.r;
    v.colour = this.colour;
    //make sure clone inherits radius and colour too
	
    return v;
};