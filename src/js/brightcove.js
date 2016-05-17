
module.exports = function(player, id, callback) {
  // B15NOtCZ
  var src = `//players.brightcove.net/1509317113/${player}_default/index.min.js`;
  var script = document.createElement("script");
  script.src = src;
  script.onload = function() {
    var player = videojs(id);
    player.ready(() => callback(player));
  };
  document.head.appendChild(script);
};