/* eslint-disable */
import {Vec2D,Box2D,framesData} from "main/characters";
import {choosingTag, drawCSSInit, cssControls, drawCSS} from 'menus/css';
import {playerObject} from 'main/player';
import {keyMap} from 'settings';
import {drawStartUp} from 'menus/startup';
import {menuMove, drawMainMenuInit, drawMainMenu} from "menus/menu";
import {sounds} from "main/sfx";
import {drawStartScreenInit, drawStartScreen} from "menus/startscreen";
import {drawBackgroundInit, drawStageInit, drawBackground, drawStage, setBackgroundType} from "stages/stagerender";
import {drawSSSInit, sssControls, drawSSS} from "menus/stageselect";
import {drawAudioMenuInit, masterVolume, drawAudioMenu, audioMenuControls, getAudioCookies} from "menus/audiomenu";
import {drawGameplayMenuInit, drawGameplayMenu, gameplayMenuControls, getGameplayCookies} from "menus/gameplaymenu";
import {drawKeyboardMenuInit, keyboardMenuControls, drawKeyboardMenu, getKeyboardCookie} from "menus/keyboardmenu";
import {drawCreditsInit, credits, drawCredits} from "menus/credits";
import {renderForeground, renderPlayer, renderOverlay, resetLostStockQueue} from "main/render";
import {vfx, dVfx, setTransparency, transparency} from "main/vfx";
import {aS} from "physics/actionStateShortcuts";
import {executeHits, hitDetect, checkPhantoms, resetHitQueue, setPhantonQueue} from "physics/hitDetection";
import {
  targetPlayer, targetHitDetection, targetTimerTick, targetTesting, medalsEarned,
  targetRecords, targetsDestroyed, targetStagePlaying , getTargetCookies , giveMedals, medalTimes
} from "target/targetplay";
import {tssControls, drawTSS, drawTSSInit, getTargetStageCookies} from "menus/targetselect";
import {targetBuilder, targetBuilderControls, renderTargetBuilder} from "target/targetbuilder";
import {destroyArticles, executeArticles, articlesHitDetection, executeArticleHits, renderArticles, resetAArticles} from "physics/article";
import {stages} from "stages/stages";
import {runAI} from "main/ai";
import {physics} from "physics/physics";
import $ from 'jquery';
import {controllerIDNumberFromGamepadID, controllerNameFromIDnumber, axis, button, controllerMaps, pollInputs, nullInputs, scaleToUnitAxes, custcent} from "main/input";
/*globals performance*/

export const player = [0,0,0,0];
export const renderTime = [10,0,100,0];
export const gamelogicTime = [5,0,100,0];
export const framerate = [0,0,0];
export var cS = [0,0,0,0];
export let vfxQueue = [];
export var shine = 0.5;

export let endTargetGame = false;

export let creditsPlayer = 0;

let gameEnd = false;
const attemptingControllerReset = [false,false,false,false];
let keyboardOccupied = false;



window.mType = [0, 0, 0, 0];


export const mType = [0,0,0,0];

export const currentPlayers = [];

export const playerAmount = 0;

export const playerType = [-1,-1,-1,-1];

export const cpuDifficulty = [3,3,3,3];

export let ports = 0;
export const activePorts = [];

export let playing = false;

export let frameByFrame = false;
export let frameByFrameRender = false;

export let findingPlayers = true;

export let showVfx = true;
export let showDebug = false;

export let gameMode = 20;
// 20:Startup
// 13:Data Menu
// 12:Keyboard Controls
// 11:Gameplay Menu
// 10:Sound Menu
// 9: -
// 8: -
// 7:Target Select
// 6:Stage Select (VS)
// 5:Target Playing
// 4:Target Builder
// 3:Playing (VS)
// 2:CSS
// 1:Main Menu
// 0:Title Screen
export let versusMode = 0;

export const randomTags = ["NEO!","SELF","NOVA","PNDA","Panda","LFFN","Scorp","AZ","AXE","Tempo","TMPO","[A]rmada","WBALLZ","Westballz","PPMD","Kreygasm","M2K","Mang0","USA","SCAR","TOPH","(.Y.)","HBOX","HungryBox","PLUP","Shroomed","SFAT","Wizz","Lucky","S2J","SilentWolf","aMSa","S2J","Hax$"];

export const palettes = [["rgb(250, 89, 89)","rgb(255, 170, 170)","rgba(255, 206, 111, ","rgb(244, 68, 68)","rgba(255, 225, 167, "],
["rgb(4, 255, 134)","rgb(154, 254, 170)","rgba(252, 95, 95, ","rgb(255, 182, 96)","rgba(254, 141, 141, "],
["rgb(5, 195, 255)","rgb(121, 223, 255)","rgba(218, 96, 254, ","rgb(231, 134, 255)","rgba(230, 144, 255, "],
["rgb(255, 187, 70)","rgb(248, 255, 122)","rgba(80, 182, 255, ","rgb(255, 142, 70)","rgba(139, 203, 249, "],
["rgb(177, 89, 255)","rgb(203, 144, 255)","rgba(144, 255, 110, ","rgb(247, 126, 250)","rgba(190, 255, 170, "],
["rgb(182, 131, 70)","rgb(252, 194, 126)","rgba(47, 186, 123, ","rgb(255, 112, 66)","rgba(111, 214, 168, "],
["rgb(166, 166, 166)","rgb(255, 255, 255)","rgba(255, 255, 255, ","rgb(191, 119, 119)","rgba(175, 172, 172, "]];


export const hasTag = [false,false,false,false];
export const tagText = ["","","",""];

export const pPal = [0,1,2,3];

export const costumeTimeout = [];

export const colours = ["rgba(4, 255, 82, 0.62)","rgba(117, 20, 255, 0.63)","rgba(255, 20, 20, 0.63)","rgba(255, 232, 20, 0.63)"];

export let pause = [[true,true],[true,true],[true,true],[true,true]];
export let frameAdvance = [[true,true],[true,true],[true,true],[true,true]];

export const startingPoint = [[-50,50],[50,50],[-25,5],[25,5]];
export const startingFace = [1,-1,1,-1];

export const ground = [[-68.4,0],[68.4,0]];

export const platforms = [[[-57.6,27.2],[-20,27.2]],[[20,27.2],[57.6,27.2]],[[-18.8,54.4],[18.8,54.4]]];

export const wallsL = [[[-68.4,0],[-68.4,-108.8]]];
export const wallsR = [[[68.4,0],[68.4,-108.8]]];

