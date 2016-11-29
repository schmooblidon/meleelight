import {bg1,bg2, clearScreen, layers,ui} from "main/main";
import {twoPi} from "main/render";
/* eslint-disable */

export let angB = 0;
export let angR = 0;
export let angles = [0,Math.PI];
export let mlVel = 0;
export let mlPos = 0;
export let mlDir = 1;
export let circlePos = [[200,0,0.4,1,200],[600,240,0.21,1,250],[10,600,0.7,-1,150],[350,500,0.65,-1,270],[1000,50,0.9,1,200],[900,400,0.1,-1,260]];

const lightDust = [];
for (var k = 0; k < 20; k++) {
  lightDust[k] = [Math.random() * 3 + 2, 330 + (k * 26 + 26 * Math.random()), 520, 0.2];
}

export function drawStartScreenInit (){
  bg1.fillStyle = "rgba(46, 8, 154, 1)";
  var grd = bg1.createRadialGradient(600, 375, 5, 600, 375, 750);
  grd.addColorStop(0, "#27005b");
  grd.addColorStop(0.25, "#2b0170");
  grd.addColorStop(0.5, "#2b005b");
  grd.addColorStop(0.75, "#35005b");
  grd.addColorStop(1, "#38005b");
  bg1.fillStyle = grd;
  bg1.fillRect(0, 0, layers.BG1.width, layers.BG1.height);
  bg1.save();
  bg1.scale(1.5, 1);
  bg1.shadowBlur = 60;
  bg1.shadowColor = "rgba(147, 14, 42, 1)";
  bg1.shadowOffsetX = -3150;
  bg1.fillStyle = "rgba(147, 14, 42, 0.5)";
  bg1.translate(2440, 380);
  var ang = 0;
  for (var i = 0; i < 10; i++) {
    bg1.beginPath();
    bg1.arc(0, 0, 720, ang, ang + Math.PI / 20);
    bg1.lineTo(0, 0);
    bg1.closePath();
    bg1.fill();
    ang += Math.PI / 5;
  }
  bg1.restore();
}

