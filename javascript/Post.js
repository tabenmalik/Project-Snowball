/* Represents a post/obstable on the map.
 *
 * Arguments for Constructor:
 *  _x: x coordinate of post
 *  _y: y coordinate of post
 *  _r: radius of post
 */
function Post(_x, _y, _r) {
  this.x = _x;  /* x coordinate */
  this.y = _y;  /* y coordinate */
  this.r = _r;  /* radius */

  /* TODO - add comment */
  this.update = function() {

  };
  
  /* TODO - add comment */
  this.draw = function(dx, dy) {
    ctx.fillStyle = "#000000";
    ctx.drawImage(images.Post, 
                  this.x - this.r + dx, 
                  this.y - this.r + dy, 
                  this.r * 2, 
                  this.r * 2); 
  };
}

