function collide(thing1,thing2){
	var dist = Math.sqrt( Math.pow(thing2.x - thing1.x,2) + Math.pow(thing2.y - thing1.y,2));
	if(thing1.r + thing2.r > dist)
		return true;
	else
		return false;
}

function squareCollide(thing1, thing2){
	if(thing1.x + thing1.w < thing2.x)
		return false;
	else if(thing1.x > thing2.x + thing2.w)
		return false;
	else if(thing1.y + thing1.h < thing2.y)
		return false;
	else if(thing1.y > thing2.y + thing2.h)
		return false;
	
	return true;
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

function scatterMoney(){
	var ms = [];
	var num = 5
	var radius = 20;
	
	for(i = 0; i < num; i++){
		var angle = Math.random() * Math.PI * 2;
		angle -= Math.PI;
		
		ms.push(new Money(Math.cos(angle) * radius, Math.sin(angle) * radius, 5));
	}
	return ms;
}

function randomizePosts(){
	var newPosts = [];
	var failedTries = 0;
	
	while(newPosts.length < 20){
		var ang = (Math.random() * 2 * Math.PI) - Math.PI;
		var dist = (Math.random() * 800) + 200;
		var rad = (Math.random() * 20) + 10;
		
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

function control1(posts,pl){
	if(mouse.clicked == false)
		return false;
	
	var x2 = pl.x + mouse.x - (can.width / 2);
	var y2 = pl.y + mouse.y - (can.height/ 2);
	
	var dist = 0;
	var index = -1;
	
    var debugnum = 0;
    
	for(var i = posts.length - 1; i >= 0; i--){
		if( posts[i].y - (can.height / 2.0) > pl.y ){
            break;
        }
        
        debugnum++;
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

function control2(posts,pl){
	var newPosts = posts;//shortenListByDistance(posts,pl,500);
	var baseAng = 0;
	
	if( keys.w)
		baseAng = -(Math.PI * 0.5);
	else if( keys.a)
		baseAng = Math.PI;
	else if( keys.s)
		baseAng = Math.PI * 0.5;
	else if( keys.d)
		baseAng = 0;
	else
		return false;
		
	var bestScore = 0;
	var index = -1;
	
	for(var i = 0; i < newPosts.length; i++){
		if(index == -1){
			index = i;
			bestScore = getDiffAngle(Math.atan2(posts[i].y - pl.y, posts[i].x - pl.x),baseAng);
		}
		else{
			var currScore = getDiffAngle(Math.atan2(posts[i].y - pl.y, posts[i].x - pl.x),baseAng);
			if( currScore < bestScore){
				index = i;
				bestScore = currScore;
			}
		}
	}
	
	return newPosts[index];
	
}

//doesn't work well
function getDiffAngle(ang, base){
	var newAng = ang - base;
	if(newAng > Math.PI)
		newAng -= 2 * Math.PI;
	else if(newAng < -Math.PI)
		newAng += 2 * Math.PI;
	
	if(newAng < 0)
		newAng *= -1;
	
	return newAng;
}

function shortenListByDistance(posts, pl, maxDist){//array of posts, player, maximum distance from player. Returns the same posts array, without ones past the max dist.
	var newPosts = [];
	
	for(var i = 0; i < posts.length; i++){
		if(findDistance(pl.x, pl.y, posts[i].x, posts[i].y) <= maxDist){
			newPosts.push(posts[i]);
		}
	}
	
	return newPosts;
}

function handleKeyDown(evt){
	if(evt.keyCode == 87)
		keys.w = true;
	else if(evt.keyCode == 65)
		keys.a = true;
	else if(evt.keyCode == 83)
		keys.s = true;
	else if(evt.keyCode == 68)
		keys.d = true;
	else if(evt.keyCode == 32)
		keys.space = true;
	else if(evt.keyCode == 80)
		keys.p = true;
	
	if(evt.keyCode > 32 && evt.keyCode < 87)
		evt.preventDefault();
}

function handleKeyUp(evt){
	if(evt.keyCode == 87)
		keys.w = false;
	else if(evt.keyCode == 65)
		keys.a = false;
	else if(evt.keyCode == 83)
		keys.s = false;
	else if(evt.keyCode == 68)
		keys.d = false;
	else if(evt.keyCode == 32)
		keys.space = false;
	else if(evt.keyCode = 80)
		keys.p = false;
	
	if(evt.keyCode > 32 && evt.keyCode < 87)
		evt.preventDefault();
}

function getRandomNumber(){
	return 4;
}