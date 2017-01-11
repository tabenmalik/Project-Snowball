function LinearMap() {
  this.posts;
  this.camera_x = 0;
  this.camera_y = 0;
  
  this.x_offset = can.width / 2.0;
  this.y_offset = can.height / 2.0;
  
  this.wall_left = -200;
  this.wall_right = 200;
  
  this.setup = function() {
    this.posts = new LinearPosts();
    this.posts.setup();
  };
  
  this.reset = function() {
    
  };
  
  this.update = function(time, player) {
    this.camera_x = player.x;
    this.camera_y = player.y;
    
    this.x_offset = -this.camera_x + (can.width / 2.0);
    this.y_offset = -this.camera_y + (can.height / 2.0);
  };
  
  this.draw = function() {
    /* Draw Boundaries */
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(this.wall_left + this.x_offset, 0, this.wall_right - this.wall_left, can.height);
    
    /* Draw posts */
    this.posts.draw(this.x_offset, this.y_offset);
  };
}