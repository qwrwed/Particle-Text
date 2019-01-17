
class Vehicle {
    constructor(x, y, size, colour) {
        // set percentage of width/height (in both directions for each) away from middle that particles may spawn in:
        const spawn_area = 0.0;
        // create kinematic vectors:
        this.pos = createVector(random(width*(0.5-spawn_area), width*(0.5+spawn_area)), random(height*(0.5-spawn_area), height*(0.5+spawn_area)));
        this.vel = createVector();
        this.acc = createVector();
        // create vector of rest location of particle
        this.target = createVector(x, y);
        // set visual properties:
        this.particleSize = typeof(size)==='undefined'? 8 : size;
        this.colour = colour;
        // set max speed and force
        this.maxspeed = 20;
        this.maxforce = 10;

    }


    applyForce(f) {
        this.acc.add(f);
    }

    updateVisualParams(parent) {
        this.colour = parent.colour;
        this.particleSize = parent.particleSize;
    }

    updateKinematics() {
        // apply attraction to target:
        const arrive = this.arrive(this.target);
        this.applyForce(arrive);

        // apply repulsion from mouse
        const mousePos = createVector(mouseX, mouseY);
        const mouseForce = this.flee(mousePos);
        if (mouseIsPressed) { mouseForce.mult(-1); } // reverse direction if mouse is clicked
        this.applyForce(mouseForce);

        // adjust pos and vel, clear acc
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0);
    }

    show(renderer) {
        //set point radius (weight) and colour, then draw the point
        if (typeof (renderer) === 'undefined') {
            strokeWeight(this.particleSize);
            stroke(this.colour);
            point(this.pos.x, this.pos.y);
        } else {
            renderer.strokeWeight(this.particleSize);
            renderer.stroke(this.colour);
            renderer.point(this.pos.x, this.pos.y);
        }
    }

    draw(parent,renderer){
        this.updateVisualParams(parent);
        this.updateKinematics();
        this.show(renderer);
    }

    arrive(attractor){
        // desired: vector pointing from the particle's current position to the attractor
        let desired = p5.Vector.sub(attractor, this.pos);
        // d: distance between current position and target position
        const d = desired.mag();
        // set speed to maxspeed initially:
        let speed = this.maxspeed;
        // r: distance beyond which speed is max
        const r = 100;
        if (d < r) {
            speed = map(d, 0, r, 0, this.maxspeed);
        }
        desired.setMag(speed); //velocity vector; magnitude is speed and direction is towards target
        let steer = p5.Vector.sub(desired, this.vel); // steering force = desired - velocity
        steer.limit(this.maxforce);
        return(steer);
    }

    flee(repulsor){ //tweaked, reversed version of arrive()
        let desired = p5.Vector.sub(repulsor, this.pos);
        const d = desired.mag();
        let r = 50;
        let speed = 0;
        if (d < r) {
            speed = map(d, 0, r, this.maxspeed, 0);
        }
        desired.setMag(speed);
        desired.mult(-1);
        desired.limit(this.maxforce);
        return(desired);
    }

    clone() {
        const v = new Vehicle(this.pos.x, this.pos.y, this.particleSize);

        v.pos.x = this.pos.x;
        v.pos.y = this.pos.y;

        v.vel.x = this.vel.x;
        v.vel.y = this.vel.y;

        v.acc.x = this.acc.x;
        v.acc.y = this.acc.y;

        return v;
    }
}
