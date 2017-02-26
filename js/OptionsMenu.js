var newOptionsMenu = function() {
  
  /////////////////////
  // Private Variables
  /////////////////////
  var title = newTitle({x:100, y:60, width:600, height:100, text:"Options"});
  var back_button = newButton({x:100, y:500, radius:50, color:"#5555ff", text:"Back"});
  var music_button = newButton({x:200, y:230, radius:50, color:"#5555ff", text:"Music"});
  var sound_button = newButton({x:200, y:360, radius:50, color:"#5555ff", text:"Sound"});
  
  ////////////
  // Methods
  ////////////
  
  // Draws the menu
  var __draw__ = function(ctx) {
    title.draw(ctx);
    back_button.draw(ctx);
    music_button.draw(ctx);
    sound_button.draw(ctx);
  }
  
  // Updates the menu
  var __update__ = function(args) {
    title.update(args);
    back_button.update(args);
    music_button.update(args);
    sound_button.update(args);
  }
  
  // Returns the completed object
  return {
    draw: __draw__,
    update: __update__
  }
}