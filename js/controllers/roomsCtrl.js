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
