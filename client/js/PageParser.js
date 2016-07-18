function Episodelink() {
    this.title = "";
    this.pageurl = "";
    this.DOMType = "Episodelink";
    this.img_src = "";
    this.episodetitle = "";
    this.providers = []; // array of domain containing video urls
}

function HTMLElement(tag, attrs) {
    this.tag = tag;
    this.attrs = attrs;
    this.DOMType = "HTMLElement";
}

function GetValueForAttribute(elem,attrname) {
  var idx = -1;
  for(var i = 0; i < elem.attrs.length; i++) {
    if(elem.attrs[i].name === attrname) {
      idx = i;
    }
  }
  if (idx == -1) return ""; // return if didnt find

  var attr = elem.attrs[idx];
  return attr.value;
}

// returns an array of episode thumbnails
var ParsePageURL = function(url) {

  var data = {};
  data.title = "Latest episodes";

  // try to get links to episodes
  var docsource = GetURLSourceSynch(url);

  docsource = docsource.replace("<!DOCTYPE html>","");
  //docsource = docsource.replace(/\n/g, ''); // remove line breaks
  //docsource = docsource.replace(/\t/g, ''); // remove tabs
  //docsource = docsource.replace(/#/g, '');

  var stack = []; // stack for temp html elements within div thumbnail
  var textstack = []; // stack for all text elements within thumbnail
  var results = []; // array for all thumbnails

  // parse page url into episode array
  HTMLParser(docsource, {
    start: function( tag, attrs, unary ) {
      // we only care about thumbnails
      if (tag == "div" && attrs[0].name == "class" && attrs[0].value == "thumbnail") {
          // put new item on stack
          var tn = new Episodelink();
          stack.push(tn);
      } else {

        // return if nothing on stack
        if (stack.length == 0) return;
        if (tag == "br") return;
        if (unary == "/") {
          return;
        }

        var elem = new HTMLElement(tag, attrs);
        stack.push(elem);
      }
    },
    end: function( tag ) {
      if (stack.length == 0) return;

      // element on stacktop is done, pop from stack
      var elem = stack.splice(stack.length-1, 1); // removes last element
      elem = elem[0];

      if (elem.tag == "a") {
        stack[0].title = GetValueForAttribute(elem,"title");
        stack[0].pageurl = GetValueForAttribute(elem,"href");
      } else if (elem.tag == "img") {
        stack[0].img_src = GetValueForAttribute(elem,"src");
        stack[0].episodetitle = GetValueForAttribute(elem,"alt");
      } else if (elem.DOMType == "Episodelink") {
        //
        //var title = textstack.splice(textstack.length-1, 1); // removes last element
        elem.title = textstack[0];
        textstack = []; // empts textstack
        results.push(elem);
      }
    },
    chars: function( text ) {
      // we ignore text not inbetween thumbnail
      if (stack.length == 0) return;

      textstack.push(text);
      //results += text;
    },
    comment: function( text ) {
      // we ignore comments
    }
  });

  // parse every episode to get domains/videourls
  /*for (var i = 0; i< results.length; i++) {
    // download page
    var pageurl = results[i].pageurl;
    var pagesrc = GetURLSourceSynch(pageurl);

    results[i].providers = GetProviders(pagesrc);
  }*/

  //console.log(results);


  return results;
}

function VideoDomain() {
    this.domain = ""; // video provider e.g. allvideos
    this.pageurl = ""; // this is where the video url is located
    this.videourl = "";
    this.DOMType = "VideoDomain";
}

