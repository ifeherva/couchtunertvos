// Entry point
App.onLaunch = function(options) {

  var javascriptFiles = [
    // utils functions
    `${options.BASEURL}js/utilfunctions.js`,
    `${options.BASEURL}js/htmlparser.js`,
    `${options.BASEURL}js/showslist.js`,
    // domain resolvers
    `${options.BASEURL}js/Resolvers.js`,
    `${options.BASEURL}js/Resolvers/AllMyVideosResolver.js`,
    `${options.BASEURL}js/Resolvers/VidSpotResolver.js`,
    `${options.BASEURL}js/Resolvers/VidbullResolver.js`,
    `${options.BASEURL}js/Resolvers/VodlockerResolver.js`,
    // other sources
    `${options.BASEURL}js/Presenter.js`,
    `${options.BASEURL}js/PageParser.js`

  ];

  evaluateScripts(javascriptFiles, function(success) {
    if(success) {
      // show loading screen while we parse data
      var loadingdoc = CreateLoadingPage("Loading data");
      Presenter.pushDocument(loadingdoc);

      var latestData = ParsePageURL("http://couchtuner2.to/latest-episodes");
      var showsData = ParseShowsURLs(showsurls);
      var doc = createCatalog("CouchTuner", latestData, showsData);

      // dismiss loading page
      Presenter.popDocument();

      Presenter.pushDocument(doc);
    } else {
      // Handle the error
      var alert = createAlert("Error while loading scripts!", "");
      navigationDocument.presentModal(alert);
    }
  });
}

var createCatalog = function(title,pagedata, showsdata) {

  var textbody = `<?xml version="1.0" encoding="UTF-8" ?>
  <document>
    <catalogTemplate>
      <banner>
        <title>${title}</title>
      </banner>
      <list>
        <section>
	  <listItemLockup>
	    <title>Latest episodes</title>
	    <decorationLabel>${pagedata.length}</decorationLabel>
	    <relatedContent>
	      <grid>
	        <section>` + GetLatestLockupSections(pagedata) + `</section>
	      </grid>
	    </relatedContent>
	  </listItemLockup>` + GetShowsLockupSections(showsdata) +
        `</section>
      </list>
    </catalogTemplate>
  </document>`;

  var doc = Presenter.makeDocument(textbody);

  // pass data to elements to read them on event
  var lockups = doc.getElementsByTagName('lockup');
  var counter = 0;
  for (var i=0;i<pagedata.length;i++)
    lockups.item(i).videodata = pagedata[i];
  counter += pagedata.length;

  for (var show in showsdata) {
    for (var i=0;i<showsdata[show].length;i++) {
      lockups.item(counter+i).videodata = showsdata[show][i];
    }
    counter += showsdata[show].length;
  }
  doc.addEventListener("select", Presenter.load.bind(Presenter)); // add event

  return doc;
}

var CreateLoadingPage = function(text) {
  var textbody = `<?xml version="1.0" encoding="UTF-8" ?>
  <document>
    <loadingTemplate>
      <activityIndicator>
        <title>${text}</title>
      </activityIndicator>
    </loadingTemplate>
  </document>`;

  var doc = Presenter.makeDocument(textbody);
  return doc;
}

// Create a simple alert
var createAlert = function(title, description) {
  // use alert template
  var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
      <alertTemplate>
        <title>${title}</title>
        <description>${description}</description>
        <button>
        <text>OK</text>
        </button>
      </alertTemplate>
    </document>`
    var parser = new DOMParser();
    var alertDoc = parser.parseFromString(alertString, "application/xml");
    return alertDoc;
}

function GetLatestLockupSections(pagedata) {

  var result = "";
  for (var i = 0; i < pagedata.length; i++) {
    // get a valid video url
    var videourl = "";
    for (var d = 0; d < pagedata[i].providers.length; d++) {
      var vurl = pagedata[i].providers[d].videourl;
      if (vurl != "") {
        videourl = vurl;
        break;
      }
    }
    // create a block
    var img_src = pagedata[i].img_src;
    var title = pagedata[i].title;
    result += `<lockup `;
    if (videourl != "") {
      result += `videoURL="${videourl}"`;
    }
    result += `>`;
    result += `<img src="${img_src}" width="240" height="360" />`

    result += `<title>${title}</title>`
    result += `</lockup>`;

  }

  return result;
}

function GetShowsLockupSections(showsdata) {
  var result = "";

  for (var showname in showsdata) {
    result += `<listItemLockup>
	    <title>${showname}</title>
	    <decorationLabel>${showsdata[showname].length}</decorationLabel>
	    <relatedContent>
	      <grid>
	        <section>` + GetLatestLockupSections(showsdata[showname]) + `</section>
	      </grid>
	    </relatedContent>
	  </listItemLockup>`;
  }
  return result;
}

var createProviderChooser = function(providers) {

  var textbody = `<?xml version="1.0" encoding="UTF-8" ?>
  <document>
  <listTemplate>
   <banner>
   </banner>
   <list>
      <header>
      </header>
      <section>` + GetProviderListLockupSections(providers) +
      `</section>
   </list>
  </listTemplate>

  </document>`;

  var doc = Presenter.makeDocument(textbody);

  var lockups = doc.getElementsByTagName('listItemLockup');
  var j=0;
  for (var i=0;i<providers.length;i++) {
    if (providers[i].videourl != "")
      lockups.item(j++).videourl = providers[i].videourl;
  }
  doc.addEventListener("select", Presenter.playvideo.bind(Presenter)); // add event

  return doc;
}

function GetProviderListLockupSections(providerlist) {
  var result = "";
  for (var d = 0; d < providerlist.length; d++) {
    var vurl = providerlist[d].videourl;
    var title = providerlist[d].domain;
    if (vurl != "") {
      result += `<listItemLockup>`;
      result += `<title>${title}</title>`;
      result += `<relatedContent>
                </relatedContent>
                </listItemLockup>`
    }
  }
  return result;
}
