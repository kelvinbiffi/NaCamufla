

$(document).ready(function(){
  var width = $(window).width();
  //When resize screen recalculate chat-talk height
  $("#chat-talk").height(($("#chat").height() - (width < 768 ? 150 : 200) ));
  $("#tuts").height(($("#chat").height() - (width < 768 ? 50 : 100) ));
  $("#listRooms").height(($("#chat").height() - (width < 768 ? 100 : 100) ));

  //When resize screen recalculate chat-talk height
  $(window).resize(function(){
    width = $(window).width();
    $("#chat-talk").height(($("#chat").height() - (width < 768 ? 150 : 200) ));
    $("#tuts").height(($("#chat").height() - (width < 768 ? 50 : 100) ));
    $("#listRooms").height(($("#chat").height() - (width < 768 ? 100 : 100) ));
  });

  var leaveChat = function () {
    var chat = localStorage.getItem("ChatterChatId");
    var userCode = localStorage.getItem("ChatterUserCode");
    var userNick = localStorage.getItem("ChatterUserNick");
    localStorage.removeItem("ChatterChatId");
    localStorage.removeItem("ChatterUserCode");
    localStorage.removeItem("ChatterUserNick");
    var params = {
      action: "leaveChat",
      participantCode: userCode,
      participantNick: userNick,
      chatId: chat
    };
    console.log(params,'params');
    $.ajax({
      type: 'GET',
      async: false,
      url: "./ws/getJson.php",
      data: params,
      success: function (data){
        console.log(data,'unload');
      }
    });
  };

  $(window).bind('beforeunload', function () {
    leaveChat();
  });

  $(window).bind("unload", function () {
    leaveChat();
  });

  $(window).on('pagebeforehide', function () {
    leaveChat();
  });

  $(window).on("pagehide", function () {
    leaveChat();
  });

});
