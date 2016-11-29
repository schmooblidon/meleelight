/* eslint-disable */

import $ from "jquery";
import {showDebug} from "main/main";

window.mobile = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  mobile = true;
}
let windwidth = 0;
let windheight = 0;

window.resizeHeader = function() {
  windwidth = $(window).width();
  windheight = $(window).height();
  if (windwidth < 1500) {
    $("#main").addClass("smalltext");
  } else {
    $("#main").removeClass("smalltext");
  }
  if (windwidth < 1200) {
    $(".button").css({
      "font-size": "12px",
      "width": 70
    }).children("p").css("margin", "23px 0px");
    $(".longbutton").css("width", 90);
    $(".doublebutton").css("width", 80).children("p").css("margin", "16px 0px");
    $(".doublelongbutton").css("width", 90).children("p").css("margin", "16px 0px");
    $("#titlelogo").css({
      "width": 280,
      "height": 60,
      "margin-top": 0
    });
  } else {
    $(".button").css({
      "font-size": "16px",
      "width": 80
    }).children("p").css("margin", "21px 0px");
    $(".longbutton").css("width", 100);
    $(".doublebutton").css("width", 85).children("p").css("margin", "12px 0px");
    $(".doublelongbutton").css("width", 100).children("p").css("margin", "12px 0px");
    $("#titlelogo").css({
      "width": 280,
      "height": 60,
      "margin-top": 0
    });
  }
  if (windwidth < 1050) {
    $(".button").css({
      "font-size": "12px",
      "width": 65
    }).children("p").css("margin", "23px 0px");
    $(".longbutton").css("width", 75);
    $(".doublebutton").css("width", 70).children("p").css("margin", "16px 0px");
    $(".doublelongbutton").css("width", 75).children("p").css("margin", "16px 0px");
    $("#titlelogo").css({
      "width": 200,
      "height": 43,
      "margin-top": 10
    });
  }
  if (windwidth < 905) {
    $(".button").css({
      "font-size": "10px",
      "width": 50
    }).children("p").css("margin", "25px 0px");
    $(".longbutton").css("width", 60);
    $(".doublebutton").css("width", 55).children("p").css("margin", "19px 0px");
    $(".doublelongbutton").css("width", 60).children("p").css("margin", "19px 0px");
    $("#titlelogo").css({
      "width": 150,
      "height": 32,
      "margin-top": 16
    });
  }
  $("#main").css("min-height", windheight - 105 + "px");
}
let showHeader = true;
if (typeof offlineMode !== "undefined") {
  if (offlineMode) {
    showHeader = false;
  }
}
window.resize = function() {
  resizeHeader();
  var head = showHeader ? 95 : 31;
  if (showDebug) {
    head += 60;
  }
  var wW = $(window).width();
  var wH = $(window).height();
  var maxScale = (wH - head) / 750;
  var scale = Math.min(maxScale, wW / 1200);
  var mY = (wH - head) - scale * 750;
  var mX = wW - scale * 1200;
  $("#display").css({
    "margin-left": (mX / 2) + "px",
    "margin-top": (mY / 2) + "px",
    "-webkit-transform": "scale(" + scale + ", " + scale + ")",
    "transform": "scale(" + scale + ", " + scale + ")",
    "-ms-transform": "scale(" + scale + ", " + scale + ")"
  });
  $("body").height(wH);
}

$(window).resize(function() {
  resize();
});
