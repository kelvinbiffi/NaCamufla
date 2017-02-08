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
