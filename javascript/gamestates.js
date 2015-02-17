/* Class: PlayGameState()
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
	this.monies = [];
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
	
	this.reset = function(){
		this.posts = randomizePosts();
		this.spawnEnemy = this.SPAWNENEMY = 3000;
		this.player.x = 0;
		this.player.y = 0;
		this.player.angle = 0;
		this.player.life = this.player.LIFE;
		this.tether = false;
		this.enemies.splice(0,this.enemies.length);
		this.projectiles.splice(0,this.projectiles.length);
		this.monies.splice(0,this.monies.length);
	}
	
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
			if(this.projectiles[i] == Rocket)
				this.projectiles[i].run(time,this.enemies);
			else
				this.projectiles[i].run(time);
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
			this.projectiles.push(new Projectile(this.player.x, this.player.y, this.player.angle) );
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
		
		//player colliding with money
		for(var i = 0; i < this.monies.length; i++){
			if(collide(this.player, this.monies[i]) ){
				money += this.monies[i].value;
				this.monies.splice(i,1);
				i--;
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
					var moniesToAdd = scatterMoney();
					for(j = 0; j < moniesToAdd.length; j++){
						var AMoney = moniesToAdd[j];
						AMoney.x += this.enemies[o].x;
						AMoney.y += this.enemies[o].y;
						this.monies.push(AMoney);
					}
					
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
		
		for(var i = 0; i < this.monies.length; i++){
			this.monies[i].draw(dx,dy);
		}
		
		for(var i = 0; i < this.enemies.length; i++){
			/*ctx.beginPath();
			ctx.arc(this.enemies[i].x + dx, this.enemies[i].y + dy, this.enemies[i].r, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();*/
			
			this.enemies[i].draw(dx,dy);
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

/* Class: Menu()
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
			gameSound.playSound("buttonPress");
			mouse.clicked = false;
			gameMusic.changeMusic(1);
			play.reset();
			gamestate = play;
		}
		
		this.optionButton.update(time);
		if(collide(mouse,this.optionButton) && mouse.clicked){
			gameSound.playSound("buttonPress");
			mouse.clicked = false;
			gamestate = optionMenu;
		}
		
		this.instructionButton.update(time);
		if(collide(mouse,this.instructionButton) && mouse.clicked){
			gameSound.playSound("buttonPress");
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

/* Class: OptionsMenu()
Arguments for Constructor: N/A
Instances: N/A
Methods:
	setup()
	update()
	draw()
*/
function OptionsMenu(){
	this.optionTitle;
	this.backButton;
	this.musicToggle;
	this.soundToggle;
	
	this.setup = function(){
		this.optionTitle = new Title(100,60,600,100,"Options");
		this.backButton = new Button(100,500, 50, "Back");
		this.musicToggle = new Button(200,230,50, "Music");
		this.soundToggle = new Button(200,360,50, "Sound");
	};
	
	this.update = function(time){
		this.optionTitle.update(time);
		
		this.backButton.update(time);
		if(collide(mouse,this.backButton) && mouse.clicked)
		{
			gameSound.playSound("buttonPress");
			mouse.clicked = false;
			gamestate = mainMenu;
		}
		
		this.musicToggle.update(time);
		if(collide(mouse,this.musicToggle) && mouse.clicked)
		{
			mouse.clicked = false;
			if(gameMusic.isPlayMusic == true)
			{
				this.musicToggle.changeColor("#5555FF");
				gameMusic.muteMusic();
			}
			else
			{
				this.musicToggle.changeColor("#545454");
				gameMusic.unmuteMusic();
			}
		}
		
		this.soundToggle.update(time);
		if(collide(mouse, this.soundToggle) && mouse.clicked)
		{
			mouse.clicked = false;
			if(this.soundToggle.color == "#545454")
			{
				this.soundToggle.changeColor("#5555FF");
				gameSound.muteSounds();
			}
			else
			{
				this.soundToggle.changeColor("#545454");
				gameSound.unmuteSounds();
			}
		}
	};
	
	this.draw = function(){
		ctx.clearRect(0,0,can.width,can.height);
		this.optionTitle.draw();
		this.backButton.draw();
		this.musicToggle.draw();
		this.soundToggle.draw();
	};
}

/* Class: HowToMenu()
Arguments for Constructor: N/A
Instances: N/A
Methods:
	setup()
	update()
	draw()
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
			gameSound.playSound("buttonPress");
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

/* Class: Store()
Arguments for Constructor: N/A
Instances: N/A
Methods:
	setup()
	update()
	draw()
*/
function Store(){
	this.backButton;
	this.speedUG;
	
	this.setup = function(){
		this.backButton = new Button(50,550,50,"Back");
		this.speedUG = new Button(100,100,50,"Speed - 10");
	}
	
	this.update = function(time){
		this.backButton.update(time);
		this.speedUG.update(time);
		
		if(collide(mouse,this.speedUG) && mouse.clicked){//later, add another parameter to the if statement for currency
			gameSound.playSound("buttonPress");
			play.player.speed += 25;
			mouse.clicked = false;
		}
		else if(collide(mouse,this.backButton) && mouse.clicked){
			gameSound.playSound("buttonPress");
			mouse.clicked = false;
			gamestate = endGame;
		}
	}
	
	this.draw = function(){
		ctx.clearRect(0,0,can.width,can.height);
		this.backButton.draw();
		this.speedUG.draw();
	}
}

/* Class: Pause()
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

/* Class: GameOver()
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
	this.storeButton;
	this.backButton;
	/*
	Method: setup()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.setup = function(){
		this.endTitle = new Title(100,125,600,100,"GAME OVER");
		this.storeButton = new Button(700,500,40,"STORE");
		this.backButton = new Button(100,500,40,"Back");
	}
	
	/*
	Method: update()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.update = function(time){
		this.endTitle.update(time);
		this.storeButton.update(time);
		this.backButton.update(time);
		
		if(collide(mouse,this.storeButton) && mouse.clicked){
			gameSound.playSound("buttonPress");
			mouse.clicked = false;
			gamestate = store;
		}
		else if(collide(mouse, this.backButton) && mouse.clicked){
			gameSound.playSound("buttonPress");
			mouse.clicked = false;
			gamestate = mainMenu;
			gameMusic.changeMusic(0);
		}
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
		this.storeButton.draw();
		this.backButton.draw();
	}
	
}
