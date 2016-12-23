/* TODO - make new file for Sound class
 *      - add comments 
 */
 
/* TODO - make adding sounds generic */
function Sound(){
  
  /* TODO - add comment */
  this.isPlaySound = true;
  
  /* TODO - add comment */
  this.currentSound = "buttonPress";
  
  /* TODO - add comment */
  this.sounds = new Howl({
      urls: ['music/soundEffects.mp3'],
      sprite: {
          buttonPress: [0,260]
      }
  });
  
  /* TODO - add comment */
  this.playSound = function(sound){
    this.currentSound = sound;
    if(this.isPlaySound) {
      this.sounds.play(sound);
      return true;
    } else {
      return false;
    }
  };

  /* TODO - add comment */
  this.muteSounds = function() {
    this.isPlaySound = false;
  };

  /* TODO - add comment */
  this.unmuteSounds = function() {
    this.isPlaySound = true;
  };
}

/* TODO - move statement */
var gameSound = new Sound();