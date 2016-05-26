var $ = require("jquery");

var panel = $(".form-panel");
var endpoint = "https://script.google.com/macros/s/AKfycbxAKynaAYvBQ6Nhc9fjfyKbVs424nMPYg7fC407Bh0VWUivXVY/exec";

var messageSending = panel.find(".message.sending");
var messageSuccess = panel.find(".message.success")
var submit = panel.find(".submit");
var form = panel.find("form");
var inputs = form.find("input, select, textarea");
var validated = false;

form.on("change keydown", function(){
  validated = true;
  inputs.each(function(i, el) {
    if (!el.value || el.value == "choose") validated = false;
  });

  if (validated) {
    submit.addClass("validated");
  } else {
    submit.removeClass("validated");
  }
})

submit.on("click", function(e) {
  if (!validated) return;

  var self = this;
  e.preventDefault();

  //handle form elements correctly
  var packet = {};
  inputs.each(function(i, el) {
    packet[el.name] = el.value;
  });
  
  packet.term = window.location.hash.replace("#", "");
  packet.method = "comment";

  var submission = $.ajax({
    url: endpoint,
    data: packet,
    dataType: "jsonp"
  });

  messageSending.addClass("visible");
  messageSuccess.removeClass("visible");

  submission.done(function(data) {
    messageSending.removeClass("visible");
    messageSuccess.addClass("visible");
    validated = false;
    form.removeClass("validated");
    inputs.each(function(i, el) {
      if (el.name == "adjective") {
        el.value = "choose";
      } else {
        el.value = "";
      }
    })
  });

});
