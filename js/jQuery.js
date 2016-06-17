

$(document).ready(function(){
  console.log($("#chat").height());
  $("#chat-talk").height(($("#chat").height() - 200));
  console.log($("#chat-talk").height());
  $( window ).resize(function(){
    $("#chat-talk").height(($("#chat").height() - 200));
  });
  
});