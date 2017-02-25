function newButton(args) {
  
  var radius = args['radius'];
  var color = args['color'];
  var x = args['x'];
  var y = args['y'];
  var x_offset = 0;
  var y_offset = 0;
  
  var text = args['text'];
  var text_x = 0;
  var text_y = 0;
  var text_x_offset = 0;
  var text_y_offset = 0;
  
  var __setColor__ = function(new_color) {
    color = new_color;
  }
  
  var __setText__ = function(new_text) {
    text = new_text;
  }
  
  var __update__ = function(time, mouse) {
    var mouse_x = mouse.getX();
    var mouse_y = mouse.getY();
    
    x_offset = mouse_x * 0.0625;
    y_offset = mouse_y * 0.0625;
    
    text_x_offset = mouse_x * 0.125;
    text_y_offset = mouse_y * 0.125;
  }
 
  var __draw__ = function(ctx) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x - x_offset, y - y_offset, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = "#000000";
    ctx.font = "30px Verdana";
    text_x = x - radius + (((radius * 2) - ctx.measureText(text).width) / 2);
    text_y = y + (30 * 0.5);
    ctx.fillText(text, text_x - text_x_offset, text_y - text_y_offset);
  }
  
  return {
    update: __update__,
    draw: __draw__,
    setColor: __setColor__,
    setText: __setText__
  }
}