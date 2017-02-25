
function newSnowball() {

  var can = document.getElementById('canvas');
  var ctx = can.getContext("2d");

  var update_interval = 1000/60;
  var accumulate = 0;
  var last_tick_time = 0;

  var mouse = newMouse();
  var menu = newMenu();
  
  var __tick__ = function(time){
    var delta_time = time - last_tick_time;
    
    ctx.clearRect(0,0,can.width,can.height);
    ctx.beginPath();
    menu.draw(ctx);
    
    accumulate += delta_time;
    
    while (accumulate >= update_interval) {
      menu.update({ctx:ctx, can:can, time:time, mouse:mouse});
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
