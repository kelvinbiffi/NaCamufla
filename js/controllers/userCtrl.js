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
