//Adjusting the elements in the window to size properly

function windowAdjust()
{
	var header = document.getElementById("banner");
	var footer = document.getElementById("footer");
	
	var body = document.body,
    html = document.documentElement;

	var docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	var canvasHeight = can.offsetHeight;
	var heightDiff = docHeight - canvasHeight;
	
	log('Document Height: '+docHeight.toString());
	log('Canvas Height: '+canvasHeight.toString());
	log('Difference Height: '+ (docHeight-canvasHeight));
	log('Header Height: ' + header.offsetHeight);
	log('Footer Height: ' + footer.offsetHeight);
	log("Proper height: " + (docHeight-canvasHeight)/2);
	
	header.style.height = (heightDiff/2) +"px";
	footer.style.height = (heightDiff/2) +"px";
	
	log('Document Height: '+docHeight.toString());
	log('Canvas Height: '+canvasHeight.toString());
	log('Difference Height: '+ (docHeight-canvasHeight));
	log('Header Height: ' + header.offsetHeight);
	log('Footer Height: ' + footer.offsetHeight);
	log("Proper height: " + (docHeight-canvasHeight)/2);
}