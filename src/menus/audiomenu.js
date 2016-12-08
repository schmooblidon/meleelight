import {player, setCookie, changeGamemode, ports, bg1, bg1 as fg1, layers, fg2 as bg2, bg1 as ui, clearScreen, shine,
    getCookie
    , addShine
    , setShine
} from "main/main";
import {sounds} from "main/sfx";
import {twoPi} from "main/render";
import {stickHoldEach, stickHold, increaseStick, resetStick} from "menus/menu";
import {music} from "../main/sfx";
/* eslint-disable */

// sounds, music
export const masterVolume = [0.5,0.3];
const audioMenuNames = ["Sounds","Music"];
let audioMenuSelected = 0;
export function audioMenuControls (i){
  let menuMove = false;
  let audioLevelMoveUp = false;
  let audioLevelMoveDown = false;
  if (player[i].inputs.b[0] && !player[i].inputs.b[1]){
	fg1.textAlign = "left";
    sounds.menuBack.play();
    player[i].inputs.b[1] = true;
    setCookie("soundsLevel", masterVolume[0], 36500);
    setCookie("musicLevel", masterVolume[1], 36500);
    changeGamemode(1);
  } else if (player[i].inputs.lStickAxis[0].y > 0.7) {
    stickHoldEach[i] = true;
    if (stickHold == 0) {
      audioMenuSelected--;
      menuMove = true;
      increaseStick();
    }
    else {
      increaseStick();
      if (stickHold % 10 == 0){
        audioMenuSelected--;
        menuMove = true;
      }
    }
  } else if (player[i].inputs.lStickAxis[0].y < -0.7) {
    stickHoldEach[i] = true;
    if (stickHold == 0) {
      audioMenuSelected++;
      menuMove = true;
      increaseStick();
    }
    else {
      increaseStick();
      if (stickHold % 10 == 0){
        audioMenuSelected++;
        menuMove = true;
      }
    }
  } else if (player[i].inputs.lStickAxis[0].x > 0.7) {
    stickHoldEach[i] = true;
    if (stickHold == 0) {
      audioLevelMoveUp = true;
      increaseStick();
    }
    else {
      increaseStick();
      if (stickHold % 10 == 0){
        audioLevelMoveUp = true;
      }
    }
  } else if (player[i].inputs.lStickAxis[0].x < -0.7) {
    stickHoldEach[i] = true;
    if (stickHold == 0) {
      audioLevelMoveDown = true;
      increaseStick();
    }
    else {
      increaseStick();
      if (stickHold % 10 == 0){
        audioLevelMoveDown = true;
      }
    }
  } else {
    stickHoldEach[i] = false;
    if (i == ports-1){
      let stickHoldAll = false;
      for (let j=0; j<ports; j++){
        if (stickHoldEach[j]){
          stickHoldAll = true;
          break;
        }
      }
      if (!stickHoldAll){
          resetStick()
      }
    }
  }
  if (menuMove) {
    sounds.menuSelect.play();
    if (audioMenuSelected == -1) {
      audioMenuSelected = 1;
    } else if (audioMenuSelected == 2) {
      audioMenuSelected = 0;
    }
  } else if (audioLevelMoveUp) {
    masterVolume[audioMenuSelected] += 0.1;
    if (masterVolume[audioMenuSelected] > 1) {
      masterVolume[audioMenuSelected] = 1;
    } else {
	  sounds.menuSelect.play();
	}
  } else if (audioLevelMoveDown) {
    masterVolume[audioMenuSelected] -= 0.1;
    if (masterVolume[audioMenuSelected] < 0) {
      masterVolume[audioMenuSelected] = 0;
    } else { 
	  sounds.menuSelect.play();
	}
  }
  if (audioLevelMoveDown || audioLevelMoveUp) {
    if (audioMenuSelected == 0) {
      changeVolume(sounds, masterVolume[0], 0);
    } else {
      changeVolume(music, masterVolume[1], 1);
    }
  }
}

export function drawAudioMenuInit (){
  const bgGrad = bg1.createLinearGradient(0, 0, 1200, 750);
  bgGrad.addColorStop(0,"rgb(11, 65, 39)");
  bgGrad.addColorStop(1,"rgb(8, 20, 61)");
  bg1.fillStyle=bgGrad;
  bg1.fillRect(0,0,layers.BG1.width,layers.BG1.height);

  bg1.fillStyle = "rgba(0,0,0,0.5)";
  fg1.lineWidth = 10;
  fg1.strokeStyle = "rgba(255, 255, 255, 0.3)";
  fg1.strokeRect(95, 125, 1010, 650);
  fg1.fillRect(95, 125, 1010, 650);
  fg1.textAlign = "center";
  fg1.fillStyle = "rgba(255, 255, 255, 0.5)";
  fg1.font = "italic 900 80px Arial";
  fg1.fillText("Audio", 600, 100);
  fg1.font = "italic 900 50px Arial";
  fg1.fillText("Sounds", 225, 275);
  fg1.fillText("Music", 225, 525);
}

export function drawAudioMenu (){
  clearScreen();
  drawAudioMenuInit();
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
  for (var i = 0; i < 2; i++) {
    if (i == audioMenuSelected) {
      //ui.fillStyle = "rgba(255, 255, 255, 0.7)";
      ui.fillStyle = "rgba(255, 255, 255,0.3)";
    } else {
      ui.fillStyle = "rgba(255, 255, 255,0.1)";
      //ui.fillStyle = "rgba(0, 0, 0, 0.8)";
    }
    ui.beginPath();
    ui.moveTo(200, 350 + i * 250);
    ui.lineTo(1000, 200 + i * 250);
    ui.lineTo(1000, 350 + i * 250);
    ui.closePath();
    ui.fill();
    if (i == 0) {	
      var bgGrad = ui.createLinearGradient(200, 0, 1200, 0);
      bgGrad.addColorStop(0, "rgb(12, 75, 13)");
      bgGrad.addColorStop(1, "rgb(15, 75, 255)");
      ui.fillStyle = bgGrad;
    } else {
      var bgGrad = ui.createLinearGradient(200, 0, 1200, 0);
      bgGrad.addColorStop(0, "rgb(11, 13, 65)");
      bgGrad.addColorStop(1, "rgb(255, 15, 73)");
      ui.fillStyle = bgGrad;
    }
    ui.beginPath();
    ui.moveTo(200, 350 + i * 250);
    ui.lineTo(200 + (masterVolume[i] * 800), 350 + i * 250 - (masterVolume[i] * 150));
    ui.lineTo(200 + (masterVolume[i] * 800), 350 + i * 250);
    ui.closePath();
    ui.fill();
    if (i == audioMenuSelected) {
      ui.fillStyle = "rgba(255, 255, 255, 1)";
    } else {
      ui.fillStyle = "rgba(136, 136, 136, 1)";
    }
    ui.beginPath();
    ui.arc(200 + (masterVolume[i] * 800), 350 + i * 250 - (masterVolume[i] * 75), 15 + (masterVolume[i] * 65), 0,
      twoPi);
    ui.closePath();
    ui.fill();
  }

}

export function getAudioCookies (){
  const s = getCookie("soundsLevel");
  if (s != null && s != undefined && s != "null"){
    masterVolume[0] = Number(s);
    changeVolume(sounds, masterVolume[0], 0);
  }
  const m = getCookie("musicLevel");
  if (m != null && m != undefined && m != "null"){
    masterVolume[1] = Number(m);
    changeVolume(music, masterVolume[1], 1);
  }
}
