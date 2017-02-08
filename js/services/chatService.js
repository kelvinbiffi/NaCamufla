/**
 * Service to send info about chats cross controlers
 */
app.service('chatService', function($http, userService) {
  var chatTalk = [];
  var chatTalkInfo = {};

  var scrollDown = function(time){
    var n = $('#chat-talk').height() * 100;
    $('#chat-talk').animate({ scrollTop: n }, time);
  };

  var notifyMessage = function(){
    $('embed').remove();
    $('body').append('<embed src="../sounds/you-wouldnt-believe.ogg" autostart="true" hidden="true" loop="false">');
  };

  var setChatTalk = function(newObj) {
    chatTalk = newObj;
  };
  var getChatTalk = function(){
    return chatTalk;
  };

  var setChatInfo = function(newObj) {
    localStorage.setItem("ChatterChatId", newObj.room);
    chatTalkInfo = newObj;
  };
  var getChatInfo = function(){
    return chatTalkInfo;
  };

  /**
   * Function to send a new message
   */
  var addMessage = function(objMsg){
    var user = userService.getUser();
    var url = "./ws/getJson.php";
    var data = {
      action: "sendMsg",
      chatId: chatTalkInfo.room,
      participantCode: user[0].code,
      msg: objMsg.text
    };
    $http({
      method: 'GET',
      url: url,
      params: data
    }).then(function successCallback(obj) {
      chatTalk.push({"nick": objMsg.user, "msg": objMsg.text});
    }, function errorCallback(data, status, headers, config) {
      console.log("Error send message",data, status, headers, config);
    });
  };

  /**
   * Function to load chat messages from json file
   */
  var loadChatTalk = function(){
    var user = userService.getUser();
    var url = "./ws/getJson.php";
    var data = {
      action: "returnChat",
      chatId: chatTalkInfo.room,
      participantCode: user[0].code
    };
    $http({
      method: 'GET',
      url: url,
      params: data
    }).then(function successCallback(obj) {
      chatTalk = obj.data;
      notifyMessage();
      //Slide down chat content
      var controlScrollDown = setTimeout(function(){
        scrollDown(1000);
        clearTimeout(controlScrollDown);
      },500);
    }, function errorCallback(data, status, headers, config) {
      console.log("Error loading chat talk",data, status, headers, config);
      if(data.status === 404 && data.statusText === "Not Found"){
        chatTalk = [];
      }
    });
  };

  return {
    setChatTalk: setChatTalk,
    getChatTalk: getChatTalk,
    setChatInfo: setChatInfo,
    getChatInfo: getChatInfo,
    scrollDown: scrollDown,
    addMessage: addMessage,
    loadChatTalk: loadChatTalk
  };
});
