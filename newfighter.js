/*you duplicate
c.save();
...
c.restore();

all over the place
what you can do instead is create a function that wraps a function in those two lines(edited)
so the context will always get restored automatically(edited)
without having to explicitly state it everywhere
function foobar(callback) {
    c.save();
    callback();
    c.restore();
}
then you just call foobar() passing in the function as an argument(edited)
first class functions are really powerful, abuse them everywhere possible*/



player = [0,0,0,0];

renderTime = [10,0,100,0];
gamelogicTime = [5,0,100,0];
framerate = [0,0,0];

gameEnd = false;

attemptingControllerReset = [false,false,false,false];

function customDeadzone(){
  this.ls = new Vec2D(0,0);
  this.cs = new Vec2D(0,0);
  this.l = 0;
  this.r = 0;
}

keyboardMap = [[102,186],[101,76],[100,75],[104,79],[103,73],[105,80],[107,192,222],[109,219],71,78,66,86];

keyboardOccupied = false;

/*xbox one controller
A : 0
B : 1
X : 2
Y : 3
LB : 4
RB : 5
LT : 6
RT : 7
Select : 8
Start : 9*/

map = {
  a : [1,0,4,0],
  b : [2,1,3,2],
  x : [0,2,2,1],
  y : [3,3,1,3],
  z : [7,4,7,5],
  r : [5,5,6,7],
  l : [4,6,5,6],
  s : [9,7,0,9],
  du : [12,8,8,12],
  dr : [13,11,10,15],
  dd : [14,9,9,13],
  dl : [15,10,11,14],
  lsX : [0,0,0,0],
  lsY : [1,1,1,1],
  csX : [5,3,3,2],
  csY : [2,4,4,3],
  lA : [3,2,5,6],
  rA : [4,5,6,7]
}


mType = [0,0,0,0];

cd = [new customDeadzone,new customDeadzone,new customDeadzone,new customDeadzone];

currentPlayers = [];

playerAmount = 0;

playerType = [-1,-1,-1,-1];

ports = 0;
activePorts = [];

playing = false;

frameByFrame = false;
frameByFrameRender = false;

findingPlayers = true;

showVfx = true;
showDebug = false;

gameMode = 20;

versusMode = 0;

cS = [0,0,0,0];

randomTags = ["NEO!","SELF","NOVA","PNDA","Panda","LFFN","Scorp","AZ","AXE","Tempo","TMPO","[A]rmada","WBALLZ","Westballz","PPMD","Kreygasm","M2K","Mang0","USA","SCAR","TOPH","(.Y.)","HBOX","HungryBox","PLUP","Shroomed","SFAT","Wizz","Lucky","S2J","SilentWolf","aMSa","S2J","Hax$"];

vfxQueue = [];

palettes = [["rgb(250, 89, 89)","rgb(255, 170, 170)","rgba(255, 206, 111, ","rgba(244, 68, 68, 0.6)","rgba(255, 225, 167, "],
["rgb(4, 255, 134)","rgb(154, 254, 170)","rgba(252, 95, 95, ","rgba(255, 182, 96, 0.6)","rgba(254, 141, 141, "],
["rgb(5, 195, 255)","rgb(121, 223, 255)","rgba(218, 96, 254, ","rgba(231, 134, 255, 0.6)","rgba(230, 144, 255, "],
["rgb(255, 187, 70)","rgb(248, 255, 122)","rgba(80, 182, 255, ","rgba(255, 142, 70, 0.6)","rgba(139, 203, 249, "],
["rgb(177, 89, 255)","rgb(203, 144, 255)","rgba(144, 255, 110, ","rgba(247, 126, 250, 0.6)","rgba(190, 255, 170, "],
["rgb(182, 131, 70)","rgb(252, 194, 126)","rgba(47, 186, 123, ","rgba(255, 112, 66, 0.6)","rgba(111, 214, 168, "],
["rgb(166, 166, 166)","rgb(255, 255, 255)","rgba(255, 255, 255, ","rgba(191, 119, 119, 0.6)","rgba(175, 172, 172, "]];

hurtboxColours = ["rgba(255, 237, 70, 0.6)","rgba(42, 57, 255, 0.6)","rgba(54, 255, 37, 0.6)"];

hasTag = [false,false,false,false];
tagText = ["","","",""];

pPal = [0,1,2,3];

costumeTimeout = [];

colours = ["rgba(4, 255, 82, 0.62)","rgba(117, 20, 255, 0.63)","rgba(255, 20, 20, 0.63)","rgba(255, 232, 20, 0.63)"];

pause = [[true,true],[true,true],[true,true],[true,true]];
frameAdvance = [[true,true],[true,true],[true,true],[true,true]];

startingPoint = [[-50,50],[50,50],[-25,5],[25,5]];
startingFace = [1,-1,1,-1];

ground = [[-68.4,0],[68.4,0]];

platforms = [[[-57.6,27.2],[-20,27.2]],[[20,27.2],[57.6,27.2]],[[-18.8,54.4],[18.8,54.4]]];

wallsL = [[[-68.4,0],[-68.4,-108.8]]];
wallsR = [[[68.4,0],[68.4,-108.8]]];

edges = [[[-68.4,0],[-63.4,0]],[[68.4,0],[63.4,0]]];
//cliffcatchOffset = [[-71.9,-22.3],[-73.1,-22.19],[-72.21,-24],[-71.8,-24],[-71.1,-23.74],[-70.74,-23.76],[-71.3,-23.75]];
cliffcatchOffset = [[-3.5,-22.3],[-4.7,-22.19],[-3.81,-24],[-3.4,-24],[-2.7,-23.74],[-2.34,-23.76],[-2.9,-23.75]];
//edgeOffset = [[-71.3,-23.7],[71.3,-23.7]];
edgeOffset = [[-2.9,-23.7],[2.9,-23.7]];

edgeOrientation = [1,-1];

respawnPoints = [[-50,50,1],[50,50,-1],[25,35,1],[-25,35,-1]];

stage = {
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
  scale : 4.5,
  offset : [600,480]
}

stageSelect = 0;

blastzone = new Box2D([-224,200],[224,-108.8]);

starting = true;
startTimer = 1.5;

//matchTimer = 5999.99;
matchTimer = 480;

document.onkeydown = overrideKeyboardEvent;
document.onkeyup = overrideKeyboardEvent;
var keys = {};

