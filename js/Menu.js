var newMenu = function() {
  
  /////////////////////
  // Private variables
  /////////////////////
  
  // The title
  var title = newTitle({x:100, y:125, width:600, height:100, text:"Snowball"});
  
  // The play button
  var play_button = newButton({x:400, y:400, radius: 70, text: "PLAY", color: "#5555ff"});
  
  // The option button
  var option_button = newButton({x:600, y:500, radius:70, text:"Options", color:"#5555ff"});
  
  // The instruction button
  var instruction_button = newButton({x:200, y:500, radius:70, text:"How To", color:"#5555ff"});
  
  ///////////
  // Methods
  ///////////
  
  // Draws the menu
  var __draw__ = function(ctx) {
    title.draw(ctx);
    play_button.draw(ctx);
    option_button.draw(ctx);
    instruction_button.draw(ctx);
  }
  
  // Updates the menu
  var __update__ = function(args) {
    title.update(args);
    play_button.update(args);
    option_button.update(args);
    instruction_button.update(args);
  }
  
  // Returns the completed object
  return {
    draw: __draw__,
    update: __update__
  }
}