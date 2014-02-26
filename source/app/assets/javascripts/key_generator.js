//-----SESSION KEY GENERATOR-----
var KeyGenerator = (function() {
  var _possibleValues = "qwertyuiopasdfghjklzxcvbnm1234567890";

  var _randomIndex = function() {
    return Math.floor((Math.random() * 34) + 1);
  }

  return {
    randomKey: function() {
      key = ""
      for (var i=0; i < 7; i++) {
        key += _possibleValues[_randomIndex()];
      }
      return key;
    }
  }
})()