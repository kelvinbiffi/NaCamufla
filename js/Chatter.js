//Initialize application
var app = angular.module("Chatter", [
    'ngSanitize' //Working with "ng-bind-html" to show html tags on interface
]);

/**
 * Service to send info about user cross controlers
 */
app.service('userService', function() {
  var user = [];
  
  var setUser = function(newObj) {
      user = newObj;
  };
  var getUser = function(){
      return user;
  };
  return {
    setUser: setUser,
    getUser: getUser
  };
});

/**
 * Service to send info about rooms cross controlers
 */
app.service('roomService', function() {
  var roomList = [];

  var setContacts = function(newObj) {
      roomList = newObj;
  };
  var getContacts = function(){
      return roomList;
  };
  return {
    setContacts: setContacts,
    getContacts: getContacts
  };
});

/**
 * Service to send info about chats cross controlers
 */
app.service('chatService', function($http, userService) {
  var chatTalk = [];
  var chatTalkInfo = {};
  
  var scrollDown = function(time){
    console.log('controlScroll');
    var n = $('#chat-talk').height() * 100;
    $('#chat-talk').animate({ scrollTop: n }, time);
  };
  
  var setChatTalk = function(newObj) {
    chatTalk = newObj;
  };
  var getChatTalk = function(){
    return chatTalk;
  };
  
  var setChatInfo = function(newObj) {
    chatTalkInfo = newObj;
  };
  var getChatInfo = function(){
    return chatTalkInfo;
  };
  
  var addMessage = function(obj){
    chatTalk.push(obj);
  };
  
  var loadChatTalk = function(){
    var json = "./chat/" + chatTalkInfo.room + ".json";
    // Simple GET request example:
    $http({
      method: 'GET',
      url: json
    }).then(function successCallback(data) {
      chatTalk = data.data;
      //Slide down chat content
      var controlScrollDown = setTimeout(function(){
        console.log('controlScrollTimeOut');
        scrollDown(1000);
        clearTimeout(controlScrollDown);
      },500);
    }, function errorCallback(data, status, headers, config) {
      console.log("error",data, status, headers, config);
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


/**
 * Service to manipulate text sent or read
 */
app.service('textService',function(){
  
  //***have to add video crawler***
  
  var changeHtmlConcern = function(text){
    var regexBL = /\r?\n/g;
    var regexArrows = /<|>/g;
    text = text.replace(regexArrows, function(match) {
      if(match === "<")return '&lt;';
      if(match === ">")return '&gt;';
    });
    return text.replace(regexBL, function(match) {
      return '<br>';
    });
  };
  
  var emoticons = function(text){
    var urlRegex = /&lt;3|\(y\)/g;
    return text.replace(urlRegex, function(emoticon) {
      if(emoticon === "&lt;3" && text.trim() === emoticon)
        return '<span title="'+emoticon+'" class="fa fa-heart big" aria-hidden="true"></span>';
      if(emoticon === "&lt;3")
        return '<span title="'+emoticon+'" class="fa fa-heart" aria-hidden="true"></span>';
      if(emoticon === "(y)")
        return '<span  title="'+emoticon+'" class="fa fa-thumbs-o-up" aria-hidden="true"></span>';
      return emoticon;
    });
  };
  
  var returnLink = function(link){
    var label = link.substr(0,10) + "..." + link.substr(link.length-5,5);
    return '<a title="'+link+'" href="' + link + '" target="_blank">' + label + '...</a>';
  };
  
  var imaged = function(text){
    var urlRegex = /(http[s]?:\/\/[^\s]+)*(jpg|png|gif)/g;
    return text.replace(urlRegex, function(url) {
      return returnLink(url) + '<br><img class="image" src="' + url + '" />';
    });
  };
  
  //manipulate http urls sent
  var urlify = function(text) {
      text = changeHtmlConcern(text);
      text = imaged(text);
      text = emoticons(text);
      var urlRegex = /(http[s]?:\/\/[^\s](?![^" ]*(?:jpg|png|gif))[^" ]+)/g;
      return text.replace(urlRegex, function(url) {
          return returnLink(url);
      });
  };
  
  return {
    urlify: urlify
  };
});

app.controller("userCtrl",function($scope, userService){
  
  $scope.control = true;
  
  $scope.name = "";
  $scope.user = "";
  $scope.code = "";
  
  $scope.keyEnter = function(event){
    if(event.keyCode === 13){
      $scope.setUser();
    }
  };
  
  $scope.setUser = function(){
    if($scope.name.replace(" ","").trim() !== ""){
      $scope.user = $scope.name.replace(" ","").trim().toLowerCase();
      var d = new Date();
      $scope.code = $scope.user + d.getTime();
      $scope.useObj = [
        {code: $scope.code, user : $scope.user, name : $scope.name},
      ];
      userService.setUser($scope.useObj);
      $scope.control = false;
    }
  };
  
});

/**
 * rooms API Controller
 */
app.controller("roomsCtrl", function($scope, userService, roomService, chatService) {
  
  $scope.chatService = {};
  
  $scope.$watch(function () {
    return chatService.getChatInfo();
  }, function(newChatInfo, oldChatInfo) {
    console.log($scope.chatService, newChatInfo, oldChatInfo);
    $scope.chatService = newChatInfo;
  }, true);
  
  $scope.user = [];
  $scope.$watch(function () {
    return userService.getUser();
  }, function(newUser, oldUser) {
    console.log($scope.chatService, newUser, oldUser);
    $scope.user = newUser;
  }, true);
  
  //Arrar avaliable rooms must be loaded from web service getRooms
  $scope.rooms = [
    {room: "8yg74g4gsgb", size : "4545"},
    {room: "98t7fed80t7vd098y", size : "5657"},
    {room: "sdvdvbdfb", size : "455"},
  ];
  
  $scope.loadChat = function(roomInfo){
    // chatService.setChatTalk([]);//Clear chat content
    chatService.setChatInfo(roomInfo);
  };
  
  //send information to the services
  roomService.setContacts($scope.rooms);
});


/**
 * chat API controller
 */
app.controller("chatCtrl", function($scope, userService, roomService, chatService, textService) {
  
  //Get information from services
  //Watch userService
  $scope.user = [];
  $scope.$watch(function () {
    return userService.getUser();
  }, function(newUser, oldUser) {
    console.log($scope.chatService, newUser, oldUser);
    $scope.user = newUser;
  }, true);
  
  $scope.rooms = roomService.getContacts();
  $scope.textService = textService;
  
  //Variables
  $scope.chatInfo = [];
  $scope.chatTalk = [];
  $scope.textArea = "";
  
  //Watching chatInfo from rooms service set above
  $scope.$watch(function () {
    return chatService.getChatInfo();
  }, function(currentChatInfo, oldChatInfo) {
    $scope.chatInfo = [currentChatInfo];
    
    //if a room was selected
    if(!angular.equals({}, currentChatInfo)){
      //must be loaded from web service and must be add spinner
      chatService.loadChatTalk();
      var chat = chatService.getChatTalk();
    }
  }, true);
  
  $scope.$watch(function () {
    return chatService.getChatTalk();
  }, function(newChat, oldChat) {
    $scope.chatTalk = newChat;
  }, true);
  
  //Functions
  $scope.newMessage = function(){
    var self = this;
    self.code = $scope.user[0].code;
    self.name = $scope.user[0].name;
    self.text = $scope.textArea;
    self.type = "user";
  };
  
  $scope.keyEnter = function(event){
    if(event.keyCode === 13 && event.ctrlKey === false){
      $scope.sendMessage();
    }else if(event.keyCode === 13){
      $scope.textArea = $scope.textArea + "\r\n";
    }
  };
  
  $scope.sendMessage = function() {
    if($scope.textArea.trim() !== ""){
      chatService.addMessage(new $scope.newMessage());
      
      chatService.scrollDown(500);
      var controlScrollDown = setTimeout(function(){
        console.log('controlScrollTimeOut');
        chatService.scrollDown(500);
        clearTimeout(controlScrollDown);
      },500);
      $scope.textArea = "";
    }
  };
  
  //When the window was closed or reloaded remove the participant from the chat
  window.onbeforeunload = function(){
	  $.getJSON("ws/getJson.php?action=leaveChat&chatId=testeid1&participantCode="+$scope.user[0].code, function(result){
          $.each(result, function(i, returned){              
          });
      });
  } 
  
});
