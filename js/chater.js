

var app = angular.module("chater", []);

app.controller("contactsCtrl", function($scope) {
  $scope.contacts = [
    {code: "8yg7", user : "kelvinbiffi", name : "Kelvin Biffi", info : "Blue sky"},
    {code: "45y4hh", user : "angelastoll", name : "Angela Stoll", info : "Red dress"},
    {code: "45h45", user : "kellenleote", name : "Kellen Leote", info : "Brown eyes"},
  ];
});

app.controller("chatInfo", function($scope) {
    
});

app.controller("chatTalk", function($scope) {
    
});

app.controller("textArea", function($scope) {
    
});