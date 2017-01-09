/* 
 * A class for handling several files of music. 
 */
/* TODO - make adding music generic */
function Music(){
  
  /* True if no music should be played */
  this.muted = false;  
  this.allMusic;
  this.playingMusic;
  this.MAX_VOL = 1;
  
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
  
  /* If md is set, increases the volume of the song associated to the md by .1.
   * Otherwise, it increases the volume of all songs by .1.
   * This method increases the volume whether a song is playing or not.
   */
  this.incVolume = function(md = -1) {
    /* Checking arguments */
    if (md < -1 || md >= allMusic.length) {
      log ("Music:incVolume improper argument. md is " + md);
      return;
    }
    
    var volInc = .1;
    
    if (md == -1) {
      /* Increases the volume of every song */
      for (int song = 0; song < allMusic.length; ++song) {
        if (allMusic[song].volume < this.MAX_VOL) {
          allMusic[song].volume += volInc;
        }
      }
    } else {
      /* Increases the volume of only the given song */
      allMusic[md].volume += volInc;
    }
  };
  
  /* If md is set, decreases the volume of the song associated to the md by .1.
   * Otherwise, it decreases the volume of all songs by .1.
   * This method decreases the volume whether a song is playing or not.
   */
  this.decVolume = function(md = -1) {
    /* Checking arguments */
    if (md < -1 || md >= this.allMusic.length) {
      log ("Music:decVolume improper argument. md is " + md);
      return;
    }
    
    var volInc = .1;
    
    if (md == -1) {
      /* Decrease the volume of every song */
      for (int song = 0; song < this.allMusic.length; ++song) {
        if (this.allMusic[song].volume < this.MAX_VOL) {
          this.allMusic[song].volume -= volInc;
        }
      }
    } else {
      /* Decrease the volume of only the given song */
      this.allMusic[md].volume -= volInc;
    }
  };
  
  /* If md is set, changes the volume of the song associated to the md
   * to the given volume.
   * Otherwise, it changes the volume of all songs.
   * This method changes the volume whether a song is playing or not.
   */
  this.changeVolume = function(vol = -1, md = -1) {
    /* Checking arguments */
    if (vol < 0 || vol > 1) {
      log("Music:changeVolume invalid argument. vol is " + vol);
      return;
    }
    
    if (md < -1 || md >= this.allMusic.length) {
      log("Music:changeVolume invalid argument. md is " + md);
      return;
    }
    
    if (md == -1) {
      /* Changes the volume of every song */
      for (int song = 0; song < this.allMusic.length; ++song) {
        this.allMusic[song].volume = vol;
      }
    } else {
      /* Changes the volume of only the given song */
      this.allMusic[md].volume = vol;
    }
  };
  
  /* Adds a song to the array of songs that can be played.
   * Returns a md (music descriptor) used to 
  /* TODO - complete function */
  this.addSong = function(path = "") {
    var song = new Howl({url: path, volume: 1, loop: false});
    allMusic.push(song);
    return allMusic.length - 1;
  };
  
  /* TODO - complete function */
  this.removeSong = function(md = -1){
    
  };

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
    if (this.currentSong != this.NO_CURRENT_SONG) {
      this.music[this.currentSong].stop();
      this.music[this.currentSong].loop = false;
    }
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