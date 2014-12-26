/*
Class: Mouse()
	controls and keeps track of the positioning of mouse
Constructor: N/A
Instances:
	x: mouse x position
	y: mouse y position
	r: mouse radius. Default is zero. Exists for collision detection
	clicked: default is false. set to true when mouse is clicked
Methods:
	setup()
	setMousePosition()
*/

function Mouse(){
	this.x = 0;
	this.y = 0;
	this.r = 0;
	this.clicked = false;
	
	/*
	Method: setup()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.setup = function(){
	};
	
	/*
	Method: setMousePosition()
	Arguments: 	1. event
				2. x, y
	Returns: N/A
	Operation: 	If passed event, it sets mouse x and y position to the event's position relative to canvas
				If passed and x and y, it sets mouse x and y position to those coordinates
	*/
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



//********************GAME STATES********************


/*
Class: PlayGameState()
	contains every object and information for the playing state
Constructor: N/A
Instances:
	player: a player object
	posts: array of post objects
	heldClick: default is false. true if player holds mouse down
	tether: a tether object that holds info for circular motion
	enemies: array of enemy objects
Methods:
	setup()
	update(time)
	draw()
	
	
*/
function PlayGameState(){
	this.player;
	this.posts = [];
	this.tether = false;
	this.enemies = [];
	this.boundry;
	this.control;
	this.spawnEnemy;
	this.SPAWNENEMY;
	
	/*
	Method: setup()
	Arguments: N/A
	Returns: N/A
	Operation: Creates player object, map, and enemies etc. for game play
	*/
	this.setup = function(){
		this.player = new Player(0,0,10,0);
		this.posts = randomizePosts();
		this.control = control1;//pass in posts and the x and y of the player
		this.boundry = new Boundry(1000);
		this.spawnEnemy = this.SPAWNENEMY = 3000;
		//this.enemies.push(new Enemy(-100,-100,10,50));//adds an enemy to the array
	};
	
	/*
	Method: update(time)
	Arguments:
		time: the update time for ticks
	Returns: N/A
	Operation:	Updates the player's position. If the mouse is clicked then a tether object is created 
				for circular motion around a post
	*/
	this.update = function(time){
		if(this.tether == false){
			var temp = this.control(this.posts, this.player);
			if(temp != false)
				this.tether = new Tether(this.player.x, this.player.y, this.player.angle, temp.x, temp.y);
		}
		else if(this.control(this.posts, this.player) == false){
			this.tether = false;
		}
		
		if(this.tether == false)
			this.player.move(time);
		else if(this.tether.passedTan(this.player.x, this.player.y, this.player.angle))
			this.player.circle(time,this.tether.postX, this.tether.postY, this.tether.radius, this.tether.onRight);
		else
			this.player.move(time);
		
		for(var i = 0; i < this.enemies.length; i++){
			this.enemies[i].run(time,this.player.x,this.player.y);
		}
		
		//spawning new enemies
		
		this.spawnEnemy -= time;
		if(this.spawnEnemy <= 0){
			this.spawnEnemy += this.SPAWNENEMY;
			this.enemies.push(new Enemy(true));
		}
		
		//collision detections
		
		for(var i = 0; i < this.posts.length; i++){
			if(collide(this.posts[i], this.player)){
				//CODE FOR WHEN PLAYER COLLIDES WITH POST
				log("Collided with Post");
				this.player.loseLife(this.player.life);
			}
		}
		
		if(findDistance(0,0,this.player.x, this.player.y) + this.player.r > this.boundry.r && this.tether == false){
			//CODE FOR RUNNING OUT OF BOUNDS
			log("Out of Bounds");
		}
		
		for(var i = 0; i < this.enemies.length; i++){
			//delete if significantly out of play Area
			if(findDistance(0,0, this.enemies[i].x, this.enemies[i].y) > this.boundry.r + 500){
				this.enemies.splice(i,1);
				i--;
				continue;
			}
			//collision detection with player
			else if(collide(this.enemies[i] , this.player) ){
				this.enemies.splice(i,1);
				i--;
				this.player.loseLife(1);
				continue;
			}
		}
		
		//CHECK TO SEE IF THE PLAYER IS OUT OF LIFE
	};
	
	/*
	Method: draw()
	Arguments: N/A
	Returns: N/A
	Operation: Draws the player, posts, enemies etc. for gameplay
	*/
	this.draw = function(){
		ctx.clearRect(0,0,can.width, can.height);
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,can.width, can.height);
		
		var dx = -this.player.x + (can.width * 0.5);
		var dy = -this.player.y + (can.height * 0.5);
		
		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.arc( dx, dy, 1000, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		
		ctx.fillStyle = "#000000";
		ctx.beginPath();
		ctx.arc(this.player.x + dx, this.player.y + dy, this.player.r, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		
		ctx.fillStyle = "#000000";
		for(var i = 0; i < this.posts.length; i++){
			ctx.beginPath();
			ctx.arc(this.posts[i].x + dx, this.posts[i].y + dy, this.posts[i].r, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
		}
		
		for(var i = 0; i < this.enemies.length; i++){
			ctx.beginPath();
			ctx.arc(this.enemies[i].x + dx, this.enemies[i].y + dy, this.enemies[i].r, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
		}
		
		//Drawing the life bar
		for(var i = 0; i < this.player.life; i++)
		{
			ctx.beginPath();
			ctx.lineWidth="1";
			ctx.strokeStyle="black";
			ctx.rect((i*20)+10,10,20,15);
			ctx.stroke();
			
			ctx.fillStyle = "#49E20E";
			ctx.fillRect((i*20)+10,10,20,15);
		}
	};
}

/*
Class: Menu()
Arguments for Constructor: N/A
Instances: 
	xFrontOffSet: x position of the front shadow offset
	yFrontOffSet: y position of the front shadow offset
	xBackOffSet: x position of the back shadow offset
	yBackOffSet: y position of the back shadow offset
	playButton: the play button object
	playTitle: the play title object
Methods:
	setup()
	update()
	draw()
*/
function Menu(){
	this.xFrontOffSet = 0;
	this.yFrontOffSet = 0;
	this.xBackOffSet = 0;
	this.yBackOffSet = 0;
	this.playButton;
	this.playTitle;
	
	
	/*
	Methods: setup()
	Arguments: N/A
	Returns: N/A
	Operation: creates a play button object and a play title object
	*/
	this.setup = function(){
		this.playButton = new PlayButton(400,400,100);
		this.playTitle = new PlayTitle(100,125,600,100);
		
	};
	
	/*
	Method: update()
	Arguments:
		time: the update time interval
	Returns: N/A
	Operation: 	updates the title and play button offsets of the menu
				if the play button is clicked then the gamestate changes to play
	*/
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
	
	/*
	Method; draw()
	Arguments: N/A
	Returns: N/A
	Operation: draws the Menu
	*/
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

/*
Class: Pause()
Arguments for Constructor: N/A
Instances: N/A
Methods:
	setup()
	update()
	draw()
*/
function Pause(){
	
	/*
	Method: setup()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.setup = function(){
		
	}
	
	/*
	Method: update()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.update = function(time){
	
	}
	
	/*
	Method: draw()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.draw = function(){
	
	}
	
}

/*
Class: GameOver()
Arguments for Constructor: N/A
Instances: N/A
Methods:
	setup()
	update()
	draw()
*/
function GameOver(){
	this.xFrontOffSet = 0;
	this.yFrontOffSet = 0;
	this.xBackOffSet = 0;
	this.yBackOffSet = 0;
	this.endTitle;
	/*
	Method: setup()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.setup = function(){
		this.endTitle = new PlayTitle(100,125,600,100);
	}
	
	/*
	Method: update()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.update = function(time){
		var x = (mouse.x - (can.width*0.5));
		var y = (mouse.y - (can.height*0.5));
		
		this.xFrontOffSet = x * 0.125;
		this.yFrontOffSet = y * 0.125;
		
		this.xBackOffSet = x * 0.0625;
		this.yBackOffSet = y * 0.0625;
	}
	
	/*
	Method: draw()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.draw = function(){
		ctx.clearRect(0,0,can.width,can.height);
		
		ctx.fillStyle = "#5555FF";
		
		ctx.fillRect(this.endTitle.x - this.xBackOffSet, this.endTitle.y - this.yBackOffSet, this.endTitle.width, this.endTitle.height);
		
		ctx.fillStyle = "#999999";
		ctx.font = "bold 60px Verdana";
		ctx.fillText("GAME OVER",195 - this.xBackOffSet ,200 - this.yBackOffSet );
		ctx.fillStyle = "#000000";
		ctx.fillText("GAME OVER",195 - this.xFrontOffSet,200 - this.yFrontOffSet);
	}
	
}

//********************Random Objects********************


/*
Class: Player(startX, startY, radius, startAng)
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
	this.life = 3;
	
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
	
	this.loseLife = function(deduct){
		this.life -= deduct;
		
		if(this.life <= 0)
			gamestate = endGame;
	};
	
	this.gainLife = function(add){
		this.life += add;
		
		if(this.life > 15)
			this.life = 15;
	};
}

/*
Class: PlayButton(a, b, c)
Arguments for Constructor:
	a: the x coordinate
	b: the y coordinate
	c: the radius of Play Button
Instances:
	x: the x coordinate
	y: the y coordinate
	r: the radius
Methods: N/A
*/
function PlayButton(a,b,c){
	this.x = a;
	this.y = b;
	this.r = c;
}

/*
Class: PlayTitle(a, b, c, d)
Arguments for Constructor:
	a: the x coordinate
	b: the y coordinate
	c: the width of title
	d: the height of title
Instances:
	x: the x coordinate
	y: the y coordinate
	width: the width of PlayTitle
	height: the height of PlayTitle
Methods: N/A
*/
function PlayTitle(a,b,c,d){
	this.x = a;
	this.y = b;
	this.width = c;
	this.height = d;
}

/*
Class: Tether(x, y, a, px, py)
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
}

/*
Class: Enemy(a, b, c, d, e)
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
	if(a == true){
		this.angle = (Math.random() * 2 * Math.PI) - Math.PI;
		var tempAng = addAngles(this.angle, (Math.random()*Math.PI * 0.5) - (Math.PI * 0.25) );
		var tempAng = addAngles(tempAng, Math.PI);
		this.x = Math.cos(tempAng) * 1010;
		this.y = Math.sin(tempAng) * 1010;
		this.speed = 50;
		this.r = 8;
	}
	else{
		this.x = a;
		this.y = b;
		this.r = c;
		this.speed = d;
		this.angle = e;
	}
	
	/*
	Method: run(time)
	Arguments:
		time: the update time interval
	Returns: N/A
	Operation: moves the enemy according to it's speed and the update time
	*/
	this.run = function(time){
		this.x += Math.cos(this.angle) * this.speed * time * 0.001;
		this.y += Math.sin(this.angle) * this.speed * time * 0.001;
	}
}

/*
Class: Post(a, b, c)
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

function Boundry(a){//radius
	this.x = 0;
	this.y = 0;
	this.r = a;
}