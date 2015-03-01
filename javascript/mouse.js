/* Class: Mouse()
	controls and keeps track of the positioning of mouse
Constructor: N/A
Instances:
	x: mouse x position
	y: mouse y position
	r: mouse radius. Default is zero. Exists for collision detection
	clicked: default is false. set to true when mouse is clicked
Methods:
	setup()
	setMousePosition()
*/
function Mouse(){
	this.x = 0;
	this.y = 0;
	this.r = 0;
	this.clicked = false;
	
	/*
	Method: setup()
	Arguments: N/A
	Returns: N/A
	Operation: N/A
	*/
	this.setup = function(){
	};
	
	/*
	Method: setMousePosition()
	Arguments: 	1. event
				2. x, y
	Returns: N/A
	Operation: 	If passed event, it sets mouse x and y position to the event's position relative to canvas
				If passed and x and y, it sets mouse x and y position to those coordinates
	*/
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