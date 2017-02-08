/**
 * Service to manipulate text sent or read replace links or specific characters per html objects
 */
app.service('textService',function(){

  //***have to add video crawler***

  var changeHtmlConcern = function(text){
    var regexBL = /\r?\n/g;
    var regexArrows = /<|>/g;
    text = text.replace(regexArrows, function(match) {
      if(match === "<")return '&lt;';
      if(match === ">")return '&gt;';
    });
    return text.replace(regexBL, function(match) {
      return '<br>';
    });
  };

  var emoticons = function(text){
    var urlRegex = /&lt;3|\(y\)/g;
    return text.replace(urlRegex, function(emoticon) {
      if(emoticon === "&lt;3" && text.trim() === emoticon)
        return '<span title="'+emoticon+'" class="fa fa-heart big" aria-hidden="true"></span>';
      if(emoticon === "&lt;3")
        return '<span title="'+emoticon+'" class="fa fa-heart" aria-hidden="true"></span>';
      if(emoticon === "(y)")
        return '<span  title="'+emoticon+'" class="fa fa-thumbs-o-up" aria-hidden="true"></span>';
      return emoticon;
    });
  };

  var returnLink = function(link){
    var label = link.substr(0,10) + "..." + link.substr(link.length-5,5);
    return '<a title="'+link+'" href="' + link + '" target="_blank">' + label + '...</a>';
  };

  var imaged = function(text){
    var urlRegex = /(http[s]?:\/\/[^\s]+)+(?:jpg|png|gif)+(?!\/)/g;
    return text.replace(urlRegex, function(url) {
      return returnLink(url) + '<br><img class="image" src="' + url + '" />';
    });
  };

  //manipulate http urls sent
  var urlify = function(text) {
    if(text !== undefined && text !== ""){
      text = changeHtmlConcern(text);
      text = imaged(text);
      text = emoticons(text);
      var urlRegex = /(http[s]?:\/\/[^\s](?![^" ]*(?:jpg|png|gif))[^" ]+)/g;
      return text.replace(urlRegex, function(url) {
          return returnLink(url);
      });
    }
  };

  return {
    urlify: urlify
  };
});
