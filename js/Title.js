function newTitle(args) {
  // position
  var x = args["x"];
  var y = args["y"];
  var x_offset = 0;
  var y_offset = 0;
  
  // size
  var width = args["width"];
  var height = args["height"];
  
  // text
  var text = args["text"];
  var text_x = 0;
  var text_y = 0;
  var text_x_offset = 0;
  var text_y_offset = 0;
  
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

  var __update__ = function(args) {
    var mouse_x = args['mouse'].getX();
    var mouse_y = args['mouse'].getY();
    
    x_offset = mouse_x * 0.0625;
    y_offset = mouse_y * 0.0625;
    
    args['ctx'].font = "bold 60px Verdana";
    text_x = ((width - args['ctx'].measureText(text).width) / 2) + x;
    text_y = ((height + 60) / 2) + y
    
    text_x_offset = mouse_x * 0.125;
    text_y_offset = mouse_y * 0.125;

  }

  return {
    draw: __draw__,
    update: __update__
  }
}
