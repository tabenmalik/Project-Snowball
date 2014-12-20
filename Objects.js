function Mouse(){
	this.x = 0;
	this.y = 0;
	this.r = 0;
	this.clicked = false;
	
	this.setup = function(){
		can.addEventListener('click', handleClick);
		can.addEventListener('drag', handleClick);
	};
	
	this.setMousePosition = function(){
		if(arguments.length == 1)
		{
			this.x = arguments[0].clientX - can.getBoundingClientRect().left;
			this.y = arguments[0].clientY - can.getBoundingClientRect().top + 0.875;
		}
		else if(arguments.length == 2)
		{
			this.x = arguments[0];
			this.y = arguments[1];
		}
	};
}

function PlayGameState(){
	this.player;
	this.gamestate = {
		update:0,
		draw:0,
	};
	
	this.setup = function(){
		this.player = new Player(100,100,10,0);
	};
	
	this.changeState = function(){
		gamestate = this.gamestate;
	};
	
	this.update = function(time){
		this.player.move(time);
	};
	
	this.draw = function(){
		ctx.clearRect(0,0,can.width, can.height);
	
		ctx.beginPath();
		ctx.arc(this.player.x, this.player.y, this.player.r, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	};
}

function Player(a,b,c,d){
	this.x = a;
	this.y = b;
	this.r = c;
	this.angle = d;
	this.speed = 100;
	
	this.move = function(time){
		this.x += Math.cos(this.angle) * this.speed * 0.001 * time;
		this.y += Math.sin(this.angle) * this.speed * 0.001 * time;
	};
	
	
	this.circle = function(time,xx,yy){//move in a circular motion around point xx,yy
		
		var distance = this.speed * time * 0.001;
		
		var tempAng = this.angle + ( Math.PI / 2.0 );
		if( tempAng > Math.PI)
			tempAng -= Math.PI * 2;

		var moveTowardTanPoint = false; //this is turned true when the code realizes that the object is behind the tangent point, so that it will still move forward for a bit.
		
		if(Math.sin(this.angle) == 0 ){ //this if statement runs when the player is moving completely sideways. (because tan would be undefined, I have to type some special math)
			if(Math.cos(this.angle) == 1 && this.x < coordinates[0])//moving right and behind tan point.
				moveTowardTanPoint = true;
			else if(Math.cos(this.angle) == -1 && this.x > coordinates[0])// moving left and behind tan point
				moveTowardTanPoint = true;
		}
		else if(Math.sin(this.angle) > 0){
			if(this.y < coordinates[1])//player is moving up and is behind tan point
				moveTowardTanPoint = true;
		}
		else if(Math.sin(this.angle) < 0){
			if(this.y > coordinates[1])//player is moving down and is behind tan point
				moveTowardTanPoint = true;
		}
		
		//if "moveTowardTanPoint" is false, it immediately starts circular motion. If it is true, it moves straight toward the tangent point, and then does corcular movement.
		if(moveTowardTanPoint){
			if(distance < findDistance(this.x,this.y, coordinates[0], coordinates[1])){//the distance the player needs to move is smaller than the distance to the tan point.
				this.x += Math.cos(this.angle) * distance;
				this.y += Math.sin(this.angle) * distance;
				return; //returns because it has ran out of distance.
			}
			else{//sets player to tan point, but subtracts the distance that it took to get there.
				distance -= findDistance(this.x,this.y, coordinates[0], coordinates[1]);
				this.x = coordinates[0];
				this.y = coordinates[1];
			}
		}
		console.log("Position (" + this.x + ", " + this.y + ")");
		
		//if the function has not returned by this point, it starts circular motion.
		var radius = findDistance(this.x, this.y, xx, yy);
		var circAngle = Math.atan2(this.y - yy, this.x - xx); //angle from circle center to player.
		var direction = this.angle - circAngle;//used to tell the direction of the player - clock wise or counter clock wise.
		
		if( direction >= (Math.PI / 2)){//clockwise
			circAngle += distance / radius;
			if(circAngle > Math.PI)
				circAngle -= 2 * Math.PI;
			
			this.x = (Math.cos(circAngle) * radius) + xx;
			this.y = (Math.sin(circAngle) * radius) + yy;
			this.angle += distance/radius;
		}
		else if( direction <= (Math.PI / -2)){//counterClockwise
			circAngle -= distance / radius;
			if(circAngle < -Math.PI)
				circAngle += 2 * Math.PI;
			
			this.x = (Math.cos(circAngle) * radius) + xx;
			this.y = (Math.sin(circAngle) * radius) + yy;
			this.angle += distance/radius;
		}
		else
			console.log("There was an error");
	}
}

function Menu(){
	this.xFrontOffSet = 0;
	this.yFrontOffSet = 0;
	this.xBackOffSet = 0;
	this.yBackOffSet = 0;
	this.playButton;
	this.playTitle;
	
	this.setup = function(){
		this.playButton = new PlayButton(400,400,100);
		this.playTitle = new PlayTitle(100,125,600,100);
		
	};
	
	this.update = function(time){
		var x = (mouse.x - (can.width*0.5));
		var y = (mouse.y - (can.height*0.5));
		
		this.xFrontOffSet = x * 0.125;
		this.yFrontOffSet = y * 0.125;
		
		this.xBackOffSet = x * 0.0625;
		this.yBackOffSet = y * 0.0625;
		
		var pb = {
			x: this.playButton.x - this.xBackOffSet,
			y: this.playButton.y - this.yBackOffSet,
			r: this.playButton.r
		};
		
		if(collide(mouse,pb) && mouse.clicked){
			gamestate = play;
		}
	};
	
	this.draw = function(){
		ctx.clearRect(0,0,can.width,can.height);
		
		ctx.fillStyle = "#5555FF";
		ctx.beginPath();
		ctx.arc(this.playButton.x - this.xBackOffSet, this.playButton.y - this.yBackOffSet, this.playButton.r, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
		
		ctx.fillRect(this.playTitle.x - this.xBackOffSet, this.playTitle.y - this.yBackOffSet, this.playTitle.width, this.playTitle.height);
		
		ctx.fillStyle = "#999999";
		ctx.font = "bold 60px Verdana";
		ctx.fillText("Project Snowball",115 - this.xBackOffSet ,200 - this.yBackOffSet );
		ctx.fillStyle = "#000000";
		ctx.fillText("Project Snowball",115 - this.xFrontOffSet,200 - this.yFrontOffSet);
		ctx.font = "30px Verdana";
		ctx.fillText("PLAY",360 - this.xFrontOffSet, 415 - this.yFrontOffSet);
	};
}

function PlayButton(a,b,c){
	this.x = a;
	this.y = b;
	this.r = c;
}

function PlayTitle(a,b,c,d){
	this.x = a;
	this.y = b;
	this.width = c;
	this.height = d;
}

function findIntersect(x,y,a,xx,yy,aa){

	var xxx = 0;
	var yyy = 0;
	
	if(Math.sin(a) == 1 || Math.sin(a) == -1){
		xxx = x;
		yyy = yy;
	}
	else if(Math.sin(aa) == 1 || Math.sin(aa) == -1){
		yyy = y;
		xxx = xx;
	}
	else{
		xxx = ( (Math.tan(a) * x) - y - (Math.tan(aa) * xx) + yy ) / ( Math.tan(a) - Math.tan(aa));
		yyy = Math.tan(aa) * (xxx - xx) + yy;
	}
	
	console.log("Tangent at (" + xxx + ", " + yyy + ")");
	
	return [xxx,yyy];
}
	
function findDistance(x,y,xx,yy){
	return Math.sqrt(Math.pow( yy - y, 2) + Math.pow( xx - x, 2));
}