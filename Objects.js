function Mouse(){
	this.x = 0;
	this.y = 0;
	this.r = 0;
	this.clicked = false;
	
	this.setup = function(){
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
	this.heldClick = false;
	this.tether = false;
	
	this.setup = function(){
		this.player = new Player(100,200,10,0);
		this.map = [{
			x: 300,
			y: 300,
			r: 30
		},
		{
			x: 600,
			y: 400,
			r: 30
		}];
	};
	
	this.update = function(time){
		if(mouse.clicked == false){
			this.player.move(time);
			this.heldClick = false;
			this.tether = false;
		}
		else if(mouse.clicked && this.heldClick == false){
			this.heldClick = true;
			
			var index = -1;
			var distance = 0;
			for(var i = 0; i < this.map.length; i++){
				if(index == -1){
					index = i;
					distance = findDistance(this.player.x + mouse.x - 400, this.player.y + mouse.y - 400, this.map[i].x, this.map[i].y);
				}
				else{
					var newDist = findDistance(this.player.x + mouse.x - 400, this.player.y + mouse.y - 400, this.map[i].x, this.map[i].y);
					if(newDist < distance){
						distance = newDist;
						index = i;
					}
				}
			}
			
			this.tether = new Tether(this.player.x, this.player.y, this.player.angle, this.map[index].x, this.map[index].y);
		}
		
		if(mouse.clicked){
			if( this.tether.passedTan(this.player.x, this.player.y, this.player.angle) == false){
				this.player.move(time);
			}
			else{
				this.player.circle(time, this.tether.postX, this.tether.postY, this.tether.radius, this.tether.onRight);
			}
		}
	};
	
	this.draw = function(){
		ctx.clearRect(0,0,can.width, can.height);
		
		var dx = -this.player.x + (can.width * 0.5);
		var dy = -this.player.y + (can.width * 0.5);
		
		ctx.beginPath();
		ctx.arc(this.player.x + dx, this.player.y + dy, this.player.r, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		
		for(var i = 0; i < this.map.length; i++){
			ctx.beginPath();
			ctx.arc(this.map[i].x + dx, this.map[i].y + dy, this.map[i].r, 0, 2 * Math.PI);
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
	this.tether = false;
	
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

function Pause(){
	
	this.setup = function(){
		
	}
	
	this.update = function(time){
	
	}
	
	this.draw = function(){
	
	}
	
}

function GameOver(){
	
	this.setup = function(){
		
	}
	
	this.update = function(time){
		
	}
	
	this.draw = function(){
		
	}
	
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

function Enemy(a,b,c,d){//x,y,r,speed
	this.x = a;
	this.y = b;
	this.r = c;
	this.speed = d;
	
	this.run = function(time,px,py){//time, player's x and y
		var ang = Math.atan2(py - this.y, px - this.x);
		
		this.x += Math.cos(ang) * speed * time * 0.001;
		this.y += Math.sin(ang) * speed * time * 0.001;
	}
}