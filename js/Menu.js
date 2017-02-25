var newMenu = function() {
  var title = newTitle({x:100, y:125, width:600, height:100, text:"Snowball"});
  var play_button = newButton({x:400, y:400, radius: 70, text: "PLAY", color: "#5555ff"});
  var option_button = newButton({x:600, y:500, radius:70, text:"Options", color:"#5555ff"});
  var instruction_button = newButton({x:200, y:500, radius:70, text:"How To", color:"#5555ff"});
  
  var __draw__ = function(ctx) {
    title.draw(ctx);
    play_button.draw(ctx);
    option_button.draw(ctx);
    instruction_button.draw(ctx);
  }
  
  var __update__ = function(time, mouse) {
    title.update(time, mouse);
    play_button.update(time, mouse);
    option_button.update(time, mouse);
    instruction_button.update(time, mouse);
  }
  
  return {
    draw: __draw__,
    update: __update__
  }
}