export const edges = [[[-68.4,0],[-63.4,0]],[[68.4,0],[63.4,0]]];

//edgeOffset = [[-71.3,-23.7],[71.3,-23.7]];
export const edgeOffset = [[-2.9,-23.7],[2.9,-23.7]];

export const edgeOrientation = [1,-1];

export const respawnPoints = [[-50,50,1],[50,50,-1],[25,35,1],[-25,35,-1]];

export var stage = {
  box : [new Box2D([-68.4,-108.8],[68.4,0])],
  platform : [[new Vec2D(-57.6,27.2),new Vec2D(-20,27.2)],[new Vec2D(20,27.2),new Vec2D(57.6,27.2)],[new Vec2D(-18.8,54.4),new Vec2D(18.8,54.4)]],
  ground : [[new Vec2D(-68.4,0),new Vec2D(68.4,0)]],
  ceiling : [[new Vec2D(-68.4,-108.8),new Vec2D(68.4,-108.8)]],
  wallL : [[new Vec2D(-68.4,0),new Vec2D(-68.4,-108.8)]],
  wallR : [[new Vec2D(68.4,0),new Vec2D(68.4,-108.8)]],
  startingPoint : [new Vec2D(-50,50),new Vec2D(50,50),new Vec2D(-25,5),new Vec2D(25,5)],
  startingFace : [1,-1,1,-1],
  respawnPoints : [new Vec2D(-50,50),new Vec2D(50,50),new Vec2D(-25,35),new Vec2D(25,35)],
  respawnFace : [1,-1,1,-1],
  blastzone : new Box2D([-224,-108.8],[224,200]),
  ledge : [[0,0],[0,1]],
  ledgePos : [new Vec2D(-68.4,0),new Vec2D(68.4,0)],
  scale : 4.5,
  offset : [600,480],
};

export var stageSelect = 0;

export function setStageSelect (val){
  stageSelect = val;
}

export const blastzone = new Box2D([-224,200],[224,-108.8]);

export let starting = true;
export function setStarting(val){
    starting = val;
}
export let startTimer = 1.5;
export function setStartTimer (val){
  startTimer = val;
}
//matchTimer = 5999.99;
export let matchTimer = 480;

export function addMatchTimer (val){
  matchTimer += val;
}
export function setMatchTimer (val){
  matchTimer = val;
}

export let usingLocalStorage = false;
if (typeof(Storage) !== "undefined") {
  // Code for localStorage/sessionStorage.
  usingLocalStorage = true;
  console.log("local storage works");
} else {
  // Sorry! No Web Storage support..
  console.log("local storage does not work");
}

export function setCookie (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var exp = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + exp;
    localStorage.setItem(cname, cvalue);
}
export function setVersusMode (val){
  versusMode = val;
}
export function getCookie (cname) {
  if (usingLocalStorage){
    return localStorage.getItem(cname);
  } else {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  }
}

export const keys = {};
export let keyBind = 0;
export let keyBinding = false;
export function setKeyBinding (val){
  keyBinding = val;
}
export function overrideKeyboardEvent (e){
  if (choosingTag == -1 && e.keyCode != 122 && e.keyCode != 116){
    switch(e.type){
      case "keydown":
        if (!keys[e.keyCode]) {
          keys[e.keyCode] = true;
          keyBind = e.keyCode;
          keyBinding = true;
          // do key down stuff here
        }
        break;
      case "keyup":
        delete(keys[e.keyCode]);
        // do key up stuff here
        break;
    }
    disabledEventPropagation(e);
    e.preventDefault();
    return false;
  } else {
    if (choosingTag > -1) {
      if (e.keyCode == 13) {
        switch (e.type) {
          case "keydown":
            keys[13] = true;
            break;
          case "keyup":
            delete(keys[13]);
            break;
          default:
            break;
        }
      }
    }
    return true;
  }
};

export function disabledEventPropagation (e){
  if(e){
    if(e.stopPropagation){
      e.stopPropagation();
    } else if(event){
       event.cancelBubble = true;
    }
  }
};

document.onkeydown = overrideKeyboardEvent;
document.onkeyup = overrideKeyboardEvent;

/*var keys = [];
export const onkeyup (e) {
  keys[e.keyCode]=false;
}
export const onkeydown (e) {
  keys[e.keyCode]=true;
}*/

export function SVG (tag)
{
   return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

/*if (Gamepad.supported) {
    console.log("gamepad supported");
} else {
    console.log("gamepad not supported");
}*/

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});
if (navigator.getGamepads) console.log(navigator.getGamepads());

export function matchTimerTick (){
  matchTimer -= 0.016667;

  if (dom.matchMinutes && dom.matchSeconds) {
    var sec = (matchTimer % 60).toFixed(2);
    dom.matchMinutes.innerHTML = Math.floor(matchTimer / 60);
    dom.matchSeconds.innerHTML = sec.length < 5 ? `0${sec}` : sec;
  }

  if (matchTimer <= 0) {
    finishGame();
  }
}

export function screenShake (kb){
  var seed = [Math.random(),Math.random(),Math.random(),Math.random()];
  fg1.translate(kb*0.1*seed[0],kb*0.1*seed[1]);
  setTimeout(function(){fg1.translate(-kb*0.05*seed[0],-kb*0.05*seed[1])},20);
  setTimeout(function(){fg1.translate(-kb*0.05*seed[0],-kb*0.05*seed[1]);fg1.translate(-kb*0.1*seed[2],-kb*0.1*seed[3])},40);
  setTimeout(function(){fg1.translate(kb*0.05*seed[2],kb*0.05*seed[3])},60);
  setTimeout(function(){fg1.translate(kb*0.05*seed[2],kb*0.05*seed[3])},80);
}

export function percentShake (kb,i){
  player[i].percentShake = new Vec2D(kb*0.1*Math.random(),kb*0.1*Math.random());
  setTimeout(function(){player[i].percentShake = new Vec2D(kb*0.05*Math.random(),kb*0.05*Math.random())},20);
  setTimeout(function(){player[i].percentShake = new Vec2D(-kb*0.1*Math.random(),-kb*0.1*Math.random())},40);
  setTimeout(function(){player[i].percentShake = new Vec2D(-kb*0.05*Math.random(),-kb*0.05*Math.random())},60);
  setTimeout(function(){player[i].percentShake = new Vec2D(0,0)},80);
}


