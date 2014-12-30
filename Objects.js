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
	this.projectiles = [];
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
		//code for movement of the player
		
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
		{
			this.tether.update(time);
			this.player.circle(time,this.tether.postX, this.tether.postY, this.tether.radius, this.tether.onRight);
		}
		else
			this.player.move(time);
		
		for(var i = 0; i < this.enemies.length; i++){
			this.enemies[i].run(time,this.player.x,this.player.y);
		}
		
		//code for moving projectiles
		
		for(var i = 0; i < this.projectiles.length; i++){
			this.projectiles[i].run(time,this.enemies);
			if(findDistance(this.projectiles[i].x, this.projectiles[i].y,0,0) > this.boundry.r + 200){
				this.projectiles.splice(i,1);
				i--;
			}
		}
		
		//code for shooting snowballs
		
		this.player.fireRate -= time;
		if(this.player.fireRate < 0)
			this.player.fireRate = 0;
		if(keys.space && this.player.fireRate == 0){
			this.projectiles.push(new Projectile('s', this.player.x, this.player.y, this.player.angle) );
			this.player.fireRate += this.player.FIRERATE;
		}
		
		//spawning new enemies
		
		this.spawnEnemy -= time;
		if(this.spawnEnemy <= 0){
			this.spawnEnemy += this.SPAWNENEMY;
			this.enemies.push(new Enemy('n'));
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
			this.player.loseLife(this.player.life);
		}
		
		for(var i = 0; i < this.enemies.length; i++){
			//delete if significantly out of play Area
			if(findDistance(0,0, this.enemies[i].x, this.enemies[i].y) > this.boundry.r + 500){
				this.enemies.splice(i,1);
				i--;
			}
			//collision detection with player
			else if(collide(this.enemies[i] , this.player) ){
				this.enemies.splice(i,1);
				i--;
				this.player.loseLife(1);
			}
		}
		
		//collision between projectiles and enemies
		for(var i = 0; i < this.projectiles.length; i++){
			
			for(var o = 0; o < this.enemies.length; o++){
				
				if(collide(this.projectiles[i], this.enemies[o])){
					this.projectiles.splice(i,1);
					this.enemies.splice(o,1);
					i--;
					break;
				}
				
			}
		}
		
		//collision between projectiles and posts
		for(var i = 0; i < this.projectiles.length; i++){
			
			for(var o = 0; o < this.posts.length; o++){
				
				if(collide(this.projectiles[i], this.posts[o])){
					this.projectiles.splice(i,1);
					i--;
					break;
				}
				
			}
		}
		
		//pause if the player is pressing "p"
		if(keys.p)
			gamestate = pause;
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
		
		/*ctx.fillStyle = "#000000";
		ctx.beginPath();
		ctx.arc(this.player.x + dx, this.player.y + dy, this.player.r, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();*/
		this.player.draw(dx,dy);
		
		//posts
		ctx.fillStyle = "#000000";
		for(var i = 0; i < this.posts.length; i++){
			ctx.drawImage(images.Post, this.posts[i].x - this.posts[i].r + dx, this.posts[i].y - this.posts[i].r + dy, this.posts[i].r * 2, this.posts[i].r * 2);
			
			/*ctx.beginPath();
			ctx.arc(this.posts[i].x + dx, this.posts[i].y + dy, this.posts[i].r, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();*/
		}
		
		for(var i = 0; i < this.enemies.length; i++){
			ctx.beginPath();
			ctx.arc(this.enemies[i].x + dx, this.enemies[i].y + dy, this.enemies[i].r, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
		}
		
		if(this.tether != false)
		{
			this.tether.draw();
		}
		
		//projectiles (snowballs)
		ctx.fillStyle = "#B5E3EB";
		for(var i = 0; i < this.projectiles.length; i++){
			ctx.beginPath();
			ctx.arc(this.projectiles[i].x + dx, this.projectiles[i].y + dy, this.projectiles[i].r, 0, 2 * Math.PI);
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
	this.optionButton;
	this.instructionButton;
	this.playTitle;
	
	
	/*
	Methods: setup()
	Arguments: N/A
	Returns: N/A
	Operation: creates a play button object and a play title object
	*/
	this.setup = function(){
		this.playButton = new Button(400,400,70,"PLAY");
		this.optionButton = new Button(600,500, 70, "Options");
		this.instructionButton = new Button(200,500,70,"How To");
		this.playTitle = new Title(100,125,600,100,"Project Snowball");
		
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
		this.playTitle.update(time);
		
		this.playButton.update(time);
		if(collide(mouse,this.playButton) && mouse.clicked){
			sounds.play("buttonPress");
			mouse.clicked = false;
			music[0].stop();
			music[1].play();
			gamestate = play;
		}
		
		this.optionButton.update(time);
		if(collide(mouse,this.optionButton) && mouse.clicked){
			sounds.play("buttonPress");
			mouse.clicked = false;
			gamestate = optionMenu;
		}
		
		this.instructionButton.update(time);
		if(collide(mouse, this.instructionButton) && mouse.clicked){
			sounds.play("buttonPress");
			mouse.clicked = false;
			gamestate = instructionMenu;
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
		this.playTitle.draw();
		this.playButton.draw();
		this.optionButton.draw();
		this.instructionButton.draw();
	};
}

/*
Class: OptionsMenu()
*/
function OptionsMenu(){
	this.optionTitle;
	this.backButton;
	
	this.setup = function(){
		this.optionTitle = new Title(100,125,600,100,"Options");
		this.backButton = new Button(100,500, 50, "Back");
	};
	
	this.update = function(time){
		this.optionTitle.update(time);
		
		this.backButton.update(time);
		if(collide(mouse,this.backButton) && mouse.clicked)
		{
			sounds.play("buttonPress");
			mouse.clicked = false;
			gamestate = mainMenu;
		}
	};
	
	this.draw = function(){
		ctx.clearRect(0,0,can.width,can.height);
		this.optionTitle.draw();
		this.backButton.draw();
	};
}

/*

*/
function HowToMenu(){
	this.howToTitle;
	this.backButton;
	
	this.setup = function(){
		this.howToTitle = new Title(100,125,600,100,"Instructions");
		this.backButton = new Button(100,500, 50, "Back");
	};
	
	this.update = function(time){
		this.howToTitle.update(time);
		
		this.backButton.update(time);
		if(collide(mouse, this.backButton) && mouse.clicked)
		{
			sounds.play("buttonPress");
			mouse.clicked = false;
			gamestate = mainMenu;
		}
	};
	
	this.draw = function(){
		ctx.clearRect(0,0,can.width,can.height);
		this.howToTitle.draw();
		this.backButton.draw();
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
	this.hasLetGo = false;
	this.pauseTitle = new Title(100,400,600,100,"PAUSED");
	
	/*
	Method: setup()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.setup = function(){
		this.hasLetGo = false;
	}
	
	/*
	Method: update()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.update = function(time){
		this.pauseTitle.update(time);
		
		if(keys.p == false)
			this.hasLetGo = true;
		else if(this.hasLetGo){
			keys.p = false;
			this.hasLetGo = false;
			gamestate = play;
		}
	}
	
	/*
	Method: draw()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.draw = function(){
		play.draw();
		this.pauseTitle.draw();
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
		this.endTitle = new Title(100,125,600,100,"GAME OVER");
	}
	
	/*
	Method: update()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.update = function(time){
		this.endTitle.update(time);
	}
	
	/*
	Method: draw()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.draw = function(){
		ctx.clearRect(0,0,can.width,can.height);
		
		this.endTitle.draw();
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
	this.fireRate = 200;
	this.FIRERATE = 200;
	
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
		
		if(this.life <= 0){
			music[1].stop();
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
function Button(a,b,c,d){
	this.x = a;
	this.y = b;
	this.r = c;
	ctx.font = "30px Verdana";
	this.title = {
		text: d,
		x: this.x - this.r + (((this.r*2) - ctx.measureText(d).width)/2),
		y: this.y + (30*.5),
	};
	this.backOffSet = {
		x: 0,
		y: 0,
	};
	this.frontOffSet = {
		x: 0,
		y: 0,
	};
	
	this.update = function(time){
		var x = (mouse.x - (can.width*0.5));
		var y = (mouse.y - (can.height*0.5));
		
		this.frontOffSet.x = x * 0.125;
		this.frontOffSet.y = y * 0.125;
		
		this.backOffSet.x = x * 0.0625;
		this.backOffSet.y = y * 0.0625;
	};
	
	this.draw = function(){
		ctx.fillStyle = "#5555FF";
		ctx.beginPath();
		ctx.arc(this.x - this.backOffSet.x, this.y - this.backOffSet.y, this.r, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
		
		ctx.fillStyle = "#000000";
		ctx.font = "30px Verdana";
		ctx.fillText(this.title.text, this.title.x - this.frontOffSet.x , this.title.y - this.frontOffSet.y );
	};
}

/*
Class: PlayTitle(a, b, c, d)
Arguments for Constructor:
	a: the x coordinate
	b: the y coordinate
	c: the width of title
	d: the height of title
	e: the text for the title
Instances:
	x: the x coordinate
	y: the y coordinate
	width: the width of PlayTitle
	height: the height of PlayTitle
Methods: N/A
*/
function Title(a,b,c,d,e){
	this.x = a;
	this.y = b;
	this.width = c;
	this.height = d;
	ctx.fillStyle = "#999999";
	ctx.font = "bold 60px Verdana";
	this.title = {
		text: e,
		x: ((this.width - ctx.measureText(e).width)/2) + this.x,
		y: ((this.height + 60)/2) + this.y,
	};
	this.backOffSet = {
		x:0,
		y:0,
	};
	this.frontOffSet = {
		x: 0,
		y: 0,
	};
	
	this.update = function(time){
		var x = (mouse.x - (can.width*0.5));
		var y = (mouse.y - (can.height*0.5));
		
		this.frontOffSet.x = x * 0.125;
		this.frontOffSet.y = y * 0.125;
		
		this.backOffSet.x = x * 0.0625;
		this.backOffSet.y = y * 0.0625;
	};
	
	this.draw = function(){
		
		ctx.fillStyle = "#5555FF";
		ctx.fillRect(this.x - this.backOffSet.x, this.y - this.backOffSet.y, this.width, this.height);
		
		ctx.fillStyle = "#999999";
		ctx.font = "bold 60px Verdana";
		ctx.fillText(this.title.text, this.title.x - this.backOffSet.x , this.title.y - this.backOffSet.y );
		
		ctx.fillStyle = "#000000";
		ctx.fillText(this.title.text, this.title.x - this.frontOffSet.x , this.title.y - this.frontOffSet.y );
	};
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
	this.x = 0;
	this.y = 0;
	this.r = 10;
	this.angle = 0;
	this.speed = 0;
	this.run;
	
	if(a == 'n'){//normal enemies.
		this.angle = (Math.random() * 2 * Math.PI) - Math.PI;
		var tempAng = addAngles(this.angle, (Math.random()*Math.PI * 0.5) - (Math.PI * 0.25) );
		var tempAng = addAngles(tempAng, Math.PI);
		this.x = Math.cos(tempAng) * 1010;
		this.y = Math.sin(tempAng) * 1010;
		this.speed = 50;
		this.r = 8;
		
		this.run = function(time){
			this.x += Math.cos(this.angle) * this.speed * time * 0.001;
			this.y += Math.sin(this.angle) * this.speed * time * 0.001;
		}
	}
	else if(a == 'f'){//follower
		var tempAng = (Math.random() * 2 * Math.PI) - Math.PI;
		this.x = Math.cos(tempAng) * 1010;
		this.y = Math.sin(tempAng) * 1010;
		this.r = 12;
		this.speed = 50;
		
		this.run = function(time,plx, ply){
			this.angle = Math.atan2(ply - this.y, plx - this.x);
			this.x += Math.cos(this.angle) * time * 0.001 * this.speed;
			this.y += Math.sin(this.angle) * time * 0.001 * this.speed;
		}
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
}

/*
Class: Projectile()
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
function Projectile(a,b,c,d,e){
	this.x = 0;
	this.y = 0;
	this.r = 5;
	this.angle = 0;
	this.speed = 0;
	this.run;
	
	if(a == 's'){//snowball
		this.x = b;
		this.y = c;
		this.r = 6;
		this.angle = d;
		this.speed = 300;
		
		this.run = function(time){
			this.x += Math.cos(this.angle) * time * 0.001 * this.speed;
			this.y += Math.sin(this.angle) * time * 0.001 * this.speed;
		}
	}
	else if(a == 'r'){//rocket
		this.x = b;
		this.y = c;
		this.r = 6;
		this.angle = d;
		this.speed = 250;
		this.deltaAngle = Math.PI * 0.25;
		
		this.run = function(time,enemies){
			var dist = 0;
			var index = -1;
			
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
			
			this.x += Math.cos(this.angle) * time * 0.001 * this.speed;
			this.y += Math.sin(this.angle) * time * 0.001 * this.speed;
		}
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