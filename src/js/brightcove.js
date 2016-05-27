var $ = require("jquery");

var loading = {};

module.exports = function(player, id, callback) {
  var later = function() {
    var player = videojs(id);
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