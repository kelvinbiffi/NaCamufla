

$(document).ready(function(){
  
  //When resize screen recalculate chat-talk height
  $("#chat-talk").height(($("#chat").height() - 200));
  
  //When resize screen recalculate chat-talk height
  $( window ).resize(function(){
    $("#chat-talk").height(($("#chat").height() - 200));
  });
  
});