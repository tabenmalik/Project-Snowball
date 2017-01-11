/* Class: Player(startX, startY, radius, startAng)
Arguments for Constructor:
	startX: starting x position of player
	startY: starting y position of player
	radius: radius of player. used for collision detection
	startAng: the starting angle of direction of player
Instances:
	x: the x coordinate of player
	y: the y coordinate of player
	r: the radius of player
	angle: the angle of direction of player
	speed: speed of player
	tether: an object created when circling around a post
*/
function Player(a,b,c,d){
	this.x = a;
	this.y = b;
	this.r = c;
	this.score = 0;
    this.highScore = 0;
	this.angle = d;
	this.speed = 400;
	this.tether = false;
	this.dtether = 100.0;
	this.gifts = 0;
	this.money = 0;
    
    this.setHighScore = function() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }
    
    this.reset = function() {};

    this.setScore = function() {
        var newScore = -1 * Math.ceil((this.y / 50));
        if (newScore > this.score) {
            this.score = newScore;
        }
    }

    this.drawScore = function() {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 30px Verdana";
        ctx.fillText(this.score + "", 50, 50);
    }

	/*
	Method: move()
	Arguments:
		time: the update time of game play
	Returns: N/A
	Operation:	moves the player according to the update time and the player's speed
	*/
	this.move = function(time){
		this.x += Math.cos(this.angle) * this.speed * 0.001 * time;
		this.y += Math.sin(this.angle) * this.speed * 0.001 * time;
	};
	
	/*
	Method: 	circle(time, postX, postY);
	Arguments:	time 	= the update time
				postX 	= the x coordinate of the Post that the player will be circling
				postY	= the y coordinate of the Post that the player will by circling
	Returns:	No value, but returns if the player has not reached the tangent intersection
	Operation:	Determines the tangent intersection between the player and a post to circle around.
				If the player is behind the tangent intersection then the player continues forward
				motion. Once it has reached the tangent intersection or past it then the player
				goes into circular motion around the post.
	*/
	this.circle = function(time,postX,postY,radius,onRight){
		var distance = time * 0.001 * this.speed;
		
		var circAngle = Math.atan2(this.y - postY, this.x - postX);
		
		var changeAng = distance / radius;
		if(!onRight)
			changeAng *= -1;
			
		circAngle = addAngles(circAngle,changeAng);
		
		this.x = postX + (Math.cos(circAngle) * radius);
		this.y = postY + (Math.sin(circAngle) * radius);
		if(onRight)
			this.angle = addAngles(circAngle,(Math.PI / 2));
		else
			this.angle = addAngles(circAngle, -(Math.PI / 2));
	};
	
	this.setPosition = function(x,y,angle){
		this.x = x;
		this.y = y;
		this.angle = angle;
	};	
	
	this.loseLife = function() {
		gameMusic.stopMusic();
		gamestate.changeGameState("endGame");
	};
  
  this.update = function(time) {
    this.x += Math.cos(this.angle) * this.speed * 0.001 * time;
		this.y += Math.sin(this.angle) * this.speed * 0.001 * time;
  };
	
	this.draw = function(dx,dy){
		ctx.save();
		//ctx.clearRect(0,0,can.width, can.height);
		ctx.translate( this.x + dx, this.y + dy);
		ctx.rotate(this.angle);
		ctx.drawImage(images.Sleigh, -this.r, -this.r, this.r * 2, this.r * 2);
		ctx.restore();
	}
	
}