function overrideKeyboardEvent(e){
  switch(e.type){
    case "keydown":
      if(!keys[e.keyCode]){
        keys[e.keyCode] = true;
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
}
function disabledEventPropagation(e){
  if(e){
    if(e.stopPropagation){
      e.stopPropagation();
    } else if(window.event){
      window.event.cancelBubble = true;
    }
  }
}

/*var keys = [];
window.onkeyup = function(e) {
  keys[e.keyCode]=false;
}
window.onkeydown = function(e) {
  keys[e.keyCode]=true;
}*/

function SVG(tag)
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
console.log(navigator.getGamepads());

function matchTimerTick(){
  matchTimer -= 0.016667;
  $("#matchMinutes").empty().append(Math.floor(matchTimer/60));
  var sec = (matchTimer % 60).toFixed(2);
  $("#matchSeconds").empty().append(((sec.length<5)?"0"+sec:sec));
  if (matchTimer <= 0){
    finishGame();
  }
}

function screenShake(kb){
  var seed = [Math.random(),Math.random(),Math.random(),Math.random()];
  c.translate(kb*0.1*seed[0],kb*0.1*seed[1]);
  setTimeout(function(){c.translate(-kb*0.05*seed[0],-kb*0.05*seed[1])},20);
  setTimeout(function(){c.translate(-kb*0.05*seed[0],-kb*0.05*seed[1]);c.translate(-kb*0.1*seed[2],-kb*0.1*seed[3])},40);
  setTimeout(function(){c.translate(kb*0.05*seed[2],kb*0.05*seed[3])},60);
  setTimeout(function(){c.translate(kb*0.05*seed[2],kb*0.05*seed[3])},80);
}

function percentShake(kb,i){
  player[i].percentShake = new Vec2D(kb*0.1*Math.random(),kb*0.1*Math.random());
  setTimeout(function(){player[i].percentShake = new Vec2D(kb*0.05*Math.random(),kb*0.05*Math.random())},20);
  setTimeout(function(){player[i].percentShake = new Vec2D(-kb*0.1*Math.random(),-kb*0.1*Math.random())},40);
  setTimeout(function(){player[i].percentShake = new Vec2D(-kb*0.05*Math.random(),-kb*0.05*Math.random())},60);
  setTimeout(function(){player[i].percentShake = new Vec2D(0,0)},80);
}

function findPlayers(){
  var gps = navigator.getGamepads();
  /*if (typeof gps != "undefined"){
    console.log(gps);
  }*/
  if (!keyboardOccupied){
    if (gameMode < 2){
      if (keys[109] || keys[219]){
        if (ports < 4){
          gameMode = 1;
          keyboardOccupied = true;
          sounds.menuForward.play();
          if (ports == 0){
            sounds.menu2.play("menu2Start");
          }
          addPlayer(ports,4);
        }
      }
    }
    else {
      if (keys[101] || keys[76]){
        if (ports < 4){
          keyboardOccupied = true;
          addPlayer(ports,4);
        }
      }
    }
  }
  for (var i=0;i<gps.length;i++){
    var gamepad = navigator.getGamepads()[i];
    if (typeof gamepad != "undefined" &&  gamepad != null){
      var gType = 0;
      if (gamepad.id[0] == "v" || gamepad.id[0] == "1"){
        gType = 1;
        //console.log("You are using vJoy");
      }
      else if (gamepad.id[0] == "M"){
        //console.log("You are using Mayflash");
      }
      // raphnet is :
      //GC/N64 to USB, v2.9 (Vendor: 289b Product: 000c)
      else if (gamepad.id[0] == "G" || gamepad.id[0] == "2"){
        gType = 2;
        console.log("You are using raphnet");
      }
      // Xbox 360 Controller (XInput STANDARD GAMEPAD)
      else if (gamepad.id[0] == "X" || gamepad.id[0] == "x"){
        gType = 3;
        console.log("You are using xbox 360");
      }
      if (gameMode < 2){
        if (gamepad.buttons[map.s[gType]].pressed){
          var alreadyIn = false;
          for (var k=0;k<ports;k++){
            if (currentPlayers[k] == i){
              alreadyIn = true;
            }
          }
          if (!alreadyIn){
            if (ports < 4){
              gameMode = 1;
              sounds.menuForward.play();
              if (ports == 0){
                sounds.menu2.play("menu2Start");
              }
              addPlayer(i,gType);
            }
          }
        }
      }
      else {
        if (gamepad.buttons[map.a[gType]].pressed){
          var alreadyIn = false;
          for (var k=0;k<ports;k++){
            if (currentPlayers[k] == i){
              alreadyIn = true;
            }
          }
          if (!alreadyIn){
            if (ports < 4){
              addPlayer(i,gType);
            }
          }
        }
        /*for (var j=0;j<currentPlayers.length;j++){
          if (currentPlayers[j] == i){
            if (gamepad.buttons[map.x[mType[j]]].pressed || gamepad.buttons[map.y[mType[j]]].pressed){
              if (!costumeTimeout[j]){
                pPal[j]++;
                if (pPal[j] > 6){
                  pPal[j] = 0;
                }
                $("#pBox"+j).css({"background-color":palettes[pPal[j]][0],"border":"5px solid "+palettes[pPal[j]][2]+"0.8)"});
                costumeTimeout[j] = true;
                costumeTout(j);
              }

            }
            if (gamepad.buttons[map.b[mType[j]]].pressed){
              if (!bPress[j]){
                hasTag[j] ^= true;
                if (hasTag[j]){
                  $("#pTag"+j).show();
                  $("#pTagEdit"+j).val(randomTags[Math.round((randomTags.length-1)*Math.random())]);
                  tagText[j] = $("#pTagEdit"+j).val();
                }
                else {
                  $("#pTag"+j).hide();
                }
              }
              bPress[j] = true;
            }
            else {
              bPress[j] = false;
            }
            if (gamepad.buttons[map.z[mType[j]]].pressed){
              if (!zPress[j]){
                if (playerAmount < 4){
                  addPlayer(-1,0,1);
                }
              }
              zPress[j] = true;
            }
            else {
              zPress[j] = false;
            }
            pause[j][1] = pause[j][0];
            pause[j][0] = gamepad.buttons[map.s[mType[j]]].pressed;
            if (pause[j][0] && !pause[j][1]){
              startGame();
            }
          }
        }*/
      }
    }
  }
}


function addPlayer(gamepad,gType){
  ports++;
  currentPlayers[ports-1] = gamepad;
  playerType[ports-1] = 0;
  mType[ports-1] = gType;
}

function togglePort(i){
  playerType[i]++;
  if (playerType[i] == 2){
    playerType[i] = -1;
  }
  if (playerType[i] == 0 && ports <= i){
    playerType[i] = 1;
  }
}

function positionPlayersInCSS(){
  for (var i=0;i<4;i++){
      var x = (-80+i*50)*2/3;
      var y = -30;
      player[i].phys.pos = new Vec2D(x,y);
      player[i].phys.hurtbox = new Box2D([-4+x,18+y],[4+x,y]);
  }
}


/*function addPlayer(i,gType,pType){
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

function removePlayer(i){
  playerType[i] = -1;
  playerAmount--;
}*/

function interpretInputs(i,active){
  if (mType[i] == 4){
    // keyboard controls
    var lstickX = keys[68] ? (keys[65] ? 0 : 1) : (keys[65] ? -1 : 0);
    var lstickY = keys[87] ? (keys[83] ? 0 : 1) : (keys[83] ? -1 : 0);
    if (keys[32] || keys[16]){
      //analog
      lstickX *= 0.7;
      lstickY *= 0.7;
    }
    var cstickX = keys[39] ? (keys[37] ? 0 : 1) : (keys[37] ? -1 : 0);
    var cstickY = keys[38] ? (keys[40] ? 0 : 1) : (keys[40] ? -1 : 0);

    var lAnalog = 0;
    var rAnalog = 0;
  }
  else {
    var gamepad = navigator.getGamepads()[currentPlayers[i]];
    //console.log(gamepad.axes);

    var lstickX = gamepad.axes[map.lsX[mType[i]]] - cd[i].ls.x;
    var lstickY = gamepad.axes[map.lsY[mType[i]]] * -1 - cd[i].ls.y;
    lstickX /= 0.75;
    lstickY /= 0.75;
    if (lstickX > 1){
      lstickX = 1;
    }
    else if (lstickX < -1){
      lstickX = -1;
    }
    else {
      lstickX = Math.round(lstickX * 80)/80;
    }
    if (lstickY > 1){
      lstickY = 1;
    }
    else if (lstickY < -1){
      lstickY = -1;
    }
    else {
      lstickY = Math.round(lstickY * 80)/80;
    }
    if (Math.abs(lstickX) < 0.3){
      lstickX = 0;
    }
    if (Math.abs(lstickY) < 0.3){
      lstickY = 0;
    }
    var cstickY = gamepad.axes[map.csY[mType[i]]]*-1-cd[i].cs.y;
    var cstickX = gamepad.axes[map.csX[mType[i]]]-cd[i].cs.x;
    cstickX /= 0.75;
    cstickY /= 0.75;
    if (cstickX > 1){
      cstickX = 1;
    }
    else if (cstickX < -1){
      cstickX = -1;
    }
    else {
      cstickX = Math.round(cstickX * 80)/80;
    }
    if (cstickY > 1){
      cstickY = 1;
    }
    else if (cstickY < -1){
      cstickY = -1;
    }
    else {
      cstickY = Math.round(cstickY * 80)/80;
    }
    if (Math.abs(cstickX) < 0.3){
      cstickX = 0;
    }
    if (Math.abs(cstickY) < 0.3){
      cstickY = 0;
    }
    if (mType[i] == 3){
      //console.log(gamepad.buttons[map.rA[mType[i]]]);
      //-cd[i].l
      //-cd[i].r
      var lAnalog = gamepad.buttons[map.lA[mType[i]]].value+0.2;
      var rAnalog = gamepad.buttons[map.rA[mType[i]]].value+0.2;
    }
    else {
      var lAnalog = gamepad.axes[map.lA[mType[i]]]-cd[i].l;
      var rAnalog = gamepad.axes[map.rA[mType[i]]]-cd[i].r;
      if (mType[i] == 2){
        lAnalog *= -1
        rAnalog *= -1
      }
      lAnalog += 0.9;
      rAnalog += 0.9;
    }
    if (lAnalog > 1){
      lAnalog = 1;
    }
    if (rAnalog > 1){
      rAnalog = 1;
    }
    if (lAnalog < 0.3){
      lAnalog = 0;
    }
    if (rAnalog < 0.3){
      rAnalog = 0;
    }
  }

  pause[i][1] = pause[i][0];
  frameAdvance[i][1] = frameAdvance[i][0];

  if (mType[i] == 4){
    if (keys[109] || keys[219]){
      pause[i][0] = true;
    }
    else {
      pause[i][0] = false
    }
    if (keys[107] || keys[192] || keys[222]){
      frameAdvance[i][0] = true;
    }
    else {
      frameAdvance[i][0] = false
    }
  }
  else {
    if (gamepad.buttons[map.s[mType[i]]].pressed || (gamepad.buttons[map.du[mType[i]]].pressed && gameMode == 5)){
      pause[i][0] = true;
    }
    else {
      pause[i][0] = false
    }
    if (gamepad.buttons[map.z[mType[i]]].pressed){
      frameAdvance[i][0] = true;
    }
    else {
      frameAdvance[i][0] = false
    }
  }

  if (active){
    for(var j=0;j<7;j++){
      player[i].inputs.lStickAxis[7-j].x = player[i].inputs.lStickAxis[6-j].x;
      player[i].inputs.lStickAxis[7-j].y = player[i].inputs.lStickAxis[6-j].y;
      player[i].inputs.cStickAxis[7-j].x = player[i].inputs.cStickAxis[6-j].x;
      player[i].inputs.cStickAxis[7-j].y = player[i].inputs.cStickAxis[6-j].y;
      player[i].inputs.lAnalog[7-j] = player[i].inputs.lAnalog[6-j];
      player[i].inputs.rAnalog[7-j] = player[i].inputs.rAnalog[6-j];
      player[i].inputs.s[7-j] = player[i].inputs.s[6-j];
      player[i].inputs.z[7-j] = player[i].inputs.z[6-j];
      player[i].inputs.a[7-j] = player[i].inputs.a[6-j];
      player[i].inputs.b[7-j] = player[i].inputs.b[6-j];
      player[i].inputs.x[7-j] = player[i].inputs.x[6-j];
      player[i].inputs.y[7-j] = player[i].inputs.y[6-j];
      player[i].inputs.r[7-j] = player[i].inputs.r[6-j];
      player[i].inputs.l[7-j] = player[i].inputs.l[6-j];
      player[i].inputs.dpadleft[7-j] = player[i].inputs.dpadleft[6-j];
      player[i].inputs.dpaddown[7-j] = player[i].inputs.dpaddown[6-j];
      player[i].inputs.dpadright[7-j] = player[i].inputs.dpadright[6-j];
      player[i].inputs.dpadup[7-j] = player[i].inputs.dpadup[6-j];
    }
    player[i].inputs.lStickAxis[0].x = lstickX;
    player[i].inputs.lStickAxis[0].y = lstickY;
    player[i].inputs.cStickAxis[0].x = cstickX;
    player[i].inputs.cStickAxis[0].y = cstickY;
    player[i].inputs.lAnalog[0] = lAnalog;
    player[i].inputs.rAnalog[0] = rAnalog;
    if (mType[i] == 4){
      player[i].inputs.s[0] = keys[109] || keys[219];
      player[i].inputs.x[0] = keys[102] || keys[186];
      player[i].inputs.a[0] = keys[101] || keys[76];
      player[i].inputs.b[0] = keys[100] || keys[75];
      player[i].inputs.y[0] = keys[104] || keys[79];
      player[i].inputs.r[0] = keys[105] || keys[80];
      player[i].inputs.l[0] = keys[103] || keys[73];
      player[i].inputs.dpadleft[0] = keys[86];
      player[i].inputs.dpaddown[0] = keys[66];
      player[i].inputs.dpadright[0] = keys[78];
      player[i].inputs.dpadup[0] = keys[71];
    }
    else {
      player[i].inputs.s[0] = gamepad.buttons[map.s[mType[i]]].pressed;
      player[i].inputs.x[0] = gamepad.buttons[map.x[mType[i]]].pressed;
      player[i].inputs.a[0] = gamepad.buttons[map.a[mType[i]]].pressed;
      player[i].inputs.b[0] = gamepad.buttons[map.b[mType[i]]].pressed;
      player[i].inputs.y[0] = gamepad.buttons[map.y[mType[i]]].pressed;
      if (mType[i] == 3){
        player[i].inputs.r[0] = gamepad.buttons[map.r[mType[i]]].value == 1?true:false;
        player[i].inputs.l[0] = gamepad.buttons[map.l[mType[i]]].value == 1?true:false;

        // 4 is lB, 5 is RB
        if (gamepad.buttons[4].pressed){
          player[i].inputs.l[0] = true;
        }
      }
      else {
        player[i].inputs.r[0] = gamepad.buttons[map.r[mType[i]]].pressed;
        player[i].inputs.l[0] = gamepad.buttons[map.l[mType[i]]].pressed;
      }
      player[i].inputs.dpadleft[0] = gamepad.buttons[map.dl[mType[i]]].pressed;
      player[i].inputs.dpaddown[0] = gamepad.buttons[map.dd[mType[i]]].pressed;
      player[i].inputs.dpadright[0] = gamepad.buttons[map.dr[mType[i]]].pressed;
      player[i].inputs.dpadup[0] = gamepad.buttons[map.du[mType[i]]].pressed;
    }

    if (!frameByFrame){
      if (mType[i] == 4){
        player[i].inputs.z[0] = keys[107] || keys[192] || keys[222];
      }
      else {
        player[i].inputs.z[0] = gamepad.buttons[map.z[mType[i]]].pressed;
      }
      if (player[i].inputs.z[0]){
        player[i].inputs.lAnalog[0] = 0.35;
        player[i].inputs.a[0] = true;
      }
    }
    if (player[i].inputs.l[0]){
      player[i].inputs.lAnalog[0] = 1;
    }
    if (player[i].inputs.r[0]){
      player[i].inputs.rAnalog[0] = 1;
    }
  }
  else {
    if (mType[i] == 4){
      if ((keys[101] || keys[76]) && (keys[103] || keys[73]) && (keys[105] || keys[80]) && (keys[109] || keys[219])){
        if (keys[100] || keys[75]){
          startGame();
        }
        else {
          endGame();
        }
      }
    }
    else {
      if (mType[i] == 3){
        if (gamepad.buttons[map.a[mType[i]]].pressed && gamepad.buttons[map.l[mType[i]]].value == 1 && gamepad.buttons[map.r[mType[i]]].value == 1 && gamepad.buttons[map.s[mType[i]]].pressed){
          if (gamepad.buttons[map.b[mType[i]]].pressed){
            startGame();
          }
          else {
            endGame();
          }
        }
      }
      else {
        if (gamepad.buttons[map.a[mType[i]]].pressed && gamepad.buttons[map.l[mType[i]]].pressed && gamepad.buttons[map.r[mType[i]]].pressed && gamepad.buttons[map.s[mType[i]]].pressed){
          if (gamepad.buttons[map.b[mType[i]]].pressed){
            startGame();
          }
          else {
            endGame();
          }
        }
      }
    }
    if (frameAdvance[i][0] && !frameAdvance[i][1]){
      frameByFrame = true;
    }
  }
  if (player[i].inputs.dpadleft[0] && !player[i].inputs.dpadleft[1]){
    player[i].showLedgeGrabBox ^= true;
  }
  if (player[i].inputs.dpaddown[0] && !player[i].inputs.dpaddown[1]){
    player[i].showECB ^= true;
  }
  if (player[i].inputs.dpadright[0] && !player[i].inputs.dpadright[1]){
    player[i].showHitbox^= true;
  }
  if (mType[i] != 4){
    if (gamepad.buttons[map.du[mType[i]]].pressed && gamepad.buttons[map.x[mType[i]]].pressed && gamepad.buttons[map.y[mType[i]]].pressed && !attemptingControllerReset[i]){
      attemptingControllerReset[i] = true;
      setTimeout(function(){
        if (gamepad.buttons[map.du[mType[i]]].pressed && gamepad.buttons[map.x[mType[i]]].pressed && gamepad.buttons[map.y[mType[i]]].pressed){
          cd[i].ls = new Vec2D(gamepad.axes[0],gamepad.axes[1]*-1);
          cd[i].cs = new Vec2D(gamepad.axes[5],gamepad.axes[2]*-1);
          cd[i].l = gamepad.axes[3]+0.8;
          cd[i].r = gamepad.axes[4]+0.8;
          $("#resetIndicator"+i).fadeIn(100);
          $("#resetIndicator"+i).fadeOut(500);
        }
        attemptingControllerReset[i] = false;
      },2000);
    }
  }
  if (pause[i][0] && !pause[i][1]){
    if (gameMode == 3 || gameMode == 5){
      playing ^= true;
      if (!playing){
        sounds.pause.play();
        sounds.battlefield.volume(0);
        renderForeground();
      }
      else {
        sounds.battlefield.volume(0);
      }
    }
  }
  if (player[i].phys.lCancelTimer > 0){
    player[i].phys.lCancelTimer--;
    if (player[i].phys.lCancelTimer == 0){
      player[i].phys.lCancel = false;
    }
  }
  if (player[i].phys.lCancelTimer == 0 && ((player[i].inputs.lAnalog[0] > 0 && player[i].inputs.lAnalog[1] == 0) || (player[i].inputs.rAnalog[0] > 0 && player[i].inputs.lAnalog[1] == 0) || (player[i].inputs.z[0] && !player[i].inputs.z[1]))){
    player[i].phys.lCancelTimer = 7;
    player[i].phys.lCancel = true;
  }

  $("#lsAxisX"+i).empty().append(lstickX.toFixed(5));
  $("#lsAxisY"+i).empty().append(lstickY.toFixed(5));
  $("#lAnalog"+i).empty().append(lAnalog.toFixed(5));
  $("#rAnalog"+i).empty().append(rAnalog.toFixed(5));
  if (mType[i] == 4){
    for (var j=0;j<12;j++){
      if ((keyboardMap[j].length > 1)?(keys[keyboardMap[j][0]] || keys[keyboardMap[j][1]] || keys[keyboardMap[j][2]]):keys[keyboardMap[j]]){
        $("#"+i+"button"+j).show();
      }
      else {
        $("#"+i+"button"+j).hide();
      }
    }
  }
  else {
    for (var j=0;j<12;j++){
      var bNum = j;
      if (mType[i] == 0){
        if (bNum > 5){
          bNum++;
        }
        if (bNum > 7){
          bNum++;
        }
        if (bNum > 8){
          bNum+=2;
        }
      }
      if (gamepad.buttons[bNum].pressed){
        $("#"+i+"button"+j).show();
      }
      else {
        $("#"+i+"button"+j).hide();
      }
    }
  }
}

function land(i,y,t,j){
  player[i].phys.pos.y = y;
  player[i].phys.grounded = true;
  player[i].phys.doubleJumped = false;
  player[i].phys.jumpsUsed = 0;
  player[i].phys.airborneTimer = 0;
  player[i].phys.fastfalled = false;
  player[i].phys.chargeFrames = 0;
  player[i].phys.charging = false;
  player[i].phys.wallJumpCount = 0;
  player[i].phys.thrownHitbox = false;
  player[i].phys.sideBJumpFlag = true;
  player[i].phys.onSurface = [t,j];
  player[i].phys.onLedge = -1;
  player[i].rotation = 0;
  player[i].rotationPoint = new Vec2D(0,0);
  switch (player[i].actionState){
    case 104:
    case 56:
      break;
    case 38:
      if (cS[i] == 2){
        aS[cS[i]][38].land(i);
      }
      else if (player[i].phys.cVel.y+player[i].phys.kVel.y <= 0){
        aS[cS[i]][12].init(i);
      }
      break;
    case 103:
      player[i].actionState = 56;
      break;
    case 33:
      //fair
      if (player[i].phys.autoCancel){
        aS[cS[i]][10].init(i);
      }
      else {
        aS[cS[i]][43].init(i);
      }
      break;
    case 34:
      //b
      if (player[i].phys.autoCancel){
        aS[cS[i]][10].init(i);
      }
      else {
        aS[cS[i]][44].init(i);
      }
      break;
    case 35:
      //u
      if (player[i].phys.autoCancel){
        aS[cS[i]][10].init(i);
      }
      else {
        aS[cS[i]][46].init(i);
      }
      break;
    case 36:
      //d
      if (player[i].phys.autoCancel){
        aS[cS[i]][10].init(i);
      }
      else {
        aS[cS[i]][45].init(i);
      }
      break;
    case 37:
      //n
      if (player[i].phys.autoCancel){
        aS[cS[i]][10].init(i);
      }
      else {
        aS[cS[i]][42].init(i);
      }
      break;
    case 9:
    case 13:
    case 15:
    case 19:
    case 20:
    case 120:
    case 121:
    case 122:
    case 123:
    case 124:
    case 125:
    case 126:
    case 127:
    case 128:
    case 129:
      if (player[i].phys.cVel.y >= -1){
        aS[cS[i]][0].init(i);
      }
      else {
        aS[cS[i]][10].init(i);
      }
      break;
    case 41:
    case 111:
    case 112:
      aS[cS[i]][10].init(i);
      break;
    case 11:
      player[i].phys.intangibleTimer = 0;
      player[i].phys.hurtBoxState = 0;
      aS[cS[i]][12].init(i);
      break;
    case 39:
    case 40:
      if (player[i].phys.techTimer > 0){
        if (player[i].inputs.lStickAxis[0].x*player[i].phys.face > 0.5){
          aS[cS[i]][68].init(i);
        }
        else if (player[i].inputs.lStickAxis[0].x*player[i].phys.face < -0.5){
          aS[cS[i]][67].init(i);
        }
        else {
          aS[cS[i]][66].init(i);
        }
      }
      else {
        aS[cS[i]][60].init(i);
      }
      break;
    case 69:
      aS[cS[i]][70].init(i);
      break;
    default:
      aS[cS[i]][12].init(i);
      break;
  }
  player[i].phys.cVel.y = 0;
  player[i].phys.kVel.y = 0;
  player[i].hit.hitstun = 0;
  player[i].hitboxes.active = [false,false,false,false];
}

function physics(i){
  player[i].phys.posPrev = new Vec2D(player[i].phys.pos.x,player[i].phys.pos.y);
  player[i].phys.facePrev = player[i].phys.face;
  $.extend(true,player[i].phys.prevFrameHitboxes,player[i].hitboxes);
  if (player[i].hit.hitlag > 0){
    player[i].hit.hitlag--;
    if (player[i].hit.hitlag == 0 && player[i].hit.knockback > 0){
      if (player[i].phys.grabbedBy == -1 || player[i].hit.knockback > 50){
        var newAngle = getLaunchAngle(player[i].hit.angle,player[i].hit.knockback,player[i].hit.reverse,player[i].inputs.lStickAxis[0].x,player[i].inputs.lStickAxis[0].y,i);
        player[i].phys.cVel.x = 0;
        player[i].phys.cVel.y = 0;
        //console.log(newAngle);
        player[i].phys.kVel.x = getHorizontalVelocity(player[i].hit.knockback,newAngle);
        player[i].phys.kVel.y = getVerticalVelocity(player[i].hit.knockback,newAngle,player[i].phys.grounded,player[i].hit.angle);
        //console.log(player[i].phys.kVel);
        player[i].phys.kDec.x = getHorizontalDecay(newAngle);
        player[i].phys.kDec.y = getVerticalDecay(newAngle);
        //console.log(player[i].phys.kDec);
        //player[i].hit.hitstun = getHitstun(player[i].hit.knockback);

        player[i].phys.onLedge = -1;
        player[i].phys.charging = false;
        player[i].phys.chargeFrames = 0;
        player[i].phys.shielding = false;
        if (player[i].phys.grounded){
          if (newAngle == 0 || newAngle > 270){
            player[i].phys.kVel.y = 0;
            player[i].phys.kDec.x = player[i].charAttributes.traction;
          }
          else if (newAngle > 180){
            player[i].phys.kVel.y = 0;
            player[i].phys.kDec.x = -player[i].charAttributes.traction;
          }
        }
        if (player[i].phys.kVel.y == 0){
          if (player[i].hit.knockback >= 80){
            player[i].phys.grounded = false;
            player[i].phys.pos.y += 0.0001;
          }
        }
        if (player[i].phys.kVel.y > 0){
          player[i].phys.grounded = false;
        }
      }
      player[i].hit.knockback = 0;
    }

    //SDI / ASDI
    switch (player[i].actionState){
      case 41:
      case 39:
      case 21:
      case 22:
        if (player[i].hit.hitlag > 0){
          if ((player[i].inputs.lStickAxis[0].x > 0.7 && player[i].inputs.lStickAxis[1].x < 0.7) || (player[i].inputs.lStickAxis[0].x < -0.7 && player[i].inputs.lStickAxis[1].x > -0.7) || (player[i].inputs.lStickAxis[0].y > 0.7 && player[i].inputs.lStickAxis[1].y < 0.7) || (player[i].inputs.lStickAxis[0].y < -0.7 && player[i].inputs.lStickAxis[1].y > -0.7)){
            player[i].phys.pos.x += player[i].inputs.lStickAxis[0].x*6;
            player[i].phys.pos.y += player[i].phys.grounded ? 0 : player[i].inputs.lStickAxis[0].y*6;
          }
        }
        else {
          player[i].phys.pos.x += player[i].inputs.lStickAxis[0].x*3;
          player[i].phys.pos.y += player[i].phys.grounded ? 0 : player[i].inputs.lStickAxis[0].y*3;
        }
        break;
      default:
        break;
    }
  }
  if (player[i].hit.hitlag == 0){
    if (player[i].hit.shieldstun > 0){
      //console.log(player[i].hit.shieldstun);
      player[i].hit.shieldstun--;
      if (player[i].hit.shieldstun < 0){
        player[i].hit.shieldstun = 0;
      }
    }
    player[i].phys.canWallJump = aS[cS[i]][player[i].actionState].wallJumpAble;
    aS[cS[i]][player[i].actionState].main(i);
    if (Math.abs(player[i].phys.kVel.x) > 0){
      var oSign = Math.sign(player[i].phys.kVel.x);
      player[i].phys.kVel.x -= player[i].phys.kDec.x;
      if (oSign != Math.sign(player[i].phys.kVel.x)){
        player[i].phys.kVel.x = 0;
      }
    }
    if (Math.abs(player[i].phys.kVel.y) > 0){
      var oSign = Math.sign(player[i].phys.kVel.y);
      player[i].phys.kVel.y -= player[i].phys.kDec.y;
      if (oSign != Math.sign(player[i].phys.kVel.y)){
        player[i].phys.kVel.y = 0;
      }
    }
    if (player[i].actionState == 68 || player[i].actionState == 67){
      player[i].phys.pos.x += player[i].phys.cVel.x;
      player[i].phys.pos.y += player[i].phys.cVel.y;
    }
    else {
      player[i].phys.pos.x += player[i].phys.cVel.x + player[i].phys.kVel.x;
      player[i].phys.pos.y += player[i].phys.cVel.y + player[i].phys.kVel.y;
    }

  }
  if (player[i].actionState == 30 || player[i].actionState == 31){
    player[i].phys.hurtBoxState = 1;
  }
  else {
    player[i].phys.hurtBoxState = 0;
  }
  if (player[i].phys.invincibleTimer > 0){
    player[i].phys.invincibleTimer--;
    player[i].phys.hurtBoxState = 2;
  }
  if (player[i].phys.intangibleTimer > 0){
    player[i].phys.intangibleTimer--;
    player[i].phys.hurtBoxState = 1;
  }

  var x = player[i].phys.pos.x;
  var y = player[i].phys.pos.y;

  if (!player[i].phys.grounded){
    player[i].phys.airborneTimer++;
  }

  // V Cancel
  if (player[i].phys.vCancelTimer > 0){
    player[i].phys.vCancelTimer--;
  }
  if (player[i].phys.techTimer > 0){
    player[i].phys.techTimer--;
  }
  if (player[i].phys.shoulderLockout > 0){
    player[i].phys.shoulderLockout--;
  }
  if ((player[i].inputs.l[0] && !player[i].inputs.l[1]) || (player[i].inputs.r[0] && !player[i].inputs.r[1])){
    if (!player[i].phys.grounded){
      if (player[i].phys.shoulderLockout == 0){
        player[i].phys.vCancelTimer = 3;
        player[i].phys.techTimer = 20;
      }
    }
    player[i].phys.shoulderLockout = 40;
  }

  /*if (player[i].actionState == 11){
    player[i].phys.ECBp = [new Vec2D(0+x,1+y),new Vec2D(3+x,9+y),new Vec2D(0+x,14+y),new Vec2D(-3+x,9+y)];
  }
  else if (player[i].actionState == 24){
    player[i].phys.ECBp = [new Vec2D(0+x,1+y),new Vec2D(2+x,9+y),new Vec2D(0+x,14+y),new Vec2D(-2+x,9+y)];
  }*/


  //console.log(player[i].timer);
  var frame = Math.floor(player[i].timer);
  if (frame == 0){
    frame = 1;
  }
  //console.log(aS[cS[i]][player[i].actionState].name+" "+(frame-1));
  var ecbOffset = ecb[cS[i]][aS[cS[i]][player[i].actionState].name][frame-1];
  switch (player[i].actionState){
    case 15:
    case 17:
    case 20:
    case 25:
    case 61:
    case 72:
    case 94:
      ecbOffset = ecb[cS[i]][aS[cS[i]][player[i].actionState].name][0];
      break;
    case 26:
    case 27:
    case 28:
    case 29:
      ecbOffset = [0,0,0,0];
      break;
    default:
      break;
  }
  player[i].phys.ECBp = [new Vec2D(0+x,ecbOffset[0]+y),new Vec2D(ecbOffset[1]+x,ecbOffset[2]+y),new Vec2D(0+x,ecbOffset[3]+y),new Vec2D(ecbOffset[1]*-1+x,ecbOffset[2]+y)];
  if (player[i].phys.grounded || player[i].phys.airborneTimer < 10){
    player[i].phys.ECBp[0].y = 0+y;;
  }
  if (!aS[cS[i]][player[i].actionState].ignoreCollision){

  for (var j=0;j<stage.platform.length;j++){
    if (player[i].phys.abovePlatforms[j] && player[i].phys.ECBp[0].y < stage.platform[j][0].y && player[i].phys.ECBp[0].x >= stage.platform[j][0].x && player[i].phys.ECBp[0].x <= stage.platform[j][1].x && ((player[i].inputs.lStickAxis[0].y > -0.56 && aS[cS[i]][player[i].actionState].canPassThrough) || !aS[cS[i]][player[i].actionState].canPassThrough)){
      if (player[i].hit.hitlag > 0){
        player[i].phys.pos.y = stage.platform[j][0].y;
      }
      else {
        land(i,stage.platform[j][0].y,1,j);
      }
    }
  }

  for (var j=0;j<stage.platform.length;j++){
    if (player[i].phys.ECBp[0].y >= stage.platform[j][0].y){
      player[i].phys.abovePlatforms[j] = true;
    }
    else {
      player[i].phys.abovePlatforms[j] = false;
    }
  }
  if (player[i].phys.grounded){
    var stillGrounded = true;
    if (player[i].phys.onSurface[0] == 0){
      var g = player[i].phys.onSurface[1];
      if (player[i].phys.ECBp[0].x < stage.ground[g][0].x-0.1){
        if (aS[cS[i]][player[i].actionState].canEdgeCancel){
          if (player[i].inputs.lStickAxis[0].x < -0.6 || player[i].phys.face == 1 || aS[cS[i]][player[i].actionState].disableTeeter){
            stillGrounded = false;
          }
          else if (player[i].phys.cVel.x == 0 && player[i].phys.kVel.x == 0){
            stillGrounded = false;
          }
          else {
            player[i].phys.cVel.x = 0;
            player[i].phys.pos.x = stage.ground[g][0].x;
            aS[cS[i]][0].init(i);
          }
        }
        else if (player[i].phys.cVel.x == 0 && player[i].phys.kVel.x == 0 && (player[i].actionState < 74 || player[i].actionState > 84)){
          stillGrounded = false;
        }
        else {
          player[i].phys.cVel.x = 0;
          player[i].phys.pos.x = stage.ground[g][0].x;
        }
      }
      else if (player[i].phys.ECBp[0].x > stage.ground[g][1].x+0.1){
        if (aS[cS[i]][player[i].actionState].canEdgeCancel){
          if (player[i].inputs.lStickAxis[0].x > 0.6 || player[i].phys.face == -1 || aS[cS[i]][player[i].actionState].disableTeeter){
            stillGrounded = false;
          }
          else if (player[i].phys.cVel.x == 0 && player[i].phys.kVel.x == 0){
            stillGrounded = false;
          }
          else {
            player[i].phys.cVel.x = 0;
            player[i].phys.pos.x = stage.ground[g][1].x;
            aS[cS[i]][0].init(i);
          }
        }
        else if (player[i].phys.cVel.x == 0 && player[i].phys.kVel.x == 0 && (player[i].actionState < 74 || player[i].actionState > 84)){
          stillGrounded = false;
        }
        else {
          player[i].phys.cVel.x = 0;
          player[i].phys.pos.x = stage.ground[g][1].x;
        }
      }
    }
    else {
      var m = player[i].phys.onSurface[1];
      if (player[i].phys.ECBp[0].x < stage.platform[m][0].x-0.1){
        if (aS[cS[i]][player[i].actionState].canEdgeCancel){
          if (player[i].inputs.lStickAxis[0].x < -0.6 || player[i].phys.face == 1 || aS[cS[i]][player[i].actionState].disableTeeter){
            stillGrounded = false;
          }
          else if (player[i].phys.cVel.x == 0 && player[i].phys.kVel.x == 0){
            stillGrounded = false;
          }
          else {
            player[i].phys.cVel.x = 0;
            player[i].phys.pos.x = stage.platform[m][0].x;
            aS[cS[i]][0].init(i);
          }
        }
        else if (player[i].phys.cVel.x == 0 && player[i].phys.kVel.x == 0 && (player[i].actionState < 74 || player[i].actionState > 84)){
          stillGrounded = false;
        }
        else {
          player[i].phys.cVel.x = 0;
          player[i].phys.pos.x = stage.platform[m][0].x;
        }
      }
      else if (player[i].phys.ECBp[0].x > stage.platform[m][1].x+0.1){
        if (aS[cS[i]][player[i].actionState].canEdgeCancel){
          if (player[i].inputs.lStickAxis[0].x > 0.6 || player[i].phys.face == -1 || aS[cS[i]][player[i].actionState].disableTeeter){
            stillGrounded = false;
          }
          else if (player[i].phys.cVel.x == 0 && player[i].phys.kVel.x == 0){
            stillGrounded = false;
          }
          else {
            player[i].phys.cVel.x = 0;
            player[i].phys.pos.x = stage.platform[m][1].x;
            aS[cS[i]][0].init(i);
          }
        }
        else if (player[i].phys.cVel.x == 0 && player[i].phys.kVel.x == 0 && (player[i].actionState < 74 || player[i].actionState > 84)){
          stillGrounded = false;
        }
        else {
          player[i].phys.cVel.x = 0;
          player[i].phys.pos.x = stage.platform[m][1].x;
        }
      }
    }
    if (!stillGrounded){
      player[i].phys.grounded = false;
      player[i].phys.shielding = false;
      aS[cS[i]][13].init(i);
      if (Math.abs(player[i].phys.cVel.x) > player[i].charAttributes.aerialHmaxV){
        player[i].phys.cVel.x = Math.sign(player[i].phys.cVel.x) * player[i].charAttributes.aerialHmaxV;
      }
    }
  }
  var notTouchingWalls = [true,true];
  for (var j=0;j<stage.wallL.length;j++){
    if (player[i].phys.ECBp[1].y < stage.wallL[j][0].y && player[i].phys.ECBp[1].y > stage.wallL[j][1].y && player[i].phys.ECBp[1].x >= stage.wallL[j][1].x && (player[i].phys.ECB1[1].x <= stage.wallL[j][1].x || ((player[i].phys.ECB1[1].y >= stage.wallL[j][0].y || player[i].phys.ECB1[1].y <= stage.wallL[j][1].y) && player[i].phys.ECB1[3].x <= stage.wallL[j][0].x))){
      //player[i].phys.ECB1[3].x <= stage.wallL[j][0].x is kind of a shitty fix. It is very unlikely something will break it though.
      notTouchingWalls[0] = false;
      player[i].phys.pos.x -= player[i].phys.ECBp[1].x - stage.wallL[j][1].x;
      if (player[i].actionState == 39){
        if (player[i].hit.hitlag == 0){
          player[i].phys.face = -1;
          if (player[i].phys.techTimer > 0){
            if (player[i].inputs.x[0] || player[i].inputs.y[0] || player[i].inputs.lStickAxis[0].y > 0.7){
              aS[cS[i]][92].init(i);
            }
            else {
              aS[cS[i]][90].init(i);
            }
          }
          else {
            drawVfx("wallBounce",new Vec2D(stage.wallL[j][1].x,player[i].phys.ECBp[1].y),-1,0);
            aS[cS[i]][89].init(i);
          }
        }
      }
      else if (player[i].phys.canWallJump){
        if (player[i].phys.wallJumpTimer == 254){
          if (player[i].phys.posDelta.x >= 0.5){
            player[i].phys.wallJumpTimer = 0;
          }
        }
        if (player[i].phys.wallJumpTimer >= 0 && player[i].phys.wallJumpTimer < 120){
          if (player[i].inputs.lStickAxis[0].x <= -0.7 && player[i].inputs.lStickAxis[3].x >= 0 && player[i].charAttributes.walljump){
            player[i].phys.wallJumpTimer = 254;
            player[i].phys.face = -1;
            aS[cS[i]][91].init(i);
          }
          else {
            player[i].phys.wallJumpTimer++;
          }
        }
      }
    }
  }

  for (var j=0;j<stage.wallR.length;j++){
    if (player[i].phys.ECBp[3].y < stage.wallR[j][0].y && player[i].phys.ECBp[3].y > stage.wallR[j][1].y && player[i].phys.ECBp[3].x <= stage.wallR[j][1].x && (player[i].phys.ECB1[3].x >= stage.wallR[j][1].x || ((player[i].phys.ECB1[3].y >= stage.wallR[j][0].y || player[i].phys.ECB1[3].y <= stage.wallR[j][1].y) && player[i].phys.ECB1[1].x >= stage.wallR[j][0].x))){
      notTouchingWalls[1] = false;
      player[i].phys.pos.x -= player[i].phys.ECBp[3].x - stage.wallR[j][1].x;
      if (player[i].actionState == 39){
        if (player[i].hit.hitlag == 0){
          player[i].phys.face = 1;
          if (player[i].phys.techTimer > 0){
            if (player[i].inputs.x[0] || player[i].inputs.y[0] || player[i].inputs.lStickAxis[0].y > 0.7){
              aS[cS[i]][92].init(i);
            }
            else {
              aS[cS[i]][90].init(i);
            }
          }
          else {
            drawVfx("wallBounce",new Vec2D(stage.wallR[j][1].x,player[i].phys.ECBp[3].y),1,1);
            aS[cS[i]][89].init(i);
          }
        }
      }
      else if (player[i].phys.canWallJump){
        if (player[i].phys.wallJumpTimer == 254){
          if (player[i].phys.posDelta.x >= 0.5){
            player[i].phys.wallJumpTimer = 0;
          }
        }
        if (player[i].phys.wallJumpTimer >= 0 && player[i].phys.wallJumpTimer < 120){
          if (player[i].inputs.lStickAxis[0].x >= 0.7 && player[i].inputs.lStickAxis[3].x <= 0 && player[i].charAttributes.walljump){
            player[i].phys.wallJumpTimer = 254;
            player[i].phys.face = 1;
            aS[cS[i]][91].init(i);
          }
          else {
            player[i].phys.wallJumpTimer++;
          }
        }
      }
    }
  }
  if (notTouchingWalls[0] && notTouchingWalls[1] && player[i].phys.canWallJump){
    player[i].phys.wallJumpTimer = 254;
  }

  if (player[i].phys.grounded){
    for (var j=0;j<4;j++){
      if (playerType[j] > -1){
        if (i != j){
          if (player[j].phys.grounded && player[j].phys.onSurface[0] == player[i].phys.onSurface[0] && player[j].phys.onSurface[1] == player[i].phys.onSurface[1]){
            if (player[i].phys.grabbing != j && player[i].phys.grabbedBy != j){
              var diff = Math.abs(player[i].phys.pos.x - player[j].phys.pos.x);
              if (diff < 6.5 && diff > 0){
                player[j].phys.pos.x += Math.sign(player[i].phys.pos.x - player[j].phys.pos.x)*-0.3;
              }
              else if  (diff == 0 && Math.abs(player[i].phys.cVel.x) > Math.abs(player[j].phys.cVel.x)){
                player[j].phys.pos.x += Math.sign(player[i].phys.cVel.x)*-0.3;
              }
            }
          }
        }
      }
    }
  }

  if (player[i].phys.shielding == false){
    player[i].phys.shieldHP += 0.07;
    if (player[i].phys.shieldHP > 60){
      player[i].phys.shieldHP = 60;
    }
  }

  if (!player[i].phys.grounded){
    for (var j=0;j<stage.ground.length;j++){
      if (player[i].phys.ECBp[0].y < stage.ground[j][0].y && player[i].phys.ECBp[0].x >= stage.ground[j][0].x && player[i].phys.ECBp[0].x <= stage.ground[j][1].x && player[i].phys.ECB1[0].y >= stage.ground[j][0].y){
        if (player[i].hit.hitlag > 0){
          player[i].phys.pos.y = stage.ground[j][0].y;
        }
        else {
          land(i,stage.ground[j][0].y,0,j);
        }
        break;
      }
    }
    for (var j=0;j<stage.ceiling.length;j++){
      if (player[i].phys.ECBp[2].y > stage.ceiling[j][0].y && player[i].phys.ECBp[0].x >= stage.ceiling[j][0].x && player[i].phys.ECBp[0].x <= stage.ceiling[j][1].x && player[i].phys.ECB1[2].y <= stage.ceiling[j][0].y){
        player[i].phys.pos.y = stage.ceiling[j][0].y-(player[i].phys.ECBp[2].y-player[i].phys.pos.y);
        if (aS[cS[i]][player[i].actionState].headBonk){
          player[i].phys.cVel.y = 0;
          aS[cS[i]][13].init(i)
        }
      }
    }
  }

  // TOP CORNER COLLISION
  for (var j=0;j<stage.ground.length;j++){
    if (player[i].phys.ECBp[0].y < stage.ground[j][0].y && player[i].phys.ECBp[1].y > stage.ground[j][0].y && player[i].phys.ECB1[0].x <= stage.ground[j][0].x){
      //console.log("top left corner in line");
      var yDistToBottom = Math.abs(stage.ground[j][0].y - player[i].phys.ECBp[0].y);
      //console.log("yDistToBottom "+yDistToBottom);
      var curECBangle = Math.atan((ecbOffset[2]-ecbOffset[0])/ecbOffset[1]);
      //console.log("curECBangle "+curECBangle);
      var proposedXDistance = yDistToBottom/Math.tan(curECBangle);
      //console.log("proposedXDistance "+proposedXDistance);
      //console.log("ecb offset: "+ecbOffset);
      //console.log("ECB X:"+ecbOffset[1]);
      //console.log("ECB Y:"+ecbOffset[2]);
      //console.log("corner to centre dist : "+(stage.ground[j][0].x-player[i].phys.ECBp[0].x));
      if (stage.ground[j][0].x-player[i].phys.ECBp[0].x < proposedXDistance){
        //console.log("top left corner within diamond");
        player[i].phys.pos.x = stage.ground[j][0].x - proposedXDistance;
      }

    }
    else if (player[i].phys.ECBp[0].y < stage.ground[j][0].y && player[i].phys.ECBp[3].y > stage.ground[j][0].y && player[i].phys.ECB1[0].x >= stage.ground[j][1].x){
      //console.log("top right corner in rectangle");
      var yDistToBottom = Math.abs(stage.ground[j][1].y - player[i].phys.ECBp[0].y);
      //console.log("yDistToBottom "+yDistToBottom);
      var curECBangle = Math.atan((ecbOffset[2]-ecbOffset[0])/ecbOffset[1]);
      //console.log("curECBangle "+curECBangle);
      var proposedXDistance = yDistToBottom/Math.tan(curECBangle);
      //console.log("proposedXDistance "+proposedXDistance);
      //console.log("ECB X:"+ecbOffset[1]);
      //console.log("ECB Y:"+ecbOffset[2]);
      //console.log("corner to centre dist : "+(stage.ground[j][1].x-player[i].phys.ECBp[0].x));
      if ((stage.ground[j][1].x-player[i].phys.ECBp[0].x)*-1 < proposedXDistance){
        //console.log("top right corner within diamond");
        player[i].phys.pos.x = stage.ground[j][1].x + proposedXDistance;
      }
    }
  }
  // BOTTOM CORNER COLLISION
  for (var j=0;j<stage.ceiling.length;j++){
    if (player[i].phys.ECBp[2].y > stage.ceiling[j][0].y && player[i].phys.ECBp[3].y < stage.ceiling[j][0].y && player[i].phys.ECB1[2].x >= stage.ceiling[j][1].x){
      //console.log("bottom right corner in rectangle");
      var yDistToTop = Math.abs(stage.ceiling[j][1].y - player[i].phys.ECBp[2].y);
      //console.log("yDistToTop "+yDistToTop);
      var curECBangle = Math.atan((ecbOffset[3]-ecbOffset[2])/ecbOffset[1]);
      //console.log("curECBangle "+curECBangle);
      var proposedXDistance = yDistToTop/Math.tan(curECBangle);
      //console.log("proposedXDistance "+proposedXDistance);
      //console.log("ECB X:"+ecbOffset[1]);
      //console.log("ECB Y:"+ecbOffset[2]);
      //console.log("corner to centre dist : "+(stage.ceiling[j][1].x-player[i].phys.ECBp[0].x));
      if ((stage.ceiling[j][1].x-player[i].phys.ECBp[0].x)*-1 < proposedXDistance){
        //console.log("bottom right corner within diamond");
        player[i].phys.pos.x = stage.ceiling[j][1].x + proposedXDistance;
      }
    }
    else if (player[i].phys.ECBp[2].y > stage.ceiling[j][0].y && player[i].phys.ECBp[1].y < stage.ceiling[j][0].y && player[i].phys.ECB1[2].x <= stage.ceiling[j][0].x){
      //console.log("bottom left corner in rectangle");
      var yDistToTop = Math.abs(stage.ceiling[j][0].y - player[i].phys.ECBp[2].y);
      //console.log("yDistToTop "+yDistToTop);
      var curECBangle = Math.atan((ecbOffset[2]-ecbOffset[0])/ecbOffset[1]);
      //console.log("curECBangle "+curECBangle);
      var proposedXDistance = yDistToTop/Math.tan(curECBangle);
      //console.log("proposedXDistance "+proposedXDistance);
      //console.log("ecb offset: "+ecbOffset);
      //console.log("ECB X:"+ecbOffset[1]);
      //console.log("ECB Y:"+ecbOffset[2]);
      //console.log("corner to centre dist : "+(stage.ceiling[j][0].x-player[i].phys.ECBp[2].x));
      if (stage.ceiling[j][0].x-player[i].phys.ECBp[2].x < proposedXDistance){
        //console.log("bottom left corner within diamond");
        player[i].phys.pos.x = stage.ceiling[j][0].x - proposedXDistance;
      }
    }
  }
} // END OF IGNORE COLLISION CHECK

  /*for (var j=0;j<stage.ground.length;j++){
    if (player[i].phys.ECBp[1].x > stage.ground[j][0].x && player[i].phys.ECBp[1].x < stage.ground[j][1].x && player[i].phys.ECBp[1].y > stage.ground[j][0].y && player[i].phys.ECBp[0].y < stage.ground[j][0].y && player[i].phys.ECBp[0].y > stage.ceiling[j][0].y){
      console.log("top left corner");
      player[i].phys.pos.x = stage.ground[j][0].x-(ecbOffset[1]*(stage.ground[j][0].y - player[i].phys.ECBp[0].y)/ecbOffset[2]);
    }
    else if (player[i].phys.ECBp[3].x < stage.ground[j][1].x && player[i].phys.ECBp[3].x > stage.ground[j][0].x && player[i].phys.ECBp[3].y > stage.ground[j][1].y && player[i].phys.ECBp[0].y < stage.ground[j][1].y && player[i].phys.ECBp[0].y > stage.ceiling[j][1].y){
      console.log("top right corner");
    }
  }*/

  player[i].phys.ledgeSnapBoxF = new Box2D([player[i].phys.pos.x,player[i].phys.pos.y+player[i].charAttributes.ledgeSnapBoxOffset[2]],[player[i].phys.pos.x+player[i].charAttributes.ledgeSnapBoxOffset[0],player[i].phys.pos.y+player[i].charAttributes.ledgeSnapBoxOffset[1]]);
  player[i].phys.ledgeSnapBoxB = new Box2D([player[i].phys.pos.x-player[i].charAttributes.ledgeSnapBoxOffset[0],player[i].phys.pos.y+player[i].charAttributes.ledgeSnapBoxOffset[2]],[player[i].phys.pos.x,player[i].phys.pos.y+player[i].charAttributes.ledgeSnapBoxOffset[1]]);
  if (player[i].phys.ledgeRegrabCount){
    player[i].phys.ledgeRegrabTimeout--;
    if (player[i].phys.ledgeRegrabTimeout == 0){
      player[i].phys.ledgeRegrabCount = false;
    }
  }
  var lsBF = -1;
  var lsBB = -1;
  if (player[i].phys.onLedge == -1 && !player[i].phys.ledgeRegrabCount){
    for (var j=0;j<stage.ledge.length;j++){
      var ledgeAvailable = true;
      for (var k=0;k<4;k++){
        if (playerType[k] > -1){
          if (k != i){
            if (player[k].phys.onLedge == j){
              ledgeAvailable = false;
            }
          }
        }
      }
      if (ledgeAvailable && !player[i].phys.grounded){
        var x = (stage.ledge[j][1])?stage.box[stage.ledge[j][0]].max.x:stage.box[stage.ledge[j][0]].min.x;
        var y = stage.box[stage.ledge[j][0]].max.y;
        if (x > player[i].phys.ledgeSnapBoxF.min.x && x < player[i].phys.ledgeSnapBoxF.max.x && y < player[i].phys.ledgeSnapBoxF.min.y && y > player[i].phys.ledgeSnapBoxF.max.y){
          if (stage.ledge[j][1] == 0){
            if (aS[cS[i]][player[i].actionState].canGrabLedge[0]){
              lsBF = j;
            }
          }
          else if (aS[cS[i]][player[i].actionState].canGrabLedge[1]){
            lsBF = j;
          }
        }
        if (x > player[i].phys.ledgeSnapBoxB.min.x && x < player[i].phys.ledgeSnapBoxB.max.x && y < player[i].phys.ledgeSnapBoxB.min.y && y > player[i].phys.ledgeSnapBoxF.max.y){
          if (stage.ledge[j][1] == 1){
            if (aS[cS[i]][player[i].actionState].canGrabLedge[0]){
              lsBB = j;
            }
          }
          else if (aS[cS[i]][player[i].actionState].canGrabLedge[1]){
            lsBB = j;
          }
        }
      }
      if (player[i].phys.cVel.y < 0 && player[i].inputs.lStickAxis[0].y > -0.5){
        if (lsBF > -1){
          if (stage.ledge[lsBF][1]*-2+1 == player[i].phys.face || aS[cS[i]][player[i].actionState].canGrabLedge[1]){
            player[i].phys.onLedge = lsBF;
            player[i].phys.ledgeRegrabTimeout = 30;
            player[i].phys.face = stage.ledge[lsBF][1]*-2+1;
            player[i].phys.pos = new Vec2D(stage.box[stage.ledge[lsBF][0]].min.x+edgeOffset[0][0],stage.box[stage.ledge[lsBF][0]].min.y+edgeOffset[0][1]);
            aS[cS[i]][24].init(i);
          }
        }
        else if (lsBB > -1){
          if (stage.ledge[lsBB][1]*-2+1 == player[i].phys.face || aS[cS[i]][player[i].actionState].canGrabLedge[1]){
            player[i].phys.onLedge = lsBB;
            player[i].phys.ledgeRegrabTimeout = 30;
            player[i].phys.face = stage.ledge[lsBB][1]*-2+1;
            player[i].phys.pos = new Vec2D(stage.box[stage.ledge[lsBB][0]].max.x+edgeOffset[1][0],stage.box[stage.ledge[lsBB][0]].min.y+edgeOffset[1][1]);
            aS[cS[i]][24].init(i);
          }
        }
      }
    }
  }

  if ((player[i].actionState < 26 || player[i].actionState > 29) && player[i].actionState != 93){
    var state = 0;
    if (player[i].phys.pos.x < stage.blastzone.min.x){
      state = 26;
    }
    else if (player[i].phys.pos.x > stage.blastzone.max.x){
      state = 27;
    }
    else if (player[i].phys.pos.y < stage.blastzone.min.y){
      state = 29;
    }
    else if (player[i].phys.pos.y > stage.blastzone.max.y){
      state = 28;
    }
    if (state > 0){
      player[i].stocks--;
      lostStockQueue.push([i,player[i].stocks,0]);
      if (player[i].stocks == 0 && versusMode){
        player[i].stocks = 1;
      }
      aS[cS[i]][state].init(i);
    }
  }

  var x = player[i].phys.pos.x;
  var y = player[i].phys.pos.y;
  player[i].phys.hurtbox = new Box2D([-player[i].charAttributes.hurtboxOffset[0]+x,player[i].charAttributes.hurtboxOffset[1]+y],[player[i].charAttributes.hurtboxOffset[0]+x,y]);
  // check collisions and stuff
  /*if (player[i].actionState == 11){
    player[i].phys.ECB1 = [new Vec2D(0+x,1+y),new Vec2D(3+x,9+y),new Vec2D(0+x,14+y),new Vec2D(-3+x,9+y)];
  }
  else if (player[i].actionState == 24){
    player[i].phys.ECB1 = [new Vec2D(0+x,1+y),new Vec2D(2+x,9+y),new Vec2D(0+x,14+y),new Vec2D(-2+x,9+y)];
  }*/
  player[i].phys.ECB1 = [new Vec2D(0+x,ecbOffset[0]+y),new Vec2D(ecbOffset[1]+x,ecbOffset[2]+y),new Vec2D(0+x,ecbOffset[3]+y),new Vec2D(ecbOffset[1]*-1+x,ecbOffset[2]+y)];
  if (player[i].phys.grounded || player[i].phys.airborneTimer < 10){
    player[i].phys.ECB1[0].y = 0+y;
  }

  /*else if (player[i].phys.grounded || player[i].phys.airborneTimer < 10){
    player[i].phys.ECB1 = [new Vec2D(0+x,0+y),new Vec2D(3+x,7+y),new Vec2D(0+x,14+y),new Vec2D(-3+x,7+y)];
  }
  else {
    player[i].phys.ECB1 = [new Vec2D(0+x,4+y),new Vec2D(3+x,9+y),new Vec2D(0+x,14+y),new Vec2D(-3+x,9+y)];
  }*/

  if (player[i].phys.posPrev.y > -80 && player[i].phys.pos.y <= -80){
    sounds.lowdown.play();
  }
  player[i].phys.isInterpolated = false;
  for (var j=0;j<4;j++){
    if (player[i].hitboxes.active[j] && player[i].phys.prevFrameHitboxes.active[j]){
      var h1 = new Vec2D(player[i].phys.posPrev.x+(player[i].phys.prevFrameHitboxes.id[j].offset[player[i].phys.prevFrameHitboxes.frame].x*player[i].phys.facePrev),player[i].phys.posPrev.y+player[i].phys.prevFrameHitboxes.id[j].offset[player[i].phys.prevFrameHitboxes.frame].y);
      var h2 = new Vec2D(player[i].phys.pos.x+(player[i].hitboxes.id[j].offset[player[i].hitboxes.frame].x*player[i].phys.face),player[i].phys.pos.y+player[i].hitboxes.id[j].offset[player[i].hitboxes.frame].y);
      var a = h2.x - h1.x;
      var b = h2.y - h1.y;
      if (a == 0 || b == 0){
        var x = 0;
      }
      else {
        var x = Math.atan(Math.abs(a)/Math.abs(b));
      }
      var opp = Math.sin(x) * player[i].hitboxes.id[j].size;
      var adj = Math.cos(x) * player[i].hitboxes.id[j].size;
      var sigma = [h1.x,h1.y];
      if ((a>0 && b>0) || (a<=0 && b<=0)){
        var alpha1 = new Vec2D((sigma[0] + adj),(sigma[1] - opp));
        var alpha2 = new Vec2D((alpha1.x + a), (alpha1.y + b));
        var beta1 = new Vec2D((sigma[0] - adj),(sigma[1] + opp));
        var beta2 = new Vec2D((beta1.x + a),(beta1.y + b));
      }
      else {
        var alpha1 = new Vec2D((sigma[0] - adj),(sigma[1] - opp));
        var alpha2 = new Vec2D((alpha1.x + a), (alpha1.y + b));
        var beta1 = new Vec2D((sigma[0] + adj),(sigma[1] + opp));
        var beta2 = new Vec2D((beta1.x + a),(beta1.y + b));
      }
      player[i].phys.interPolatedHitbox[j] = [alpha1,alpha2,beta2,beta1];
      player[i].phys.isInterpolated = true;
    }
  }

  player[i].phys.posDelta = new Vec2D(Math.abs(player[i].phys.pos.x-player[i].phys.posPrev.x),Math.abs(player[i].phys.pos.y-player[i].phys.posPrev.y));

  $("#velocityX"+i).empty().append(player[i].phys.cVel.x.toFixed(5));
  $("#velocityY"+i).empty().append(player[i].phys.cVel.y.toFixed(5));
  $("#kvelocityX"+i).empty().append(player[i].phys.kVel.x.toFixed(5));
  $("#kvelocityY"+i).empty().append(player[i].phys.kVel.y.toFixed(5));
  $("#pvelocityX"+i).empty().append(player[i].phys.pos.x.toFixed(5));
  $("#pvelocityY"+i).empty().append(player[i].phys.pos.y.toFixed(5));
}
c = 0;
canvas = 0;

function renderVfx(){
  var popQueue = [];
  for (var j=0;j<vfxQueue.length;j++){
    vfxQueue[j][1]++;
    if (vfxQueue[j][0].frames >= vfxQueue[j][1]){
      if (showVfx){
        if (vfxQueue[j][0].name[0] == "s" && vfxQueue[j][0].name[1] == "w"){
          dVfx["swing"](j);
        }
        else {
          dVfx[vfxQueue[j][0].name](j);
        }
      }
    }
    else {
      popQueue.push(j);
    }
  }
  for (var k=0;k<popQueue.length;k++){
    vfxQueue.splice(popQueue[k]-k, 1);
  }
}

function drawVfx(name,pos,face,f){
  if (typeof(f)==='undefined') f = -1;
  var instance = {};
  $.extend(true,instance,vfx[name]);
  if (instance.name == "circleDust"){
    instance.circles[0] = Math.random()*-2;
    instance.circles[1] = (Math.random()*-stage.scale)-2;
    instance.circles[2] = Math.random()*2;
    instance.circles[3] = (Math.random()*stage.scale)+2;
  }
  var newPos = new Vec2D(pos.x,pos.y);
  vfxQueue.push([instance,0,newPos,face,f]);
}

function update(i){
  if (!starting){
    if (playerType[i] == 0){
      if (currentPlayers[i] != -1){
        interpretInputs(i,true);
      }
    }
  }
  physics(i);
}

delta = 0;
lastFrameTimeMs = 0;
lastUpdate = performance.now();

function gameTick(){
  var start = performance.now();
  var diff = 0;
  if (gameMode == 0){
    findPlayers();
  }
  else if (gameMode == 1){
    //console.log(playerType);
    for (var i=0;i<ports;i++){
      interpretInputs(i,true);
      menuMove(i);
    }
  }
  else if (gameMode == 2){
    for (var i=0;i<4;i++){
      if (i < ports){
        interpretInputs(i,true);
        cssControls(i);
      }
      aS[cS[i]][player[i].actionState].main(i);
    }
    for (var i=0;i<4;i++){
      if (playerType[i] > -1){
        hitDetection(i);
      }
    }
    executeHits();
    hitQueue = [];
    findPlayers();
  }
  else if (gameMode == 6){
    // stage select
    for (var i=0;i<4;i++){
      if (i < ports){
        interpretInputs(i,true);
        sssControls(i);
      }
    }
  }
  else if (gameMode == 7){
    // stage select
    interpretInputs(targetPlayer,true);
    tssControls(targetPlayer);
  }
  else if (gameMode == 4){
    interpretInputs(targetBuilder,true);
    targetBuilderControls(targetBuilder);
  }
  else if (gameMode == 5){
    if (endTargetGame){
      finishGame();
    }
    if (playing || frameByFrame){
      var now = performance.now();
      var dt = now - lastUpdate;
      lastUpdate = now;
      destroyArticles();
      executeArticles();
      update(targetBuilder);
      targetHitDetection(targetBuilder);
      if (!starting && !versusMode){
        targetTimerTick();
      }
      else {
        startTimer -= 0.01666667;
        if (startTimer < 0){
          starting = false;
        }
      }
      if (player[targetBuilder].inputs.s[0] && !player[targetBuilder].inputs.s[1]){
        endGame();
      }
      if (frameByFrame){
        frameByFrameRender = true;
      }
      frameByFrame = false;
      diff = performance.now() - start;
      gamelogicTime[0] += diff;
      gamelogicTime[0] /= 2;
      if (diff >= 10){
        gamelogicTime[3]++;
      }
      if (diff < gamelogicTime[2]){
        gamelogicTime[2] = diff;
      }
      if (diff > gamelogicTime[1]){
        gamelogicTime[1] = diff;
      }
      $("#gamelogicAvg").empty().append(Math.round(gamelogicTime[0]));
      $("#gamelogicHigh").empty().append(Math.round(gamelogicTime[1]));
      $("#gamelogicLow").empty().append(Math.round(gamelogicTime[2]));
      $("#gamelogicPeak").empty().append(gamelogicTime[3]);
    }
    else {
      if (!gameEnd){
        interpretInputs(targetBuilder,false);
      }
    }
  }
  else if (playing || frameByFrame){
    //console.log("test0");
    /*delta = timestamp - lastFrameTimeMs; // get the delta time since last frame
    lastFrameTimeMs = timestamp;
    console.log(delta);*/
    var now = performance.now();
    var dt = now - lastUpdate;

    //console.log(now);
    //console.log(dt);
    lastUpdate = now;

    hitQueue = [];
    stage.movingPlatforms();
    destroyArticles();
    executeArticles();
    for (var i=0;i<4;i++){
      if (playerType[i] > -1){
        update(i);
      }
    }
    for (var i=0;i<4;i++){
      if (playerType[i] > -1){
        hitDetection(i);
      }
    }
    executeHits();
    if (!starting && !versusMode){
      matchTimerTick();
    }
    else {
      startTimer -= 0.01666667;
      if (startTimer < 0){
        starting = false;
      }
    }
    if (frameByFrame){
      frameByFrameRender = true;
    }
    frameByFrame = false;
    diff = performance.now() - start;
    gamelogicTime[0] += diff;
    gamelogicTime[0] /= 2;
    if (diff >= 10){
      gamelogicTime[3]++;
    }
    if (diff < gamelogicTime[2]){
      gamelogicTime[2] = diff;
    }
    if (diff > gamelogicTime[1]){
      gamelogicTime[1] = diff;
    }
    $("#gamelogicAvg").empty().append(Math.round(gamelogicTime[0]));
    $("#gamelogicHigh").empty().append(Math.round(gamelogicTime[1]));
    $("#gamelogicLow").empty().append(Math.round(gamelogicTime[2]));
    $("#gamelogicPeak").empty().append(gamelogicTime[3]);

    //console.log("test1");
    //console.log(diff);
    //console.log(1000/60-diff);
  }
  else if (findingPlayers){
    findPlayers();
  }
  else {
    if (!gameEnd){
      for (var i=0;i<4;i++){
        if (playerType[i] == 0){
          if (currentPlayers[i] != -1){
            interpretInputs(i,false);
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

  setTimeout(gameTick,16-diff);
}
otherFrame = true;
fps30 = false;
function renderTick(){
  window.requestAnimationFrame(renderTick);
  otherFrame ^= true
  if ((fps30 && otherFrame) || !fps30){
    //console.log("------");
    if (gameMode == 20){
      drawStartUp();
    }
    else if (gameMode == 0){
      drawStartScreen();
    }
    else if (gameMode == 1){
      drawMainMenu();
    }
    else if (gameMode == 2){
      drawCSS();
      //renderVfx();
    }
    else if (gameMode == 6){
      drawSSS();
    }
    else if (gameMode == 7){
      drawTSS();
    }
    else if (gameMode == 4){
      renderTargetBuilder();
    }
    else if (gameMode == 5){
      if (playing || frameByFrameRender){
        var rStart = performance.now();
        c.fillStyle = "rgba(0, 0, 0, 1)";
        c.fillRect(0,0,canvas.width,canvas.height);
        if (showVfx){
          drawBackground();
        }
        drawStage();
        renderPlayer(targetBuilder);
        renderArticles();
        renderVfx();
        renderOverlay(false);
        var diff = performance.now() - rStart;
        renderTime[0] += diff;
        renderTime[0] /= 2;
        if (diff >= 10){
          renderTime[3]++;
        }
        if (diff > renderTime[1]){
          renderTime[1] = diff;
        }
        if (diff < renderTime[2]){
          renderTime[2] = diff;
        }

        $("#renderAvg").empty().append(Math.round(renderTime[0]));
        $("#renderHigh").empty().append(Math.round(renderTime[1]));
        $("#renderLow").empty().append(Math.round(renderTime[2]));
        $("#renderPeak").empty().append(renderTime[3]);
      }
    }
    else if (playing || frameByFrameRender){
      /*delta = timestamp - lastFrameTimeMs; // get the delta time since last frame
      lastFrameTimeMs = timestamp;
      console.log(delta);*/
      //console.log("test2");
      var rStart = performance.now();
      c.fillStyle = "rgba(0, 0, 0, 1)";
      c.fillRect(0,0,canvas.width,canvas.height);
      if (showVfx){
        drawBackground();
      }
      drawStage();
      for (var i=0;i<4;i++){
        if (playerType[i] > -1){
          renderPlayer(i);
        }
      }
      renderArticles();
      renderVfx();
      renderOverlay(true);
      var diff = performance.now() - rStart;
      renderTime[0] += diff;
      renderTime[0] /= 2;
      if (diff >= 10){
        renderTime[3]++;
      }
      if (diff > renderTime[1]){
        renderTime[1] = diff;
      }
      if (diff < renderTime[2]){
        renderTime[2] = diff;
      }

      $("#renderAvg").empty().append(Math.round(renderTime[0]));
      $("#renderHigh").empty().append(Math.round(renderTime[1]));
      $("#renderLow").empty().append(Math.round(renderTime[2]));
      $("#renderPeak").empty().append(renderTime[3]);
      //console.log("test3");
    }
    if (frameByFrameRender){
      renderForeground();
    }
    frameByFrameRender = false;
  //console.log(performance.now());
  }
}

function buildPlayerObject(i){
  player[i] = new playerObject(cS[i],startingPoint[i],startingFace[i]);
  player[i].phys.ECB1 = [new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y)];
  player[i].phys.ECBp = [new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y),new Vec2D(startingPoint[i].x,startingPoint[i].y)];
}

for (var i=0;i<4;i++){
  buildPlayerObject(i);
  player[i].phys.face = 1;
  player[i].actionState = 0;
}

function initializePlayers(i,target){
  buildPlayerObject(i);
  /*if (hasTag[i]){
    tagText[i] = $("#pTagEdit"+i).val();
  }*/
  if (target){
    drawVfx("entrance",new Vec2D(stage.startingPoint.x,stage.startingPoint.y));
  }
  else {
    drawVfx("entrance",new Vec2D(startingPoint[i][0],startingPoint[i][1]));
  }
}

function drawStage(){
  c.strokeStyle = "#db80cc";
  c.lineWidth = 1;
  for (var j=0;j<stage.ground.length;j++){
    c.beginPath();
    c.moveTo((stage.ground[j][0].x*stage.scale) +stage.offset[0],(stage.ground[j][0].y*-stage.scale)+stage.offset[1]);
    c.lineTo((stage.ground[j][1].x*stage.scale) +stage.offset[0],(stage.ground[j][1].y*-stage.scale)+stage.offset[1]);
    c.closePath();
    c.stroke();
  }
  c.strokeStyle = "#ed6767";
  for (var j=0;j<stage.ceiling.length;j++){
    c.beginPath();
    c.moveTo((stage.ceiling[j][0].x*stage.scale) +stage.offset[0],(stage.ceiling[j][0].y*-stage.scale)+stage.offset[1]);
    c.lineTo((stage.ceiling[j][1].x*stage.scale) +stage.offset[0],(stage.ceiling[j][1].y*-stage.scale)+stage.offset[1]);
    c.closePath();
    c.stroke();
  }
  for (var j=0;j<stage.box.length;j++){
    c.fillRect((stage.box[j].min.x*stage.scale)+stage.offset[0],(stage.box[j].max.y*-stage.scale)+stage.offset[1],(stage.box[j].max.x-stage.box[j].min.x)*stage.scale,(stage.box[j].max.y-stage.box[j].min.y)*stage.scale);
  }
  c.strokeStyle = "#4794c6";
  for (var j=0;j<stage.platform.length;j++){
      c.beginPath();
      c.moveTo((stage.platform[j][0].x*stage.scale) +stage.offset[0],(stage.platform[j][0].y*-stage.scale)+stage.offset[1]);
      c.lineTo((stage.platform[j][1].x*stage.scale) +stage.offset[0],(stage.platform[j][1].y*-stage.scale)+stage.offset[1]);
      c.closePath();
      c.stroke();
  }
  c.strokeStyle = "#47c648";
  for (var k=0;k<stage.wallL.length;k++){
      c.beginPath();
      c.moveTo((stage.wallL[k][0].x*stage.scale) +stage.offset[0],(stage.wallL[k][0].y*-stage.scale)+stage.offset[1]);
      c.lineTo((stage.wallL[k][1].x*stage.scale) +stage.offset[0],(stage.wallL[k][1].y*-stage.scale)+stage.offset[1]);
      c.closePath();
      c.stroke();
  }
  c.strokeStyle = "#9867de";
  for (var l=0;l<stage.wallR.length;l++){
      c.beginPath();
      c.moveTo((stage.wallR[l][0].x*stage.scale) +stage.offset[0],(stage.wallR[l][0].y*-stage.scale)+stage.offset[1]);
      c.lineTo((stage.wallR[l][1].x*stage.scale) +stage.offset[0],(stage.wallR[l][1].y*-stage.scale)+stage.offset[1]);
      c.closePath();
      c.stroke();
  }
  c.strokeStyle = "#e7a44c";
  //c.fillStyle = "rgba(228, 159, 70, 0.2)";
  for (var j=0;j<stage.ledge.length;j++){
    var e = stage.ledge[j];
    c.beginPath();
    if (e[1]){
      c.moveTo(stage.box[e[0]].max.x*stage.scale+stage.offset[0],(stage.box[e[0]].max.y-Math.min(10,(stage.box[e[0]].max.y-stage.box[e[0]].min.y)/2))*-stage.scale+stage.offset[1]);
      c.lineTo(stage.box[e[0]].max.x*stage.scale+stage.offset[0],stage.box[e[0]].max.y*-stage.scale+stage.offset[1]);
      c.lineTo((stage.box[e[0]].max.x-Math.min(10,(stage.box[e[0]].max.x-stage.box[e[0]].min.x)/2))*stage.scale+stage.offset[0],stage.box[e[0]].max.y*-stage.scale+stage.offset[1]);
    }
    else {
      c.moveTo(stage.box[e[0]].min.x*stage.scale+stage.offset[0],(stage.box[e[0]].max.y-Math.min(10,(stage.box[e[0]].max.y-stage.box[e[0]].min.y)/2))*-stage.scale+stage.offset[1]);
      c.lineTo(stage.box[e[0]].min.x*stage.scale+stage.offset[0],stage.box[e[0]].max.y*-stage.scale+stage.offset[1]);
      c.lineTo((stage.box[e[0]].min.x+Math.min(10,(stage.box[e[0]].max.x-stage.box[e[0]].min.x)/2))*stage.scale+stage.offset[0],stage.box[e[0]].max.y*-stage.scale+stage.offset[1]);
    }
    c.closePath();
    c.stroke();
    c.fill();
    c.fill();

  }
  if (typeof stage.target != "undefined"){
    for (var k=0;k<stage.target.length;k++){
      if (!targetDestroyed[k]){
        var x = stage.target[k].x*stage.scale+stage.offset[0];
        var y = stage.target[k].y*-stage.scale+stage.offset[1];
        for (var j=0;j<5;j++){
          c.fillStyle = (j%2)?"white":"red";
          c.beginPath();
          c.arc(x,y,(25-j*5)*(stage.scale/4.5),0,twoPi);
          c.closePath();
          c.fill();
        }
      }
    }
  }
}

var bgPos = [[-30,500,300,500,900,500,1230,450,358],[-30,400,300,400,900,400,1230,350,179]];
var direction = [[1,-1,1,-1,1,-1,1,-1,1],[-1,1,-1,1,-1,1,-1,1,-1]];
function bgStar(){
  var vSeed = Math.random();
  this.velocity = new Vec2D(5*vSeed*Math.sign(0.5-Math.random()),5*(1-vSeed)*Math.sign(0.5-Math.random()));
  this.colour = "hsl("+358*Math.random()+", 100%, 50%)";
  this.pos = new Vec2D(0,0);
  this.life = 0;
}
bgStars = [];
for (var p=0;p<20;p++){
  bgStars[p] = new bgStar();
  bgStars[p].pos = new Vec2D(600*Math.random()*Math.sign(bgStars[p].velocity.x),400*Math.random()*Math.sign(bgStars[p].velocity.y));
}
bgSparkle = 3;
function drawBackground(){
  bgSparkle--;
  var bgGrad =c.createLinearGradient(0,0,0,500);
  bgGrad.addColorStop(0,"rgb(24, 17, 66)");
  bgGrad.addColorStop(1,"black");
  c.fillStyle=bgGrad;
  c.fillRect(-100,-100,canvas.width+200,canvas.height+200);
  for (var p=0;p<20;p++){
    if (Math.abs(bgStars[p].pos.x) > 600 || Math.abs(bgStars[p].pos.y) > 400){
      bgStars[p] = new bgStar();
    }
    bgStars[p].pos.x += bgStars[p].velocity.x;
    bgStars[p].pos.y += bgStars[p].velocity.y;

    bgStars[p].life++;

    if (bgSparkle == 0){
      c.fillStyle = bgStars[p].colour;
      c.globalAlpha = Math.min(bgStars[p].life/300,1);
      c.beginPath();
      c.arc(600+bgStars[p].pos.x,375+bgStars[p].pos.y,5,twoPi,0);
      c.fill();

    }
  }
  if (bgSparkle == 0){
    bgSparkle = 2;
  }
  c.globalAlpha = 1;
  for (var k=1;k>-1;k--){
    for (var j=0;j<9;j++){
      //bgPos[j] += direction[j]*5*Math.random();
      if (j == 8){
        bgPos[k][j] += direction[k][j]*0.2*Math.random();
      }
      else {
        bgPos[k][j] += direction[k][j]*1*Math.random();
      }
      switch (j){
        case 0:
          if ((direction[k][j] == 1 && bgPos[k][j] > -10) || (direction[k][j] == -1 && bgPos[k][j] < -200)){
            direction[k][j] *= -1;
          }
          break;
        case 1:
          if ((direction[k][j] == 1 && bgPos[k][j] > 550-k*100) || (direction[k][j] == -1 && bgPos[k][j] < 450-k*100)){
            direction[k][j] *= -1;
          }
          break;
        case 2:
          if ((direction[k][j] == 1 && bgPos[k][j] > 550) || (direction[k][j] == -1 && bgPos[k][j] < 0)){
            direction[k][j] *= -1;
          }
          break;
        case 3:
          if ((direction[k][j] == 1 && bgPos[k][j] > 550-k*100) || (direction[k][j] == -1 && bgPos[k][j] < 450-k*100)){
            direction[k][j] *= -1;
          }
          break;
        case 4:
          if ((direction[k][j] == 1 && bgPos[k][j] > 1150) || (direction[k][j] == -1 && bgPos[k][j] < 600)){
            direction[k][j] *= -1;
          }
          break;
        case 5:
          if ((direction[k][j] == 1 && bgPos[k][j] > 550-k*100) || (direction[k][j] == -1 && bgPos[k][j] < 450-k*100)){
            direction[k][j] *= -1;
          }
          break;
        case 6:
          if ((direction[k][j] == 1 && bgPos[k][j] > 1400) || (direction[k][j] == -1 && bgPos[k][j] < 1210)){
            direction[k][j] *= -1;
          }
          break;
        case 7:
          if ((direction[k][j] == 1 && bgPos[k][j] > 550-k*100) || (direction[k][j] == -1 && bgPos[k][j] < 450-k*100)){
            direction[k][j] *= -1;
          }
          break;
        case 8:
          if ((direction[k][j] == 1 && bgPos[k][j] > 357) || (direction[k][j] == -1 && bgPos[k][j] < 1)){
            direction[k][j] *= -1;
          }
          break;
        default:
          break;
      }
    }
    c.fillStyle = "hsla("+bgPos[k][8]+", 100%, 50%, "+(0.15-k*0.07)+")";
    c.beginPath();
    c.moveTo(bgPos[k][0],bgPos[k][1]);
    c.bezierCurveTo(bgPos[k][2],bgPos[k][3],bgPos[k][4],bgPos[k][5],bgPos[k][6],bgPos[k][7]);
    if (k == 1){
      c.lineTo(bgPos[0][6],bgPos[0][7]);
      c.bezierCurveTo(bgPos[0][4],bgPos[0][5],bgPos[0][2],bgPos[0][3],bgPos[0][0],bgPos[0][1]);
    }
    else {
      c.lineTo(1200,750);
      c.lineTo(0,750);
    }
    c.closePath();
    c.fill();
  }
}

function startGame(){
  gameMode = 3;
  vfxQueue = [];
  for (var n=0;n<4;n++){
    if (playerType[n] > -1){
      initializePlayers(n,false);
      renderPlayer(n);
      player[n].inCSS = false;
    }
    if (versusMode){
      player[n].stocks = 1;
    }
  }
  matchTimer = 480;
  startTimer = 1.5;
  starting = true;
  sounds.menu2.stop();
  sounds.battlefield.stop();
  sounds.battlefield.play("battlefieldStart");
  drawVfx("start",new Vec2D(0,0));
  findingPlayers = false;
  playing = true;
  stage = stages[stageSelect];
}

function endGame(){
  gameEnd = false;
  lostStockQueue = [];
  sounds.battlefield.stop();
  playing = false;
  c.fillStyle = "rgba(0, 0, 0, 1)";
  c.fillRect(-100,-100,canvas.width+200,canvas.height+200);
  drawStage();
  if (gameMode == 3){
    gameMode = 2;
  }
  else if (gameMode == 5){
    if (targetTesting){
      gameMode = 4;
    }
    else {
      gameMode = 7;
    }
  }
  sounds.menu2.play("menu2Start");
  //$("#playerFind").show();
  pause = [[true,true],[true,true],[true,true],[true,true]];
  frameAdvance = [[true,true],[true,true],[true,true],[true,true]];
  findingPlayers = true;
  positionPlayersInCSS();
  for (var i=0;i<4;i++){
    if (playerType[i] > -1){
      if (player[i].actionState == 72){
        sounds.furaloop.stop(player[i].furaLoopID);
      }
      player[i].inputs.a[0] = true;
      player[i].inputs.a[1] = true;
      player[i].inCSS = true;
      player[i].phys.face = 1;
      player[i].actionState = 0;
      player[i].timer = 0;
    }
  }
}

function finishGame(){
  endTargetGame = false;
  gameEnd = true;
  playing = false;
  c.save();
  c.textAlign = "center";
  var text = "Game!";
  var size = 300;
  var textScale = 1;
  var textGrad =c.createLinearGradient(0,200,0,520);
  if (gameMode == 5 || gameMode == 8){
    if (stage.target.length == targetsDestroyed){
      if (!targetTesting){
        if (targetStagePlaying < 10){
          for (var i=0;i<3;i++){
            if (!medalsEarned[cS[targetPlayer]][targetStagePlaying][i]){
              if (matchTimer <= medalTimes[cS[targetPlayer]][targetStagePlaying][i]){
                medalsEarned[cS[targetPlayer]][targetStagePlaying][i] = true;
              }
            }
          }
        }
        if (matchTimer < targetRecords[cS[targetPlayer]][targetStagePlaying] || targetRecords[cS[targetPlayer]][targetStagePlaying] == -1){
          targetRecords[cS[targetPlayer]][targetStagePlaying] = matchTimer;
          if (targetStagePlaying < 10){
            if (matchTimer < worldRecords[cS[targetPlayer]][targetStagePlaying]){
              worldRecords[cS[targetPlayer]][targetStagePlaying] = matchTimer;
              worldRecordNames[cS[targetPlayer]][targetStagePlaying] = "you";
            }
          }
          sounds.newRecord.play();
        }
        else {
          sounds.complete.play();
        }
      }
      else {
        sounds.complete.play();
      }
      text = "Complete!";
      size = 200;
      textScale = 1.5;
      var textGrad =c.createLinearGradient(0,200/textScale,0,520/textScale);
      textGrad.addColorStop(0,"black");
      textGrad.addColorStop(0.4,"black");
      textGrad.addColorStop(0.8,"rgb(150, 86, 46)");
      textGrad.addColorStop(1,"rgb(205, 108, 45)");
    }
    else {
      sounds.failure.play();
      text = "Failure";
      size = 250;
      textGrad.addColorStop(0,"black");
      textGrad.addColorStop(0.5,"black");
      textGrad.addColorStop(0.7,"rgb(51, 34, 251)");
      textGrad.addColorStop(1,"rgb(107, 71, 250)");
    }
  }
  else {
    if (matchTimer <= 0){
      text = "Time!"
      sounds.time.play();
      textGrad.addColorStop(0,"black");
      textGrad.addColorStop(0.5,"black");
      textGrad.addColorStop(0.7,"rgb(21, 51, 180)");
      textGrad.addColorStop(1,"rgb(71, 94, 250)");
    }
    else {
      sounds.game.play();
      textGrad.addColorStop(0,"black");
      textGrad.addColorStop(0.4,"black");
      textGrad.addColorStop(0.7,"rgb(167, 27, 40)");
      textGrad.addColorStop(1,"rgb(255, 31, 52)");
    }
  }
  c.scale(1,textScale);
  c.fillStyle=textGrad;
  c.lineWidth = 40;
  c.strokeStyle="black";
  c.font="900 "+size+"px Arial";
  c.strokeText(text,600,470/textScale);
  c.lineWidth = 20;
  c.strokeStyle="white";
  c.font="900 "+size+"px Arial";
  c.strokeText(text,600,470/textScale);
  c.font="900 "+size+"px Arial";
  c.fillText(text,600,470/textScale);
  c.restore();
  sounds.battlefield.stop();
  setTimeout(function(){endGame()},2500);
}

$(document).ready(function(){
  $("#keyboardButton").click(function(){
    $("#keyboardControlsImg").toggle();
  });
  $("#controllerButton").click(function(){
    $("#controllerSupportContainer").toggle();
  });
  canvas = document.getElementById("gameCanvas");
  c = canvas.getContext("2d");
  c.fillStyle = "rgba(0, 0, 0, 1)";
  c.fillRect(-100,-100,canvas.width+200,canvas.height+200);
  //drawStartScreen();
  //drawStage();
  gameTick();
  renderTick();
  var mX = Math.max(($(window).width()-1200)/2,0);
  var mY = Math.max(($(window).height()-750)/2,0);
  $("#display").css("margin",mY+"px 0px 0px "+mX+"px");

  $("#effectsButton").click(function(){
    if (showVfx){
      $("#effectsButtonEdit").empty().append("OFF");
    }
    else {
      $("#effectsButtonEdit").empty().append("ON");
    }
    showVfx ^= true;
  });

  $("#fpsButton").click(function(){
    if (fps30){
      $("#fpsButtonEdit").empty().append("60");
    }
    else {
      $("#fpsButtonEdit").empty().append("30");
    }
    fps30 ^= true;
  });

  $("#debugButton").click(function(){
    if (showDebug){
      $("#debugButtonEdit").empty().append("OFF");
      $("#debug").hide();
      $("#players").hide();
      var mY = Math.max(($(window).height()-750)/2,0);
      $("#display").css("margin",mY+"px 0px 0px "+mX+"px");
    }
    else {
      $("#debugButtonEdit").empty().append("ON");
      $("#debug").show();
      $("#players").show();
      var mY = Math.max(($(window).height()-900)/2,0);
      $("#display").css("margin",mY+" 0px 0px px "+mX+"px");
    }
    showDebug ^= true;
  });
});
