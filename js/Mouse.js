var newMouse = function() {
  var x = 0;
  var y = 0;
  var radius = 0;
  var clicked = false;
  
  var __isClicked__ = function() {
    return clicked;
  }
  
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
  
  var __getX__ = function() {
    return x;
  }
  
  var __getY__ = function() {
    return y;
  }
  
  document.getElementById('canvas').onmousedown = function() {
    clicked = true;
  };
  
  document.getElementById('canvas').onmouseup = function() {
    clicked = false;
  };
  
  document.getElementById('canvas').onmousemove = function() {
    __setMousePosition__(event);
  };
  
  return {
    setMousePosition: __setMousePosition__,
    isClicked: __isClicked__,
    getY: __getY__,
    getX: __getX__
  }
}