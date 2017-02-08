/**
 * Service to send info about user cross controlers
 */
app.service('aboutService', function() {
  var open = false;

  var setOpen = function(info) {
      open = info;
  };
  var getOpen = function(){
      return open;
  };

  return {
    setOpen: setOpen,
    getOpen: getOpen
  };
});
