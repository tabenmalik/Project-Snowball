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
	this.angle = d;
	this.speed = 200;
	this.tether = false;
	this.LIFE = 3;
	this.life = 3;
	this.fireRate = 200;
	this.FIRERATE = 200;
	this.money = 0;
	
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
	
	this.addMoney = function(amount){
		this.money += amount
	};
	
	this.checkMoney = function(){
		return this.money;
	};
	
	this.subMoney = function(amount){
		this.money -= amount;
		
		if(this.money < 0)
		{
			this.money = 0;
		}
	};
	
	this.loseLife = function(deduct){
		this.life -= deduct;
		
		if(this.life <= 0){
			gameMusic.stopMusic();
			gamestate = endGame;
		}
	};
	
	this.gainLife = function(add){
		this.life += add;
		
		if(this.life > 15)
			this.life = 15;
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
		
	};
	
	this.draw = function(){
		var dx = -play.player.x + (can.width * 0.5);
		var dy = -play.player.y + (can.height * 0.5);
		
		ctx.strokeStyle = "#663300";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(play.player.x + dx, play.player.y + dy);
		ctx.lineTo(this.postX + dx, this.postY + dy);
		ctx.stroke();
		
	};
}

/* Class: Enemy(initialX, initialY, radius, speed, angle)
Arguments for Constructor:
	a: starting x coordinate
	b: starting y coordinate
	c: radius of enemy
	d: starting speed of enemy
	e: starting angle of direction of enemy
	
	OR
	
	a: true
		//this randomizes every single variable in the object for you. ;)
Instances:
	x: x coordinate of enemy
	y: y coordinate of enemy
	r: radius of enemy
	speed: speed of enemy
	angle: angle of direction of enemy
Methods:
	run()
*/
function Enemy(a,b,c,d,e){
	this.r = 10;
	this.angle = (Math.random() * 2 * Math.PI) - Math.PI;
	var tempAng = addAngles(this.angle, (Math.random()*Math.PI * 0.5) - (Math.PI * 0.25) );
	var tempAng = addAngles(tempAng, Math.PI);
	this.x = Math.cos(tempAng) * 1010;
	this.y = Math.sin(tempAng) * 1010;
	this.speed = 50;
		
	this.run = function(time){
		this.x += Math.cos(this.angle) * this.speed * time * 0.001;
		this.y += Math.sin(this.angle) * this.speed * time * 0.001;
	}
	
	this.draw = function(dx,dy){
		ctx.save();
		ctx.translate( this.x + dx, this.y + dy);
		ctx.rotate(this.angle);
		ctx.drawImage(images.Enemy, -this.r, -this.r, this.r * 2, this.r * 2);
		ctx.restore();
	}
	/*
	Method: run(time)
	Arguments:
		time: the update time interval
	Returns: N/A
	Operation: moves the enemy according to it's speed and the update time
	*/
}

/* Class: Follow()
Arguments for Constructor: N/A
Instances:
	x: x coordinate of Follower
	y: y coordinate of Follower
	r: radius of Follower
	speed: speed of Follower
Methods:
	run()
*/
function Follower(){
	var tempAng = (Math.random() * 2 * Math.PI) - Math.PI;
	this.x = Math.cos(tempAng) * 1010;
	this.y = Math.sin(tempAng) * 1010;
	this.r = 12;
	this.speed = 50;
	
	/* Method: run(time, plx, ply)
	Arguments:
		time: the time since last tick
		plx: the x position of the player
		ply: the y position of the player
	Returns: N/A
	Function: moves the position of the follower towards the player 
	*/
	this.run = function(time,plx, ply){
		this.angle = Math.atan2(ply - this.y, plx - this.x);
		this.x += Math.cos(this.angle) * time * 0.001 * this.speed;
		this.y += Math.sin(this.angle) * time * 0.001 * this.speed;
	}
}

