var video = document.querySelector(".hed-container video");

// when are we below tablet?
var mediaQuery = window.matchMedia("(max-width: 480px)");

var updateVideo = function() {
  if (!mediaQuery.matches) {
    video.setAttribute("src", video.getAttribute("data-src"));
  }
};

//set video source on load
updateVideo();

//also set it if the media query changes
mediaQuery.addListener(updateVideo);