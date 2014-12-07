function collide(thing1,thing2){
	var dist = Math.sqrt( Math.pow(thing2.x - thing1.x,2) + Math.pow(thing2.y - thing1.y,2));
	if(thing1.r + thing2.r > dist)
		return true;
	else
		return false;
}

function getRandomNumber(){
	return 4;
}