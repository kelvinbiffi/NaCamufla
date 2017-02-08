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
    var chatId = user[0].code + timestamp;
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
