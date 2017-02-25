
function newSnowball() {

  var can = document.getElementById('canvas');
  var ctx = can.getContext("2d");

  var update_interval = 1000/60;
  var accumulate = 0;
  var last_tick_time = 0;

  var menu = newTitle({x:100, y:125, width:600, height:100, text:"Snowball"});
  var button1 = newButton({x:400, y:400, radius: 70, text: "PLAY", color: "#5555ff"});
  
  var __tick__ = function(time){
    var delta_time = time - last_tick_time;
    
    ctx.beginPath();
    menu.draw(ctx);
    button1.draw(ctx);
    
    accumulate += delta_time;
    
    while (accumulate >= update_interval) {
      menu.update();
      button1.update();
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
