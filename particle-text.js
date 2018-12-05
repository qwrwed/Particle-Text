class ParticleString{
	
	
	constructor(string, font, x, y){
		this.xdisp = x;
		this.ydisp = y;
		this.textString = string;
		this.radius = 20;
		//this.font = loadFont('AvenirNextLTPro-Demi.otf');
		this.font = font;
		this.vehicleList = [];
		this.fontSize = 40;
		var particleSize = 3
		
		//font.textBounds(lineOfText, xpos, ypos, fontSize);
		var bounds = font.textBounds(this.textString, 0, 0, this.fontSize);
		
		//positioning:
		var posX = x;
		var posY = y;
	
		//conversion:
		var sampleFactor = 0.3
		var points = font.textToPoints(this.textString, posX, posY, this.fontSize, {
            sampleFactor: sampleFactor
		});
	
		for (var i = 0; i < points.length; i++) {
			var point = points[i];
			var newVehicle = new Vehicle(point.x, point.y, particleSize);
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
}

