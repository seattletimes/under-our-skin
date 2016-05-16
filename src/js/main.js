// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");
var $ = require("./lib/qsa");
var ready = require("./brightcove");

var pageIndex = 0;
var sections = $(".flex-container");

var fadeIn = function(el) {
  el.classList.add("shown");
  var reflow = el.offsetWidth;
  el.classList.add("fade");
};

var navigateTo = function(index) {
  sections.forEach(function(section) {
    if (index == section.getAttribute("data-index")) {
      fadeIn(section);
    } else {
      section.classList.remove("fade", "shown");
    }
  });
}

document.body.addEventListener("click", function(e) {
  if (e.target.classList.contains("next")) {
    pageIndex = e.target.getAttribute("data-index");
    navigateTo(pageIndex);
  };
  if (e.target.classList.contains("read-more")) {
    e.target.classList.add("hide");
    fadeIn(document.querySelector(".editors-note .more"));
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
