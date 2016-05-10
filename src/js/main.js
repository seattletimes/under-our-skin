// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");
var $ = require("./lib/qsa");
var ready = require("./brightcove");

var pageIndex = 0;
var sections = $("section");

var navigateTo = function(index) {
  sections.forEach(function(section) {
    if (index == section.getAttribute("data-index")) {
      section.classList.add("shown");
      var reflow = section.offsetWidth;
      section.classList.add("fade");
    } else {
      section.classList.remove("fade");
      setTimeout(function() {
        section.classList.remove("shown")
      }, 5000);
    }
  });
}

document.body.addEventListener("click", function(e) {
  if (e.target.classList.contains("next")) {
    pageIndex = e.target.getAttribute("data-index");
    navigateTo(pageIndex);
  };
});

// Video player

var playlistID = 4884471259001;

ready(function(player) {
  window.player = player;

  player.catalog.getPlaylist(playlistID, function(err, playlist) {
    player.catalog.load(playlist);

    $(".word.tile").forEach(tile => tile.addEventListener("click", function(e) {
      var index = this.getAttribute("data-index") * 1;
      navigateTo(3);
      player.playlist.currentItem(index);
      player.play();
      // display relevant content divs based on index
    }));

  });
});
