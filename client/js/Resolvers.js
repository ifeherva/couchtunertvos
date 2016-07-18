
function GetResolver(domain) {

  if (domain == "allmyvideos.net") {
    var resolver = new AllMyVideosResolver();
    return resolver;
  } else if (domain == "vidspot.net") {
    var resolver = new VidspotResolver();
    return resolver;
  } else if (domain == "vidbull.com") {
    var resolver = new VidbullResolver();
    return resolver;
  } else if (domain == "vodlocker.com") {
    var resolver = new VodlockerResolver();
    return resolver;
  } /*else if (domain == "vidto.me") {
    var resolver = new VidtoResolver();
    return resolver;
  }*/

  else {
    var dummyResolver = new DummyResolver();
    return dummyResolver;
  }
}

function DummyResolver() {
  this.resolve = function(pageurl) {
    return "";
  }
}
