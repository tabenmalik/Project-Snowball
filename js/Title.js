function newTitle(args) {
  // position
  var x = args["x"];
  var y = args["y"];

  // size
  var width = args["width"];
  var height = args["height"];
  
  // text
  var text = args["text"];

  var __draw__ = function(ctx) {
    // draws purple background rectangle
    ctx.fillStyle = "#5555ff";
    ctx.fillRect(x, y, width, height);
    
    // draws shadowed text
    ctx.fillSyle = "#999999";
    ctx.font = "bold 60px Verdana";
    var title_x = ((width - ctx.measureText(text).width) / 2) + x;
    var title_y = ((height + 60) / 2) + y;
    ctx.fillText(text, title_x, title_y);

    // draws text
    ctx.fillStyle = "#000000";
    ctx.fillText(text, title_x, title_y);
  }

  var __update__ = function() {

  }

  return {
    draw: __draw__,
    update: __update__
  }
}
