import {player, setCookie, changeGamemode, ports, bg1, layers, bg2, ui, fg2, fg1, clearScreen, shine,
    getCookie
    , addShine
    , setShine
    , calibrationPlayer
} from "main/main";
import {twoPi} from "main/render";
import {updateGamepadSVGColour} from "../input/gamepad/drawGamepad";
import {setClickObject, setClickObjectNumber} from "../input/gamepad/gamepadCalibration";
import {sounds} from "main/sfx";
/* eslint-disable */

let controllerTimer    = 0;
let controllerTimerMax = 3000;
let prevTime = 0;

export function updateControllerMenu(quit, texts, interval){
  fg1.clearRect(0,0,layers.FG1.width,layers.FG1.height);
  fg1.fillStyle = "rgba(255,255,255,0.8)";
  fg1.font = "700 36px Arial";
  fg1.textAlign = "center";
  const [text1, text2, text3] = texts;
  if (text1 !== undefined) {
    if (text2 === undefined) {
      fg1.fillText(text1, 600, 580);
    }
    else {
      fg1.fillText(text1, 600, 540);
      if (text2 !== undefined) {
        fg1.fillText(text2, 600, 580);
        if (text3 !== undefined) {
          fg1.fillText(text3, 600, 620);
        }
      }
    }
  }
  if (quit) {
    setTimeout(function(){ 
      document.getElementById("gamepadSVGCalibration").style.display = "none"; 
      const canvas = document.getElementById('uiCanvas');
      const context = canvas.getContext('2d');
      canvas.removeEventListener('mousemove', hoverFunction);
      canvas.removeEventListener('mousedown', pressFunction);
      canvas.removeEventListener('click'    , clickFunction);
      changeGamemode(1)}, 16);
  } else {
    controllerTimer    = interval;
    controllerTimerMax = interval;
    prevTime = performance.now();
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
  const newTime = performance.now();
  controllerTimer -= newTime - prevTime;
  prevTime = newTime;
  if (controllerTimer > 0) {
    fg2.fillRect(300,600,600,30);
    fg2.fillStyle = "rgba(255,255,255,0.8)";
    fg2.fillRect(300,600,600*Math.max(0,(controllerTimer/controllerTimerMax)),30);
    fg2.fillRect(296,585,4,60);
  }
}

const baseFill   = "rgba(255, 255, 255, 0.6)";
const baseStroke = "rgba(255, 255, 255, 0.72)";
const highlightFill   = "rgba(249, 255, 193, 0.6)";
const highlightStroke = "rgba(249, 255, 193, 0.72)";
const inUseStroke = "rgba(249, 255, 193, 0.9)";
const pressedFill   = "rgba(145, 145, 145, 0.6)";
const pressedStroke = "rgba(249, 255, 193, 0.72)";

export let centerState = "none";
export let exitState   = "none";
export let resetState  = "none";
export let customState = "none";
export let customInteract = null;
export let customInUse = 0;
export let saveOrLoad = "load";

export function setCustomInUse (k) {
  customInUse = k;
}

function fillColour (state) {
  if (state === "pressed") {
    return pressedFill;
  }
  else if (state === "highlight") {
    return highlightFill;
  }
  else { 
    return baseFill;
  }
}

function strokeColour (state) {
  if (state === "pressed") {
    return pressedStroke;
  }
  else if (state === "highlight") {
    return highlightStroke;
  }
  else { 
    return baseStroke;
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
  let bgGrad = bg2.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgba(255, 255, 255,0.05)");
  bgGrad.addColorStop(Math.min(Math.max(0,shine),1),"rgba(255,255,255,"+opacity+")");
  bgGrad.addColorStop(1,"rgba(255, 255, 255,0.05)");
  //ui.strokeStyle = "rgba(255,255,255,0.13)";
  bg2.strokeStyle = bgGrad;
  bg2.beginPath();
  for (let i = 0; i < 60; i++) {
    bg2.moveTo(0 + (i * 30), 0);
    bg2.lineTo(0 + (i * 30), 750);
    bg2.moveTo(0, 0 + (i * 30));
    bg2.lineTo(1200, 0 + (i * 30));
  }
  bg2.stroke();

  ui.fillRect(30, 60, 120, 60);
  ui.strokeRect(30, 60, 120, 60);
  ui.fillRect(180, 60, 120, 60);
  ui.strokeRect(180, 60, 120, 60);
  ui.strokeStyle = inUseStroke;
  if (saveOrLoad === "load") {
    ui.strokeRect(27,57,126,66);
  }
  else {
    ui.strokeRect(177,57,126,66);
  }

  // draw custom controller binding boxes
  for (let i = 0; i < 4; i++) {
    if (customInteract !== 2*i ) {
      ui.fillStyle = baseFill;
      ui.strokeStyle = baseStroke;
    }
    else {
      ui.fillStyle = fillColour(customState);
      ui.strokeStyle = strokeColour(customState);
    }
    ui.fillRect(30, 150+90*i, 120, 60);
    ui.strokeRect(30, 150+90*i, 120, 60);
    if (customInUse === 2*i) {
      ui.strokeStyle = inUseStroke;
      ui.strokeRect(27,147+90*i,126,66);
    }
    if (customInteract !== 2*i+1 ) {
      ui.fillStyle = baseFill;
      ui.strokeStyle = baseStroke;
    }
    else {
      ui.fillStyle = fillColour(customState);
      ui.strokeStyle = strokeColour(customState);
    }
    ui.fillRect(180, 150+90*i, 120, 60);
    ui.strokeRect(180, 150+90*i, 120, 60);
    if (customInUse === 2*i+1) {
      ui.strokeStyle = inUseStroke;
      ui.strokeRect(177,147+90*i,126,66);
    }
  }

  ui.font = "700 36px Arial";
  ui.textAlign = "center";
  ui.fillStyle = "rgba(255,255,255,0.8)";
  ui.fillText("Center", 1035, 190);
  ui.fillText("Reset" , 1035, 280);
  ui.fillText("Quit"  , 1035, 370);
  ui.font = "700 28px Arial";
  ui.fillText("Load" , 90, 100);
  ui.fillText("Save" , 240, 100);
  ui.fillText("Default" , 90, 190);
  ui.font = "700 20px Arial";
  ui.fillText("Custom 1", 240, 186);
  for (let i = 1; i < 4; i++) {
    ui.fillText("Custom "+(2*i),90,186+90*i);
    ui.fillText("Custom "+(2*i+1),240,186+90*i);
  }

  ui.fillStyle = fillColour(centerState);
  ui.strokeStyle = strokeColour(centerState);
  ui.fillRect(960, 150, 150, 60);
  ui.strokeRect(960, 150, 150, 60);
  ui.fillStyle = fillColour(resetState);
  ui.strokeStyle = strokeColour(resetState);
  ui.fillRect(960, 240, 150, 60);
  ui.strokeRect(960, 240, 150, 60);
  ui.fillStyle = fillColour(exitState);
  ui.strokeStyle = strokeColour(exitState);
  ui.fillRect(960,330, 150, 60);
  ui.strokeRect(960,330, 150, 60);

  const canvas = document.getElementById('uiCanvas');
  const context = canvas.getContext('2d');
  canvas.addEventListener('mousemove', hoverFunction);
  canvas.addEventListener('mousedown', pressFunction);
  canvas.addEventListener('click'    , clickFunction);
}

function hoverFunction (e) {
  const x = e.offsetX;
  const y = e.offsetY;
  if (x >= 30 && x <= 150) {
    centerState = "none";
    resetState = "none";
    exitState = "none";
    if (y >= 60 && y <= 120) {
      if (customState === "none") {
        sounds.menuSelect.play();
        customState = "highlight";
      }
      customInteract = -2;
    }
    else if (y >= 150 && y <= 210) {
      if (customState === "none") {
        sounds.menuSelect.play();
        customState = "highlight";
      }
      customInteract = 0;
    }
    else if (y >= 240 && y <= 300) {
      if (customState === "none") {
        sounds.menuSelect.play();
        customState = "highlight";
      }
      customInteract = 2;
    }
    else if (y >= 330 && y <= 390) {
      if (customState === "none") {
        sounds.menuSelect.play();
        customState = "highlight";
      }
      customInteract = 4;
    }
    else if (y >= 420 && y <= 480) {
      if (customState === "none") {
        sounds.menuSelect.play();
        customState = "highlight";
      }
      customInteract = 6;
    }
    else {
      customState = "none";
      customInteract = null;
    }
  }
  else if (x >= 180 && x <= 300) {
    centerState = "none";
    resetState = "none";
    exitState = "none";
    if (y >= 60 && y <= 120) {
      if (customState === "none") {
        sounds.menuSelect.play();
        customState = "highlight";
      }
      customInteract = -1;
    }
    else if (y >= 150 && y <= 210) {
      if (customState === "none") {
        sounds.menuSelect.play();
        customState = "highlight";
      }
      customInteract = 1;
    }
    else if (y >= 240 && y <= 300) {
      if (customState === "none") {
        sounds.menuSelect.play();
        customState = "highlight";
      }
      customInteract = 3;
    }
    else if (y >= 330 && y <= 390) {
      if (customState === "none") {
        sounds.menuSelect.play();
        customState = "highlight";
      }
      customInteract = 5;
    }
    else if (y >= 420 && y <= 480) {
      if (customState === "none") {
        sounds.menuSelect.play();
        customState = "highlight";
      }
      customInteract = 7;
    }
    else {
      customState = "none";
      customInteract = null;
    }
  }
  else if (x >= 960 && x <= 1110) {
    customState = "none";
    customInteract = null;
    if (y >= 150 && y <= 210) {
      if (centerState === "none") {
        sounds.menuSelect.play();
        centerState = "highlight";
      }
      resetState = "none";
      exitState = "none";
    }
    else if (y >= 240 && y <= 300) {
      centerState = "none";
      if (resetState === "none") {
        sounds.menuSelect.play();
        resetState = "highlight";
      }
      exitState = "none";
    }
    else if (y >= 330 && y <= 390) {
      centerState = "none";
      resetState = "none";
      if (exitState === "none") {
        sounds.menuSelect.play();
        exitState = "highlight";
      }
    }
    else {
      centerState = "none";
      exitState = "none";
      resetState = "none";
    }
  }
  else {
    customState = "none";
    customInteract = null;
    centerState = "none";
    exitState = "none";
    resetState = "none";
  }
}

function pressFunction (e) {
  const x = e.offsetX;
  const y = e.offsetY;
  if (x >= 30 && x <= 150) {
    if (y >= 60 && y <= 120) {
      customState = "pressed";
      customInteract = -2;
    }
    else if (y >= 150 && y <= 210) {
      customState = "pressed";
      customInteract = 0;
    }
    else if (y >= 240 && y <= 300) {
      customState = "pressed";
      customInteract = 2;
    }
    else if (y >= 330 && y <= 390) {
      customState = "pressed";
      customInteract = 4;
    }
    else if (y >= 420 && y <= 480) {
      customState = "pressed";
      customInteract = 6;
    }
  }
  else if (x >= 180 && x <= 300) {
    if (y >= 60 && y <= 120) {
      customState = "pressed";
      customInteract = -1;
    }
    else if (y >= 150 && y <= 210) {
      customState = "pressed";
      customInteract = 1;
    }
    else if (y >= 240 && y <= 300) {
      customState = "pressed";
      customInteract = 3;
    }
    else if (y >= 330 && y <= 390) {
      customState = "pressed";
      customInteract = 5;
    }
    else if (y >= 420 && y <= 480) {
      customState = "pressed";
      customInteract = 7;
    }
  }
  else if (x >= 960 && x <= 1110) {
    if (y >= 150 && y <= 210) {
      centerState = "pressed";
    }
    else if (y >= 240 && y <= 300) {
      resetState = "pressed";
    }
    else if (y >= 330 && y <= 390) {
      exitState = "pressed";
    }
  }
}

function clickFunction (e) {
  const x = e.offsetX;
  const y = e.offsetY;
  if (x >= 30 && x <= 150) {
    if (y >= 60 && y <= 120) {
      saveOrLoad = "load";
    }
    else if (y >= 150 && y <= 210) {
      setClickObjectNumber(0);
      setClickObject(saveOrLoad+"Custom");
    }
    else if (y >= 240 && y <= 300) {
      setClickObjectNumber(2);
      setClickObject(saveOrLoad+"Custom");
    }
    else if (y >= 330 && y <= 390) {
      setClickObjectNumber(4);
      setClickObject(saveOrLoad+"Custom");
    }
    else if (y >= 420 && y <= 480) {
      setClickObjectNumber(6);
      setClickObject(saveOrLoad+"Custom");      
    }
  }
  else if (x >= 180 && x <= 300) {
    if (y >= 60 && y <= 120) {
      saveOrLoad = "save";
    }
    if (y >= 150 && y <= 210) {
      setClickObjectNumber(1);
      setClickObject(saveOrLoad+"Custom");      
    }
    else if (y >= 240 && y <= 300) {
      setClickObjectNumber(3);
      setClickObject(saveOrLoad+"Custom");      
    }
    else if (y >= 330 && y <= 390) {
      setClickObjectNumber(5);
      setClickObject(saveOrLoad+"Custom");      
    }
    else if (y >= 420 && y <= 480) {
      setClickObjectNumber(7);
      setClickObject(saveOrLoad+"Custom");      
    }
  }
  else if (x >= 960 && x <= 1110) {
    if (y >= 150 && y <= 210) {
      setClickObject("center");
    }
    else if (y >= 240 && y <= 300) {      
      setClickObject("reset");
    }
    else if (y >= 330 && y <= 390) {
      sounds.menuSelect.play();
      setClickObject("exit");
    }
  }
}