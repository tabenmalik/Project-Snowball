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
			tempAng -= Math.PI;
		
		var coordinates = findIntersect(this.x,this.y,this.angle,xx,yy,tempAng);
		
		var moveTowardTanPoint = false; //this is turned true when the code realizes that the object is behind the tangent point, so that it will still move forward for a bit.
		
		if(Math.sin(this.angle) == 0){ //this if statement runs when the player is moving completely sideways. (because tan would be undefined, I have to type some special math)
			if(Math.cos(this.angle) == 1 && this.x < coordinates[0])//moving right and behind tan point.
				moveTowardTanPoint = true;
			else if(Math.cos(this.angle) == -1 && this.x > coordinates[0])// moving left and behind tan point
				moveTowardTanPoint = true;
		}
		else if(Math.sin(this.angle) == 1){
			if(this.y < coordinates[1])//player is moving up and is behind tan point
				moveTowardTanPoint = true;
		}
		else if(Math.sin(this.angle) == -1){
			if(this.y > coordinates[1])//player is moving down and is behind tan point
				moveTowardTanPoint = true;
		}
		
		//if "moveTowardTanPoint" is false, it immediately starts circular motion. If it is true, it moves straight toward the tangent point, and then does corcular movement.
		
		if(moveTowardTanPoint){
			if(distance < findDistance(this.x,this.y, coordinates[0], coordinates[1])){//the distance the player needs to move is smaller than the distance to the tan point.
				this.x = Math.cos(this.angle) * distance;
				this.y = Math.sin(this.angle) * distance;
				return; //returns because it has ran out of distance.
			}
			else{//sets player to tan point, but subtracts the distance that it took to get there.
				distance -= findDistance(this.x,this.y, coordinates[0], coordinates[1]);
				this.x = coordinates[0];
				this.y = coordinates[1];
			}
		}
		
		//if the function has not returned by this point, it starts circular motion.
		var radius = findDistance(this.x, this.y, xx, yy);
		var circAngle = Math.atan2(this.y - yy, this.x - xx); //angle from circle center to player.
		var direction = this.angle - circAngle;//used to tell the direction of the player - clock wise or counter clock wise.
		
		if( direction >= Math.PI / 2){//clockwise
			circAngle += distance / radius;
			if(circAngle > Math.PI)
				circAngle -= 2 * Math.PI;
			
			this.x = (Math.cos(circAngle) * radius) + xx;
			this.y = (Math.sin(circAngle) * radius) + yy;
			this.angle += circAngle;
		}
		else if( direction <= Math.PI / -2){//counterClockwise
			circAngle -= distance / radius;
			if(circAngle < -Math.PI)
				circAngle += 2 * Math.PI;
			
			this.x = (Math.cos(circAngle) * radius) + xx;
			this.y = (Math.sin(circAngle) * radius) + yy;
			this.angle += circAngle;
		}
		else
			console.log("There was an error");
	}
	
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