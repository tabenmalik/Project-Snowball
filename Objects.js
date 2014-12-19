function Mouse(){
	this.x = 0;
	this.y = 0;
	this.r = 0;
	this.clicked = false;
	
	this.setup = function(){
		can.addEventListener('click', handleClick);
		can.addEventListener('drag', handleClick);
	};
	
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

function PlayGameState(){
	this.player;
	this.gamestate = {
		update:0,
		draw:0,
	};
	
	this.setup = function(){
		this.player = new Player(100,100,10,0);
	};
	
	this.changeState = function(){
		gamestate = this.gamestate;
	};
	
	this.update = function(time){
		this.player.move(time);
	};
	
	this.draw = function(){
		ctx.clearRect(0,0,can.width, can.height);
	
		ctx.beginPath();
		ctx.arc(this.player.x, this.player.y, this.player.r, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	};
}

function Player(a,b,c,d){
	this.x = a;
	this.y = b;
	this.r = c;
	this.angle = d;
	this.speed = 100;
	
	this.move = function(time){
		this.x += Math.cos(this.angle) * this.speed * 0.001 * time;
		this.y += Math.sin(this.angle) * this.speed * 0.001 * time;
	};
}

function Menu(){
	this.xFrontOffSet = 0;
	this.yFrontOffSet = 0;
	this.xBackOffSet = 0;
	this.yBackOffSet = 0;
	this.playButton;
	this.playTitle;
	
	this.setup = function(){
		this.playButton = new PlayButton(400,400,100);
		this.playTitle = new PlayTitle(100,125,600,100);
		
	};
	
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

function PlayButton(a,b,c){
	this.x = a;
	this.y = b;
	this.r = c;
}

function PlayTitle(a,b,c,d){
	this.x = a;
	this.y = b;
	this.width = c;
	this.height = d;
}