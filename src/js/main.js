// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");
var $ = require("./lib/qsa");
var ready = require("./brightcove");

var index;
var sections = $("section");

document.body.addEventListener("click", function(e) {
  if (e.target.classList.contains("next")) {

    index = e.target.getAttribute("data-index");

    sections.forEach(function(section) {
      if (index == section.getAttribute("data-index")) {
        console.log(section.classList)
        section.classList.add("shown");
      } else {
        section.classList.remove("shown");
      }
    });

  };
});

// Video player

var playlistID = 4884471259001;

ready(function(player) {
  window.player = player;

  player.catalog.getPlaylist(playlistID, function(err, playlist) {
    player.catalog.load(playlist);

    var lookup = {};
    playlist.forEach((v, i) => lookup[v.id] = v);

    $(".word.tile").forEach(tile => tile.addEventListener("click", function(e) {
      var id = this.getAttribute("data-id");
      player.play(lookup[id]);
    }));

  });
});