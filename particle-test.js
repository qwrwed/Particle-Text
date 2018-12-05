class ParticleString{
	preload() {
		this.font = loadFont('AvenirNextLTPro-Demi.otf');
		//try to load in preload function; does not work
	}
	
	constructor(string, x,y){
		this.xdisp = x;
		this.ydisp = y;
		this.string = string;
		this.font = loadFont('AvenirNextLTPro-Demi.otf');
		//try to load in constructor; does not work
		this.fontSize = 40
		
		//font.textBounds(lineOfText, xpos, ypos, fontSize);
		var myBounds = this.font.textBounds(this.myText, 0, 0, this.fontSize);
	
	}
}