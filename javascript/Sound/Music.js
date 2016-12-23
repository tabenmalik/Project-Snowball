/* Class: Music()
 * Parameters N/A
 * 
 * A class for handling several files of music. 
 */
/* TODO - make adding music generic */
function Music(){
  /* True if no music should be played */
  this.muted = false;
  
  /* Plays song in song array at this index */
  this.currentSong = 0;
  
  /* Array of songs to play that can be played. */
  this.music = [
      new Howl({
          urls: ['music/Carefree.mp3'],
          volume: 0.7,
          loop: false,
      }),

      new Howl({
          urls: ['music/Monkeys Spinning Monkeys.mp3'],
          volume: 0.5,
          loop: false,
      }),
  ];
  
  /* Increases the volume of the current playing song,
   * if there is a song playing.
   */
  /* TODO - complete function */
  this.incVolume = function(){};
  
  /* Decreases the volume of the current playing song,
   * if there is a song playing.
   */
  /* TODO - complete function */
  this.decVolume = function(){};
  
  /* Changes the volume of the current playing song to
   * the given volume, if there is a song that is playing
   */
  /* TODO - complete function */
  this.changeVolume = function(){};
  
  /* Adds a song to the array of songs that can be played.
   * Returns a md (music descriptor) used to 
  /* TODO - complete function */
  this.addSong = function(){};
  
  /* TODO - complete function */
  this.removeSong = function(){};

  /* TODO - add comment */
  this.playMusic = function(musicNum) {
    var playingMusic = false;
    this.currentSong = musicNum;
    
    if(!this.muted) {
      this.music[musicNum].loop = true;
      this.music[musicNum].play();
      playingMusic = true;
    }
    
    return playingMusic;
  };

  /* TODO - add comment */
  this.stopMusic = function(){
    this.music[this.currentSong].stop();
    this.music[this.currentSong].loop = false;
  };

  /* TODO - add comment */
  this.changeMusic = function(musicNum){
    this.stopMusic();
    this.playMusic(musicNum);
  };

  /* TODO - add comment */
  this.muteMusic = function(){
    this.muted = true;
    this.stopMusic();
  };

  /* TODO - add comment */
  this.unmuteMusic = function(){
    this.muted = false;
    this.playMusic(this.currentSong);
  };
  
  this.isMuted = function() {
    return this.muted;
  };
}

/* TODO - move this statement */
var gameMusic = new Music();