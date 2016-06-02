var $ = require("jquery");

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
var validated = false;

select.on("change", function() {
  if (select.val() == "other") {
    document.querySelector(".adjective").innerHTML = `
      <select name="adjective">
        <input maxlength="100" name="adjective" placeholder="" required>
      </select> 
    `;
    document.querySelector(".adjective input").classList.add("visible");
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
    charLimit.html("500");
    validated = false;
    document.querySelector(".adjective").innerHTML = `
      <select name="adjective">
        <option value="choose" selected="selected" disabled="disabled">CHOOSE</option>
        <option value="surprised">surprised</option>
        <option value="interested">interested</option>
        <option value="inspired">inspired</option>
        <option value="resonated">resonated with</option>
        <option value="confused">confused</option>
        <option value="frustrated">frustrated</option>
        <option value="saddened">saddened</option>
        <option value="angered">angered</option>
        <option value="other">(write your own)</option>
        <input maxlength="100" name="adjective" placeholder="" required>
      </select> 
    `;
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
