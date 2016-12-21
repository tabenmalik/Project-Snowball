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
	this.posts = [];
    this.postArchive = [];
	this.tether = false;
	this.walls;
	this.control;
    this.distToNextPost = 200;
	
	/*
	Method: setup()
	Arguments: N/A
	Returns: N/A
	Operation: Creates player object, map, and enemies etc. for game play
	*/
	this.setup = function(){
		//this.posts = randomizePosts();
		this.control = control1;//pass in posts and the x and y of the player
		this.walls = new Walls(400);
		
	};
	
	this.reset = function(){
		//this.posts = randomizePosts();
        this.posts.splice(0, this.posts.length);
		player.setPosition(0,0, -Math.PI / 2.0);
		player.life = player.LIFE;
		this.tether = false;
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
        //Generating Posts
        if(this.posts.length == 0){
            var randx = Math.random() * (this.walls.right - this.walls.left) + this.walls.left;
            var randr = (Math.random() * 20.0) + 10.0;
            
            this.posts.push(new Post(randx, player.y - (can.height / 2.0) - randr, randr));
            this.distToNextPost = (Math.random() * 200) + 50;
        } else {
            if (this.posts[this.posts.length - 1].y - (player.y - (can.height / 2.0)) >= this.distToNextPost){
                var randx = Math.random() * (this.walls.right - this.walls.left) + this.walls.left;
                var randr = (Math.random() * 20.0) + 10.0;
                
                this.posts.push(new Post(randx, player.y - (can.height / 2.0) - randr, randr));
                this.distToNextPost = (Math.random() * 200) + 50;
            }
        }
        
		//code for movement of the player
		
		//Checking to see if the player is trying to tether to a post.
		if(this.tether == false){
			var temp = this.control(this.posts, player);
			if(temp != false)
				this.tether = new Tether(player.x, player.y, player.angle, temp.x, temp.y);
		}
		else if(this.control(this.posts, player) == false){
			this.tether = false;
		}
		
		
		if(this.tether == false)
			player.move(time);
		else if(this.tether.passedTan(player.x, player.y, player.angle))
		{
			this.tether.update(time);
			player.circle(time,this.tether.postX, this.tether.postY, this.tether.radius, this.tether.onRight);
		}
		else
		{
			this.tether.update(time);
			player.move(time);
		}
		
		
		//collision detections
		for(var i = 0; i < this.posts.length; i++){
			if(collide(this.posts[i], player)){
				//CODE FOR WHEN PLAYER COLLIDES WITH POST
				log("Collided with Post");
				player.loseLife();
			}
		}
		
        
		if( (player.x < this.walls.left || player.x > this.walls.right)&& this.tether == false){
			//CODE FOR RUNNING OUT OF BOUNDS
			player.loseLife();
		}
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
		
		var dx = -player.x + (can.width * 0.5);
		var dy = -player.y + (can.height * 0.5);
		
		//DRAW MAP
        this.walls.draw(dx,dy);
		
		player.draw(dx,dy);
		
		//posts
		ctx.fillStyle = "#000000";
		for(var i = 0; i < this.posts.length; i++){
			ctx.drawImage(images.Post, this.posts[i].x - this.posts[i].r + dx, this.posts[i].y - this.posts[i].r + dy, this.posts[i].r * 2, this.posts[i].r * 2);
		}
		
		if(this.tether != false){
			this.tether.draw();
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
	Arguments:function (){
            
    }
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
			gamestate.gamestates.play.reset();
			gamestate.changeGameState("play");
		}
		
		this.optionButton.update(time);
		if(collide(mouse,this.optionButton) && mouse.clicked){
			gameSound.playSound("buttonPress");
			mouse.clicked = false;
			gamestate.changeGameState("optionMenu");
		}
		
		this.instructionButton.update(time);
		if(collide(mouse,this.instructionButton) && mouse.clicked){
			gameSound.playSound("buttonPress");
			mouse.clicked = false;
			gamestate.changeGameState("instructionMenu");
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
			gamestate.changeGameState("mainMenu");
		}
		
		this.musicToggle.update(time);
		if(collide(mouse,this.musicToggle) && mouse.clicked)
		{
			mouse.clicked = false;
			if(gameMusic.isPlayMusic == true)
			{
				this.musicToggle.changeColor("#545454");
				gameMusic.muteMusic();
			}
			else
			{
				this.musicToggle.changeColor("#5555FF");
				gameMusic.unmuteMusic();
			}
		}
		
		this.soundToggle.update(time);
		if(collide(mouse, this.soundToggle) && mouse.clicked)
		{
			mouse.clicked = false;
			if(gameSound.isPlaySound == true)
			{
				this.soundToggle.changeColor("#545454");
				gameSound.muteSounds();
			}
			else
			{
				this.soundToggle.changeColor("#5555FF");
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
	this.nextButton;
	this.screen;
	
	this.setup = function(){
		this.howToTitle = new Title(100,125,600,100,"Instructions");
		this.nextButton = new Button(700,500,50,"Next");
		this.backButton = new Button(100,500, 50, "Back");
		this.screen = 0;
	};
	
	this.update = function(time){
		this.howToTitle.update(time);
		
		this.backButton.update(time);
		if(collide(mouse, this.backButton) && mouse.clicked)
		{
			mouse.clicked = false;
			gameSound.playSound("buttonPress");
			
			if(this.screen == 0)
			{
				gamestate.changeGameState("mainMenu");
			}
			else
			{
				this.screen = this.screen-1;
			}
		}
		
		this.nextButton.update(time);
		if(collide(mouse, this.nextButton) && mouse.clicked)
		{
			mouse.clicked = false;
			gameSound.playSound("buttonPress");
			
			if(this.screen == 1)
			{
				this.screen = 0;
				gamestate.changeGameState("mainMenu");
			}
			else
			{
				this.screen = this.screen+1;
			}
		}
	};
	
	this.draw = function(){
		ctx.clearRect(0,0,can.width,can.height);
		this.howToTitle.draw();
		this.backButton.draw();
		this.nextButton.draw();
		
		if(this.screen == 0)
		{
			ctx.fillStyle = "#000000";
			ctx.font = "30px Verdana";
			ctx.fillText("Figure it out.", 200 , 300 );
		}
		
		if(this.screen == 1)
		{
			ctx.fillStyle = "#000000";
			ctx.font = "30px Verdana";
			ctx.fillText("Seriously. Just figure it out.", 200 , 300 );
		}
	};
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
	this.backButton;
	/*
	Method: setup()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.setup = function(){
		this.endTitle = new Title(100,125,600,100,"Play Again?");
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
		this.backButton.update(time);
		
		if(collide(mouse, this.backButton) && mouse.clicked){
			gameSound.playSound("buttonPress");
			mouse.clicked = false;
			gamestate.changeGameState("mainMenu");
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
		this.backButton.draw();
	}
	
}

function Gamestates(){
	this.gamestates = {
		mainMenu: 0,
		optionMenu: 0,
		instructionMenu: 0,
		play: 0,
		endGame: 0,
	};

	this.currentState = "mainMenu";

	this.setup = function(){
		this.gamestates["mainMenu"] = new Menu();
		this.gamestates["optionMenu"] = new OptionsMenu();
		this.gamestates["instructionMenu"] = new HowToMenu();
		this.gamestates["play"] = new PlayGameState();
		this.gamestates["endGame"] = new GameOver();

		for(var key in this.gamestates) {
			this.gamestates[key].setup();
		}		
	};

	this.changeGameState = function(nextState){
		this.currentState = nextState;
	};

	this.update = function(time){
		this.gamestates[this.currentState].update(time);
	};

	this.draw = function(){
		this.gamestates[this.currentState].draw();
	};
}
