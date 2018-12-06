class ParticleString{
	
	//constructor(string, font, x, y){
	constructor(string, font, args){
		this.posX = args.x || 50;
		this.posY = args.y || 50;
		this.textString = string || "No string set";
		this.radius = 20;
		//this.font = loadFont('AvenirNextLTPro-Demi.otf');
		this.font = font;
		this.vehicleList = [];
		this.fontSize = args.fontSize || 40;
		
		this.particleSize = 0.03*this.fontSize;
		this.sampleFactor = 20 * 1/this.fontSize
		
		var bounds = this.font.textBounds(this.textString, 0, 0, this.fontSize);
		
		//positioning:
		//this.posX = x;
		//this.posY = y;
	
		var points = font.textToPoints(this.textString, this.posX, this.posY, this.fontSize, {
            sampleFactor: this.sampleFactor
		});
	
		for (var i = 0; i < points.length; i++) {
			var point = points[i];
			var newVehicle = new Vehicle(point.x, point.y, this.particleSize);
			this.vehicleList.push(newVehicle);
		}		
	}
	

	draw(){
		for (var i = 0; i < this.vehicleList.length; i++) {
			var v = this.vehicleList[i];
			v.behaviors();
			v.update();
			v.show();
		}
	}
	
	updateText(string) {
		var maxChangeForce = 0;
		//update the text string:
		this.textString = string;
		
		//update the bounds:
		var bounds = font.textBounds(this.textString, 0, 0, this.fontSize);
		//var posX = width / 2 - bounds.w / 2;
		//var posY = height / 2 + bounds.h / 2;

		var points = font.textToPoints(this.textString, this.posX, this.posY, this.fontSize, {
			sampleFactor: this.sampleFactor
		});
	
		if (points.length < this.vehicleList.length) {
		//if there are LESS points than existing vehicles (i.e. too many vehicles)
			var toSplice = this.vehicleList.length - points.length;
			//calculate the number of vehicles to remove
			this.vehicleList.splice(points.length - 1, toSplice);
			//remove the this number of vehicles, starting at the end of the list
			
		} else if (points.length > this.vehicleList.length) {
			
		//else, if there are MORE points than existing vehicles (not enough vehicles)
			for (var i = this.vehicleList.length; i < points.length; i++) {
			//for i starting at (length of vehicle list) up to (length of points list)
				var v = this.vehicleList[i - 1].clone();
				//make a clone the previous vehicle	
				this.vehicleList.push(v);
				//and push it to the vehicle list
			}
		}
		for (var i = 0; i < points.length; i++) {
		this.vehicleList[i].target.x = points[i].x;
		this.vehicleList[i].target.y = points[i].y;
		var force = p5.Vector.random2D();
		force.mult(random(maxChangeForce));
		this.vehicleList[i].applyForce(force);
		}
	}
	
}

class ParticleClock extends ParticleString{
	constructor(font, args){
		args.x = args.x || 100;
		args.y = args.y || 325;
		args.fontSize = args.fontSize || 192;
		super("abcd", font, args)
		this.prevSec = -1;
	}
	
	draw() {
		
		var hours = hour();
		var minutes = minute();
		var seconds = second();
		
		if(seconds != this.prevSec) {
			this.prevSec = seconds;
			hours = nf(hours, 2, 0);
			minutes = nf(minutes, 2, 0);
			seconds = nf(seconds, 2, 0);
			this.updateText(hours + ":" + minutes + ":" + seconds);
		}
		
		for (var i = 0; i < this.vehicleList.length; i++) {
			var v = this.vehicleList[i];
			v.behaviors();
			v.update();
			v.show();
		}
	}
}


