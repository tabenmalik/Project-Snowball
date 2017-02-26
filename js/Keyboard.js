var newKeyboard = function() {
  
  /////////////////////
  // Private Variables
  /////////////////////
  
  var w = false;
  var a = false;
  var s = false;
  var d = false;
  var space = false;
  var p = false;
  
  ///////////
  // Setup
  ///////////
  
  document.onkeydown = function(event) {
    switch(event.keyCode) {
      case 87:
        w = true;
        break;
      case 65:
        a = true;
        break;
      case 83:
        s = true;
        break;
      case 68:
        d = true;
        break;
      case 32:
        space = true;
        break;
      case 80:
        p = true;
        break;
      default:
        event.preventDefault();
        break;
    }
  }
  
  document.onkeyup = function(event) {
    switch(event.keyCode) {
      case 87:
        w = false;
        break;
      case 65:
        a = false;
        break;
      case 83:
        s = false;
        break;
      case 68:
        d = false;
        break;
      case 32:
        space = false;
        break;
      case 80:
        p = false;
        break;
      default:
        event.preventDefault();
        break;
    }
  }
  
  ///////////
  // Methods
  ///////////
  
  var __isWPressed__ = function() {
    return w;
  }
  
  var __isAPressed__ = function() {
    return a;
  }
  
  var __isSPressed__ = function() {
    return s;
  }
  
  var __isDPressed__ = function() {
    return d;
  }
  
  var __isSpacePressed__ = function() {
    return space;
  }
  
  var __isPPressed__ = function() {
    return p;
  }
  
  // Returns the complete object
  return {
    isWPressed: __isWPressed__,
    isAPressed: __isAPressed__,
    isSPressed: __isSPressed__,
    isDPressed: __isDPressed__,
    isSpacePressed: __isSpacePressed__,
    isPPressed: __isPPressed__
  }
  
  
}