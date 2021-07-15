//utility function for replacing polish accents

var accentArr = 'ĄąĆćĘęŁłŃńÓóŚśŹźŻż';
var unaccentArr = 'AaCcEeLlNnOoSsZzZz';

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function unaccent(text){
  var str = text;
  for(i = 0; i < text.length; i++){
    var index = accentArr.indexOf(text[i]);
    if(index >= 0){
      str = str.replaceAt(i, unaccentArr[index]); 
    }
  }
  return str;
}
