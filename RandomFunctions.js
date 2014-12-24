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
	
	//used for bug testing
	//log("Intersection at ("+intx+", "+inty+")");
	
	return [intx,inty];
}

function findTanIntersect(x,y,angle,x2,y2){
	var angle2 = addAngles(angle, (Math.PI / 2));
	return findIntersect(x,y,angle,x2,y2,angle2);
}

function findDistance(x,y,x2,y2){
	return Math.sqrt(Math.pow( y2 - y, 2) + Math.pow( x2 - x, 2));
}

function addAngles(a1,a2){
	a1 += a2;
	
	if(a1 > Math.PI)
		a1 -= 2 * Math.PI;
	else if(a1 < -Math.PI)
		a1 += 2 * Math.PI;
		
	return a1;
}

function randomizePosts(){
	var newPosts = [];
	
	var failedTries = 0;
	
	while(newPosts.length < 20){
		var ang = (Math.random() * 2 * Math.PI) - Math.PI;
		var dist = (Math.random() * 800) + 200;
		var rad = (Math.random() * 25) + 5;
		
		var newX = Math.cos(ang) * dist;
		var newY = Math.sin(ang) * dist;
		
		var minDist = 3000;
		for(var i = 0; i < newPosts.length; i++){
			if(findDistance(newX,newY, newPosts[i].x, newPosts[i].y) < minDist)
				minDist = findDistance(newX,newY, newPosts[i].x, newPosts[i].y);
		}
		
		if(minDist > 200)
			newPosts.push(new Post(newX, newY, rad));
		else{
			failedTries++;
			if(failedTries > 100)
				break;
		}
	}
	
	return newPosts;
}

function control1(posts,x,y){
	if(mouse.clicked == false)
		return false;
	
	var x2 = x + mouse.x - (can.width / 2);
	var y2 = y + mouse.y - (can.height/ 2);
	
	var dist = 0;
	var index = -1;
	
	for(var i = 0; i < posts.length; i++){
		if(index == -1){
			index = i;
			dist = findDistance(x2, y2, posts[i].x, posts[i].y);
		}
		else if(findDistance(x2, y2, posts[i].x, posts[i].y) < dist){
			dist = findDistance(x2, y2, posts[i].x, posts[i].y);
			index = i;
		}
	}
	
	return posts[index];
}

function getRandomNumber(){
	return 4;
}