export function findPlayers (){
  var gps = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  /*if (typeof gps != "undefined"){
    console.log(gps);
  }*/
  if (!keyboardOccupied) {
    if (gameMode < 2 || gameMode == 20) {
      if (keys[13] || keys[keyMap.s[0]] || keys[keyMap.s[1]]) {
        if (ports < 4) {
          changeGamemode(1);
          keyboardOccupied = true;
          sounds.menuForward.play();
          if (ports == 0) {
            music.menu.play("menuStart");
          }
          addPlayer(ports, 10);
        }
      }
    } else {
      if (keys[keyMap.a[0]] || keys[keyMap.a[1]]) {
        if (ports < 4) {
          keyboardOccupied = true;
          addPlayer(ports, 10);
        }
      }
    }
  }
  for (var i = 0; i < gps.length; i++) {
    var gamepad = navigator.getGamepads ? navigator.getGamepads()[i] : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() :
      null);
    if (typeof gamepad != "undefined" && gamepad != null) {
      var detected = false;
      var gType = 0;
      let gamepadIDnumber = controllerIDNumberFromGamepadID(gamepad.id);
      if (gamepadIDnumber == -1) {
        console.log("error: controller detected but not supported");
      } else {
        detected ^= true;
        gType = gamepadIDnumber;
        console.log("You are using ".concat(controllerNameFromIDnumber(gamepadIDnumber)));
      }
      if (detected) {
        if (gameMode < 2 || gameMode == 20) {
          if (gamepad.buttons[controllerMaps[gType][button.s]].pressed) {
            var alreadyIn = false;
            for (var k = 0; k < ports; k++) {
              if (currentPlayers[k] == i) {
                alreadyIn = true;
              }
            }
            if (!alreadyIn) {
              if (ports < 4) {
                changeGamemode(1);
                sounds.menuForward.play();
                if (ports == 0) {
                  music.menu.play("menuStart");
                }
                addPlayer(i, gType);
              }
            }
          }
        } else {
          if (gamepad.buttons[controllerMaps[gType][button.a]].pressed) {
            var alreadyIn = false;
            for (var k = 0; k < ports; k++) {
              if (currentPlayers[k] == i) {
                alreadyIn = true;
              }
            }
            if (!alreadyIn) {
              if (ports < 4) {
                addPlayer(i, gType);
              }
            }
          }
        }
      } else {
        console.log("No controller detected by browser");
      }
    }
  }
}


export function addPlayer (gamepad,gType){
  ports++;
  currentPlayers[ports - 1] = gamepad;
  playerType[ports - 1] = 0;
  mType[ports - 1] = gType;
}

export function togglePort (i){
  playerType[i]++;
  if (playerType[i] == 2) {
    playerType[i] = -1;
  }
  if (playerType[i] == 0 && ports <= i) {
    playerType[i] = 1;
  }
}

export function positionPlayersInCSS (){
  for (var i=0;i<4;i++){
      var x = (-80+i*50)*2/3;
      var y = -30;
      player[i].phys.pos = new Vec2D(x,y);
      player[i].phys.hurtbox = new Box2D([-4+x,18+y],[4+x,y]);
  }
}

// 20:Startup
// 13:Data Menu
// 12:Keyboard Controls
// 11:Gameplay Menu
// 10:Sound Menu
// 9: -
// 8: -
// 7:Target Select
// 6:Stage Select (VS)
// 5:Target Playing
// 4:Target Builder
// 3:Playing (VS)
// 2:CSS
// 1:Main Menu
// 0:Title Screen

export function changeGamemode (newGamemode){
  bg1.fillStyle = "black";
  bg1.fillRect(0, 0, layers.BG1.width, layers.BG1.height);
  fg1.clearRect(0, 0, layers.FG1.width, layers.FG1.height);
  gameMode = newGamemode;
  switch (newGamemode) {
    // TITLESCREEN
    case 0:
      drawStartScreenInit();
      break;
      // MAIN MENU
    case 1:
      $("#logoVid").remove();
      drawMainMenuInit();
      break;
      // CSS
    case 2:
      drawCSSInit();
      break;
      // Playing (VS)
    case 3:
      drawBackgroundInit();
      drawStageInit();
      break;
      // Target Builder
    case 4:
      break;
      // Target Playing
    case 5:
      drawBackgroundInit();
      drawStageInit();
      break;
      // Stage select (vs)
    case 6:
      drawSSSInit();
      break;
      // Target Select
    case 7:
      drawTSSInit();
      break;
      // sound menu
    case 10:
      drawAudioMenuInit();
      break;
      // gameplay menu
    case 11:
      drawGameplayMenuInit();
      break;
      // keyboard menu
    case 12:
      drawKeyboardMenuInit();
      break;
      // credits
    case 13:
      drawCreditsInit();
      break;
      // startup
    case 20:
      break;
    default:
      break;
  }
}


/*export const addPlayer (i,gType,pType){
  console.log(i,gType,pType);

  currentPlayers.push(i);
  if (pType == 0){
    ports++;
    mType[ports-1] = gType;
    playerType[ports-1] = pType;

    costumeTimeout.push(false);
    pPal.push(ports-1);
    buildPlayerObject(ports-1);
    player[playerAmount-1].phys.pos = new Vec2D(-100+25*(playerAmount=1),-40);
    player[ports-1].phys.face = 1;
    player[ports-1].actionState = 0;
    $("#currentPlayers").append('<div class="pBoxBox"><div class="playerBox" id="pBox'+(ports-1)+'" style="background-color:'+palettes[pPal[ports-1]][0]+';border:5px solid '+palettes[pPal[ports-1]][2]+'0.8)"><p>P'+ports+'<br><span class="cont">(Cont. '+i+')</span></p></div><div id="pTag'+(ports-1)+'" class="pTag"><textarea id="pTagEdit'+(ports-1)+'" class="pTagEdit" maxlength="10"></textarea></div></div>');
  }
  else {
    mType[i] = gType;

    costumeTimeout.push(false);
    pPal.push(i);
    buildPlayerObject(i);
    player[playerAmount-1].phys.pos = new Vec2D(-100+25*(playerAmount=1),-40);
    player[i].phys.face = 1;
    player[i].actionState = 0;
    $("#currentPlayers").append('<div class="pBoxBox"><div class="playerBox" id="pBox'+i+'" style="background-color:'+palettes[pPal[i]][0]+';border:5px solid '+palettes[pPal[i]][2]+'0.8)"><p>P'+(i+1)+'<br><span class="cont">(Cont. '+i+')</span></p></div><div id="pTag'+i+'" class="pTag"><textarea id="pTagEdit'+i+'" class="pTagEdit" maxlength="10"></textarea></div></div>');
  }
  playerAmount++;
}

export const removePlayer (i){
  playerType[i] = -1;
  playerAmount--;
}*/


