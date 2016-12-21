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
	
	this.draw = function(dx,dy){
		ctx.save();
		//ctx.clearRect(0,0,can.width, can.height);
		ctx.translate( this.x + dx, this.y + dy);
		ctx.rotate(this.angle);
		ctx.drawImage(images.Sleigh, -this.r, -this.r, this.r * 2, this.r * 2);
		ctx.restore();
	}
	
}

/* Class: Tether(xPosition, yPosition, angle, postXPosition, postYPosition)
Arguments for Constructor:
	x: the x position of the player
	y: the y position of the player
	a: the angle of direction of player
	px: the x position of a post
	py: the y position of a post
Instances:
	postX: x position of a post
	postY: y position of a post
	tanX: the x position of the tangent intersection 
	tanY: the y position of the tangent intersection
	radius: the radius between the post and the player
	pt: default is false. true if passed the tangent intersection
	onRight: default is false. true if post is to the right of the player relative to the player's direction
	coors: coordinates of the tangent intersection
Methods:
	passedTan()
	
*/
const minTetherLength = 10.0;

function Tether(x,y,a,px,py){
	this.postX = px;
	this.postY = py;
	this.tanX = 0;
	this.tanY = 0;
	this.radius = 0;
	this.pt = false;
	this.onRight = false;
	
	var coors = findTanIntersect(x,y,a,px,py);
	this.tanX = coors[0];
	this.tanY = coors[1];
	
	var ang = Math.atan2(py - y, px - x);
	ang = addAngles(ang, -a);
	if(ang > 0)
		this.onRight = true;
	
	/*
	Method: passedTan(x, y, a)
	Arguments:
		x: the x position of player
		y: the y position of player
		a: the angle of direction of player
	Returns: 	true if player is passed the tangent intersection
				false if player has not passed the tangent intersection
	*/
	this.passedTan = function(x,y,a){
		if(this.pt == true)
			return true;
		var passedTan = false;
		
		if(a == 0 && x > this.tanX)
			passedTan = true;
		else if( (a == -Math.PI || a == Math.PI) && x < this.tanX)
			passedTan = true;
		else if( a > 0 && y > this.tanY)
			passedTan = true;
		else if( a < 0 && y < this.tanY)
			passedTan = true;
		
		if(passedTan == true)
			this.pt = true;
		return passedTan;
	}
	
	if(this.passedTan(x,y,a)){
		this.radius = findDistance(x,y,px,py);
		this.tanX = x;
		this.tanY = y;
	}
	else
		this.radius = findDistance(this.tanX, this.tanY, px,py);
		
	this.update = function(time){
        /*
		var t = time / 1000.0;
		if(keys.w == true){
			this.changeLength( t * player.dtether );
		}
		else if(keys.s == true){
			this.changeLength( -1 * t * player.dtether);
		}
        */
	};
	
	this.draw = function(){
		var dx = -player.x + (can.width * 0.5);
		var dy = -player.y + (can.height * 0.5);
		
		ctx.strokeStyle = "#663300";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(player.x + dx, player.y + dy);
		ctx.lineTo(this.postX + dx, this.postY + dy);
		ctx.stroke();
		
	};
	
	this.changeLength = function(d){
		this.radius += d;
		if(this.radius < minTetherLength)
			this.radius = minTetherLength;
        
        //this function is bad. It does not change the length before it passses the tangent point.
	};
}

/* Class: House(ix, iy)
Arguments:
	ix: initial x
	iy: initial y

*/
function House(ix, iy){
	this.x = ix;
	this.y = iy;
	this.r = 50;
	this.gifts = 0;
	
	this.update = function(dt){
		
	}
	
	this.draw = function(dx,dy){
		ctx.save();
		ctx.translate( this.x + dx, this.y + dy);
		ctx.drawImage(images.House, -this.r, -this.r, this.r * 2, this.r * 2);
		ctx.restore();
	}
}

/* Class: Post(a, b, c)
Arguments for Constructor:
	a: x coordinate of post
	b: y coordinate of post
	c: radius of post
Instances:
	x: the x coordinate of post
	y: the y coordinate of post
	r: radius of post
Methods: N/A
*/
function Post(a,b,c){
	this.x = a;
	this.y = b;
	this.r = c
}

function Walls(dist){
    this.left = dist / -2.0;
    this.right = dist / 2.0;
    
    this.draw = function(dx, dy){
        
        ctx.fillStyle = "#FFFFFF";
        
        ctx.fillRect( dx + this.left,0, this.right - this.left ,can.height);
        
    }
}

function StraightTrail(){
    
}

function ArcTrail(a, b, c, d, e){
    this.x = a;
    this.y = b;
    this.r = c;
    this.startAngle = d;
    this.endAngle = e;
    
    this.draw = function(dx, dy){
        ctx.strokeStyle = "#D0D0D0";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(this.x - dx, this.y - dy, this.r, this.startAngle, this.endAngle);
        ctx.stroke();
    }
}
