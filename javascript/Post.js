var POST_IMAGE = new Image();
POST_IMAGE.src = "images/Post.png";

/* Represents a post on the map.
 *
 * Arguments for Constructor:
 *  _x: x coordinate of post
 *  _y: y coordinate of post
 *  _r: radius of post
 */
function Post(x, y, r) {
  /* Checking arguments */
  if (isNaN(x) || isNaN(y) || isNaN(r)) {
    log("Post:setup. Improper arguments.\n"
            + "x = " + x + "\n"
            + "y = " + y + "\n"
            + "r = " + r + "\n");
    x = 0;
    y = 0;
    r = 0;
  }
  
  this.x = x;  /* x coordinate */
  this.y = y;  /* y coordinate */
  this.r = r;  /* radius */
  
  /* TODO - add comment */
  this.setup = function(x, y, r) {
    /* Checking arguments */
    if (isNaN(x) || isNaN(y) || isNaN(r)) {
      log("Post:setup. Improper arguments.\n"
              + "x = " + x + "\n"
              + "y = " + y + "\n"
              + "r = " + r + "\n");
      x = 0;
      y = 0;
      r = 0;
    }
    
    this.x = x;
    this.y = y;
    this.r = r;
  };
  
  /* TODO - add comment */
  this.reset = function() {
    this.x = 0;
    this.y = 0;
    this.r = 0;
  };

  /* TODO - add comment */
  this.update = function() {

  };
  
  /* TODO - add comment */
  this.draw = function(dx, dy) {
    ctx.fillStyle = "#000000";
    ctx.drawImage(POST_IMAGE, 
                  this.x - this.r + dx, 
                  this.y - this.r + dy, 
                  this.r * 2, 
                  this.r * 2); 
  };
}