window.interpretInputs = function(i, active) {
  let input = nullInputs;
  
  // the following block should be removed once the old input data is properly threaded through
  for (var k = 1; k < 8; k++) {
    input[k].lsX = player[i].inputs.lStickAxis[k-1].x;
    input[k].lsY = player[i].inputs.lStickAxis[k-1].y;
    input[k].rawX = player[i].inputs.rawlStickAxis[k-1].x;
    input[k].rawY = player[i].inputs.rawlStickAxis[k-1].y;
    input[k].csX = player[i].inputs.cStickAxis[k-1].x;
    input[k].csY = player[i].inputs.cStickAxis[k-1].y;
    input[k].lA = player[i].inputs.lAnalog[k-1];
    input[k].rA = player[i].inputs.rAnalog[k-1];
    input[k].s = player[i].inputs.s[k-1];
    input[k].z = player[i].inputs.z[k-1];
    input[k].a = player[i].inputs.a[k-1];
    input[k].b = player[i].inputs.b[k-1];
    input[k].x = player[i].inputs.x[k-1];
    input[k].y = player[i].inputs.y[k-1];
    input[k].r = player[i].inputs.r[k-1];
    input[k].l = player[i].inputs.l[k-1];
    input[k].dl = player[i].inputs.dpadleft[k-1];
    input[k].dd = player[i].inputs.dpaddown[k-1];
    input[k].dr = player[i].inputs.dpadright[k-1];
    input[k].du = player[i].inputs.dpadup[k-1];
  }
  
  input[0] = pollInputs(gameMode, frameByFrame, mType[i], i, currentPlayers[i], keys);

  pause[i][1] = pause[i][0];
  frameAdvance[i][1] = frameAdvance[i][0];

  if (mType[i] == 10) { // keyboard controls
    if (input[0].s || input[1].s ) {
      pause[i][0] = true;
    } else {
      pause[i][0] = false
    }
    if (input[0].z  || input[1].z ) {
      frameAdvance[i][0] = true;
    } else {
      frameAdvance[i][0] = false
    }
    if (frameAdvance[i][0] && !frameAdvance[i][1]) {
    frameByFrame = true;
    }
    if (active) {
      if (input[0].dl && !input[1].dl ) {
       player[i].showLedgeGrabBox ^= true;
      }
      if (input[0].dd && !input[1].dd) {
        player[i].showECB ^= true;
      }
      if (input[0].dr && !input[1].dr) {
        player[i].showHitbox ^= true;
      }
    }
    if ((input[0].a || input[1].a) && (input[0].l || input[1].l) && (input[0].r ||
         input[1].r) && (input[0].s || input[1].s)) {
      if (input[0].b || input[1].b) {
        startGame();
      } 
      else {
        endGame();
      }
    }
    
    interpretPause(i);
    
    if (showDebug) {
    $("#lsAxisX" + i).empty().append(input[0].lsX.toFixed(4));
    $("#lsAxisY" + i).empty().append(input[0].lsY.toFixed(4));
    $("#csAxisX" + i).empty().append(input[0].csX.toFixed(4));
    $("#csAxisY" + i).empty().append(input[0].csY.toFixed(4));
    $("#lAnalog" + i).empty().append(input[0].lA.toFixed(4));
    $("#rAnalog" + i).empty().append(input[0].rA.toFixed(4));
    }
  } 
  else { // gamepad controls
    
    if (input[0].a && input[0].l && input[0].r && input[0].s) {
      if (input[0].b) {
        startGame();
      } 
      else {
        endGame();
      }
    }
    
    if (( input[0].s && ! input[1].s) || input[0].du.pressed && gameMode == 5) {
      pause[i][0] = true;
    } else {
      pause[i][0] = false
    }
    if (input[0].z && ! input[1].z ) {
      frameAdvance[i][0] = true;
    } else {
      frameAdvance[i][0] = false
    }
    
    if (frameAdvance[i][0] && !frameAdvance[i][1] && !playing) {
    frameByFrame = true;
    }
    
    if (input[0].dl && !input[1].dl) {
      player[i].showLedgeGrabBox ^= true;
    }
    if (input[0].dd && !input[1].dd) {
      player[i].showECB ^= true;
    }
    if (input[0].dr && !input[1].dr) {
      player[i].showHitbox ^= true;
    }
    
    // Controller reset functionality
    if ((input[0].z || input[0].du) && input[0].x && input[0].y && !attemptingControllerReset[i]) {
      attemptingControllerReset[i] = true;
      setTimeout(function() {
        if (input[0].du && input[0].x && input[0].y) {
          custcent[i].ls = new Vec2D(input[0].lsX, input[0].lsY);
          custcent[i].cs = new Vec2D(input[0].lsX, input[0].lsY);
          custcent[i].l = input[0].lA;
          custcent[i].r = input[0].rA;
          console.log("Controller Reset!");
          $("#resetIndicator" + i).fadeIn(100);
          $("#resetIndicator" + i).fadeOut(500);
        }
        attemptingControllerReset[i] = false;
      }, 2000);
    }
    
    interpretPause(i);
    
    /* I can't deal with the following right now 
    
    for (var j = 0; j < 12; j++) {
      var bNum = j;
      if (mType[i] == 0) {
        if (bNum > 5) {
          bNum++;
        }
        if (bNum > 7) {
          bNum++;
        }
        if (bNum > 8) {
          bNum += 2;
        }
      }
      if (gamepad.buttons[bNum].pressed) { // this could cause problems if controller has undefined buttons
        $("#" + i + "button" + j).show();
      } else {
        $("#" + i + "button" + j).hide();
      }
    }
    
    */
    
        
    if (showDebug) {
    $("#lsAxisX" + i).empty().append(input[0].lsX.toFixed(4));
    $("#lsAxisY" + i).empty().append(input[0].lsY.toFixed(4));
    $("#csAxisX" + i).empty().append(input[0].csX.toFixed(4));
    $("#csAxisY" + i).empty().append(input[0].csY.toFixed(4));
    $("#lAnalog" + i).empty().append(input[0].lA.toFixed(4));
    $("#rAnalog" + i).empty().append(input[0].rA.toFixed(4));
    }
    
  }
  
  // the following block should be removed once the input data is properly threaded through and can be passed on
  for (var k = 0; k < 8; k++) {
    player[i].inputs.lStickAxis[k].x = input[k].lsX;
    player[i].inputs.lStickAxis[k].y = input[k].lsY;
    player[i].inputs.rawlStickAxis[k].x = input[k].rawX;
    player[i].inputs.rawlStickAxis[k].y = input[k].rawY;
    player[i].inputs.cStickAxis[k].x = input[k].csX;
    player[i].inputs.cStickAxis[k].y = input[k].csY;
    player[i].inputs.lAnalog[k] = input[k].lA;
    player[i].inputs.rAnalog[k] = input[k].rA;
    player[i].inputs.s[k] = input[k].s;
    player[i].inputs.z[k] = input[k].z;
    player[i].inputs.a[k] = input[k].a;
    player[i].inputs.b[k] = input[k].b;
    player[i].inputs.x[k] = input[k].x;
    player[i].inputs.y[k] = input[k].y;
    player[i].inputs.r[k] = input[k].r;
    player[i].inputs.l[k] = input[k].l;
    player[i].inputs.dpadleft[k] = input[k].dl;
    player[i].inputs.dpaddown[k] = input[k].dd;
    player[i].inputs.dpadright[k] = input[k].dr;
    player[i].inputs.dpadup[k] = input[k].du;
  }
  
};
  
