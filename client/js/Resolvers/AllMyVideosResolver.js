function AllMyVideosResolver() {
  this.resolve = function(url) {

    var docsource = GetURLSourceSynch(url);
    if (!docsource) return "";
    //docsource = docsource.replace("<!DOCTYPE html>","");

    var httpregex = /(https?:\/\/allmyvideos.net\/[^\s]+html)/g;
    var matches = docsource.match(httpregex);

    if (!matches || matches.length == 0) return "";

    // we assume the first hit is correct
    var domainurl = matches[0];
    docsource = GetURLSourceSynch(domainurl);
    var videofileregex = /("file"\s*:\s*[^\s]+,)/g;
    matches = docsource.match(videofileregex);

    if (!matches || matches.length == 0) return "";

    // e.g. "file" : "http://d4412.allmyvideos.net/d/4smceyr4yq5dh6lnzhcidmuefh552wgbbxvovdmqvrguqqmrnlxt33xo3ld2yay/video.mp4?v2",
    var fileblock = matches[0];
    var regex = /(https?:\/\/[^\s"]+)/g;
    matches = fileblock.match(regex);

    if (matches[0] == fileblock) {
      return "";
    }

    if (!matches || matches.length == 0) return "";
    // we again assume the first one works

    return matches[0];
  }
}
