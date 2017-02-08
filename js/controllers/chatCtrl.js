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