function interpretPause(i) {  
  if (pause[i][0] && !pause[i][1]) {
    if (gameMode == 3 || gameMode == 5) {
      playing ^= true;
      if (!playing) {
        sounds.pause.play();
        changeVolume(music, masterVolume[1] * 0.3, 1);
        renderForeground();
      } else {
        changeVolume(music, masterVolume[1], 1);
      }
    }
  }
}


export let bg1 = 0;
export let bg2 = 0;
export let fg1 = 0;
export let fg2 = 0;
export let ui = 0;
export const c = 0;
export const canvasMain = 0;
export const layers = {
  BG1 : 0,
  BG2 : 0,
  FG1 : 0,
  FG2 : 0,
  UI : 0
};
export const layerSwitches = {
  BG1 : true,
  BG2 : true,
  FG1 : true,
  FG2 : true,
  UI : true
};

export function renderToMain (){
  var keys = Object.keys(layers);
  for (var i = 0; i < keys.length; i++) {
    if (layerSwitches[keys[i]]) {
      c.drawImage(layers[keys[i]], 0, 0)
    }
  }
}

export function renderVfx (otherFrame){
  otherFrame = otherFrame || false;
  var popQueue = [];
  for (var j = 0; j < vfxQueue.length; j++) {
    vfxQueue[j][1]++;
    if (vfxQueue[j][0].frames >= vfxQueue[j][1]) {
      if (showVfx) {
        if (!otherFrame) {
          dVfx[vfxQueue[j][0].name](j);
        }
        // if 30fps mode on the other frame, still call swing function but just don't draw
        else if (vfxQueue[j][0].name == "swing") {
          dVfx.swing(j, false);
        }
      }
    } else {
      popQueue.push(j);
    }
  }
  for (var k = 0; k < popQueue.length; k++) {
    vfxQueue.splice(popQueue[k] - k, 1);
  }
}

export function drawVfx (name,pos,face,f){
  if (typeof(f)==='undefined') f = -1;
  var instance = {};
  deepCopyObject(true,instance,vfx[name]);
  if (instance.name == "circleDust"){
    instance.circles[0] = Math.random()*-2;
    instance.circles[1] = (Math.random()*-stage.scale)-2;
    instance.circles[2] = Math.random()*2;
    instance.circles[3] = (Math.random()*stage.scale)+2;
  }
  var newPos = new Vec2D(pos.x, pos.y);
  vfxQueue.push([instance, 0, newPos, face, f]);
}

export function update (i){
  if (!starting){
    if (currentPlayers[i] != -1){
      if (playerType[i] == 0){
        interpretInputs(i,true);
      }
      else {
        if (player[i].actionState != "SLEEP"){
          runAI(i);
        }
      }
    }
  }
  physics(i);
}

let delta = 0;
let lastFrameTimeMs = 0;
let lastUpdate = performance.now();

