import {sounds} from "main/sfx";
import {player, changeGamemode, bg1,fg1,bg2,ui, clearScreen, shine, startGame, layers, setShine, addShine
    , setStageSelect
} from "main/main";
import {twoPi} from "main/render";
/* eslint-disable */

let stageSelected = 4;
let stageSelectTimer = 0;

const stagePointerPos = [600, 635];

var bfIcon = new Image();
bfIcon.src = "assets/stage-icons/bf.png";
var ysIcon = new Image();
ysIcon.src = "assets/stage-icons/ys.png";
var dlIcon = new Image();
dlIcon.src = "assets/stage-icons/dl.png";
var psIcon = new Image();
psIcon.src = "assets/stage-icons/ps.png";

export function sssControls (i){
  stagePointerPos[0] += player[i].inputs.lStickAxis[0].x*15;
  stagePointerPos[1] += player[i].inputs.lStickAxis[0].y*-15;
  if (stagePointerPos[1] >= 450 && stagePointerPos[1] <= 540){
    for (var j=0;j<4;j++){
      if (stagePointerPos[0] >= 225+j*200 && stagePointerPos[0] <= 375+j*200){
        if (stageSelected != j){
          sounds.menuSelect.play();
        }
        stageSelected = j;
        break;
      }
    }
  } else if (stagePointerPos[0] >= 525 && stagePointerPos[0] <= 675 && stagePointerPos[1] >= 590 && stagePointerPos[1] <=
    680) {
    if (stageSelected != 4) {
      sounds.menuSelect.play();
    }
    stageSelected = 4;
  }
  if (player[i].inputs.b[0] && !player[i].inputs.b[1]) {
    sounds.menuBack.play();
    changeGamemode(2);
  } else if ((player[i].inputs.s[0] && !player[i].inputs.s[1]) || (player[i].inputs.a[0] && !player[i].inputs.a[1])) {
    sounds.menuForward.play();
    if (stageSelected == 4) {
      stageSelected = Math.floor(Math.random() * 3.99);
    }
      setStageSelect(stageSelected);
    /*switch (stageSelected){
      case 0:
        stageSelect = "bf";
        break;
      case 1:
        stageSelect = "ys";
        break;
      case 2:
        stageSelect = "ps";
        break;
      case 3:
        stageSelect = "dl";
        break;
      default:
        break;
    }*/
    startGame();
  }
}

export function drawSSSInit (){
  var bgGrad =bg1.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgb(17, 11, 65)");
  bgGrad.addColorStop(1,"rgb(61, 8, 37)");
  bg1.fillStyle=bgGrad;
  bg1.fillRect(0,0,layers.BG1.width,layers.BG1.height);

  fg1.lineWidth = 4;
  fg1.strokeStyle = "rgba(255, 255, 255, 0.57)";
  fg1.strokeRect(198, 98, 804, 304);
  fg1.fillStyle = "black";
  stageSelectTimer++;
  for (var i = 0; i < 4; i++) {
    fg1.fillRect(225 + i * 200, 450, 150, 90);
  }
  fg1.fillRect(525, 590, 150, 90);

  fg1.fillStyle = "white";
  fg1.font = "500 16px Arial";
  fg1.textAlign = "center";
  fg1.fillText("BATTLEFIELD", 300, 530);
  fg1.fillText("Y-STORY", 500, 530);
  fg1.fillText("P-STADIUM", 700, 530);
  fg1.fillText("DREAMLAND", 900, 530);
  fg1.drawImage(bfIcon, 227, 452, 146, 55);
  fg1.drawImage(ysIcon, 427, 452, 146, 55);
  fg1.drawImage(psIcon, 627, 452, 146, 55);
  fg1.drawImage(dlIcon, 827, 452, 146, 55);
}

export function drawSSS (){
  clearScreen();
  bg2.lineWidth = 3;
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
  ui.textAlign = "center";
  ui.lineWidth = 3;
  stageSelectTimer++;
  for (var i = 0; i < 4; i++) {
    if (stageSelected == i) {
      if (stageSelectTimer % 8 > 4) {
        ui.strokeStyle = "rgb(251, 116, 155)";
      } else {
        ui.strokeStyle = "rgb(255, 182, 204)";
      }
    } else {
      ui.strokeStyle = "rgb(166, 166, 166)";
    }
    ui.strokeRect(225 + i * 200, 450, 150, 90);
  }
  ui.fillStyle = "rgb(245, 144, 61)";
  ui.strokeStyle = "rgb(245, 144, 61)";
  if (stageSelected == 4) {
    if (stageSelectTimer % 8 > 4) {
      ui.fillStyle = "rgb(251, 195, 149)";
      ui.strokeStyle = "rgb(251, 195, 149)";
    }
  }
  ui.font = "700 25px Arial";
  ui.lineWidth = 4;
  ui.strokeRect(525, 590, 150, 90);
  ui.fillText("RANDOM", 600, 665);
  ui.font = "700 32px Arial";
  ui.fillText("?", 600, 630);
  ui.beginPath();
  ui.arc(600, 618, 18, 0, twoPi);
  ui.closePath();
  ui.stroke();
  ui.textAlign = "start";
  ui.fillStyle = "rgba(255,255,255,0.6)";
  ui.font = "900 48px Arial";
  switch (stageSelected) {
    case 0:
      ui.drawImage(bfIcon, 200, 100, 800, 300);
      ui.fillText("Battlefield", 220, 380);
      break;
    case 1:
      ui.drawImage(ysIcon, 200, 100, 800, 300);
      ui.fillText("Yoshi's Story", 220, 380);
      break;
    case 2:
      ui.drawImage(psIcon, 200, 100, 800, 300);
      ui.fillText("Pokemon Stadium", 220, 380);
      break;
    case 3:
      ui.drawImage(dlIcon, 200, 100, 800, 300);
      ui.fillText("Dreamland", 220, 380);
      break;
    case 4:
      ui.textAlign = "center";
      ui.lineWidth = 9;
      ui.fillStyle = "rgba(0,0,0,0.7)";
      ui.fillRect(202, 102, 796, 296);
      ui.fillStyle = "rgb(255, 161, 84)";
      ui.strokeStyle = "rgb(255, 161, 84)";
      ui.font = "900 100px Arial";
      ui.fillText("?", 600, 230);
      ui.fillText("RANDOM", 600, 355);
      ui.beginPath();
      ui.arc(600, 192, 55, 0, twoPi);
      ui.closePath();
      ui.stroke();
      break;
    default:
      break;
  }
  ui.textAlign = "center";
  ui.lineWidth = 8;
  ui.strokeStyle = "rgba(255,255,255,0.8)";
  ui.beginPath();
  ui.arc(stagePointerPos[0], stagePointerPos[1], 40, 0, twoPi);
  ui.closePath();
  ui.stroke();
}
