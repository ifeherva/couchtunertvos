// Class that handles navigation and event handling
var Presenter = {

  // creates a new document from the passes resource
  makeDocument: function(resource) {
    // create new parser
    if (!Presenter.parser) {
      Presenter.parser = new DOMParser();
    }
    var doc = Presenter.parser.parseFromString(resource, "application/xml");
    return doc;
  },
  // Displays the passed document on top of the current document.
  modalDialogPresenter: function(xml) {
    navigationDocument.presentModal(xml);
  },

  dismissModal: function() {
    navigationDocument.dismissModal();
  },

  popDocument: function() {
    navigationDocument.popDocument();
  },

  // Pushes the specified document onto the stack.
  pushDocument: function(xml) {
    navigationDocument.pushDocument(xml);
  },

  load: function(event) {

  var self = this,
  ele = event.target,
  videodata = ele.videodata;

  if (videodata.DOMType == "Episodelink") {
    // resolve providers
    var pageurl = videodata.pageurl;
    var pagesrc = GetURLSourceSynch(pageurl);

    videodata.providers = GetProviders(pagesrc);

    var doc = createProviderChooser(videodata.providers);
    Presenter.pushDocument(doc);
  } else if (videodata.DOMType == "link") {

  }


  },



playvideo: function(event) {

var self = this,
ele = event.target,
videoURL = ele.videourl;

if(videoURL) {
  //2
  var player = new Player();
  var playlist = new Playlist();
  var mediaItem = new MediaItem("video", videoURL);

  player.playlist = playlist;
  player.playlist.push(mediaItem);
  player.present();
}

},
}
