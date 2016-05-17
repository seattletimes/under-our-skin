var $ = require("jquery");

var panel = $(".form-panel");
var endpoint = "https://script.google.com/macros/s/AKfycbxAKynaAYvBQ6Nhc9fjfyKbVs424nMPYg7fC407Bh0VWUivXVY/exec";

var messageSending = panel.find(".message-sending");
var messageSuccess = panel.find(".message-success")
var submit = panel.find(".submit");
var form = panel.find("form");

submit.on("click", function(e) {
  var self = this;
  e.preventDefault();

  //handle form elements correctly
  var packet = {};
  var inputs = form.find("input, select");
  inputs.each(function(i, el) {
    console.log(el)
    packet[el.name] = el.value;
  });
  packet.term = "BLM";
  packet.method = "comment";

  var submission = $.ajax({
    url: endpoint,
    data: packet,
    dataType: "jsonp"
  });

  messageSending.show();

  submission.done(function(data) {
    messageSending.hide();
    messageSuccess.show();
  });
});
