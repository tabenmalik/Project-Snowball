var newMouse = function() {
  
  /////////////////////
  // Private variables 
  /////////////////////
  
  var x = 0;            // x coordinate of mouse on canvas grid
  var y = 0;            // y coordinate of mouse on canvas grid
  var radius = 0;       // radius of mouse area
  var clicked = false;  // true if the mouse has been clicked
  
  //////////
  // Setup
  //////////
  can = document.getElementById('canvas');
  
  // Event handler for mouse down
  can.onmousedown = function() {
    clicked = true;
  };
  
  // Event handler for mouse up
  can.onmouseup = function() {
    clicked = false;
    return false;
  };
  
  // Event handler for mouse move
  can.onmousemove = function() {
    __setMousePosition__(event);
  };
  
  ////////////
  // Methods
  ////////////
  
  // Returns true if the mouse is clicked
  var __isClicked__ = function() {
    return clicked;
  }
  
  // Sets the position of the mouse
  var __setMousePosition__ = function() {
    var can = document.getElementById('canvas');
    
    if (arguments.length == 1) {
      x = arguments[0].clientX - can.getBoundingClientRect().left;
      y = arguments[0].clientY - can.getBoundingClientRect().top + 0.875;
      
    } else if (arguments.length == 2) {
      x = arguments[0];
      y = arguments[1];
    }
  }
  
  // Returns the x coordinate of the mouse
  var __getX__ = function() {
    var can = document.getElementById('canvas');
    return x;
  }
  
  // Returns the y coordinate of the mouse
  var __getY__ = function() {
    var can = document.getElementById('canvas');
    return y;
  }
  
  // Returns the complete object
  return {
    setMousePosition: __setMousePosition__,
    isClicked: __isClicked__,
    getY: __getY__,
    getX: __getX__
  }
}