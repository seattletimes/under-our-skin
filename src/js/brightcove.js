var $ = require("jquery");

var loading = {};

module.exports = function(player, id, callback) {
  var later = function() {
    var player = videojs(id);

    //add our custom playID method
    var playQueue = [];

    //when videos are loaded, check to see if they're in our request queue
    //if so, immediately play them.
    player.on("loadedmetadata", function() {
      var first = playQueue[0];
      if (first && player.mediainfo.id == first.id) {
        playQueue.shift();
        player.play();
      }
    });

    player.playID = function(id) {
      //quick return if we're there already
      if (player.mediainfo.id == id) {
        return player.play();
      }
      var matching = player.playlist().filter(v => v.id == id).shift();
      if (matching) {
        //add this to the queue
        playQueue.push(matching);
        var index = player.playlist.indexOf(matching);
        player.playlist.currentItem(index);
      }
    };

    callback(player);
  };

  // B15NOtCZ
  if (loading[player]) {
    return loading[player].then(later);
  }
  var deferred = $.Deferred();
  loading[player] = deferred.promise();
  var src = `//players.brightcove.net/1509317113/${player}_default/index.min.js`;
  var script = document.createElement("script");
  script.src = src;
  script.onload = function() {
    deferred.resolve();
  };
  document.head.appendChild(script);
  loading[player].then(later);
};