// collects all providers
function GetProviders(docsource) {

  docsource = docsource.replace("<!DOCTYPE html>","");
  var results = []; // array of VideoDomain objects
  var stack = []; // stack for temp html elements within div thumbnail
  var textstack = []; // stack for all text elements within thumbnail

  HTMLParser(docsource, {
    start: function( tag, attrs, unary ) {
      // we only care about thumbnails
      if (tag == "td" && attrs[0].name == "class" && attrs[0].value == "domain") {
          // put new item on stack
          var tn = new VideoDomain();
          stack.push(tn);
      } else {

        // return if nothing on stack
        if (stack.length == 0) return;
        if (tag == "br") return;
        if (unary == "/") {
          return;
        }

        var elem = new HTMLElement(tag, attrs);
        stack.push(elem);
      }
    },
    end: function( tag ) {
      if (stack.length == 0) return;

      // element on stacktop is done, pop from stack
      var elem = stack.splice(stack.length-1, 1); // removes last element
      elem = elem[0];

      // parse information from elements inbetween
      if (elem.tag == "a") {
        stack[0].pageurl = GetValueForAttribute(elem,"href");
      } else if (elem.DOMType == "VideoDomain") {
        // assign domain from text and return
        var dom = textstack.splice(textstack.length-1, 1); // removes last element
        elem.domain = dom[0];

        results.push(elem);
      }
    },
    chars: function( text ) {
      // we ignore text not inbetween thumbnail
      if (stack.length == 0 || isOnlyWhitespace(text)) return;

      textstack.push(text.trim());// remove trailing whitespace
    },
    comment: function( text ) {
      // we ignore comments
    }
  });

  // resolve all providers
  for (var d = 0; d < results.length; d++) {
    var resolver = GetResolver(results[d].domain);
    results[d].videourl = resolver.resolve(results[d].pageurl);
  }

  return results;
}

/*function Episodelink() {
    this.title = "";
    this.pageurl = "";
    this.DOMType = "Episodelink";
    this.img_src = "";
    this.episodetitle = "";
    this.providers = []; // array of domain containing video urls
}*/

function ParseShowsURLs(showsurls) {
  results = {};

  for (var showname in showsurls) {
    //console.log(key, yourobject[key]);
    // collect all episode links
    var url = showsurls[showname];
    var docsource = GetURLSourceSynch(url);
    docsource = docsource.replace("<!DOCTYPE html>","");

    var imgregex = /(<img\s*src=[^\s]+(jpg|png))/g;
    var matches = docsource.match(imgregex);
    var imgsrc = matches[0];
    var regex = /(https?:\/\/[^\s"]+)/g;
    matches = imgsrc.match(regex);
    var imgsrc = matches[0];

    var stack = []; // stack for temp html elements within div thumbnail
    var textstack = []; // stack for all text elements within thumbnail
    var episodelist = []; // array for all thumbnails

    // parse page url into episode array
    HTMLParser(docsource, {
      start: function( tag, attrs, unary ) {
        // we only care about thumbnails
        if (tag == "tr") {
            // put new item on stack
            var tn = new Episodelink();
            tn.img_src = imgsrc;
            stack.push(tn);
        } else {

          // return if nothing on stack
          if (stack.length == 0) return;
          if (tag == "br") return;
          if (unary == "/") {
            return;
          }

          var elem = new HTMLElement(tag, attrs);
          stack.push(elem);
        }
      },
      end: function( tag ) {
        if (stack.length == 0) return;

        // element on stacktop is done, pop from stack
        var elem = stack.splice(stack.length-1, 1); // removes last element
        elem = elem[0];

        if (elem.tag == "a") {
          stack[0].title = GetValueForAttribute(elem,"title");
          stack[0].pageurl = GetValueForAttribute(elem,"href");
        } else if (elem.DOMType == "Episodelink") {
          //
          if (elem.title != "") {
            elem.title = textstack[0];
            elem.episodetitle = textstack[1];
            episodelist.push(elem);
          }
          //var title = textstack.splice(textstack.length-1, 1); // removes last element

          textstack = []; // empts textstack

        }
      },
      chars: function( text ) {
        // we ignore text not inbetween thumbnail
        if (stack.length == 0 || isOnlyWhitespace(text)) return;
        text = text.trim();
        textstack.push(text);
        //results += text;
      },
      comment: function( text ) {
        // we ignore comments
      }
    });

    results[showname] = episodelist;
  }
  return results;
}