/* Class: Projectile(a,b,c)
Arguments for Constructor:
	a: x coordinate
	b: y coordinate
	c: radius
	d: angle
	e: speed
Instances:
	x / y coordinates
	r radius
	angle
	speed
Methods: 
	run()
		this function should be called every frame for every projectile.
		it allows them to move.
		different projectiles may move differently, thus having a different run() function
*/
function Projectile(a,b,c){
	this.x = a;
	this.y = b;
	this.r = 6;
	this.angle = c;
	this.speed = 300;
		
	this.run = function(time){
		this.x += Math.cos(this.angle) * time * 0.001 * this.speed;
		this.y += Math.sin(this.angle) * time * 0.001 * this.speed;
	};
}

/* Class: Rocket(ix,iy,ia)
Arguments:
	ix: the initial x position of rocket
	iy: the initial y position of rocket
	ia: the initial angle of rocket
Instances:
	x: x position of rocket
	y: y position of rocket
	r: radius of rocket image/sprite
	angle: the angle of forward direction of rocket
	speed: the speed of the rocket
	deltaAngle: the highest degree of turning that the rocket can do
Methods:
	run(time, enemies)
*/
function Rocket(ix,iy,ia){
	this.x = ix;
	this.y = iy;
	this.r = 6;
	this.angle = ia;
	this.speed = 250;
	this.deltaAngle = Math.PI * 0.25;
	
	/* Method: run(time, enemies)
	Arguments:
		time: the time since last tick
		enemies: an array of enemies on field
	Returns: N/A
	Function: determines the closest enemy and moves towards it.
	*/
	this.run = function(time,enemies){
		var dist = 0;
		var index = -1;
		
		//this is determining the closest enemy
		for(var i = 0; i < enemies.length; i++){
			if(index == -1){
				dist = findDistance(this.x, this.y, enemies[i].x, enemies[i].y);
				index = i;
			}
			else{
				var currDist = findDistance(this.x, this.y, enemies[i].x, enemies[i].y);
				if(currDist < dist){
					dist = currDist;
					index = i;
				}
			}
		}
		
		//if there are enemies on the map then it determines the angle of attack
		//else it just continues in a straight line
		if(enemies.length > 0){
			var ang = Math.atan2(enemies[index].y - this.y, enemies[index].x - this.x);
			ang = addAngles(ang, this.angle * -1);
			
			var da = this.deltaAngle * time * 0.001;
			if(ang > da)
				ang = da;
			else if(ang < -da)
				ang = -da;
			
			this.angle = addAngles(this.angle, ang);
		}
		
		//moves position towards chosen enemy
		this.x += Math.cos(this.angle) * time * 0.001 * this.speed;
		this.y += Math.sin(this.angle) * time * 0.001 * this.speed;
	};
}

/* Class: Money(ix,iy,iv)
Arguments for constructor:
	ix: initial x location
	iy: initial y location
	iv: initial value of money
Instances:
	x: the x position of Money
	y: the y position of Money
	r: radius of Money contact area
	value: point value of money
Methods:
	draw(dx, dy)
*/
function Money(ix, iy, iv){
	this.x = ix;
	this.y = iy;
	this.r = 10;
	this.value = iv;
	
	/* Method: draw(dx, dy)
	Arguments:
		dx: the change of x due to the screen moving
		dy: the change of y due to the screen moving
	Returns: N/A
	Function: simply draws the money on the screen
	*/
	this.draw = function(dx,dy){
		ctx.save();
		ctx.translate( this.x + dx, this.y + dy);
		ctx.drawImage(images.Money, -this.r, -this.r, this.r * 2, this.r * 2);
		ctx.restore();
	};
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

/* Class: Boundry(a)
Arguments:
	a: the radius of the outer boundary
Instances:
	x: the x position of the center
	y: the y position of the center
	r: the radius of the map/outer boundary
*/
function Boundry(a){//radius
	this.x = 0;
	this.y = 0;
	this.r = a;
}
