/**
 * Initialize application
 */
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
   *
   * @param callbak function
   */
  var generateCode = function(callback){
    var url = "./ws/getJson.php";
    var data = {action: "generateCode"};
    $http({
      method: 'GET',
      url: url,
      params: data
    }).then(function successCallback(obj) {
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
 * Service to send info about user cross controlers
 */
app.service('aboutService', function() {
  var open = false;

  var setOpen = function(info) {
      open = info;
  };
  var getOpen = function(){
      return open;
  };

  return {
    setOpen: setOpen,
    getOpen: getOpen
  };
});

/**
 * Service to send info about rooms cross controlers
 */
app.service('roomService', function($http, userService, chatService) {
  var roomList = [];
  var roomOpen = false;

  /**
   * Function to load avaliable rooms
   */
  var fillRooms = function() {
      var url = "./ws/getRooms.php";
      $http({
        method: 'GET',
        url: url
      }).then(function successCallback(obj) {
        roomList = obj.data;
      }, function errorCallback(data, status, headers, config) {
        console.log("Error loading rooms",data, status, headers, config);
      });
      setTimeout(fillRooms,2000);
  };

  /**
   * To include user in the room
   */
  var enterInChat = function(room, callback){
    var user = userService.getUser();
    var url = "./ws/getJson.php";
    var data = {
      action: "enterInChat",
      participantNick: user[0].user,
      participantCode: user[0].code,
      chatId: room.room
    };
    $http({
      method: 'GET',
      url: url,
      params: data
    }).then(function successCallback(obj) {
      callback();
    }, function errorCallback(data, status, headers, config) {
      console.log("Error enter in room",data, status, headers, config);
    });
  };

  /**
   * Create a new room
   *
   * @param user object
   */
  var createNewRoom = function(user){
    var timestamp = new Date().getTime();
    var chatId = user[0].user + timestamp;
    var url = "./ws/getJson.php";
    var data = {
      action: "createChat",
      ownerNick: user[0].user,
      ownerCode: user[0].code,
      dateExpiration: "10",
      howMuchKeep: "50",
      chatId: chatId
    };
    $http({
      method: 'GET',
      url: url,
      params: data
    }).then(function successCallback(obj) {
      chatService.setChatInfo({room: chatId, size: 0});
      roomOpen = false;
      var n = $('#listRooms').height() * 100;
      $('#listRooms').animate({ scrollTop: n }, 1000);
    }, function errorCallback(data, status, headers, config) {
      console.log("Error create new room",data, status, headers, config);
    });
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
    createNewRoom: createNewRoom,
    enterInChat: enterInChat,
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
    var urlRegex = /(http[s]?:\/\/[^\s]+)+(?:jpg|png|gif)+(?!\/)/g;
    return text.replace(urlRegex, function(url) {
      return returnLink(url) + '<br><img class="image" src="' + url + '" />';
    });
  };

  //manipulate http urls sent
  var urlify = function(text) {
    if(text !== undefined && text !== ""){
      text = changeHtmlConcern(text);
      text = imaged(text);
      text = emoticons(text);
      var urlRegex = /(http[s]?:\/\/[^\s](?![^" ]*(?:jpg|png|gif))[^" ]+)/g;
      return text.replace(urlRegex, function(url) {
          return returnLink(url);
      });
    }
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
        localStorage.setItem("ChatterUserCode", code);
        localStorage.setItem("ChatterUserNick", $scope.user);
        $scope.useObj = [
          {code: $scope.code, user : $scope.user, name : $scope.name},
        ];
        userService.setUser($scope.useObj);
        $scope.control = false;
      });
    }
  };

});

app.controller("aboutCtrl",function($scope, aboutService){

  $scope.open = false;
  //Watch chatInfo
  $scope.$watch(function () {
    return aboutService.getOpen();
  }, function(newOpenInfo, oldOpenInfo) {
    $scope.open = newOpenInfo;
  }, true);

  /**
   * Set user information
   */
  $scope.closeAbout = function(){
    aboutService.setOpen(false);
  };

});

/**
 * rooms API Controller
 */
app.controller("roomsCtrl", function($scope, userService, roomService, chatService, aboutService) {

  $scope.chatService = {};
  $scope.createChatDisabled = false;

  //Watch chatInfo
  $scope.$watch(function () {
    return chatService.getChatInfo();
  }, function(newChatInfo, oldChatInfo) {
    $scope.chatService = newChatInfo;
  }, true);

  //watch user
  $scope.user = [];
  $scope.$watch(function () {
    return userService.getUser();
  }, function(newUser, oldUser) {
    $scope.user = newUser;
  }, true);

  //Watch rooms
  $scope.rooms = [];
  $scope.$watch(function () {
    return roomService.getRooms();
  }, function(newRooms, oldRooms) {
    if(!angular.equals([], oldRooms)){
      for(var n=0;n<newRooms.length;n++){
        for(var o=0;o<oldRooms.length;o++){
          if((newRooms[n].room === oldRooms[o].room) && newRooms[n].room === $scope.chatService.room){
            if((newRooms[n].size > oldRooms[o].size)){
              chatService.loadChatTalk();
            }
          }
        }
      }
    }
    $scope.rooms = newRooms;
  }, true);

  //watch room open status (Mobile version)
  $scope.roomsOpen = false;
  $scope.$watch(function () {
    return roomService.getRoomsContentOpen();
  }, function(newRoomsOpenedStatus, oldRoomsOpenedStatus) {
    $scope.roomsOpen = newRoomsOpenedStatus;
  }, true);

  /**
   * closeRooms content (This work just in mobile)
   */
  $scope.closeRooms = function(){
    roomService.closeRoomsContent();
  };

  /**
   * Call function from room service to create a new room
   */
  $scope.createNewRoom = function(){
    $scope.createChatDisabled = true;
    var enableCreateChat = setTimeout(function(){
      $scope.createChatDisabled = false;
      clearTimeout(enableCreateChat);
    },15000);
    roomService.createNewRoom($scope.user);
  };

  /**
   * Open about
   */
  $scope.openAbout = function(){
    aboutService.setOpen(true);
  };

  /**
   * Set room info at charService
   */
  $scope.loadChat = function(roomInfo){
    // chatService.setChatTalk([]);//Clear chat content
    roomService.enterInChat(roomInfo, function(){
      chatService.setChatInfo(roomInfo);
      roomService.closeRoomsContent();
    });
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
  //Watch userService to catch user info
  $scope.user = [];
  $scope.$watch(function () {
    return userService.getUser();
  }, function(newUser, oldUser) {
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
        chatService.scrollDown(500);
        clearTimeout(controlScrollDown);
      },500);
      $scope.textArea = "";
    }
  };

});
