var raf = window[require("./prefixed").requestAnimationFrame];

var animating = false;

var noop = function() {};
var ease = v => 0.5 - Math.cos( v * Math.PI ) / 2;

var getScroll = () => document.body.scrollTop || document.documentElement.scrollTop || 0;

module.exports = function(element, done = noop) {
  if (animating) return;
  if (typeof element == "string") element = document.querySelector(element);

  var start = getScroll();
  var now = Date.now();
  var duration = 800;

  var frame = function() {
    var t = Date.now();
    var elapsed = t - now;
    var d = elapsed / duration;
    var bounds = element.getBoundingClientRect();
    var offset = bounds.top + getScroll();
    var distance = offset - start - 70;
    document.body.scrollTop = document.documentElement.scrollTop = start + distance * ease(d);
    if (elapsed > duration) {
      setTimeout(() => document.body.scrollTop = document.documentElement.scrollTop = start + distance, 10);
      return animating = false;
    }
    raf(frame);
  };

  animating = true;
  frame();
};