export function gameTick (){
  var start = performance.now();
  var diff = 0;
  
  if (gameMode == 0 || gameMode == 20) {
    findPlayers();
  } else if (gameMode == 1) {
    //console.log(playerType);
    for (var i = 0; i < ports; i++) {
      interpretInputs(i, true);
      menuMove(i);
    }
  } else if (gameMode == 10) {
    for (var i = 0; i < ports; i++) {
      interpretInputs(i, true);
      audioMenuControls(i);
    }
  } else if (gameMode == 11) {
    for (var i = 0; i < ports; i++) {
      interpretInputs(i, true);
      gameplayMenuControls(i);
    }
  } else if (gameMode == 12) {
    for (var i = 0; i < ports; i++) {
      interpretInputs(i, true);
      keyboardMenuControls(i);
    }
  } else if (gameMode == 13) {
    interpretInputs(creditsPlayer, true);
    credits(creditsPlayer);
  } else if (gameMode == 2) {
    for (var i = 0; i < 4; i++) {
      if (i < ports) {
        interpretInputs(i, true);
        cssControls(i);
      }

      aS[cS[i]][player[i].actionState].main(i);
    }
    for (var i = 0; i < 4; i++) {
      if (playerType[i] > -1) {
        hitDetect(i);
      }
    }
    executeHits();
      resetHitQueue();
    findPlayers();
  } else if (gameMode == 6) {
    // stage select
    for (var i = 0; i < 4; i++) {
      if (i < ports) {
        interpretInputs(i, true);
        sssControls(i);
      }
    }
  } else if (gameMode == 7) {
    // stage select
    interpretInputs(targetPlayer, true);
    tssControls(targetPlayer);
  } else if (gameMode == 4) {
    interpretInputs(targetBuilder, true);
    targetBuilderControls(targetBuilder);
  } else if (gameMode == 5) {
    if (endTargetGame) {
      finishGame();
    }
    if (playing || frameByFrame) {
      var now = performance.now();
      var dt = now - lastUpdate;
      lastUpdate = now;
      destroyArticles();
      executeArticles();
      update(targetBuilder);
      targetHitDetection(targetBuilder);
      if (!starting) {
        targetTimerTick();
      } else {
        startTimer -= 0.01666667;
        if (startTimer < 0) {
          starting = false;
        }
      }
      if (player[targetBuilder].inputs.s[0] && !player[targetBuilder].inputs.s[1]) {
        endGame();
      }
      if (frameByFrame) {
        frameByFrameRender = true;
      }
      frameByFrame = false;

      if (showDebug) {
        diff = performance.now() - start;
        gamelogicTime[0] += diff;
        gamelogicTime[0] /= 2;
        if (diff >= 10) {
          gamelogicTime[3]++;
        }
        if (diff < gamelogicTime[2]) {
          gamelogicTime[2] = diff;
        }
        if (diff > gamelogicTime[1]) {
          gamelogicTime[1] = diff;
        }
        dom.gamelogicAvg.innerHTML = Math.round(gamelogicTime[0]);
        dom.gamelogicHigh.innerHTML = Math.round(gamelogicTime[1]);
        dom.gamelogicLow.innerHTML = Math.round(gamelogicTime[2]);
        dom.gamelogicPeak.innerHTML = gamelogicTime[3];
      }
    } else {
      if (!gameEnd) {
        interpretInputs(targetBuilder, false);
      }
    }
  } else if (playing || frameByFrame) {
    //console.log("test0");
    /*delta = timestamp - lastFrameTimeMs; // get the delta time since last frame
    lastFrameTimeMs = timestamp;
    console.log(delta);*/
    var now = performance.now();
    var dt = now - lastUpdate;

    //console.log(now);
    //console.log(dt);
    lastUpdate = now;

      resetHitQueue();
    stage.movingPlatforms();
    destroyArticles();
    executeArticles();
    for (var i = 0; i < 4; i++) {
      if (playerType[i] > -1) {
        update(i);
      }
    }
    checkPhantoms();
    for (var i = 0; i < 4; i++) {
      if (playerType[i] > -1) {
        hitDetect(i);
      }
    }
    executeHits();
    articlesHitDetection();
    executeArticleHits();
    if (!starting && !versusMode) {
      matchTimerTick();
    } else {
      startTimer -= 0.01666667;
      if (startTimer < 0) {
        starting = false;
      }
    }
    if (frameByFrame) {
      frameByFrameRender = true;
    }
    frameByFrame = false;

    if (showDebug) {
      diff = performance.now() - start;
      gamelogicTime[0] += diff;
      gamelogicTime[0] /= 2;
      if (diff >= 10) {
        gamelogicTime[3]++;
      }
      if (diff < gamelogicTime[2]) {
        gamelogicTime[2] = diff;
      }
      if (diff > gamelogicTime[1]) {
        gamelogicTime[1] = diff;
      }
      dom.gamelogicAvg.innerHTML = Math.round(gamelogicTime[0]);
      dom.gamelogicHigh.innerHTML = Math.round(gamelogicTime[1]);
      dom.gamelogicLow.innerHTML = Math.round(gamelogicTime[2]);
      dom.gamelogicPeak.innerHTML = gamelogicTime[3];
    }
  } else if (findingPlayers) {
    findPlayers();
  } else {
    if (!gameEnd) {
      for (var i = 0; i < 4; i++) {
        if (playerType[i] == 0) {
          if (currentPlayers[i] != -1) {
            interpretInputs(i, false);
          }
        }
      }
    }
  }
  /*

  var beforeWaster = performance.now();
  // neeed to waste 0.666ms
  var timeWasted = false;
  var t = 0;
  var o = performance.now();
  while(!timeWasted){
    var n = performance.now();
    t += n - o;
    //console.log(t);
    if (t > 0.6666){
      timeWasted = true;
    }
    o = n;
    //console.log(".");
  }
  //console.log(performance.now() - beforeWaster);*/
  setTimeout(gameTick, 16 - diff);
}

export function clearScreen (){
  //bg1.fillStyle = "rgb(0, 0, 0)";
  //bg1.fillRect(0,0,layers.BG1.width,layers.BG1.height);
  bg2.clearRect(0, 0, layers.BG2.width, layers.BG2.height);
  //fg1.clearRect(0,0,layers.FG1.width,layers.FG1.height);
  fg2.clearRect(0, 0, layers.FG2.width, layers.FG2.height);
  ui.clearRect(0, 0, layers.UI.width, layers.UI.height);
}

let otherFrame = true;
let fps30 = false;
export function renderTick (){
  window.requestAnimationFrame(renderTick);
  otherFrame ^= true
  if ((fps30 && otherFrame) || !fps30) {
    //console.log("------");
    if (gameMode == 20) {
      drawStartUp();
    } else if (gameMode == 10) {
      drawAudioMenu();
    } else if (gameMode == 11) {
      drawGameplayMenu();
    } else if (gameMode == 12) {
      drawKeyboardMenu();
    } else if (gameMode == 13) {
      drawCredits();
    } else if (gameMode == 0) {
      drawStartScreen();
    } else if (gameMode == 1) {
      drawMainMenu();
    } else if (gameMode == 2) {
      drawCSS();
      //renderVfx();
    } else if (gameMode == 6) {
      drawSSS();
    } else if (gameMode == 7) {
      drawTSS();
    } else if (gameMode == 4) {
      renderTargetBuilder();
    } else if (gameMode == 5) {
      if (playing || frameByFrameRender) {
        var rStart = performance.now();
        clearScreen();
        if (showVfx) {
          drawBackground();
        }
        drawStage();
        renderPlayer(targetBuilder);
        renderArticles();
        renderVfx();
        renderOverlay(false);

        if (showDebug) {
          var diff = performance.now() - rStart;
          renderTime[0] += diff;
          renderTime[0] /= 2;
          if (diff >= 10) {
            renderTime[3]++;
          }
          if (diff > renderTime[1]) {
            renderTime[1] = diff;
          }
          if (diff < renderTime[2]) {
            renderTime[2] = diff;
          }
          dom.renderAvg.innerHTML = Math.round(renderTime[0]);
          dom.renderHigh.innerHTML = Math.round(renderTime[1]);
          dom.renderLow.innerHTML = Math.round(renderTime[2]);
          dom.renderPeak.innerHTML = renderTime[3];
        }
      }
    } else if (playing || frameByFrameRender) {
      /*delta = timestamp - lastFrameTimeMs; // get the delta time since last frame
      lastFrameTimeMs = timestamp;
      console.log(delta);*/
      //console.log("test2");
      var rStart = performance.now();
      clearScreen();
      if (showVfx) {
        drawBackground();
      }
      drawStage();
      for (var i = 0; i < 4; i++) {
        if (playerType[i] > -1) {
          renderPlayer(i);
        }
      }
      renderArticles();
      renderVfx();
      renderOverlay(true);

      if (showDebug) {
        var diff = performance.now() - rStart;
        renderTime[0] += diff;
        renderTime[0] /= 2;
        if (diff >= 10) {
          renderTime[3]++;
        }
        if (diff > renderTime[1]) {
          renderTime[1] = diff;
        }
        if (diff < renderTime[2]) {
          renderTime[2] = diff;
        }

        dom.renderAvg.innerHTML = Math.round(renderTime[0]);
        dom.renderHigh.innerHTML = Math.round(renderTime[1]);
        dom.renderLow.innerHTML = Math.round(renderTime[2]);
        dom.renderPeak.innerHTML = renderTime[3];
      }
    }
    if (frameByFrameRender) {
      renderForeground();
    }
    frameByFrameRender = false;
    //renderToMain();
    //console.log(performance.now());
  } else {
    if (playing) {
      renderVfx(true);
    }
  }
}

