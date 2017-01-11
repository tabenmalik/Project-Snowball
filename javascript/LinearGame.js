function LinearGame(){
  this.map;
  this.player;
  this.score;
  this.high_score;
  this.song_src = 'music/Monkeys Spinning Monkeys.mp3';
  this.md;
  
	this.setup = function(){
    this.map = new LinearMap();
    this.player = new Player(0, 0, 10, -Math.PI / 2.0);
    this.map.setup();
    this.md = gameMusic.addSong(this.song_src, 0.5, true);
	};
	
	this.reset = function(){
		this.map.reset();
    this.player.reset();
    /* Reset score */
	};
  
  this.start = function() {
    
  };
  
  this.stop = function() {
    
  };
	
	this.update = function(time) {
    /* Update Player */
    this.player.update(time)
    /* Update Map */
    this.map.update(time, this.player);
    /* Update Score */
    /* Check for end game */
	};
	
	this.draw = function() {
    /* Reset canvas */
    ctx.clearRect(0,0,can.width, can.height);
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,can.width, can.height);
    
    /* Draw map */
    this.map.draw();
    /* Draw player */
    this.player.draw(this.map.x_offset, this.map.y_offset);
    /* Draw score */
	};
}