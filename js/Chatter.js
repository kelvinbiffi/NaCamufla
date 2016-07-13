//Initialize application
var app = angular.module("Chatter", [
    'ngSanitize' //Working with "ng-bind-html" to show html tags on interface
]);

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

//Service to manipulate text sent or read
app.service('textService',function(){
  
  //***have to add video crawler***
  
  var returnLink = function(link){
    console.log(link);
    var label = link.substr(0,10) + "..." + link.substr(link.length-5,5);
    return '<a href="' + link + '" target="_blank">' + label + '...</a>';
  };
  
  var imaged = function(text){
    var urlRegex = /(http[s]?:\/\/[^\s]+)*(jpg|png|gif)/g;
    return text.replace(urlRegex, function(url) {
      return returnLink(url) + '<br><img class="image" src="' + url + '" />';
    });
  };
  
  //manipulate http urls sent
  var urlify = function(text) {
      text = text.replace("<", '&lt;').replace(">", '&gt;').replace(/\r?\n/g, '<br>');
      text = imaged(text);
      var urlRegex = /(http[s]?:\/\/[^\s](?![^" ]*(?:jpg|png|gif))[^" ]+)/g;
      return text.replace(urlRegex, function(url) {
          return returnLink(url);
      });
  };
  
  return {
    urlify: urlify
  };
});

//contacts API Controller
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
  
  //send information to the services
  userService.setUser($scope.user);
  contactService.setContacts($scope.contacts);
});

//chat API controller
app.controller("chatCtrl", function($scope, userService, contactService, chatService, textService) {
  
  //Get information from services
  $scope.user = userService.getUser();
  $scope.contacts = contactService.getContacts();
  $scope.textService = textService;
  $scope.oldScrollHeight = $('#chat-talk ul').height();
  
  //must be loaded from contacts scope set above
  $scope.chatInfo = [
    {code: "46j4y4j654", user : "kellenleote, angelastoll, fabiobueno, costinha234", name : "Zueira TI", info : "Zueira never ends"},
  ];
  
  //must be loaded from web service
  $scope.chatTalk = [
    {code: "8yg7", name : "Leonelo Biffi", text: "Hy", type: "contact"},
    {code: "8yg7", name : "Leonelo Biffi", text: "How r u?", type: "contact"},
    {code: "8yg7", name : "Leonelo Biffi", text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?", type: "contact"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "Hey I'm fine and you man?", type: "user"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "Whata hell you doing now?", type: "user"},
    {code: "8yg7", name : "Leonelo Biffi", text: "Im at the school, after I will go to the pub, do you want go?", type: "contact"},
    {code: "8yg7", name : "Leonelo Biffi", text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)", type: "contact"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "Ohhhh I can't :/", type: "user"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", type: "user"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "I will work until tonight, I will pass that, sorry", type: "user"},
    {code: "8yg7", name : "Leonelo Biffi", text: "No problem man, I send you pictures kkk, have a good work", type: "contact"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.", type: "user"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "Thanks man!!", type: "user"},
    {code: "8yg7", name : "Leonelo Biffi", text: "Thanks man!! https://media.giphy.com/media/xELN8T63yUJOM/giphy.gif", type: "contact"},
    {code: "4g4gsgb", name : "Kelvin Biffi", text: "Noooooooooooo man!!", type: "user"},
    
  ];
  
  $scope.textArea = "";
  
  $scope.newMessage = function(){
    var self = this;
    self.code = $scope.user[0].code;
    self.name = $scope.user[0].name;
    self.text = $scope.textArea;
    self.type = "user";
  };
  
  $scope.scrollDown = function(time){
    console.log('controlScroll');
    var n = $('#chat-talk').height() * 100;
    $('#chat-talk').animate({ scrollTop: n }, time);
  };
  
  $scope.keyEnter = function(event){
    if(event.keyCode === 13 && event.ctrlKey === false){
      $scope.sendMessage();
    }else if(event.keyCode === 13){
      $scope.textArea = $scope.textArea + "\r\n";
    }
  };
  
  $scope.sendMessage = function() {
    $scope.chatTalk.push(new $scope.newMessage());
    
    $scope.scrollDown(500);
    var controlScrollDown = setTimeout(function(){
      console.log('controlScrollTimeOut');
      $scope.scrollDown(500);
      clearTimeout(controlScrollDown);
    },500);
    
    $scope.textArea = "";
  };
  
  var controlScrollDown = setTimeout(function(){
    console.log('controlScrollTimeOut');
    $scope.scrollDown(500);
    clearTimeout(controlScrollDown);
  },500);
  
});
