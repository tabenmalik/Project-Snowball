function Ball(a,b,c){//x,y coordinate and radius
	this.x = a;
	this.y = b;
	this.r = c; //radius
	
	function fa(num){//distance (in a random direction)
		var angle = (Math.random() * 2 * Math.PI) - Math.PI;
		this.x += Math.sin(angle) * num;
		this.y += Math.cos(angle) * num;
	}
	
	this.moveRandom = fa;
}