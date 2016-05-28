// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");
var $ = require("./lib/qsa");
var debounce = require("./lib/debounce");
var animateScroll = require("./lib/animateScroll");
var ready = require("./brightcove");
require("./form");

var EventEmitter = require("events");
var channel = new EventEmitter();

var videoLookup = {};
playlistItems.forEach(i => videoLookup[i.video_id] = i);

var pageIndex = "intro";
var sections = $(".scroll-aware");

var pending = null;
var preLoaded = v => pending = v;
channel.on("playVideo", preLoaded);

var players = {};
var playerDelay = null;

// Scroll listener
window.addEventListener("scroll", debounce(function(e) {
  sections.forEach(function(section) {
    var bounds = section.getBoundingClientRect();
    if (bounds.top <= window.innerHeight * 0.7) {
      section.classList.add("visible");
    } else {
      section.classList.remove("visible");
    }
  });
  for (var p in players) {
    var player = players[p];
    var element = player.el();
    var bounds = element.getBoundingClientRect();
    if (playerDelay) clearTimeout(playerDelay);
    if (bounds.top > 0 && bounds.bottom < window.innerHeight) {
      playerDelay = setTimeout(function() {
        var newBounds = element.getBoundingClientRect();
        if (newBounds.top > 0 && newBounds.bottom < window.innerHeight) {
          player.play();
        }
      }, 300);
      break;
    } else {
      player.pause();
    }
  }
}));

// Navigation within page
$(".jump a").forEach(function(a) {
  a.addEventListener("click", function(e) {
    var href = this.getAttribute("href");
    if (href.indexOf("#") != 0) return;
    var section = document.querySelector(href);
    if (!section) return;
    e.preventDefault();
    
    animateScroll(section);
    pageIndex = section.id;
    window.history.pushState(href, href, href);
  });
});

// Insert video title, comments, and URL hash
var loadVideoInfo = function(v) {
  var playlistItem = document.querySelector(`.playlist-video[data-id="${v.video_id}"]`);
  var playing = document.querySelector(".playlist-video.playing");
  if (playing) playing.classList.remove("playing");
  playlistItem.classList.add("playing");

  window.location.hash = v.term;
  document.querySelector(".question-title").innerHTML = v.word;
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
    animateScroll("#playlist");
    pageIndex = "playlist";
    channel.emit("updatePlaylist", pending);
  } else {
    animateScroll("#intro");
    pageIndex = "intro";
    window.location.hash = "";
  }
} else {
  animateScroll("#intro");
  pageIndex = "intro";
  window.location.hash = "";
}

// Load intro video player
ready("B15NOtCZ", "intro-player", p => players.intro = p);

// Set up event listeners
document.body.addEventListener("click", function(e) {
  // Home button
  if (e.target.classList.contains("nav-label")) {
    pageIndex = "intro";
    e.preventDefault();
    animateScroll("#intro");
    window.location.hash = "";
    pageIndex = "intro";
  };

  // Nav items
  if (e.target.classList.contains("nav-item")) {
    var hash = e.target.getAttribute("data-nav");
    pageIndex = hash;
    e.preventDefault();
    animateScroll(`#${hash}`);
    pageIndex = hash;
  };

  // Word tiles
  if (e.target.classList.contains("word-tile")) {
    var id = e.target.getAttribute("data-id");
    var v = videoLookup[id];
    e.preventDefault();
    animateScroll("#playlist");
    pageIndex = "playlist";
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
  window.player = players.main = player;

  player.on("loadedmetadata", function() {
    if (pageIndex == "playlist") {
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

