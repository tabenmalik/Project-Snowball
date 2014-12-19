function Game(){
	this.can = document.getElementById('canvas');
	this.ctx = can.getContext("2d");
	this.gamestate = {
		update = 0,
		draw = 0,
	}
	this.lastTickTime = 0;
	this.UPDATEINTERVAL = (1000/60);
	this.accumulate = 0;
	this.mouse = new Mouse();
	this.mainMenu = new Menu();
	
	this.setup = function(){
		log("Setting up Game Object");
		log("Setting up Main Menu");
		this.menu.setup();
		
	}
}

function Mouse(){
	this.x = 0;
	this.y = 0;
	this.r = 0;
	this.clicked = false;
	
	this.setup = function(can){
		can.addEventListener('click', handleClick);
		can.addEventListener('drag', handleClick);
	}
	
	this.handleClick = function(event){
		setMousePosition(event);
		this.clicked = true;
	}
	
	this.setMousePosition = function(){
		if(arguments.length == 1)
		{
			this.x = arguments[0].clientX - game.can.getBoundingClientRect().left;
			this.y = arguments[0].clientY - game.can.getBoundingClientRect().top + 0.875;
		}
		else if(arguments.length == 2)
		{
			this.x = arguments[0];
			this.y = arguments[1];
		}
	}
}

function Menu(){
	this.xFrontOffSet;
	this.yFrontOffSet;
	this.xBackOffSet;
	this.yBackOffSet;
	

	this.gamestate = {
		update = this.update;
		draw = this.draw;
	}
	this.setup = function(){
		
		game.gamestate = this.gamestate;
	}
	
	this.update = function(time){
		var x = (game.mouse.x - (game.can.width*0.5));
		var y = (game.mouse.y - (game.can.height*0.5));
		
		
	}
}

function PlayButton(){

}

function 

function Ball(a,b,c){//x,y coordinate and radius
	this.x = a;
	this.y = b;
	this.r = c; //radius
	this.speed = 100;
	this.angle = 0;
	
	function d(num){
		this.speed = num;
	}
	this.setSpeed = d;
	
	function e(num){
		this.angle = num;
	}
	this.setAngle = e;
	
	function f(time){
		this.x += Math.cos(this.angle) * this.speed * 0.001 * time;
		this.y += Math.sin(this.angle) * this.speed * 0.001 * time;
	}
	this.move = f;
	
	function g(time,xx,yy){//move in a circular motion around point xx,yy
		var distance = this.speed * time * 0.001;
		
		var tempAng = this.angle + ( Math.PI / 2.0 );
		if( tempAng > Math.PI)
			tempAng -= Math.PI;
		
		var coordinates = findIntersect(this.x,this.y,this.angle,xx,yy,tempAng);
		
		if(Math.sin(this.angle) == 1 && coordinates[1] > this.y){
			if(distance < findDistance(this.x,this.y, coordinates[0], coordinates[1])){
				this.x = Math.cos(this.angle) * distance;
				this.y = Math.sin(this.angle) * distance;
				return;
			}
			else{
				distance -= findDistance(this.x, this.y, coordinates[0], coordinates[1]);
				this.x = coordinates[0];
				this.y = coordinates[1];
			}
		}
		else if(Math.sin(this.angle) == -1 && coordinates[1] < this.y){
			if(distance < findDistance(this.x,this.y, coordinates[0], coordinates[1])){
				this.x = Math.cos(this.angle) * distance;
				this.y = Math.sin(this.angle) * distance;
				return;
			}
			else{
				distance -= findDistance(this.x, this.y, coordinates[0], coordinates[1]);
				this.x = coordinates[0];
				this.y = coordinates[1];
			}
		}
		else if( Math.sin(this.angle) > 0 && this.y < (Math.tan(tempAng) * coordinates[0]) - (Math.tan(tempAng)*xx) + yy - coordinates[1]){
			if(distance < findDistance(this.x,this.y, coordinates[0], coordinates[1])){
				this.x = Math.cos(this.angle) * distance;
				this.y = Math.sin(this.angle) * distance;
				return;
			}
			else{
				distance -= findDistance(this.x, this.y, coordinates[0], coordinates[1]);
				this.x = coordinates[0];
				this.y = coordinates[1];
			}
		}
		else if(Math.sin(this.angle) < 0 && this.y > (Math.tan(tempAng) * coordinates[0]) - (Math.tan(tempAng)*xx) + yy - coordinates[1]){
			if(distance < findDistance(this.x,this.y, coordinates[0], coordinates[1])){
				this.x = Math.cos(this.angle) * distance;
				this.y = Math.sin(this.angle) * distance;
				return;
			}
			else{
				distance -= findDistance(this.x, this.y, coordinates[0], coordinates[1]);
				this.x = coordinates[0];
				this.y = coordinates[1];
			}
		}
		else{
			console.log("ERROR");
		}
		
		var circleRadius = findDistance(this.x, this.y, xx,yy);
		var circumfrence = 2 * Math.PI * circleRaduis;
		while(distance > circumfrence){
			distance -= circumfrence;
		}
		
		this.angle += (distance / circumfrence) * 2 * Math.PI;
		if(this.angle > Math.PI)
			this.angle -= 2 * Math.PI;
		
		//this is where I am stuck
	}
	this.circle = g;
	
	function findIntersect(x,y,a,xx,yy,aa){
		var tempAng = this.angle + ( Math.PI / 2.0 );
		if( tempAng > Math.PI)
			tempAng -= Math.PI;
		
		var xxx = ( (Math.tan(this.angle) * this.x) - this.y - (Math.tan(tempAng) * xx) + yy ) / ( Math.tan(this.angle) - Math.tan(tempAng));
		var yyy = Math.tan(tempAng) * (xxx - xx) + yy;
		return [xxx,yyy];
	}
	
	function findDistance(x,y,xx,yy){
		return Math.sqrt(Math.pow( yy - y, 2) + Math.pow( xx - x, 2));
	}
}