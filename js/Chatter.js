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
      contactList = newObj;
  };
  var getUser = function(){
      return contactList;
  };
  return {
    setUser: setUser,
    getUser: getUser
  };
});

/**
 * Service to send info about contacts cross controlers
 */
app.service('contactService', function() {
  var contactList = [];

  var setContacts = function(newObj) {
      contactList = newObj;
  };
  var getContacts = function(){
      return contactList;
  };
  return {
    setContacts: setContacts,
    getContacts: getContacts
  };
});

/**
 * Service to send info about chats cross controlers
 */
app.service('chatService', function(userService) {
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
  
  var getChatTalk = function(){
    
  };
  
  var loadChatTalk = function(callback){
    var user = userService.getUser();
    console.log(user,'user');
    var json = "http://kelvinbiffi.com/chatter/chat/" + chatTalkInfo.code + user[0].code + ".json";
    console.log(json);
    $.ajaxSetup({
  	  cache:false
  	});
    $.ajax({
      type: "GET",
      dataType: 'json',
      url: json,
      data: {},
      success: function (data) {
        callback(data);
      },
      error: function(data, status, headers, config) {
          console.log("error",data, status, headers, config);
      }
    });
  };
  
  return {
    setChatTalk: setChatTalk,
    getChatTalk: getChatTalk,
    setChatInfo: setChatInfo,
    getChatInfo: getChatInfo,
    scrollDown: scrollDown,
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
    text = text.replace(regexBL, function(match) {
      return '<br>';
    });
    return text.replace(regexArrows, function(match) {
      if(match === "<")return '&lt;';
      if(match === ">")return '&gt;';
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

/**
 * contacts API Controller
 */
app.controller("contactsCtrl", function($scope, userService, contactService, chatService) {
  
  //Array user information must be loaded from web service
  $scope.user = [
    {code: "4g4gsgb", user : "kelvinbiffi", name : "Kelvin Biffi", info : "Only nature is secret"},
  ];
  
  //Arrar avaliable contacts must be loaded from web service
  $scope.contacts = [
    {code: "8yg7", user : "leonelobiffi", name : "Leonelo Biffi", info : "Blue sky"},
    {code: "45y4hh", user : "angelastoll", name : "Angela Stoll", info : "Red dress"},
    {code: "45h45", user : "kellenleote", name : "Kellen Leote", info : "Brown eyes"},
    {code: "46j4y4j654", user : "kellenleote, angelastoll, fabiobueno, costinha234", name : "Zueira TI", info : "Zueira never ends"},
  ];
  
  $scope.loadChat = function(contactInfo){
    chatService.setChatInfo(contactInfo);
  };
  
  //send information to the services
  userService.setUser($scope.user);
  contactService.setContacts($scope.contacts);
});


/**
 * chat API controller
 */
app.controller("chatCtrl", function($scope, userService, contactService, chatService, textService) {
  
  //Get information from services
  $scope.user = userService.getUser();
  $scope.contacts = contactService.getContacts();
  $scope.textService = textService;
  
  //Variables
  $scope.chatInfo = [];
  $scope.chatTalk = [];
  $scope.textArea = "";
  
  //Watching chatInfo from contacts service set above
  $scope.$watch(function () {
    return chatService.getChatInfo();
  }, function(currentChatInfo, oldChatInfo) {
    $scope.chatInfo = [currentChatInfo];
    
    //if a contact was selected
    if(!angular.equals({}, currentChatInfo)){
      //must be loaded from web service and must be add spinner
      chatService.loadChatTalk(function(data){
        chatService.setChatTalk(data);
        console.log($scope.chatTalk);
        //Slide down chat content
        var controlScrollDown = setTimeout(function(){
          console.log('controlScrollTimeOut');
          chatService.scrollDown(500);
          clearTimeout(controlScrollDown);
        },500);
      });
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
      $scope.chatTalk.push(new $scope.newMessage());
      
      chatService.scrollDown(500);
      var controlScrollDown = setTimeout(function(){
        console.log('controlScrollTimeOut');
        chatService.scrollDown(500);
        clearTimeout(controlScrollDown);
      },500);
      $scope.textArea = "";
    }
  };
  
});
