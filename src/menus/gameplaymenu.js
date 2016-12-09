import {player, changeGamemode, setCookie, ports, bg1, fg1, clearScreen,bg2, shine,ui, layers, getCookie, setShine,
    addShine
} from "main/main";
import {gameSettings} from "settings";
import {sounds} from "main/sfx";
import {stickHold, stickHoldEach, increaseStick, resetStick} from "menus/menu";
/* eslint-disable */

export let menuIndex = [0,0];
export var menuVOptions =  4;
export var menuHOptions = [0,0,0,0,3];
export let menuMove = false;
export function getGameplayCookies (){
  var keys = Object.keys(gameSettings);
  for (var j = 0; j < keys.length; j++) {
    var c = getCookie(keys[j]);
    if (c != null && c != undefined && c != "null") {
      gameSettings[keys[j]] = Number(c);
    }
  }
}
export function gameplayMenuControls (i, input){
  var menuMove = false;
  if (input[0].b && !input[1].b) {
    sounds.menuBack.play();
    input[i][1].b = true;
    var keys = Object.keys(gameSettings);
    for (var j = 0; j < keys.length; j++) {
      setCookie(keys[j], gameSettings[keys[j]], 36500);
    }
    changeGamemode(1);
  } else if (input[0].a && !input[1].a) {
    sounds.menuSelect.play();
    switch (menuIndex[0]) {
      case 0:
        gameSettings.turbo ^= true;
        break;
      case 1:
        gameSettings.lCancelType++;
        if (gameSettings.lCancelType > 2) {
          gameSettings.lCancelType = 0;
        }
        break;
      case 2:
        gameSettings.flashOnLCancel ^= true;
        break;
      case 3:
        gameSettings.everyCharWallJump ^= true;
        break;
      case 4:
        gameSettings["tapJumpOffp" + (menuIndex[1] + 1)] ^= true;
      default:
        break;
    }
  } else if (input[0].lsY > 0.7 && !(Math.abs(input[0].lsX >= 0.7))) {
    stickHoldEach[i] = true;
    if (stickHold == 0) {
      menuIndex[0]--;
      if (menuIndex[1] > menuHOptions[menuIndex[0]]) {
        menuIndex[1] = menuHOptions[menuIndex[0]];
      }
      menuMove = true;
      increaseStick();
    } else {
      increaseStick();
      if (stickHold % 10 == 0){
        menuIndex[0]--;
        if (menuIndex[1] > menuHOptions[menuIndex[0]]) {
          menuIndex[1] = menuHOptions[menuIndex[0]];
        }
        menuMove = true;
      }
    }
  } else if (input[0].lsY < -0.7 &&  !(Math.abs(input[0].lsX >= 0.7))) {
    stickHoldEach[i] = true;
    if (stickHold == 0) {
      menuIndex[0]++;
      if (menuIndex[1] > menuHOptions[menuIndex[0]]) {
        menuIndex[1] = menuHOptions[menuIndex[0]];
      }
      menuMove = true;
      increaseStick();
    } else {
      increaseStick();
      if (stickHold % 10 == 0){
        menuIndex[0]++;
        if (menuIndex[1] > menuHOptions[menuIndex[0]]) {
          menuIndex[1] = menuHOptions[menuIndex[0]];
        }
        menuMove = true;
      }
    }
    } else if (player[i].inputs.lStickAxis[0].x > 0.7 && !(Math.abs(player[i].inputs.lStickAxis[0].y >= 0.7))) {
    stickHoldEach[i] = true;
    if (stickHold == 0) {
      menuIndex[1]++;
      //if (menuIndex[1] > menuHOptions[menuIndex[0]]) {
      //  menuIndex[1] = menuHOptions[menuIndex[0]];
      //}
      menuMove = true;
      increaseStick();
    } else {
      increaseStick();
      if (stickHold % 10 == 0){
        menuIndex[1]++;
        //if (menuIndex[1] > menuHOptions[menuIndex[0]]) {
        //  menuIndex[1] = menuHOptions[menuIndex[0]];
        //}
        menuMove = true;
      }
    }
    } else if (player[i].inputs.lStickAxis[0].x < -0.7 && !(Math.abs(player[i].inputs.lStickAxis[0].y >= 0.7))){
    if (stickHold == 0) {
      menuIndex[1]--;
      //if (menuIndex[1] > menuHOptions[menuIndex[0]]) {
      //  menuIndex[1] = menuHOptions[menuIndex[0]];
      //}
      menuMove = true;
      increaseStick();
    } else {
      increaseStick();
      if (stickHold % 10 == 0){
        menuIndex[1]--;
        //if (menuIndex[1] > menuHOptions[menuIndex[0]]) {
        //  menuIndex[1] = menuHOptions[menuIndex[0]];
        //}
        menuMove = true;
      }
    }
  } else {
    stickHoldEach[i] = false;
    if (i == ports - 1) {
      var stickHoldAll = false;
      for (var j = 0; j < ports; j++) {
        if (stickHoldEach[j]) {
          stickHoldAll = true;
          break;
        }
      }
      if (!stickHoldAll){
        resetStick();
      }
    }
  }
  if (menuMove) {
	menuMove = false;
    sounds.menuSelect.play();
	if (menuIndex[0] <	 0) {
		menuIndex[0] = menuVOptions;
	} else if (menuIndex[0] > menuVOptions) {
		menuIndex[0] = 0;
	}
	console.log("index[0]: " + menuIndex[0]);
	console.log("index[1]: " + menuIndex[1]);
	if (menuIndex[1] > menuHOptions[menuIndex[0]]) {
	  menuIndex[1] = 0;
	} else if (menuIndex[1] < 0) {
	  menuIndex[1] = menuHOptions[menuIndex[0]];
	}
  }
}

