

$(document).ready(function(){
  var width = $(window).width()
  //When resize screen recalculate chat-talk height
  $("#chat-talk").height(($("#chat").height() - (width < 768 ? 150 : 200) ));
  $("#tuts").height(($("#chat").height() - (width < 768 ? 50 : 100) ));

  //When resize screen recalculate chat-talk height
  $( window ).resize(function(){
    width = $(window).width()
    $("#chat-talk").height(($("#chat").height() - (width < 768 ? 150 : 200) ));
    $("#tuts").height(($("#chat").height() - (width < 768 ? 50 : 100) ));
  });

});
