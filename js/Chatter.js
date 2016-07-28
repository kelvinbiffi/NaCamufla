//Initialize application
var app = angular.module("Chatter", [
    'ngSanitize' //Working with "ng-bind-html" to show html tags on interface
]);

/**
 * Service to send info about user cross controlers
 */
app.service('userService', function($http) {
  var user = [];

  var setUser = function(newObj) {
      user = newObj;
  };
  var getUser = function(){
      return user;
  };

  /**
   * Function to generate user code
   */
  var generateCode = function(callback){
    var url = "./ws/getJson.php";
    var data = {action: "generateCode"};
    $http({
      method: 'GET',
      url: url,
      params: data
    }).then(function successCallback(obj) {
      console.log('user code',obj.data.idGenerated);
      callback(obj.data.idGenerated);
    }, function errorCallback(data, status, headers, config) {
      console.log("Error generate user code",data, status, headers, config);
    });
  };

  return {
    setUser: setUser,
    getUser: getUser,
    generateCode: generateCode
  };
});

/**
 * Service to send info about rooms cross controlers
 */
app.service('roomService', function($http) {
  var roomList = [];
  var roomOpen = false;

  /**
   * Function to load rooms
   */
  var fillRooms = function() {
      var url = "./ws/getRooms.php";
      $http({
        method: 'GET',
        url: url
      }).then(function successCallback(obj) {
        console.log(obj,'obj rooms');
        roomList = obj.data;
        console.log(roomList,'rooms loaded');
      }, function errorCallback(data, status, headers, config) {
        console.log("Error loading rooms",data, status, headers, config);
      });
      setTimeout(fillRooms,5000);
  };

  var getRooms = function(){
    return roomList;
  };


  var openRoomsContent = function(){
    roomOpen = true;
  };

  var closeRoomsContent = function(){
    roomOpen = false;
  };

  var getRoomsContentOpen = function(){
    return roomOpen;
  };

  return {
    fillRooms: fillRooms,
    getRooms: getRooms,
    openRoomsContent: openRoomsContent,
    closeRoomsContent: closeRoomsContent,
    getRoomsContentOpen: getRoomsContentOpen
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

  /**
   * Function to send a new message
   */
  var addMessage = function(obj){
    chatTalk.push(obj);
  };

  /**
   * Function to load chat messages from json file
   */
  var loadChatTalk = function(){
    var json = "./chat/" + chatTalkInfo.room + ".json";
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


/**
 * Service to manipulate text sent or read replace links or specific characters per html objects
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



app.controller("userCtrl",function($scope, userService, roomService){

  $scope.control = true;

  $scope.name = "";
  $scope.user = "";
  $scope.code = "";

  /**
   * function to log in the chat with ket enter
   */
  $scope.keyEnter = function(event){
    if(event.keyCode === 13){
      $scope.setUser();
    }
  };

  /**
   * Set user information
   */
  $scope.setUser = function(){
    if($scope.name.replace(" ","").trim() !== ""){
      roomService.fillRooms();
      userService.generateCode(function(code){
        $scope.user = $scope.name.replace(" ","").trim().toLowerCase();
        var d = new Date();
        $scope.code = code;
        $scope.useObj = [
          {code: $scope.code, user : $scope.user, name : $scope.name},
        ];
        userService.setUser($scope.useObj);
        $scope.control = false;
      });
    }
  };

});

/**
 * rooms API Controller
 */
app.controller("roomsCtrl", function($scope, userService, roomService, chatService) {

  $scope.chatService = {};

  //Watch chatInfo
  $scope.$watch(function () {
    return chatService.getChatInfo();
  }, function(newChatInfo, oldChatInfo) {
    console.log($scope.chatService, newChatInfo, oldChatInfo);
    $scope.chatService = newChatInfo;
  }, true);

  //watch user
  $scope.user = [];
  $scope.$watch(function () {
    return userService.getUser();
  }, function(newUser, oldUser) {
    console.log($scope.chatService, newUser, oldUser);
    $scope.user = newUser;
  }, true);

  //Watch rooms
  $scope.rooms = [];
  $scope.$watch(function () {
    return roomService.getRooms();
  }, function(newRooms, oldRooms) {
    console.log($scope.rooms, newRooms, oldRooms);
    $scope.rooms = newRooms;
  }, true);

  //watch room open status (Mobile version)
  $scope.roomsOpen = false;
  $scope.$watch(function () {
    return roomService.getRoomsContentOpen();
  }, function(newRoomsOpenedStatus, oldRoomsOpenedStatus) {
    console.log($scope.roomsOpen, newRoomsOpenedStatus, oldRoomsOpenedStatus);
    $scope.roomsOpen = newRoomsOpenedStatus;
  }, true);

  $scope.closeRooms = function(){
    roomService.closeRoomsContent();
  };

  $scope.loadChat = function(roomInfo){
    // chatService.setChatTalk([]);//Clear chat content
    chatService.setChatInfo(roomInfo);
    roomService.closeRoomsContent();
  };

});


/**
 * chat API controller
 */
app.controller("chatCtrl", function($scope, $http, userService, roomService, chatService, textService) {

  $scope.openRooms = function(){
    roomService.openRoomsContent();
  };

  //Get information from services
  //Watch userService
  $scope.user = [];
  $scope.$watch(function () {
    return userService.getUser();
  }, function(newUser, oldUser) {
    console.log($scope.chatService, newUser, oldUser);
    $scope.user = newUser;
  }, true);

  $scope.rooms = roomService.getRooms();
  $scope.textService = textService;

  //Variables
  $scope.chatInfo = [];
  $scope.chatTalk = [];
  $scope.textArea = "";
  $scope.tutsOpen = true;//Variable to show or not show tuts content

  //Watching chatInfo from rooms service set above
  $scope.$watch(function () {
    return chatService.getChatInfo();
  }, function(currentChatInfo, oldChatInfo) {
    $scope.chatInfo = [currentChatInfo];

    //if a room was selected
    if(!angular.equals({}, currentChatInfo)){
      $scope.tutsOpen = false;//To hide tuts content
      //must be loaded from web service and must be add spinner
      chatService.loadChatTalk();
      var chat = chatService.getChatTalk();
    }
  }, true);

  /**
   * Watch chat
   */
  $scope.$watch(function () {
    return chatService.getChatTalk();
  }, function(newChat, oldChat) {
    $scope.chatTalk = newChat;
  }, true);

  //*** Functions Session ***

  /**
   * Function to return a new message object
   */
  $scope.newMessage = function(){
    var self = this;
    self.code = $scope.user[0].code;
    self.user = $scope.user[0].user;
    self.name = $scope.user[0].name;
    self.text = $scope.textArea;
    self.type = "user";
  };

  /**
   * Control keyboard enter key
   * if key enter was pressed alone send message
   * if key enter was pressed with Ctrl key break line
   */
  $scope.keyEnter = function(event){
    if(event.keyCode === 13 && event.ctrlKey === false){
      $scope.sendMessage();
    }else if(event.keyCode === 13){
      $scope.textArea = $scope.textArea + "\r\n";
    }
  };


  /**
   * Send a new message
   */
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

  /**
   * When the window was closed or reloaded remove the participant from the chat
   */
  window.onbeforeunload = function(){
	  $http({
      method: 'GET',
      url: "ws/getJson.php?action=leaveChat&chatId=testeid1&participantCode="+$scope.user[0].code
    }).then(function successCallback(result) {
      console.log(result,'result close window');
      $.each(result, function(i, returned){
        console.log(i,returned,'returned close window');
      });
    }, function errorCallback(data, status, headers, config) {
      console.log("error",data, status, headers, config);
    });
  };

});
