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
  
  /* TODO - remove this instance variable? */
  /* Boolean array of songs that are loaded */
  //this.musicLoads = [false,false,false,false,false,false];
  
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
  
  /* TODO - complete function */
  this.incVolume = function(){};
  
  /* TODO - complete function */
  this.decVolume = function(){};
  
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
    this.isPlayMusic = false;
    this.stopMusic();
  };

  /* TODO - add comment */
  this.unmuteMusic = function(){
    this.isPlayMusic = true;
    this.playMusic(this.currentSong);
  };
}

/* TODO - move this statement */
var gameMusic = new Music();