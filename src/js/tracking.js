var $ = require("./lib/qsa");
var jquery = require("jquery");
var track = require("./lib/tracking");

// Dropdown
$(".nav-item").forEach(function(item) {
  item.addEventListener("click", function(e) {
    track("interactive", "uos-dropdown", e.target.getAttribute("data-nav"));
  });
});

// Start button
document.querySelector(".hed-container .jump a").addEventListener("click", function(e) {
  track("interactive", "uos-start-button", "start-button");
});

// Dots
document.querySelector(".down.arrow").addEventListener("click", function(e) {
  track("interactive", "uos-dots", "down-arrow");
});
document.querySelector(".up.arrow").addEventListener("click", function(e) {
  track("interactive", "uos-dots", "up-arrow");
});

// Skip intro
document.querySelector(".skip-intro").addEventListener("click", function(e) {
  track("interactive", "uos-skip-intro", "skip-intro");
});

// Word tiles
$(".word-tile").forEach(function(item) {
  item.addEventListener("click", function(e) {
    track("interactive", "uos-word-tiles", e.target.getAttribute("data-term"));
  });
});

// Playlist tiles
$(".playlist-video").forEach(function(item) {
  item.addEventListener("click", function(e) {
    track("interactive", "uos-playlist-tiles", e.target.getAttribute("data-term"));
  });
});

// Read more

document.querySelector(".comment-bucket").addEventListener("click", function(e) {
  if (e.target.class.contains("read-more")) {
    track("interactive", "uos-read-more", "read-more");
  }
  if (e.target.class.contains("read-fewer")) {
    track("interactive", "uos-read-fewer", "read-fewer");
  }
});

// Bio video word tiles
jquery(".bio-video").on("click", ".bio-playlist-video", function(e) {
  track("interactive", "uos-bio-tiles", e.target.getAttribute("data-term"));
});