export function buildPlayerObject (i){
  player[i] = new playerObject(cS[i],startingPoint[i],startingFace[i]);
  player[i].phys.ECB1 = [new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y)];
  player[i].phys.ECBp = [new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y)];
  player[i].difficulty = cpuDifficulty[i];
}



export function initializePlayers (i,target){
  buildPlayerObject(i);
  if (target) {
    drawVfx("entrance", new Vec2D(stage.startingPoint.x, stage.startingPoint.y));
  } else {
    drawVfx("entrance", new Vec2D(startingPoint[i][0], startingPoint[i][1]));
  }
}

export function startGame (){
  stage = stages[stageSelect];
    setBackgroundType(Math.round(Math.random()));
  changeGamemode(3);
  vfxQueue = [];
  for (var n = 0; n < 4; n++) {
    if (playerType[n] > -1) {
      initializePlayers(n, false);
      renderPlayer(n);
      player[n].inCSS = false;
    }
    if (versusMode) {
      player[n].stocks = 1;
    }
  }
  matchTimer = 480;
  startTimer = 1.5;
  starting = true;
  music.menu.stop();
  switch (stageSelect) {
    case 0:
      music.battlefield.stop();
      music.battlefield.play("battlefieldStart");
      break;
    case 1:
      music.yStory.stop();
      music.yStory.play("yStoryStart");
      break;
    case 2:
      music.pStadium.stop();
      music.pStadium.play("pStadiumStart");
      break;
    case 3:
      music.dreamland.stop();
      music.dreamland.play("dreamlandStart");
      break;
    default:
      break;
  }
  drawVfx("start", new Vec2D(0, 0));
  findingPlayers = false;
  playing = true;
}

export function endGame (){
  gameEnd = false;
  resetLostStockQueue();
    setPhantonQueue([]);
    resetAArticles();
  music.battlefield.stop();
  music.yStory.stop();
  music.pStadium.stop();
  music.dreamland.stop();
  changeVolume(music, masterVolume[1], 1);
  playing = false;
  clearScreen();
  drawStage();
  if (gameMode == 3) {
    changeGamemode(2);
    music.menu.play("menuStart");
  } else if (gameMode == 5) {
    if (targetTesting) {
      changeGamemode(4);
    } else {
      changeGamemode(7);
    }
  }
  pause = [
    [true, true],
    [true, true],
    [true, true],
    [true, true]
  ];
  frameAdvance = [
    [true, true],
    [true, true],
    [true, true],
    [true, true]
  ];
  findingPlayers = true;
  positionPlayersInCSS();
  for (var i = 0; i < 4; i++) {
    if (playerType[i] > -1) {
      if (player[i].actionState == "FURAFURA") {
        sounds.furaloop.stop(player[i].furaLoopID);
      }
      player[i].inputs.a[0] = true;
      player[i].inputs.a[1] = true;
      player[i].inCSS = true;
      player[i].phys.face = 1;
      player[i].actionState = "WAIT";
      player[i].timer = 0;
    }
  }
}

export function finishGame (){
    setEndTargetGame(false);
  gameEnd = true;
  playing = false;
  fg2.save();
  fg2.textAlign = "center";
  var text = "Game!";
  var size = 300;
  var textScale = 1;
  var textGrad = fg2.createLinearGradient(0, 200, 0, 520);
  if (gameMode == 5 || gameMode == 8) {
    if (stage.target.length == targetsDestroyed) {
      if (!targetTesting) {
        if (targetStagePlaying < 10) {
          for (var i = 0; i < 3; i++) {
            if (!medalsEarned[cS[targetPlayer]][targetStagePlaying][i]) {
              if (Math.round(matchTimer * 100) / 100 <= medalTimes[cS[targetPlayer]][targetStagePlaying][i]) {
                medalsEarned[cS[targetPlayer]][targetStagePlaying][i] = true;
              }
            }
          }
        }
        if (matchTimer < targetRecords[cS[targetPlayer]][targetStagePlaying] || targetRecords[cS[targetPlayer]][
            targetStagePlaying
          ] == -1) {
          targetRecords[cS[targetPlayer]][targetStagePlaying] = matchTimer;
          sounds.newRecord.play();
          setCookie(cS[targetPlayer] + "target" + targetStagePlaying, targetRecords[cS[targetPlayer]][
            targetStagePlaying
          ], 36500);
        } else {
          sounds.complete.play();
        }
      } else {
        sounds.complete.play();
      }
      text = "Complete!";
      size = 200;
      textScale = 1.5;
      var textGrad = fg2.createLinearGradient(0, 200 / textScale, 0, 520 / textScale);
      textGrad.addColorStop(0, "black");
      textGrad.addColorStop(0.4, "black");
      textGrad.addColorStop(0.8, "rgb(150, 86, 46)");
      textGrad.addColorStop(1, "rgb(205, 108, 45)");
    } else {
      sounds.failure.play();
      text = "Failure";
      size = 250;
      textGrad.addColorStop(0, "black");
      textGrad.addColorStop(0.5, "black");
      textGrad.addColorStop(0.7, "rgb(51, 34, 251)");
      textGrad.addColorStop(1, "rgb(107, 71, 250)");
    }
  } else {
    if (matchTimer <= 0) {
      text = "Time!"
      sounds.time.play();
      textGrad.addColorStop(0, "black");
      textGrad.addColorStop(0.5, "black");
      textGrad.addColorStop(0.7, "rgb(21, 51, 180)");
      textGrad.addColorStop(1, "rgb(71, 94, 250)");
    } else {
      sounds.game.play();
      textGrad.addColorStop(0, "black");
      textGrad.addColorStop(0.4, "black");
      textGrad.addColorStop(0.7, "rgb(167, 27, 40)");
      textGrad.addColorStop(1, "rgb(255, 31, 52)");
    }
  }
  fg2.scale(1, textScale);
  fg2.fillStyle = textGrad;
  fg2.lineWidth = 40;
  fg2.strokeStyle = "black";
  fg2.font = "900 " + size + "px Arial";
  fg2.strokeText(text, 600, 470 / textScale);
  fg2.lineWidth = 20;
  fg2.strokeStyle = "white";
  fg2.font = "900 " + size + "px Arial";
  fg2.strokeText(text, 600, 470 / textScale);
  fg2.font = "900 " + size + "px Arial";
  fg2.fillText(text, 600, 470 / textScale);
  fg2.restore();
  music.battlefield.stop();
  music.yStory.stop();
  music.pStadium.stop();
  music.dreamland.stop();
  setTimeout(function() {
    endGame()
  }, 2500);
}

