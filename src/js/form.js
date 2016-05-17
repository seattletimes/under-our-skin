var $ = require("jquery");
var formUtil = require("./form-utils");

var endpoint = "https://script.google.com/macros/s/AKfycbzN-l4_B5W3tHS8sYRCgBBSj1KKgAEPaZBh7cXG7sjDyGCEqbQ/exec";

var message = panel.find(".message");
var form = panel.find(".form");

//stupid Firefox form memory
form.find(".submit").attr("disabled", null);

//do not show form if it has been submitted before
if (cookie.read("sfm-sent")) {
  $(".form-panel").hide();
  $(".add-yourself").hide();
  $(".results").show();
}

var stored = localStorage.score;
if (stored) {
  placeUser(stored);
}

form.on("click", ".submit", function() {
  var self = this;
  if (self.disabled) return;

  //handle form elements correctly
  var packet = formUtil.package(form);
  var errorMsg = "";
  if (!packet) {
    errorMsg = "We need your prediction in order to add you!";
  } else if (isNaN(packet.patriots) || isNaN(packet.seahawks)) {
    errorMsg = "Scores must be numbers.";
  } else if (Math.max(packet.patriots, packet.seahawks) > 70) {
    errorMsg = "Scores over 70 points are not accepted.";
  } else if (packet.seahawks == packet.patriots) {
    errorMsg = "Scores cannot be equal.";
  }

  if (errorMsg) {
    panel.addClass("invalid");
    $(".validation.error").html(errorMsg);
    return;
  } else {
    panel.removeClass("invalid");
  }
  
  self.disabled = true;

  var submission = $.ajax({
    url: endpoint,
    data: packet,
    dataType: "jsonp"
  });

  message.show();

  submission.done(function(data) {
    $(".add-yourself").hide();
    $(".results").show();
    $(".form-panel").hide();
    cookie.write("sfm-sent", true);
    var stored = packet.seahawks + "-" + packet.patriots;
    localStorage.score = stored;
    placeUser(stored);
  });

  submission.fail(function() {
    self.disabled = false;
  });

});

window.clearSent = function() {
  cookie.clear("sfm-sent");
};