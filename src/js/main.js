// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");
var $ = require("./lib/qsa");
var ready = require("./brightcove");
require("./form");

var EventEmitter = require("events");
var channel = new EventEmitter();

var videoLookup = {};
playlistItems.forEach(i => videoLookup[i.video_id] = i);

var pageIndex = 0;
var sections = $(".flex-container");
var introPlayer = null;
var videoPlayer = null;

var pending = null;
var preLoaded = v => pending = v;
channel.on("playVideo", preLoaded);


// Page transitions
var fadeIn = function(el) {
  el.classList.add("shown");
  var reflow = el.offsetWidth;
  el.classList.add("fade");
};
var fadeOut = function(el) {
  el.classList.remove("fade");
  setTimeout(function() {
    el.classList.remove("shown");
  }, 1000);
};

var show = (el) => el.classList.add("fade", "shown");
var hide = (el) => el.classList.remove("fade", "shown");

// Navigate to page
var navigateTo = function(index, silent) {
  pageIndex = index;
  sections.forEach(function(section) {
    if (index == section.getAttribute("data-index")) {
      if (silent) {
        show(section);
      } else fadeIn(section);
    } else {
      if (silent) {
        hide(section);
      } else fadeOut(section);
    }
  });
  if (introPlayer) {
    if (index == 1) {
      introPlayer.play();
    } else {
      introPlayer.pause();
    }
  }
  if (videoPlayer) {
    if (index !== 3) {
      videoPlayer.pause();
      window.location.hash = "";
    }
  }
};

// Insert video title, comments, and URL hash
var loadVideoInfo = function(v) {
  var playlistItem = document.querySelector(`.playlist-video[data-id="${v.video_id}"]`);
  var playing = document.querySelector(".playlist-video.playing");
  if (playing) playing.classList.remove("playing");
  playlistItem.classList.add("playing");

  window.location.hash = v.term;
  document.querySelector(".title.tile").innerHTML = v.word;
  $(".comment").forEach(function(comment){
    if (comment.getAttribute("data-term") == v.term) {
      comment.classList.add("visible");
    } else {
      comment.classList.remove("visible");
    }
  })
}

channel.on("updatePlaylist", loadVideoInfo);

// If URL already contains video hash, load correct video
var term = window.location.hash.replace("#", "");
if (term) {
  pending = playlistItems.filter(v => v.term == term).pop();
  if (pending) {
    navigateTo(3, true);
    channel.emit("updatePlaylist", pending);
  } else {
    navigateTo(0, true);
    window.location.hash = "";
  }
} else {
  navigateTo(0, true);
  window.location.hash = "";
}

// Load intro video player
ready("default", "intro-player", p => introPlayer = p);

// Set up event listeners
document.body.addEventListener("click", function(e) {
  // Next buttons
  if (e.target.classList.contains("next")) {
    pageIndex = e.target.getAttribute("data-index");
    navigateTo(pageIndex);
  };

  // Read more button
  if (e.target.classList.contains("read-more")) {
    e.target.classList.add("hide");
    fadeIn(document.querySelector(".editors-note .more"));
  };

  // Word tiles
  if (e.target.classList.contains("word-tile")) {
    var id = e.target.getAttribute("data-id");
    var v = videoLookup[id];
    navigateTo(3);
    channel.emit("playVideo", v);
    channel.emit("updatePlaylist", v);
  };

  // Playlist functionality
  if (e.target.classList.contains("playlist-video")) {
    var id = e.target.getAttribute("data-id");
    var v = videoLookup[id];
    channel.emit("playVideo", v);
    channel.emit("updatePlaylist", v);
  };
});


// Load words video player
var playlistID = 4884471259001;

ready("B15NOtCZ", "player", function(player) {
  window.player = videoPlayer = player;

  player.on("loadedmetadata", function() {
    if (pageIndex == 3) {
      var id = player.mediainfo.id ;
      var v = videoLookup[id];
      channel.emit("updatePlaylist", v);
    }
  });

  player.catalog.getPlaylist(playlistID, function(err, playlist) {
    player.catalog.load(playlist);

    channel.removeListener("playVideo", preLoaded);

    channel.on("playVideo", function(v) {
      player.playlist.currentItem(v.index);
      player.play();
    });

    if (pending) {
      player.playlist.currentItem(pending.index);
      player.play();
    }

  });
});