export function drawStartScreen (){
  clearScreen();
  bg2.save();
  bg2.lineWidth = 60;
  bg2.strokeStyle = "rgba(92, 18, 18, 0.2)";
  for (var j = 0; j < 6; j++) {
    circlePos[j][0] += circlePos[j][2] * circlePos[j][3];
    circlePos[j][1] += circlePos[j][2] * circlePos[j][3];
    if (circlePos[j][0] > 1300 || circlePos[j][1] > 850) {
      circlePos[j][0] -= 1;
      circlePos[j][1] -= 1;
      circlePos[j][3] *= -1;
    }
    if (circlePos[j][0] < -100 || circlePos[j][1] < -100) {
      circlePos[j][0] += 1;
      circlePos[j][1] += 1;
      circlePos[j][3] *= -1;
    }
    bg2.beginPath();
    bg2.arc(Math.round(circlePos[j][0]), Math.round(circlePos[j][1]), circlePos[j][4], 0, twoPi);
    bg2.closePath();
    bg2.stroke();
  }
  bg2.restore();
  bg2.save();
  bg2.fillStyle = "#333236";
  bg2.translate(600, 375);
  angB += 0.001;
  var ang = angB;
  for (var i = 0; i < 30; i++) {
    bg2.beginPath();
    bg2.arc(0, 0, 720, ang, ang + Math.PI / 30);
    bg2.lineTo(0, 0);
    bg2.closePath();
    bg2.fill();
    ang += Math.PI / 15;
  }
  bg2.restore();
  var grd = bg2.createRadialGradient(600, 375, 5, 600, 375, 300);
  grd.addColorStop(0, "rgb(51, 51, 51)");
  grd.addColorStop(1, "rgba(51, 51, 51, 0)");
  bg2.fillStyle = grd;
  bg2.fillRect(0, 0, layers.BG2.width, layers.BG2.height);
  bg2.save();
  bg2.lineWidth = 3;
  bg2.strokeStyle = "rgba(149, 255, 131, 0.12)";
  bg2.scale(1.3, 1.1);
  var rad = 20;
  for (var n = 0; n < 15; n++) {
    bg2.beginPath();
    bg2.arc(515, 530 + n * 10, rad, 0, twoPi);
    bg2.closePath();
    bg2.stroke();
    rad += 30 + n * 5;
  }
  bg2.restore();
  bg2.save();
  bg2.lineWidth = 3;
  bg2.strokeStyle = "rgba(149, 255, 131, 0.12)";
  bg2.translate(670, 580);
  angR += 0.001;
  bg2.rotate(angR)
  var ang = 0;
  bg2.beginPath();
  for (var m = 0; m < 25; m++) {
    ang += Math.PI / 12;
    bg2.moveTo(0, 0);
    bg2.lineTo(0, 850);
    bg2.rotate(ang);
  }
  bg2.stroke();
  bg2.restore();
  ui.save();
  ui.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ui.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ui.lineWidth = 5;
  ui.globalCompositeOperation = "xor";
  var bgGrad = ui.createLinearGradient(0, 200, 0, 390);
  bgGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
  bgGrad.addColorStop(1, "rgba(0, 0, 0, 0.5)");
  ui.fillStyle = bgGrad;
  ui.textAlign = "center";
  ui.font = "900 250px Arial";
  ui.strokeText("Melee", 600, 350);
  ui.fillText("Melee", 600, 350);
  ui.globalCompositeOperation = "lighter";
  var bgGrad = ui.createLinearGradient(0, 440 + mlPos, 0, 500 + mlPos);
  bgGrad.addColorStop(0, "rgba(255, 255, 255,0.45)");
  bgGrad.addColorStop(1, "rgba(255, 255, 255,0.2)");
  ui.fillStyle = bgGrad;
  ui.shadowBlur = 30;
  ui.shadowColor = "rgba(255, 255, 255, 0.7)";
  ui.font = "900 150px Arial";
  ui.fillText("LIGHT", 600, 500 + mlPos);
  mlVel += 0.05 * mlDir;
  mlPos += mlVel;
  if (Math.abs(mlVel) > 0.8) {
    mlDir *= -1;
    if (mlDir == -1) {
      for (var k = 0; k < 10; k++) {

      }
    }
  }
  ui.restore();
  for (var k = 0; k < 20; k++) {
    if (lightDust[k][2] < 410) {
      lightDust[k] = [Math.random() * 3 + 2, 330 + (k * 26 + 26 * Math.random()), 520, 0.2];
    }
    lightDust[k][2] -= lightDust[k][0];
    lightDust[k][3] = Math.max(0, lightDust[k][3] - 0.01);
    ui.fillStyle = "rgba(155,155,255," + lightDust[k][3] + ")"
    ui.beginPath();
    ui.arc(lightDust[k][1], lightDust[k][2], 10, 0, twoPi);
    ui.closePath();
    ui.fill();
  }
  ui.save();
  ui.fillStyle = "#989898";
  ui.beginPath();
  ui.arc(600, 580, 30, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "#6c6b6b";
  ui.beginPath();
  ui.arc(600, 580, 15, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.lineWidth = 7;
  ui.font = "900 40px monospace";
  ui.textAlign = "center";
  ui.fillStyle = "#f0c900";
  ui.strokeStyle = "black";
  ui.strokeText("PRESS START", 600, 600);
  ui.fillText("PRESS START", 600, 600);
  ui.fillStyle = "rgba(0,0,0,0.6)";
  ui.beginPath();
  ui.arc(600, -2900, 3000, Math.PI * 0.05, Math.PI * 0.95);
  ui.closePath();
  ui.fill();
  ui.beginPath();
  ui.arc(600, 3650, 3000, Math.PI * 1.05, Math.PI * 1.95);
  ui.closePath();
  ui.fill();
  ui.restore();
}
