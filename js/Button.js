// args - {x:x, y:y, radius:radius, color:color, text:text}
function newButton(args) {
  
  //////////////////////
  // Private variables
  //////////////////////
  
  var radius = args['radius'];  // Radius of circle
  var color = args['color'];    // Color of circle
  var x = args['x'];            // x coordinate of circle
  var y = args['y'];            // y corrdiante of circle
  var x_offset = 0;             // x offset of circle
  var y_offset = 0;             // y offset of circle
  
  var text = args['text'];      // text for button
  var text_x = 0;               // x coordinate of text
  var text_y = 0;               // y coordinate of text
  var text_x_offset = 0;        // x offset of text
  var text_y_offset = 0;        // y offset of text
  
  //////////////
  // Methods
  //////////////
  
  // Sets the color of the button to new_color
  var __setColor__ = function(new_color) {
    // TODO - error checking
    color = new_color;
  }
  
  // Sets the text of the button to new_text
  var __setText__ = function(new_text) {
    // TODO - error checking
    text = new_text;
  }
  
  // Updates the button.
  // args - must contain 'mouse', 'can', and 'ctx'
  var __update__ = function(args) {
    // Gets the mouse position on the canvas relative to the center
    var mouse_x = args['mouse'].getX() - (args['can'].width / 2);
    var mouse_y = args['mouse'].getY() - (args['can'].height / 2);
    
    // Calculate the offset of the circle
    x_offset = mouse_x * 0.0625;
    y_offset = mouse_y * 0.0625;
    
    // Calculate the position of the text
    args['ctx'].font = "30px Verdana";
    text_x = x - radius + (((radius * 2) - args['ctx'].measureText(text).width) / 2);
    text_y = y + (30 * 0.5);
    
    // Calculate the offset of the text
    text_x_offset = mouse_x * 0.125;
    text_y_offset = mouse_y * 0.125;
  }
 
  // Draws the button
  // ctx - the context in which to draw on
  var __draw__ = function(ctx) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x - x_offset, y - y_offset, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = "#000000";
    ctx.font = "30px Verdana";
    ctx.fillText(text, text_x - text_x_offset, text_y - text_y_offset);
  }
  
  // Return the completed object
  return {
    update: __update__,
    draw: __draw__,
    setColor: __setColor__,
    setText: __setText__
  }
}