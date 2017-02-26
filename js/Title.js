// args - {x:x, y:y, width:width, height:height, text:text}
function newTitle(args) {
  
  /////////////////////
  // Private Variables
  /////////////////////
  
  var x = args["x"];            // x coordinate of rectangle
  var y = args["y"];            // y coordinate of rectangle
  var x_offset = 0;             // x offset of rectangle
  var y_offset = 0;             // y offset of rectangle
  var width = args["width"];    // width of rectangle
  var height = args["height"];  // height of rectangle
  
  var text = args["text"];      // text for title
  var text_x = 0;               // x coordinate of text
  var text_y = 0;               // y coordinate of text
  var text_x_offset = 0;        // x offset of text
  var text_y_offset = 0;        // y offset of text
  
  ////////////
  // Methods
  ////////////
  
  // Draws the title block
  // ctx - the context to draw on
  var __draw__ = function(ctx) {
    // draws purple background rectangle
    ctx.fillStyle = "#5555ff";
    ctx.fillRect(x - x_offset, y - y_offset, width, height);
    
    // draws shadowed text
    ctx.fillStyle = "#999999";
    ctx.font = "bold 60px Verdana";
    ctx.fillText(text, text_x - x_offset, text_y - y_offset);

    // draws text
    ctx.fillStyle = "#000000";
    ctx.fillText(text, text_x - text_x_offset, text_y - text_y_offset);
  }

  // Updates the title
  // args - must contain 'mouse', 'can', and 'ctx'
  var __update__ = function(args) {
    // Gets the mouse position on the canvas relative to the center
    var mouse_x = args['mouse'].getX() - (args['can'].width / 2);
    var mouse_y = args['mouse'].getY() - (args['can'].height / 2);
    
    // Calculate the offset of the rectangle
    x_offset = mouse_x * 0.0625;
    y_offset = mouse_y * 0.0625;
    
    // Calculates the position of the text
    args['ctx'].font = "bold 60px Verdana";
    text_x = ((width - args['ctx'].measureText(text).width) / 2) + x;
    text_y = ((height + 60) / 2) + y
    
    // Calculates the offset of the text
    text_x_offset = mouse_x * 0.125;
    text_y_offset = mouse_y * 0.125;
  }

  // Returns the completed object
  return {
    draw: __draw__,
    update: __update__
  }
}
