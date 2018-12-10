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
	this.color = color;
    this.maxspeed = 20;
    this.maxforce = 2;
}

Vehicle.prototype.behaviors = function () {
    const arrive = this.arrive(this.target);
    const mouse = createVector(mouseX, mouseY);
    const flee = this.flee(mouse);
	if (mouseIsPressed) {
		flee.mult(-3);
	} else{
		flee.mult(5);
	}
    
	arrive.mult(1);
	
    this.applyForce(arrive);
    this.applyForce(flee);
};

Vehicle.prototype.applyForce = function (f) {
    this.acc.add(f);
};

Vehicle.prototype.update = function () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
};

Vehicle.prototype.show = function () {
    stroke(this.color);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
};


Vehicle.prototype.arrive = function (target) {
    const desired = p5.Vector.sub(target, this.pos);
    const d = desired.mag();
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
    // target: where the particle should be (2-element vector)
    // this.pos: where the particle is (2-element vector)
    const desired = p5.Vector.sub(target, this.pos);
    // desired
    const d = desired.mag();

    //desired.setMag(-Math.exp(-((d / 30)**2)));
    //return desired;
    if (d < 50) {

        desired.setMag(this.maxspeed);
        desired.mult(-1);
        const steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer;
    } else {
        return createVector(0, 0);
    }
};

Vehicle.prototype.clone = function () {
    const v = new Vehicle(this.pos.x, this.pos.y, this.r);

    v.pos.x = this.pos.x;
    v.pos.y = this.pos.y;

    v.vel.x = this.vel.x;
    v.vel.y = this.vel.y;

    v.acc.x = this.acc.x;
    v.acc.y = this.acc.y;

	v.r = this.r;
	v.color = this.color;
	//make sure clone inherits radius and colour too
	
    return v;
};