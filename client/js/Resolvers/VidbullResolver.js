function VidbullResolver() {
  this.resolve = function(url) {

    var docsource = GetURLSourceSynch(url);
    if (!docsource) return "";
    //docsource = docsource.replace("<!DOCTYPE html>","");

    var httpregex = /(https?:\/\/vidbull.com\/[^\s]+html)/g;
    var matches = docsource.match(httpregex);

    if (!matches || matches.length == 0) return "";

    // we assume the first hit is correct
    var domainurl = matches[0];
    docsource = GetURLSourceSynch(domainurl);

// NOT WORKING YET

    /*var crazy = function(p,a,c,k,e,d) {
      while(c--)
        if(k[c])
          p=p.replace(new RegExp('\\b'+c.toString(a)+'\\b','g'),k[c]);
        return p;
    };*/

    //var r = crazy('2u("2t").2s({d:"2r",2q:"2://2p.2o.2n.2m/i/2l/2k.2j",2i:"2",2h:"../7/2g.2f",2e:"2d",h:g,k:j,2c:"2://5.4/7/7.p",2b:{"2://5.4/7/2a.p":{},"29-1":{},"/7/28.n":{},"27-3":{"b":"2://5.4/9","26":"%25%24%23%21%1z%1y%1x.4%1w-9-m.l%22%1v%a%1u%a%1t%a%1s%1r%1q%1p%1o%1n%o%1m%1l%o"},"/7/1k.n":{"1j":"2://5.4/1i-9-m.l","k":j+20,"h":g+15}},\'1h\':{\'1g\':1f(f){1e(!f.1d){1c()}}},\'1b.c\':"1a",\'19\':"e",\'18\':"17",\'16\':"e",\'14\':"13",\'6.d\':"2://5.4/12/11.10",\'6.z\':y,\'6.x\':15,\'6.w\':1,\'6.v\':0.8,\'6.c\':"u-t",\'6.b\':"2://5.4",s:"r",q:"2://5.4"});',36,103,'||http||com|vidbull|logo|player||tn0m06um98rk|3D0|link|position|file|always|event|800|width||400|height|html|800x400|js|3E|swf|aboutlink|VidBull|abouttext|right|top|out|over|timeout|false|hide|png|vidbull_playerlogo|images|uniform|stretching||allowscriptaccess|opaque|wmode|allowfullscreen|left|dock|displayAgain|fullscreen|if|function|onFullscreen|events|embed|url|popout|2FIFRAME|3C|3D420|20HEIGHT|3D800|20WIDTH|3DNO|20SCROLLING|20MARGINHEIGHT|20MARGINWIDTH|20FRAMEBORDER|2Fembed|2Fvidbull|2F|3A||22http||3D|20SRC|3CIFRAME|code|sharing|mute|lightsout|asproject|plugins|flashplayer|2552|duration|zip|modieus1|skin|provider|jpg|ojixznb6u31c|01480|73|99|195|91|image|a53d1df2aa78e39523a1226847846eab6e2b14913e86121d2f1be52fa3b0f10759ec28f7c25ed923dc44512ce249f05f36b298084ddac67fe66429e5cd0d4ae5dfa3ac1dd9e4359de6e8cf45b12adedd8b8961f97deade6788adf92783c7ef4e|setup|flvplayer|jwplayer'.split('|'));

    return "";
  }
}
