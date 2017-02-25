
function newSnowball() {

  var can = document.getElementById('canvas');
  var ctx = can.getContext("2d");

  var update_interval = 1000/60;
  var accumulate = 0;
  var last_tick_time = 0;

  var menu = newMenu();
  
  var __tick__ = function(time){
    var delta_time = time - last_tick_time;
    
    ctx.beginPath();
    menu.draw(ctx);
    
    accumulate += delta_time;
    
    while (accumulate >= update_interval) {
      menu.update();
      accumulate -= update_interval;
    }
    
    last_tick_time = time;
    window.requestAnimationFrame(__tick__);
  }
  
  var __start__ = function(){
    window.requestAnimationFrame(__tick__);
  }
  
  return {
    tick: __tick__,
    start: __start__
  }
}