export function drawGameplayMenuInit (){
  var bgGrad =bg1.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgb(11, 65, 39)");
  bgGrad.addColorStop(1,"rgb(8, 20, 61)");
  bg1.fillStyle=bgGrad;
  bg1.fillRect(0,0,layers.BG1.width,layers.BG1.height);
  fg1.textAlign = "center";
  fg1.fillStyle = "rgba(255, 255, 255, 0.65)";
  fg1.font = "italic 900 80px Arial";
  fg1.fillText("Gameplay", 600, 100);
  fg1.font = "italic 900 50px Arial";
  fg1.textAlign = "start";
  fg1.fillText("Turbo Mode", 75, 275);
  fg1.fillText("L-Cancel", 75, 335);
  fg1.fillText("Flash on L-Cancel", 75, 395);
  fg1.fillText("Everyone Walljumps",75,465);
  fg1.fillText("Tapjump off", 75, 535);
}

export function drawGameplayMenu (){
  clearScreen();
  fg1.lineWidth = 3;
  addShine(0.01);
  if (shine > 1.8){
    setShine(-0.8);
  }
  var opacity = (shine < 0) ? (0.05 + (0.25 / 0.8) * (0.8 + shine)) : ((shine > 1) ? (0.3 - (0.25 / 0.8) * (shine - 1)) :
    0.3);
  var bgGrad = bg2.createLinearGradient(0, 0, 1200, 750);
  bgGrad.addColorStop(0, "rgba(255, 255, 255,0.05)");
  bgGrad.addColorStop(Math.min(Math.max(0, shine), 1), "rgba(255,255,255," + opacity + ")");
  bgGrad.addColorStop(1, "rgba(255, 255, 255,0.05)");
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
  for (let i = 0; i < menuVOptions + 1; i++) {
    for (let x = 0; x < menuHOptions[i] + 1; x++) {
    ui.strokeStyle = "rgba(255, 255, 255, 0.72)";
    if (i == menuIndex[0] && x == menuIndex[1]) {
      ui.fillStyle = "rgba(255, 255, 255, 0.6)";
    } else {
      ui.fillStyle = "rgba(255, 255, 255, 0.2)";
    }
    if (menuHOptions[i] > 0) {
      ui.fillRect(650 + (x * (300 / (menuHOptions[i] + 1))), 235 + i * 60, (300 / (menuHOptions[i] + 1)), 50);
      ui.strokeRect(650 + (x * (300 / (menuHOptions[i] + 1))), 235 + i * 60, (300 / (menuHOptions[i] + 1)), 50);
    } else {
      ui.fillRect(650,235 + i * 60, 300, 50);
      ui.strokeRect(650,235 + i * 60, 300, 50);
    }
    ui.font = "900 " + 30 / (Math.min(1,menuHOptions[i] - 1)) + "px Arial";
    ui.textAlign = "center";
    ui.fillStyle = "white";
    ui.strokeStyle = "black";
    var text = "";
    switch (i) {
      case 0:
        text = gameSettings.turbo ? "On" : "Off";
        break;
      case 1:
        text = gameSettings.lCancelType ? (gameSettings.lCancelType == 1 ? "Auto" : "Smash 64") : "Normal";
        break;
      case 2:
        text = gameSettings.flashOnLCancel ? "On" : "Off";
        break;
	    case 3:
	      text = gameSettings.everyCharWallJump ? "On" : "Off";
		    break;
      case 4:
          text = gameSettings["tapJumpOffp" + (x + 1)] ? "On" : "Off";
      default:
        break;
    }
    if (menuHOptions[i] == 0) {
      ui.strokeText(text, 800, 270 + i * 60);
      ui.fillText(text, 800, 270 + i * 60);
    } else {
      ui.strokeText(text, (650 + (x * (300 / (menuHOptions[i] + 1)))) + ((300 / (menuHOptions[i] + 1)) / 2), 270 + i * 60);
      ui.fillText(text, (650 + (x * (300 / (menuHOptions[i] + 1)))) + ((300 / (menuHOptions[i] + 1)) / 2), 270 + i * 60);
    }
    }
  }

}
