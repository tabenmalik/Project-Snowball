
function newSnowball() {

  var can = document.getElementById('canvas');
  var ctx = can.getContext("2d");

  var update_interval = 1000/60;
  var accumulate = 0;
  var last_tick_time = 0;
  
  var __tick__ = function(time){
    var delta_time = time - last_tick_time;
    
    ctx.beginPath();
    
    accumulate += delta_time;
    
    while (accumulate >= update_interval) {
      ctx.clearRect(0, 0, can.width, can.height);
      ctx.fillStyle= "#000000";
      ctx.font = "30px Verdana";
      ctx.fillText(time.toString(), 100, 100);
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