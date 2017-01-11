function Posts() {

  this.posts = [];
  
  this.setup = function() {};
  
  this.reset = function() {
    this.posts.splice(0, this.posts.length);
  };
  
  
  
  
  this.get = function(i) {
    /* Checking arguments */
    if (isNaN(i) || i < 0 || i >= this.length() - 1) {
      log("Posts:get. Improper arguments.\n" +
              "i = " + i + "\n");
      return;
    }
    
    return this.posts[i];
  };
  
  this.length = function() {
    return this.posts.length;
  };
  
  this.add = function(post) {
    /* Checking arguments */
    if (!(post instanceof Post)) {
      log("Posts:add. Improper arguments.\n" +
              "post = " + post + "\n");
      return;
    }
    
    this.posts.push(post);
  };
  
  this.remove = function(i) {
    /* Checking arguments */
    if (isNaN(i) || i < 0 || i >= this.length() - 1) {
      log("Posts:remove. Improper arguments.\n" +
              "i = " + i + "\n");
      return;
    }
    
    return this.posts.splice(i, 1)[0];
  };
  
  this.find = function() {};
  
  this.toArray = function() {};
  
  this.toString = function() {};
  
  
  this.update = function() {};
  
  this.draw = function(dx, dy) {
    for (var i = 0; i < this.posts.length; i++) {
      this.posts[i].draw(dx, dy);
    }
  };
}
