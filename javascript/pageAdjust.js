//Adjusting the elements in the window to size properly

function windowAdjust()
{
	var canvas = document.getElementById("canvas");
	var header = document.getElementById("banner");
	var footer = document.getElementById("footer");
	
	var body = document.body,
    html = document.documentElement;

	var docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	var canvasHeight = canvas.offsetHeight;
	var heightDiff = docHeight - canvasHeight;
	
	header.style.height = (heightDiff/2-(header.style.borderWidth*2))+"px";
	footer.style.height = (heightDiff/2-(footer.style.borderWidth*2))+"px";
}