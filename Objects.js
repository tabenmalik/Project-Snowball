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
	this.map;
	
	this.setup = function(){
		this.player = new Player(100,200,10,0);
		this.map = [{
			x: 300,
			y: 300,
			r: 30
			}];
	};
	
	this.changeState = function(){
		gamestate = this.gamestate;
	};
	
	this.update = function(time){
		this.player.circle(time, this.map[0].x, this.map[0].y);
	};
	
	this.draw = function(){
		ctx.clearRect(0,0,can.width, can.height);
	
		ctx.beginPath();
		ctx.arc(this.player.x, this.player.y, this.player.r, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		
		for(var i = 0; i < this.map.length; i++){
			ctx.beginPath();
			ctx.arc(this.map[i].x, this.map[i].y, this.map[i].r, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
		}
	};
}
	
function Player(a,b,c,d){
	this.x = a;
	this.y = b;
	this.r = c;
	this.angle = d;
	this.speed = 200;
	
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
	this.circle = function(time,postX,postY){
		var distance = time * 0.001 * this.speed;
		
		intersect = findTanIntersect(this.x, this.y, this.angle, postX, postY);
		var behindTan = false;
		
		//Determines if the player is behind the tangent intersection
		if( this.angle == Math.PI || this.angle == -Math.PI || this.angle == 0){
		
			if( (Math.cos(this.angle) == 1) && (this.x < intersect[0]))
			{
				behindTan = true;
			}
			else if( (Math.cos(this.angle) == -1) && (this.x > intersect[0]))
			{
				behindTan = true;
			}
				
		}
		else if( Math.sin(this.angle) > 0 && this.y < intersect[1])
			behindTan = true;
		else if( Math.sin(this.angle) < 0 && this.y > intersect[1])
			behindTan = true;
		
		//If the player is behind the tanIntersect, checks that it won't pass it, then moves forward and returns
		if(behindTan){
			var temp = findDistance(this.x, this.y, postX, postY);
			if( temp > distance){
				this.move(time);
				return;
			}
			else{
				this.x = intersect[0];
				this.y = intersect[1];
				distance -= temp;
			}
		}
		
		//Once the player is at the tanIntersect, it begins circular motion
		var radiusToPost = findDistance(this.x, this.y, postX, postY);
		var angleToPost = Math.atan2(postY-this.y, postX-this.x);
		var postOnRight = false;
		
		if(angleToPost < 0 && (postX-this.x) < 0)
		{
			angleToPost += Math.PI;
		}
		
		//figure out which side of the player the post is on
		if(this.angle == (Math.PI/2) && postX < this.x)
			postOnRight = true;
		else if(this.angle == (-Math.PI/2) && postX < this.x)
			postOnRight = true;
		else if(this.angle > (Math.PI / 2) || this.angle < (-Math.PI / 2)){
			if(postY - 4 < this.y)
				postOnRight = true;
		}
		else if(this.angle > (-Math.PI / 2) && this.angle < (Math.PI / 2)){
			if(postY + 4 > this.y)
				postOnRight = true;
		}
		
		log(postOnRight);
		
		//and last but not least, the official circular motion
		var radius = findDistance(this.x,this.y, postX, postY);
		
		var circAngle = 0;
		if(postOnRight)
			circAngle = this.angle - (Math.PI / 2);
		else if(!postOnRight)
			circAngle = this.angle + (Math.PI / 2);
		
		if(circAngle > Math.PI)
			circAngle -= 2 * Math.PI;
		else if(circAngle < -Math.PI)
			circAngle += 2 * Math.PI;
		
		var changeAng = distance / radius;
		if(!postOnRight)
			changeAng *= -1;
			
		circAngle += changeAng;
		if(circAngle > Math.PI)
			circAngle -= 2 * Math.PI;
		else if(circAngle < -Math.PI)
			circAngle += 2 * Math.PI;
		
		this.x = postX + (Math.cos(circAngle) * radius);
		this.y = postY + (Math.sin(circAngle) * radius);
		this.angle += changeAng;
		if(this.angle > Math.PI)
			this.angle -= 2 * Math.PI;
		else if(this.angle < -Math.PI)
			this.angle += 2 * Math.PI;
	}
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