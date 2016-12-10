import {sounds} from "main/sfx";
import {
  player, changeGamemode, bg1, fg1, bg2, ui, clearScreen, shine, startGame, layers, setShine, addShine
  , setStageSelect
} from "main/main";
import {twoPi} from "main/render";
/* eslint-disable */

/*
should be able to add levels by just adding to smallboxstagenames, bigboxnames and stageimages
 */
const smallBoxStageNames = [
  "BATTLEFIELD",
  "Y-STORY",
  "P-STADIUM",
  "DREAMLAND",
  "LAST STOP"
];

const bigBoxNames = [
  "Battlefield",
  "Yoshi's Story",
  "Pokemon Stadium",
  "Dreamland",
  "Final Destination"
];

const stageImages = {
  0:retrieveImage("assets/stage-icons/bf.png"),
  1:retrieveImage( "assets/stage-icons/ys.png"),
  2:retrieveImage( "assets/stage-icons/ps.png"),
  3:retrieveImage( "assets/stage-icons/dl.png"),
  4:retrieveImage( "assets/stage-icons/fd.png"),
};

function retrieveImage(src){
    let box =new Image();
    box.src = src;
    box.onerror = function(){
      box.onError = null;
      box.src = "assets/stage-icons/Icon_transparent_Question.png";
    };

    return box;
}
let stageSelected = smallBoxStageNames.length;
let stageSelectTimer = 0;

const stagePointerPos = [600, 635];
const xRowOffset = 175;


export function sssControls(i) {
  stagePointerPos[0] += player[i].inputs.lStickAxis[0].x * 15;
  stagePointerPos[1] += player[i].inputs.lStickAxis[0].y * -15;
  if (stagePointerPos[1] >= 450 && stagePointerPos[1] <= 540) {
    for (let j = 0; j < smallBoxStageNames.length; j++) {
      if (stagePointerPos[0] >= 200 + j * xRowOffset && stagePointerPos[0] <= 350 + j * xRowOffset) {
        if (stageSelected != j) {
          sounds.menuSelect.play();
        }
        stageSelected = j;
        break;
      }
    }
  } else if (stagePointerPos[0] >= 525 && stagePointerPos[0] <= 675 &&
      stagePointerPos[1] >= 590 && stagePointerPos[1] <= 680) {
    if (stageSelected != smallBoxStageNames.length) {
      sounds.menuSelect.play();
    }
    stageSelected = smallBoxStageNames.length;
  }
  if (player[i].inputs.b[0] && !player[i].inputs.b[1]) {
    sounds.menuBack.play();
    changeGamemode(2);
  } else if ((player[i].inputs.s[0] && !player[i].inputs.s[1]) || (player[i].inputs.a[0] && !player[i].inputs.a[1])) {
    sounds.menuForward.play();
    if (stageSelected == smallBoxStageNames.length) {
      stageSelected = Math.floor(Math.random() * (smallBoxStageNames.length + 0.99));
    }
    setStageSelect(stageSelected);

    startGame();
  }
}



export function drawSSSInit() {
  let bgGrad = bg1.createLinearGradient(0, 0, 1200, 750);
  bgGrad.addColorStop(0, "rgb(17, 11, 65)");
  bgGrad.addColorStop(1, "rgb(61, 8, 37)");
  bg1.fillStyle = bgGrad;
  bg1.fillRect(0, 0, layers.BG1.width, layers.BG1.height);

  fg1.lineWidth = 4;
  fg1.strokeStyle = "rgba(255, 255, 255, 0.57)";
  fg1.strokeRect(198, 98, 804, 304);
  fg1.fillStyle = "black";
  stageSelectTimer++;
  for (let i = 0; i < smallBoxStageNames.length; i++) {
    fg1.fillRect(200 + i * xRowOffset, 450, 150, 90);
  }
  fg1.fillRect(525, 590, 150, 90);

  fg1.fillStyle = "white";
  fg1.font = "500 16px Arial";
  fg1.textAlign = "center";

  for (let i = 0 ; i < smallBoxStageNames.length ; i++) {
    fg1.fillText(smallBoxStageNames[i], i * xRowOffset + 275, 530);
    fg1.drawImage(stageImages[i ], i * xRowOffset + 200, 452, 146, 55);
  }

}

function drawBigBox() {
  if (stageSelected < smallBoxStageNames.length) {
    ui.drawImage(stageImages[stageSelected], 200, 100, 800, 300);
    ui.fillText(bigBoxNames[stageSelected], 220, 380);
  } else if (stageSelected == smallBoxStageNames.length) {
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
  }
}
export function drawSSS() {
  clearScreen();
  bg2.lineWidth = 3;
  addShine(0.01);
  if (shine > 1.8) {
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
  for (var i = 0; i < smallBoxStageNames.length; i++) {
    if (stageSelected == i) {
      if (stageSelectTimer % 8 > 4) {
        ui.strokeStyle = "rgb(251, 116, 155)";
      } else {
        ui.strokeStyle = "rgb(255, 182, 204)";
      }
    } else {
      ui.strokeStyle = "rgb(166, 166, 166)";
    }
    ui.strokeRect(200 + i * xRowOffset, 450, 150, 90);
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
  drawBigBox();
  ui.textAlign = "center";
  ui.lineWidth = 8;
  ui.strokeStyle = "rgba(255,255,255,0.8)";
  ui.beginPath();
  ui.arc(stagePointerPos[0], stagePointerPos[1], 40, 0, twoPi);
  ui.closePath();
  ui.stroke();
}