export function start (){
  for (var i=0;i<4;i++){
    buildPlayerObject(i);
    player[i].phys.face = 1;
    player[i].actionState = "WAIT";
  }
    cacheDom();
    getKeyboardCookie();
    getTargetCookies();
    giveMedals();
    getTargetStageCookies();
    getAudioCookies();
    getGameplayCookies();
  $("#keyboardButton").click(function(){
    $("#keyboardControlsImg").toggle();
  });
  $("#controllerButton").click(function() {
    $("#controllerSupportContainer").toggle();
  });
  layers.BG1 = document.getElementById("background1Canvas");
  bg1 = layers.BG1.getContext("2d");
  layers.BG2 = document.getElementById("background2Canvas");
  bg2 = layers.BG2.getContext("2d");
  layers.FG1 = document.getElementById("foreground1Canvas");
  fg1 = layers.FG1.getContext("2d");
  layers.FG2 = document.getElementById("foreground2Canvas");
  fg2 = layers.FG2.getContext("2d");
  layers.UI = document.getElementById("uiCanvas");
  ui = layers.UI.getContext("2d");
  bg1.fillStyle = "rgb(0, 0, 0)";
  bg1.fillRect(0, 0, layers.BG1.width, layers.BG1.height);
  gameTick();
  renderTick();

  $("#effectsButton").click(function() {
    if (showVfx) {
      $("#effectsButtonEdit").empty().append("OFF");
    } else {
      $("#effectsButtonEdit").empty().append("ON");
    }
    showVfx ^= true;
  });

  $("#fpsButton").click(function() {
    if (fps30) {
      $("#fpsButtonEdit").empty().append("60");
    } else {
      $("#fpsButtonEdit").empty().append("30");
    }
    fps30 ^= true;
  });

  $("#alphaButton").click(function() {
    if (transparency) {
      $("#alphaButtonEdit").empty().append("OFF");
    } else {
      $("#alphaButtonEdit").empty().append("ON");
    }
      setTransparency(!transparency);
  });

  $("#layerButton").hover(function() {
    $("#layerDropdown").toggle();
  });

  $(".layer").click(function() {
    var id = $(this).attr("id");
    switch (id) {
      case "layer1":
        layerSwitches.BG1 ^= true;
        $("#background1Canvas").toggle();
        break;
      case "layer2":
        layerSwitches.BG2 ^= true;
        $("#background2Canvas").toggle();
        break;
      case "layer3":
        layerSwitches.FG1 ^= true;
        $("#foreground1Canvas").toggle();
        break;
      case "layer4":
        layerSwitches.FG2 ^= true;
        $("#foreground2Canvas").toggle();
        break;
      case "layer5":
        layerSwitches.UI ^= true;
        $("#uiCanvas").toggle();
        break;
      default:
        break;
    }
    $(this).toggleClass("layerOn");
  });

  $("#debugButton").click(function() {
    if (showDebug) {
      $("#debugButtonEdit").empty().append("OFF");
      $("#debug").hide();
      $("#players").hide();
      $("body").css("overflow", "hidden");
      //var mY = Math.max(($(window).height()-750)/2,0);
      //$("#display").css("margin",mY+"px 0px 0px "+mX+"px");
    } else {
      $("#debugButtonEdit").empty().append("ON");
      $("#debug").show();
      $("#players").show();
      $("body").css("overflow", "scroll");
      //var mY = Math.max(($(window).height()-900)/2,0);
      //$("#display").css("margin",mY+" 0px 0px px "+mX+"px");
    }
    showDebug ^= true;
    resize();
  });

  $("#hideButton").click(function() {
    $("#header").toggle();
    showHeader ^= true;
    resize();
  });

  $("#fullscreenButton").click(function() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !
        document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
    resize();
  });

  $(".topButton").hover(function() {
    $(this).children(".buttonDetails").toggle();
  });

  if (mobile === false) {
    $(".button").hover(function() {
      $(this).toggleClass("buttonhighlighted");
    });
    $(".socialmedia").hover(function() {
      $(this).toggleClass("socialmediahighlight");
    });
    $(".sugbtn").hover(function() {
      $(this).toggleClass("sugbtnhighlight");
    });
  }
  $("#appsButton").hover(function() {
    $("#appsDropdown").show();
  }, function() {
    $("#appsDropdown").hide();
  });
  resize();
}
window.start = start;
export function resetVfxQueue  (){
    vfxQueue =[];
}

export function addShine (val){
    shine += val;
}
export function setShine (val){
    shine = val;
}
export function setFindingPlayers(val){
  findingPlayers = val;
}
export function setPlaying(val){
  playing = val;
}
export function setEndTargetGame(val){
    endTargetGame = val;
}
export function setCreditsPlayer(val){
  creditsPlayer =val;
}
export function deepCopyObject(deep,target,...object){
   if(deep) {
       target = target || {};

       for (var i = 2; i < arguments.length; i++) {
           var obj = arguments[i];

           if (!obj)
               continue;

           for (var key in obj) {
               if (obj.hasOwnProperty(key)) {
                   if (typeof obj[key] === 'object')
                       target[key] = deepCopyObject(deep,target[key], obj[key]);
                   else
                       target[key] = obj[key];
               }
           }
           // adds length property for arrays
           if (obj instanceof Array){
               target.length = obj.length;
           }
       }

       return target;
   }else {
      return Object.assign(target, ...object)
   }
}
export function setStage(val){
  stage = val;
}
const dom = {};

export function cacheDom() {
  const elementIds = [
    "matchMinutes",
    "matchSeconds",
    "gamelogicAvg",
    "gamelogicHigh",
    "gamelogicLow",
    "gamelogicPeak",
    "renderAvg",
    "renderHigh",
    "renderLow",
    "renderPeak",
  ];

  elementIds.forEach((id) => {
    dom[id] = document.getElementById(id);
  });
};

export function setCS(index,val){
  cS[index] = val;
}
