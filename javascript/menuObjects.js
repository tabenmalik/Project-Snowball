/* Class: PlayButton(a, b, c)
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
function Button(a,b,c,d,e){
	this.baseX = a;
	this.baseY = b;
	this.x = a;
	this.y = b;
	this.r = c;
	ctx.font = "30px Verdana";
	this.color = "#5555FF";
	this.title = {
		text: d,
		x: this.x - this.r + (((this.r*2) - ctx.measureText(d).width)/2),
		y: this.y + (30*.5),
	};
	this.action = e;
	this.backOffSet = {
		x: 0,
		y: 0,
		r: c,
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
		
		this.x = this.baseX - this.backOffSet.x;
		this.y = this.baseY - this.backOffSet.y;
	};
	
	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
		
		ctx.fillStyle = "#000000";
		ctx.font = "30px Verdana";
		ctx.fillText(this.title.text, this.title.x - this.frontOffSet.x , this.title.y - this.frontOffSet.y );
	};
	
	this.changeColor = function(color){
		this.color = color;
	};
	
	this.changeText = function(text){
		this.title.text = text;
		this.title.x = this.x - this.r + (((this.r*2) - ctx.measureText(d).width)/2);
		this.title.y = this.y + (30*.5);
	};
}

/* Class: PlayTitle(a, b, c, d)
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

