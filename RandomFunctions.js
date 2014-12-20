function collide(thing1,thing2){
	var dist = Math.sqrt( Math.pow(thing2.x - thing1.x,2) + Math.pow(thing2.y - thing1.y,2));
	if(thing1.r + thing2.r > dist)
		return true;
	else
		return false;
}

function findIntersect(x,y,angle,x2,y2,angle2){
	
	var intx = 0;
	var inty = 0;
	
	if(Math.sin(angle) == 1 || Math.sin(angle) == -1){
		intx = x;
		inty = y2;
	}
	else if(Math.sin(angle2) == 1 || Math.sin(angle2) == -1){
		inty = y;
		intx = x2;
	}
	else{
		intx = ( (- Math.tan(angle) * x) + y + (Math.tan(angle2) * x2) - y2 ) / ( Math.tan(angle2) - Math.tan(angle) );
		inty = Math.tan(angle2) * (intx - x2) + y2;
	}
	
	log("Intersection at ("+intx+", "+inty+")");
	
	return [intx,inty];
}

function findTanIntersect(x,y,angle,x2,y2){
	var angle2 = angle + (Math.PI /2);
	if(angle2 > Math.PI)
		angle2 -= (2 * Math.PI);
	
	return findIntersect(x,y,angle,x2,y2,angle2);
}

function findDistance(x,y,x2,y2){
	return Math.sqrt(Math.pow( y2 - y, 2) + Math.pow( x2 - x, 2));
}

function getRandomNumber(){
	return 4;
}