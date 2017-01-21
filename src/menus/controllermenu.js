import {player, setCookie, changeGamemode, ports, bg1, layers, bg2, ui, fg2, fg1, clearScreen, shine,
    getCookie
    , addShine
    , setShine
    , calibrationPlayer
} from "main/main";
import {twoPi} from "main/render";
import {updateGamepadSVGColour} from "../input/gamepad/drawGamepad";
/* eslint-disable */

let controllerTimer    = 0;
let controllerTimerMax = 3000/16.667;

export function updateControllerMenu(quit, text, interval){
  fg1.clearRect(0,0,layers.FG1.width,layers.FG1.height);
  fg1.fillStyle = "rgba(255,255,255,0.8)";
  fg1.font = "700 42px Arial";
  fg1.textAlign = "center";
  if (text.length > 60) {
    let n1 = text.indexOf(" ", 15);
    let n2 = text.indexOf(" ", 45);
    let text1 = text.substr(0, n1);
    let text2 = text.substr(n1+1, n2-n1);
    let text3 = text.substr(n2+1, text.length);
    fg1.fillText(text1, 600, 520);
    fg1.fillText(text2, 600, 580);
    fg1.fillText(text3, 600, 640);
  }
  else if (text.length > 30) {
    let n = text.indexOf(" ", 13);
    let text1 = text.substr(0,n);
    let text2 = text.substr(n+1, text.length);
    fg1.fillText(text1, 600, 520);
    fg1.fillText(text2, 600, 580);
  } 
  else {
    fg1.fillText(text, 600, 540);
  }
  if (quit) {
    setTimeout(function(){ document.getElementById("gamepadSVGCalibration").style.display = "none"; changeGamemode(1)}, 2000);
  } else {
    controllerTimer    = interval/16.667;
    controllerTimerMax = interval/16.667;
  }
}

export function drawControllerMenuInit (){
  updateGamepadSVGColour(calibrationPlayer, "gamepadSVGCalibration");
  document.getElementById("gamepadSVGCalibration").style.display = "";
  const bgGrad = bg1.createLinearGradient(0, 0, 1200, 750);
  bgGrad.addColorStop(0,"rgb(11, 65, 39)");
  bgGrad.addColorStop(1,"rgb(8, 20, 61)");
  bg1.fillStyle=bgGrad;
  bg1.fillRect(0,0,layers.BG1.width,layers.BG1.height);
  bg1.fillStyle = "rgba(0,0,0,0.5)";
  fg2.fillStyle = "rgba(255,255,255,0.2)";
  controllerTimer--;
  if (controllerTimer > 0) {
    fg2.fillRect(300,600,600,30);
    fg2.fillStyle = "rgba(255,255,255,0.8)";
    fg2.fillRect(300,600,600*Math.max(0,(controllerTimer/controllerTimerMax)),30);
  }
}

export function drawControllerMenu (){
  clearScreen();
  drawControllerMenuInit();
  bg2.lineWidth = 3;
  addShine(0.01);
  if (shine > 1.8){
   setShine(-0.8);
  }
  const opacity = (shine < 0) ? (0.05 + (0.25 / 0.8) * (0.8 + shine)) : ((shine > 1) ? (0.3 - (0.25 / 0.8) * (shine - 1)) : 0.3);
  var bgGrad =bg2.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgba(255, 255, 255,0.05)");
  bgGrad.addColorStop(Math.min(Math.max(0,shine),1),"rgba(255,255,255,"+opacity+")");
  bgGrad.addColorStop(1,"rgba(255, 255, 255,0.05)");
  //ui.strokeStyle = "rgba(255,255,255,0.13)";
  bg2.strokeStyle = bgGrad;
  bg2.beginPath();
  for (var i = 0; i < 60; i++) {
    bg2.moveTo(0 + (i * 30), 0);
    bg2.lineTo(0 + (i * 30), 750);
    bg2.moveTo(0, 0 + (i * 30));
    bg2.lineTo(1200, 0 + (i * 30));
  }
  bg2.stroke();
}