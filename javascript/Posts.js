function Posts() {

  this.posts = [];
  
  this.setup = function() {
    
  };
  
  this.reset = function() {
    this.posts.splice(0, this.posts.length);
  };
  
  
  
  
  this.get = function(i) {
    /* Checking arguments */
    if (isNaN(i) || i < 0 || i >= this.length() - 1) {
      log("Posts:get. Improper arguments.\n"
              + "i = " + i + "\n");
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
      log("Posts:add. Improper arguments.\n"
              + "post = " + post + "\n");
      return;
    }
    
    this.posts.push(post);
  };
  
  this.remove = function(i) {
    /* Checking arguments */
    if (isNaN(i) || i < 0 || i >= this.length() - 1) {
      log("Posts:remove. Improper arguments.\n"
              + "i = " + i + "\n");
      return;
    }
    
    return this.posts.splice(i, 1)[0];
  };
  
  this.find = function() {
    
  };
  
  this.toArray = function() {};
  
  this.toString = function() {};
  
  
  this.update = function() {
    
  };
  
  this.draw = function(dx, dy) {
    for (int i = 0; i < posts.length; i++) {
      this.posts[i].draw(dx, dy);
    }
  };

}

function Linear_Posts() {
  this.init_gap;
  this.gap;
  this.posts;
  this.EASY_START_COUNT = 5;
  this.max_r = 30.0;
  this.min_r = 10.0;
  
  this.setup = function() {
    this.posts = new Posts();
  };
  
  this.reset = function() {
    this.posts.reset();
  };
  
  this.toArray = function() {
    
  };
  
  this.newNonCenteredPost = function() {
    var r = (Math.random() * (this.max_r - this.min_r)) + this.min_r;
    var y = map.screen_top();
    var x = 0;
    
    var gap = 100;
    var variation = map.right(map.screen_top) - map.left(map.screen_top) - gap;
    x = Math.random() * variation;
    if(x < (variation / 2.0)) {
        x += map.left(map.screen_top());
    } else {
        x += map.left(map.screen_top()) + gap;
    }
    
    var new_post = new Post(x, y, r);
    this.posts.add(new_post);
  };
  
  this.newCenteredPost = function(map) {
    var x = map.center_x();
    var y = map.screen_top();
    var r = (Math.random() * (this.max_r - this.min_r)) + this.min_r;
    
    var new_post = new Post(x, y, r);
    this.posts.add(new_post);
  };
  
  this.newRandomPost = function(map) {
    var x = map.right(map.screen_top()) - map.left(map.screen_top());
    var y = map.screen_top();
    var r = (Math.random() * (this.max_r - this.min_r)) + this.min_r;
    
    var new_post = new Post(x, y, r);
    this.posts.add(new_post);
  };
  
  this.max_gap;
  this.min_gap;
  
  this.update = function(time, map) {
    /* Create new post if needed */
    var last_post = this.posts.get(this.posts.length() - 1);
    /* TODO - remove player from equation. make map keep track of center */
    if (last_post.y - (player.y - (can.height / 2.0)) >= this.gap) {
        if (this.posts.length() < this.EASY_START_COUNT) {
          this.newNonCenteredPost();
        
        } else if (this.posts.length() == this.EASY_START_COUNT) {
          this.newCenteredPost();
        
        } else {    
          this.newRandomPost();
        }
        
      /* update gap */
      this.gap = (Math.random() * (this.max_gap - this.min_gap)) + this.min_gap;
    }
    
    this.posts.update(time);
  };
  
  this.draw = function() {
    this.posts.draw();
  };
}