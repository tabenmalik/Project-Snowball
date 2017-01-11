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
  this.songSrc = 'music/Carefree.mp3';
  this.md;
	
	
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
	  this.md = gameMusic.addSong(this.songSrc, 0.5, true);
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
			if(!gameMusic.isMuted())
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
		this.gamestates["play"] = new LinearGame();
		this.gamestates["endGame"] = new GameOver();

		for(var key in this.gamestates) {
			this.gamestates[key].setup();
		}		
	};

	this.changeGameState = function(nextState){
		this.currentState = nextState;

    if ('md' in this.gamestates[this.currentState]) {
      gameMusic.playMusic(this.gamestates[this.currentState].md);
    }
	};

	this.update = function(time){
		this.gamestates[this.currentState].update(time);
	};

	this.draw = function(){
		this.gamestates[this.currentState].draw();
	};
}
