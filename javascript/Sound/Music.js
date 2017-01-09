/* A class for handling several files of music. 
 * Only one track can play at a time.
 */
function Music(){
  
  /* Plays song in song array at this index */
  this.currentSong = -1;
  
  /* An array of songs that can be played */  
  this.music = new Array();
 
  /* Increases the volume of the current playing song,
   * if there is a song playing.
   */
  this.incVolume = function() {
    if (this.currentSong == -1) {
      log("Music:incVolume. There is no current song.");
      return;
    }

    var currVol = this.music[currentSong].volume();
    var newVol = currVol + 0.1;
    this.music[currentSong].volume(newVol);
  };
  
  /* If md is set, decreases the volume of the song associated to the md by .1.
   * Otherwise, it decreases the volume of all songs by .1.
   * This method decreases the volume whether a song is playing or not.
   */
  this.decVolume = function() {
    if (this.currentSong != -1) {
      var currVol = this.music[currentSong].volume();
      var newVol = currVol - 0.1;
      this.music[currentSong].volume(newVol);
    }
  };
  
  /* If md is set, changes the volume of the song associated to the md
   * to the given volume.
   * Otherwise, it changes the volume of all songs.
   * This method changes the volume whether a song is playing or not.
   */
  this.changeVolume = function(newVol) {
    if (this.currentSong != -1) {
      this.music[currentSong].volume(newVol);
    }
  };
  
  /* Adds a song to the array of songs that can be played.
   * Returns a md (music descriptor) used to
   */
  this.addSong = function(src = "", initVol = 0, initLoop = false) {
    /* Check arguments */
    if (!src || initVol > 1.0 || initVol < 0) {
      log("Music:addSong. Improper arguments.\n"
              + "src = " + src + " "
              + "initVol = " + initVol + " "
              + "initLoop = " + initLoop);

      return -1;
    }
  
    var song = new Howl({
            src: [src],
            volume: initVol,
            loop: initLoop });

    this.music.push(song);
    return this.music.length - 1;
  };
  
  /* Removes the song associated with the give md 
   */
  this.removeSong = function(md) {
    /* Checking arguments */
    if (md < 0 || md >= this.music.length) {
      log("Music:removeSong. Improper arguments."
              + "md = " + md);
      return;
    }

    this.music.splice(md, 1);
  };

  /* Switches songs to the song given by MD.
   * If no MD is supplied than the current song is played.
   * If muteMusic has been called, playMusic will switch songs
   * but will remain to be muted.
   */
  this.playMusic = function(md = this.currentSong) {
    /* Checking arguments */
    if (md < 0 || md >= this.music.length) {
      log("Music:playMusic. Improper arguments."
              + "md = " + md);
      return;
    }
    
    
    if (md != this.currentSong) {
      this.stopMusic();
      this.currentSong = md;
    }

    if (!this.muted && !this.music[this.currentSong].playing()) {
      this.music[this.currentSong].play();
    }
  };

  /* Stops playing the current song. This is not equivalent to
   * muting the music. If playMusic is called again the music 
   * will continue playing.
   */
  this.stopMusic = function() {
    /* Checking state */
    if (this.currentSong == -1) {
      log("Music:stopMusic. There is no current song");
      return;
    }
    
    this.music[this.currentSong].stop();
  };

  /* Mutes the current playing song. If playMusic is called
   * to switch songs, the music will remain to be muted.
   * unmuteMusic must be called to unmute the music.
   */
  this.muteMusic = function(){
    this.muted = true;
    this.stopMusic();
  };

  /* Unmutes the current playing song.
   */
  this.unmuteMusic = function(){
    this.muted = false;
    this.playMusic(this.currentSong);
  };
 
  /* Returns true if the music is currently muted.
   */ 
  this.isMuted = function() {
    return this.muted;
  };
}

/* TODO - move this statement */
var gameMusic = new Music();
