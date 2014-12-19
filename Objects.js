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
	
	this.circle = function(time,xx,yy){//move in a circular motion around point xx,yy
		
		var distance = this.speed * time * 0.001;
		
		var tempAng = this.angle + ( Math.PI / 2.0 );
		if( tempAng > Math.PI)
			tempAng -= Math.PI * 2;
		
		var coordinates = findIntersect(this.x,this.y,this.angle,xx,yy,tempAng);
		
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
}