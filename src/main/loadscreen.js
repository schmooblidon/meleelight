/* globals start */

import $ from "jquery";

function drawHexagonLoading(r,tX,tY,width) {
  let a = r*Math.sin(Math.PI/6);
  let b = r*Math.cos(Math.PI/6);

  lc.save();
  lc.translate(tX,tY);
  lc.beginPath();
  lc.moveTo(0,r);
  lc.lineTo(b,r-a);
  lc.lineTo(b,-r+a);
  lc.lineTo(0,-r);
  lc.lineTo(-b,-r+a);
  lc.lineTo(-b,r-a);
  lc.lineTo(0,r);

  const rs = r-width;
  a = rs*Math.sin(Math.PI/6);
  b = rs*Math.cos(Math.PI/6);
  lc.moveTo(0,rs);
  lc.lineTo(-b,rs-a);
  lc.lineTo(-b,-rs+a);
  lc.lineTo(0,-rs);
  lc.lineTo(b,-rs+a);
  lc.lineTo(b,rs-a);
  lc.lineTo(0,rs);
  lc.closePath();
  lc.fill();
  lc.restore();
}

let loading = true;
const scriptNames = [
  "main/sfx.js",
  "settings.js",
  "characters/marth/marthanimations.js",
  "characters/marth/ecbmarth.js",
  "characters/puff/puffanimations.js",
  "characters/puff/ecbpuff.js",
  "characters/baseActionStates.js",
  "main/swordSwings.js",
  "main/vfx.js",
  "physics/hitDetection.js",
  "main/characters.js",
  "characters/marth/marthAttributes.js",
  "characters/puff/puffAttributes.js",
  "physics/article.js",
  "main/player.js",
  "physics/actionStateShortcuts.js",
  "characters/marth/marth.js",
  "characters/puff/puff.js",
  "../dist/js/characters/fox.js",
  "main/render.js",
  "menus/startup.js",
  "menus/startscreen.js",
  "menus/menu.js",
  "menus/audiomenu.js",
  "menus/gameplaymenu.js",
  "menus/keytest.js",
  "menus/keyboardmenu.js",
  "menus/credits.js",
  "menus/css.js",
  "target/targetbuilder.js",
  "target/targetplay.js",
  "menus/targetselect.js",
  "stages/stages.js",
  "stages/stagerender.js",
  "menus/stageselect.js",
  "physics/physics.js",
  "main/ai.js",
  "main/resize.js",
  "main/main.js"
];

const loadText = [
  "Loading audio",
  "Loading animations",
  "Loading characters",
  "Loading menus",
  "Loading core"
];

let sNum=0;

function loadScript(){
  $.getScript("../src/" + scriptNames[sNum])
    .done(() => {
      if (sNum < scriptNames.length - 1){
        sNum++;
        loadScript();
      }
      else {
        loading = false;
        start();
      }
    })
    .fail((jqxhr, settings, exception) => {
      console.error(`Failed to load ${scriptNames[sNum]}`, exception);
    });
}

function drawLoading(){
  lc.clearRect(0,0,loadCanvas.width,loadCanvas.height);
  lc.fillStyle = "rgb(143, 228, 255)";

  const part = sNum%3+1;
  if (part === 1){
    drawHexagonLoading(40,150,100,14*2);
  }
  else if (part === 2){
    drawHexagonLoading(60,150,100,14*2);
  }
  else if (part === 3){
    drawHexagonLoading(80,150,100,14*2);
  }

  $("#loadTextEdit").empty().append(loadText[Math.round(sNum/6.5)]);
  $("#loadPercentEdit").empty().append(Math.round(((sNum+1)/scriptNames.length)*100));

  if (loading){
    requestAnimationFrame(drawLoading);
  }
  else {
    $("#loadScreen").fadeOut();
  }
}

let loadCanvas;
let lc;
$(document).ready(() => {
  loadCanvas = document.getElementById("loadCanvas");
  lc = loadCanvas.getContext("2d");
  drawLoading();
  loadScript();
});
