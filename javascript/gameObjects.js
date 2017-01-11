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
