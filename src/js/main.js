// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");
var $ = require("./lib/qsa");
var ready = require("./brightcove");
require("./form");

var pageIndex = 0;
var sections = $(".flex-container");

var fadeIn = function(el) {
  el.classList.add("shown");
  var reflow = el.offsetWidth;
  el.classList.add("fade");
};
var fadeOut = function(el) {
  el.classList.remove("fade");
  setTimeout(function() {
    el.classList.remove("shown");
  }, 500);
};

var navigateTo = function(index) {
  sections.forEach(function(section) {
    if (index == section.getAttribute("data-index")) {
      fadeIn(section);
    } else {
      fadeOut(section);
    }
  });
  if (index == 1) {
    // auto play intro video
  }
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

var term = window.location.hash.replace("#", "");
if (term) {
 // cue playlist 
}

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
      window.location.hash = e.target.getAttribute("data-term");
      document.querySelector(".title.tile").innerHTML = e.target.innerHTML;
      // display relevant content divs based on index
    }));

  });
});
