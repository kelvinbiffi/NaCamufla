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
