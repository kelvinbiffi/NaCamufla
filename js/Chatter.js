//Initialize application
var app = angular.module("Chatter", []);

//Service to send info about user cross controlers
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

//Service to send info about contacts cross controlers
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

//Service to send info about chats cross controlers
app.service('chatService', function() {
  var chatTalk = [];

  var setChat = function(newObj) {
      chatTalk = newObj;
  };
  var getChat = function(){
      return chatTalk;
  };
  return {
    setChat: setChat,
    getChat: getChat
  };
});

//contacts API Controller
app.controller("contactsCtrl", function($scope, userService, contactService, chatService) {
  //Array user information
  $scope.user = [
    {code: "4g4gsgb", user : "kelvinbiffi", name : "Kelvin Biffi", info : "Only nature is secret"},
  ];
  //Arrar avaliable contacts information
  $scope.contacts = [
    {code: "8yg7", user : "leonelobiffi", name : "Leonelo Biffi", info : "Blue sky"},
    {code: "45y4hh", user : "angelastoll", name : "Angela Stoll", info : "Red dress"},
    {code: "45h45", user : "kellenleote", name : "Kellen Leote", info : "Brown eyes"},
  ];
  
  //send information to the services
  userService.setUser($scope.user);
  contactService.setContacts($scope.contacts);
});

//chat API controller
app.controller("chatCtrl", function($scope, userService, contactService, chatService) {
  
  //Get information from services
  $scope.user = userService.getUser();
  $scope.contacts = contactService.getContacts();
  
  $scope.chatInfo = [
    {code: "8yg7", users : "kelvinbiffi",}
  ];
  
  $scope.chatTalk = [
    {code: "8yg7", name : "Leonelo Biffi", text: "Hy", type: "contact"},
    {code: "8yg7", name : "Leonelo Biffi", text: "How r u?", type: "contact"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "Hey I'm fine and you man?", type: "user"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "Whata hell you doing now?", type: "user"},
    {code: "8yg7", name : "Leonelo Biffi", text: "Im at the school, after I will go to the pub, do you want go?", type: "contact"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "Ohhhh I can't :/", type: "user"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "I will work until tonight, I will pass that, sorry", type: "user"},
    {code: "8yg7", name : "Leonelo Biffi", text: "No problem man, I send you pictures kkk, have a good work", type: "contact"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "Thanks man!!", type: "user"},
  ];
  
  $scope.textArea = "";
  
});
