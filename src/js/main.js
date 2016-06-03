require("./lib/social");
// require("./lib/ads");

require("./tracking.js");

var $ = require("./lib/qsa");
var debounce = require("./lib/debounce");
var animateScroll = require("./lib/animateScroll");
var ready = require("./brightcove");
require("./form");

var EventEmitter = require("events");
var channel = new EventEmitter();

var videoLookup = {};
playlistItems.forEach(i => videoLookup[i.id] = i);

var bioLookup = {};
bioData.forEach(i => bioLookup[i.id] = i);

var pageIndex = "intro";
var sections = $(".scroll-aware");

var pending = null;
var preLoaded = v => pending = v;
channel.on("playVideo", preLoaded);

var players = {};
var playerDelay = null;

var dots = $(".dot");

var closeVideo = function() {
  bioVideo.classList.remove("faded");
  setTimeout(function() {
    bioVideo.classList.remove("lightboxed");
  }, 300);
}

// Scroll listener
window.addEventListener("scroll", debounce(function(e) {
  sections.forEach(function(section) {
    var bounds = section.getBoundingClientRect();
    if (bounds.top <= window.innerHeight * 0.7) {
      section.classList.add("visible");
      if (bounds.bottom >= window.innerHeight * 0.3) {
        var index = section.getAttribute("data-index");
        if (section.id == "intro") {
          document.querySelector(".dots").classList.add("hidden");
        } else {
          document.querySelector(".dots").classList.remove("hidden");
        }
        dots.forEach(function(d) {
          if (d.getAttribute("data-index") == index) {
            d.classList.add("active");
          } else {
            d.classList.remove("active");
          }
        })
        if (section.id !== "bios") {
          closeVideo();
        }
      }
    } else {
      section.classList.remove("visible");
    }
    if (section.id == "bios" && bounds.bottom <= window.innerHeight * 0.3) {
      section.classList.remove("visible");
      players.bio.pause();
    }
  });

  for (var p in players) {
    var player = players[p];
    var element = player.el();
    var bounds = element.getBoundingClientRect();
    if (playerDelay) clearTimeout(playerDelay);
    if (bounds.top < window.innerHeight * 0.7 && bounds.bottom > window.innerHeight * 0.3) {
      if (player.hasBeenPlayed) return;

      playerDelay = setTimeout(function() {
        var newBounds = element.getBoundingClientRect();
        if (newBounds.top < window.innerHeight * 0.7 && newBounds.bottom > window.innerHeight * 0.3) {
          player.play();
          player.hasBeenPlayed = true;
        }
      }, 300);
      break;
    } else {
      player.pause();
    }
  }
}));

var indexLookup = ["intro", "note", "words", "playlist", "bios", "about"];

// Dots/arrows navigation
$(".arrow").forEach(function(arrow) {
  arrow.addEventListener("click", function(e) {
    var index = document.querySelector(".dot.active").getAttribute("data-index") * 1;
    if (e.target.classList.contains("up")) {
      index -= 1;
    } else if (e.target.classList.contains("down")) {
      index += 1;
    }
    if (index > 5) index = 5;

    animateScroll(`#${indexLookup[index]}`);
  })
})

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
    window.history.replaceState("#", "#", "#");
  });
});

// Insert video title, comments, and URL hash
var loadVideoInfo = function(v) {
  var playlistItem = document.querySelector(`.playlist-video[data-id="${v.id}"]`);
  var playing = document.querySelector(".playlist-video.playing");
  if (playing) playing.classList.remove("playing");
  playlistItem.classList.add("playing");

  window.history.replaceState(`#${v.term}`, `#${v.term}`, `#${v.term}`);
  document.querySelector(".question-title").innerHTML = `${v.word}`;
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
    window.history.replaceState("#", "#", "#");
  }
} else {
  animateScroll("#intro");
  pageIndex = "intro";
  window.history.replaceState("#", "#", "#");
}

// Load intro video player
ready("B15NOtCZ", "intro-player", p => players.intro = p);


// Bio videos
var gridImages = $(".bio-grid-img");
var bioVideo = document.querySelector(".bio-video");

gridImages.forEach(function(img) {
  img.addEventListener("click", function(e) {
    var id = e.target.getAttribute("data-id");
    var b = bioLookup[id];
    bioVideo.classList.add("lightboxed");
    setTimeout(function() {
      bioVideo.classList.add("faded")
      channel.emit("playBioVideo", b);
    }, 300)
  });
});


// Set up event listeners
document.body.addEventListener("click", function(e) {
  // Home button
  if (e.target.classList.contains("nav-label")) {
    pageIndex = "intro";
    e.preventDefault();
    animateScroll("#intro");
    window.history.replaceState("#", "#", "#");
    pageIndex = "intro";
  };

  // Nav items
  if (e.target.classList.contains("nav-item")) {
    var hash = e.target.getAttribute("data-nav");
    pageIndex = hash;
    e.preventDefault();
    animateScroll(`#${hash}`);
    window.history.replaceState("#", "#", "#");
    pageIndex = hash;
  };

  // Skip intro
  if (e.target.classList.contains("skip-intro")) {
    animateScroll("#words");
    pageIndex = "words";
    window.history.replaceState("#", "#", "#");
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

  // More comments
  if (e.target.classList.contains("read-more")) {
    $(".comment.visible").forEach(function (c) {
      c.classList.add("more");
    });
    document.querySelector(".read-fewer").classList.remove("hidden");
    document.querySelector(".read-more").classList.add("hidden");
  };
  if (e.target.classList.contains("read-fewer")) {
    $(".comment.visible").forEach(function (c) {
      c.classList.remove("more");
    });
    document.querySelector(".read-fewer").classList.add("hidden");
    document.querySelector(".read-more").classList.remove("hidden");
  };

  // Bio video close button
  if (e.target.classList.contains("close-bio")) {
    closeVideo();
  };
});

// Load words video player
var playlistID = 4884471259001;

ready("B15NOtCZ", "player", function(player) {

  player.on("playing", function() {
    if (pageIndex == "playlist") {
      var id = player.mediainfo.id ;
      var v = videoLookup[id];
      channel.emit("updatePlaylist", v);
    }
  });

  player.catalog.getPlaylist(playlistID, function(err, playlist) {
    player.catalog.load(playlist);
    window.player = players.main = player;

    channel.removeListener("playVideo", preLoaded);

    channel.on("playVideo", function(v) {
      player.playID(v.id);
      //player.playlist.currentItem(v.index);
      // player.play();
    });

    if (pending) {
      player.playID(pending.id);
      //player.playlist.currentItem(pending.index);
      // player.play();
    }

  });
});


// Load bio video player
var bioPlaylistID = 4902235697001;

ready("B15NOtCZ", "bio-player", function(player) {
  window.player = players.bio = player;

  document.body.addEventListener("click", function(e) {
    if (e.target.classList.contains("close-bio")) player.pause();
  });

  player.catalog.getPlaylist(bioPlaylistID, function(err, playlist) {
    player.catalog.load(playlist);

    channel.on("playBioVideo", function(b) {
      player.playlist.currentItem(b.index);
      player.play();
    });

  });
});


