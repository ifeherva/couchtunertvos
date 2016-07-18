// returns true if string only contains whitespace chars
function isOnlyWhitespace(str) {
  return (!str.replace(/\s/g, '').length);
}

function GetURLSourceSynch(url) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, false); // synchronous
  xhttp.send();
  return xhttp.responseText;
}

//console.log(results);
