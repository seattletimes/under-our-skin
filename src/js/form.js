var $ = require("jquery");
var moment = window.moment = require("moment");

var panel = $(".form-panel");
var endpoint = "https://script.google.com/macros/s/AKfycbxAKynaAYvBQ6Nhc9fjfyKbVs424nMPYg7fC407Bh0VWUivXVY/exec";

var messageSending = panel.find(".message.sending");
var messageSuccess = panel.find(".message.success")
var submit = panel.find(".submit");
var form = panel.find("form");
var inputs = form.find("input, select, textarea");
var textarea = form.find("textarea");
var select = form.find("select");
var charLimit = $(".char-limit");
var input = document.querySelector(".adjective input");
var validated = false;

select.on("change", function() {
  if (select.val() == "other") {
    select.addClass("hidden");
    input.value = "";
    input.classList.add("visible");
  }
})

form.on("change keyup", function(){
  var count = 500 - textarea[0].value.length;
  charLimit.html(count);
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
  
  packet.term = document.querySelector(".comment-title").innerHTML.toLowerCase().replace(/ /g, "_");
  packet.timestamp = Date.now();
  packet.adjective = document.querySelector(".adjective select").value;
  if (packet.adjective == "resonated") packet.adjective = "resonated with";
  packet.fillin = input.value;
  packet.date = moment(packet.timestamp).format('MM/DD/YY h:mm a');
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
    charLimit.html("500");
    validated = false;
    select.removeClass("hidden");
    input.classList.remove("visible");
    form.removeClass("validated");
    inputs.each(function(i, el) {
      if (el.name == "select-adjective") {
        el.value = "choose";
      } else if (el.name == "input-adjective") {
        el.value = "--";
      } else {
        el.value = "";
      }
    })
  });

});
