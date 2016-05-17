// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");
var $ = require("./lib/qsa");
var ready = require("./brightcove");
require("./form");

var pageIndex = 0;
var sections = $(".flex-container");
var introPlayer = null;

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
  if (introPlayer) {
    if (index == 1) {
      // auto play intro video
    } else {
      //stop the video
    }
  }
};

ready("default", "intro-player", p => introPlayer = p);

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

ready("B15NOtCZ", "player", function(player) {
  window.player = player;

  var cuePlaylist = function(index, term, label) {
    console.log(index, term, label)
    navigateTo(3);
    player.playlist.currentItem(index);
    player.play();
    window.location.hash = term;
    document.querySelector(".title.tile").innerHTML = `"${label}"`;
    $(".comment").forEach(function(comment){
      if (comment.getAttribute("data-term") == term) {
        comment.classList.add("visible");
      } else {
        comment.classList.remove("visible");
      }
    })
  }

  player.catalog.getPlaylist(playlistID, function(err, playlist) {
    player.catalog.load(playlist);

    var term = window.location.hash.replace("#", "");
    if (term) {
      
      var v = playlistItems.filter(p => p.term == term).pop();
      console.log(term)
      cuePlaylist(v.index, v.term, v.word);
    }

    $(".word.tile").forEach(tile => tile.addEventListener("click", function(e) {
      var index = this.getAttribute("data-index") * 1;
      var term = e.target.getAttribute("data-term");
      var label = e.target.innerHTML;
      // navigateTo(3);
      cuePlaylist(index, term, label);
    }));

  });
});
