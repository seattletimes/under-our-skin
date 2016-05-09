var callbacks = [];
var player;

var src="//players.brightcove.net/1509317113/B15NOtCZ_default/index.min.js";
var script = document.createElement("script");
script.src = src;
script.onload = function() {
  player = videojs("player");
  player.ready(function() {
    callbacks.forEach(fn => fn(player));
  });
};
document.head.appendChild(script);

module.exports = function(fn) {
  if (player) {
    return fn(player);
  }
  callbacks.push(fn);
};