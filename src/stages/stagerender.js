import {getTransparency} from "main/vfx/transparency";
import {bg1, bg2, fg1, fg2, layers, gameMode, holiday, snowCount} from "main/main";
import {targetDestroyed} from "target/targetplay";
import {rotateVector, twoPi} from "main/render";
import {activeStage} from "stages/activeStage";
import {Vec2D} from "../main/util/Vec2D";
import {euclideanDist} from "../main/linAlg";
import {drawLine, drawShape, makeRectShape, makePolygonShape} from "../render/threeUtil";
import {addToClearEveryFrame} from "../main/util/renderUtils";
import * as THREE from "three";


const bgPos = [[-30, 500, 300, 500, 900, 500, 1230, 450, 358], [-30, 400, 300, 400, 900, 400, 1230, 350, 179]];
const direction = [[1, -1, 1, -1, 1, -1, 1, -1, 1], [-1, 1, -1, 1, -1, 1, -1, 1, -1]];
export let boxFill = "rgba(0, 0, 0, 0.1)";
export let boxFillBG = "rgba(0, 0, 0, 0.1)";


const bgStars = [];
for (let p = 0; p < 20; p++) {
  bgStars[p] = new bgStar();
  bgStars[p].pos = new Vec2D(600 + 100 * Math.random() * bgStars[p].velocity.x, 375 + 100 * Math.random() * bgStars[p].velocity.y);
}
let bgSparkle = 3;
const gridGrad = "rgba(94,173,255,0.2)";

const circleSize = [];
for (let i = 0; i < 5; i++) {
  circleSize[i] = i * 40;
}
let ang = 0;
export let backgroundType = 0;
export const snowMeltTime = 200;

let snowBalls = [];

const targetbauble = new Image();
targetbauble.src = "assets/christmas/targetbauble.png";

const scandypattern = new Image();
scandypattern.src = "assets/christmas/scandypattern.png";

const fabric = new Image();
fabric.src = "assets/christmas/fabric.png";

const randall = [new Image(),new Image(),new Image()];
randall[0].src = "assets/stage/randall1.png";
randall[1].src = "assets/stage/randall2.png";
randall[2].src = "assets/stage/randall3.png";
let randallTimer = 0;


const types = ["wallL", "wallR", "ground", "ceiling"];
const surfaceColors = ["#47c648", "#9867de", "#db80cc", "#ed6767"];

export function drawStageInit() {
  addToClearEveryFrame({ label : "stageDynamic", remove : true});

  const scene = fg1;
  const group = new THREE.Group();
  group.name = "stageStatic";
  group.matrixAutoUpdate = false;

  for (let i =0 ; i < types.length; i++) {
    const type = types[i];
    for (let j = 0; j < activeStage[type].length; j++) {
      const surf = activeStage[type][j];
      drawLine(group, new THREE.LineBasicMaterial( { linewidth : 1, color : surfaceColors[i] }), surf[0].x, surf[0].y, surf[1].x, surf[1].y);
    }
  }

  for (let j = 0; j < activeStage.platform.length; j++) {
    if (activeStage.movingPlats === null || activeStage.movingPlats === undefined || activeStage.movingPlats.indexOf(j) === -1){ // not a moving platform
      const surf = activeStage.platform[j];
      drawLine(group, new THREE.LineBasicMaterial( { linewidth : 1, color : "#4794c6" }), surf[0].x, surf[0].y, surf[1].x, surf[1].y);
    }
  }  

  const polyLineMat = null;
  const polyMeshMat = new THREE.MeshBasicMaterial( { color : "rgba(94, 173, 255)", opacity : 0.3 } );
  if (activeStage.box !== null && activeStage.box !== undefined) {
    for (let j = 0; j < activeStage.box.length; j++) {
      const b = activeStage.box[j];
      const rect = makeRectShape (b.min.x, b.min.y, b.max.x, b.max.y);
      drawShape(group, rect, polyMeshMat, polyLineMat);
    }
  }
  if (activeStage.polygon !== null && activeStage.polygon !== undefined) {
    for (let j=0;j<activeStage.polygon.length;j++){
      const poly = makePolygonShape(activeStage.polygon[j]);
      drawShape(group, poly, polyMeshMat, polyLineMat);
    }
  }

  for (let i=0;i<activeStage.ledge.length;i++){
    const e = activeStage.ledge[i];
    const pA = activeStage[e[0]][e[1]][e[2]];
    const pB = activeStage[e[0]][e[1]][1-e[2]];
    const ang = Math.atan2((pB.y - pA.y) , (pB.x - pA.x));
    const magnitude = euclideanDist(pA, pB);
    const length = Math.min(0.4 * magnitude, 20 / activeStage.scale);
    const pC = new Vec2D(pA.x + length * Math.cos(ang), pA.y + length * Math.sin(ang));
    drawLine(group, new THREE.LineBasicMaterial( { linewidth : 2, color : "#e7a44c" }), pA.x, pA.y, pC.x, pC.y);
  }

  group.scale.set(activeStage.scale, -activeStage.scale, 1);
  group.translateX(activeStage.offset[0]);
  group.translateY(activeStage.offset[1]);
  group.updateMatrix();
  scene.add(group);

};

const swirlTimer = 0;
const swirlSwitch = false;

const wallColour = ["rgb(255,0,40)","rgb(0,255,255)","rgb(125,125,125)","rgb(125,50,255)"];

function wallColourFromDamageType (damageType) {
  if (damageType === "fire") {
    return wallColour[0];
  }
  else if (damageType === "electric") {
    return wallColour[1];
  }
  else if (damageType === "slash") {
    return wallColour[2];
  }
  else if (damageType === "darkness") {
    return wallColour[3];
  }
  else {
    return "rgb(0,50,180)";
  }
};

let wallCycle = 0;

export function calculateDamageWallColours(){
  let a = 0;
  if (wallCycle < 240){
    wallCycle++;
    if (wallCycle > 120){
      a = 240 - wallCycle;
    } else {
      a = wallCycle;
    }
  } else {
    wallCycle = 0;
  } 
  const n = Math.round(255*a/120);
  wallColour[0] = "rgb(255,"+n+",40)";
  wallColour[1] = "rgb("+n+",255,255)";
  const m = Math.round(125+n/2);
  wallColour[2] = "rgb("+m+","+m+","+m+")";
  wallColour[3] = "rgb("+Math.round(125-n/3)+",50,"+Math.round(255-n/3)+")";
}

export function drawDamageLines(type, scene, stage){
  for (let i=0;i<stage[type].length;i++) {
    const surfaceProperties = stage[type][i][2];
    if (surfaceProperties !== undefined && surfaceProperties.damageType !== null) {
      drawLine( scene
              , new THREE.LineBasicMaterial( { linewidth : 4, color : wallColourFromDamageType(surfaceProperties.damageType) })
              , stage[type][i][0].x, stage[type][i][0].y, stage[type][i][1].x, stage[type][i][1].y );
    }
  }
}

export function drawStageBackground() {
  const scene = bg2;
  const group = new THREE.Group();
  if (activeStage.background !== null && activeStage.background !== undefined) {
    if (activeStage.background.polygon !== null && activeStage.background.polygon !== undefined) {
      const polyLineMat = null;
      const polyMeshMat = new THREE.MeshDepthMaterial( { color : boxFillBG } );
      for (let j=0;j<activeStage.background.polygon.length;j++){
        const poly = makePolygonShape(activeStage.background.polygon[j]);
        drawShape(group, poly, polyMeshMat, polyLineMat);
      }
    }
    if (activeStage.background.line !== null && activeStage.background.line !== undefined) {
      for (let j=0;j<activeStage.background.line.length;j++){
        const surf = activeStage.background.line[j];
        drawLine(group, new THREE.LineBasicMaterial( { linewidth : 3, color : boxFillBG }), surf[0].x, surf[0].y, surf[1].x, surf[1].y);
      }
    }    
    group.scale.set(activeStage.scale, -activeStage.scale, 1);
    group.translateX(activeStage.offset[0]);
    group.translateY(activeStage.offset[1]);
    scene.add(group);
  }
}

export function drawStage() {

  drawStageBackground();

  const scene = fg2;
  const group = new THREE.Group();
  group.name = "stageDynamic";
  calculateDamageWallColours();

  // draw moving platforms
  // bypassed for now, sorry Randall
  if (false && activeStage.name === "ystory") {
    // Randall
    randallTimer++;
    if (randallTimer === 30){
      randallTimer = 0;
    }
    //bg2.drawImage(randall[Math.floor(randallTimer/10)],(activeStage.platform[0][0].x * activeStage.scale) + activeStage.offset[0]-20, (activeStage.platform[0][0].y * -activeStage.scale) + activeStage.offset[1]-20,100,100);
  }
  else if (activeStage.movingPlats !== null && activeStage.movingPlats !== undefined && activeStage.movingPlats.length !== 0) {
    for (let i = 0; i < activeStage.movingPlats.length; i++) {
      if (activeStage.name !== "fountain" || activeStage.platform[activeStage.movingPlats[i]][0].y > 0) {
        const surf = activeStage.platform[activeStage.movingPlats[i]];
        drawLine(group, new THREE.LineBasicMaterial( { linewidth : 1, color : "#4794c6" }), surf[0].x, surf[0].y, surf[1].x, surf[1].y);
      }
    }
  }
  
  // draw damaging stage surfaces
  for (let i=0;i<types.length;i++) {
    drawDamageLines(types[i], group, activeStage);
  }

  // draw targets, bypassed for now
  /*
  if (typeof activeStage.target !== "undefined") {
    fg2.strokeStyle = "rgba(255,255,255,0.4)";
    fg2.lineWidth = 1;
    for (let k = 0; k < activeStage.target.length; k++) {
      if (!targetDestroyed[k]) {
        const x = activeStage.target[k].x * activeStage.scale + activeStage.offset[0];
        const y = activeStage.target[k].y * -activeStage.scale + activeStage.offset[1];
        if (holiday === 1){
          fg2.drawImage(targetbauble,x-17,y-25,35,43);
          fg2.beginPath();
          fg2.moveTo(x,y-23);
          fg2.lineTo(x,0);
          fg2.closePath();
          fg2.stroke();
        } else {
          for (let j = 0; j < 5; j++) {
            fg2.fillStyle = (j % 2) ? "white" : "red";
            fg2.beginPath();
            fg2.arc(x, y, (25 - j * 5) * (activeStage.scale / 4.5), 0, twoPi);
            fg2.closePath();
            fg2.fill();
          }
        }
      }
    }
  }
  */

  group.scale.set(activeStage.scale, -activeStage.scale, 1);
  group.translateX(activeStage.offset[0]);
  group.translateY(activeStage.offset[1]);
  scene.add(group);

};

export function setBackgroundType(val) {
  backgroundType = val;
};
export function bgStar() {
  const vSeed = Math.random();
  this.velocity = new Vec2D(5 * vSeed * Math.sign(0.5 - Math.random()), 5 * (1 - vSeed) * Math.sign(0.5 - Math.random()));
  if (getTransparency()) {
    this.colour = "hsl(" + 358 * Math.random() + ", 100%, 50%)";
  }
  else {
    this.colour = "hsl(" + 358 * Math.random() + ",100%,15%)";
  }
  this.pos = new Vec2D(0, 0);
  this.life = 0;
};
export function drawBackgroundInit() {
  const bgGrad = bg1.createLinearGradient(0, 0, 0, 500);
  bgGrad.addColorStop(0, (holiday === 1) ? "rgb(46, 100, 147)" : "rgb(24, 17, 66)");
  bgGrad.addColorStop(1, "black");
  bg1.fillStyle = bgGrad;
  bg1.fillRect(-100, -100, layers.BG1.width + 200, layers.BG1.height + 200);
  ;
  if (backgroundType === 1 || holiday === 1) {
    const gridGrad = bg2.createRadialGradient(600, 375, 1, 600, 375, 800);
    gridGrad.addColorStop(0, "rgba(94, 173, 255, 0)");
    gridGrad.addColorStop(1, "rgba(94, 173, 255, 0.2)");
    bg2.strokeStyle = gridGrad;
    boxFill = "rgba(94, 173, 255, 0.3)";
    boxFillBG = "rgba(94, 173, 255, 0.25)";
  }
};

export function drawBackground() {
  // bypass for now
  /*
  if (holiday === 1){
    if (gameMode !== 4){
      drawSnow();
    }
  }
  else {
    if (backgroundType === 0) {
      drawStars();
    }
    else {
      drawTunnel();
    }
  }
  */
};

export function drawTunnel() {
  bg2.lineWidth = 2;
  ang += 0.005;
  let angB = ang;
  bg2.beginPath();
  for (let i = 0; i < 16; i++) {
    const v = rotateVector(0, 800, angB);
    bg2.moveTo(600, 375);
    bg2.lineTo(600 + v.x, 375 + v.y);
    angB += Math.PI / 8;
  }
  bg2.stroke();
  for (let i = 0; i < circleSize.length; i++) {
    circleSize[i]++;
    if (circleSize[i] > 200) {
      circleSize[i] = 0;
    }
    bg2.lineWidth = Math.max(1, Math.round(3 * (circleSize[i] / 60)));
    bg2.beginPath();
    bg2.arc(600, 375, circleSize[i] * 4, 0, twoPi);
    bg2.closePath();
    bg2.stroke();
  }
};

export function drawStars() {
  bgSparkle--;
  for (let p = 0; p < 20; p++) {
    if (bgStars[p].pos.x > 1250 || bgStars[p].pos.y > 800 || bgStars[p].pos.x < -50 || bgStars[p].pos.y < -50) {
      bgStars[p].pos = new Vec2D(600, 375);
      bgStars[p].life = 0;
      const vSeed = Math.random();
      bgStars[p].velocity = new Vec2D(5 * vSeed * Math.sign(0.5 - Math.random()), 5 * (1 - vSeed) * Math.sign(0.5 - Math.random()));
    }
    bgStars[p].pos.x += bgStars[p].velocity.x;
    bgStars[p].pos.y += bgStars[p].velocity.y;

    bgStars[p].life++;

    if (bgSparkle === 0) {
      bg2.fillStyle = bgStars[p].colour;
      if (getTransparency()) {
        bg2.globalAlpha = Math.min(bgStars[p].life / 300, 1);
      }
      bg2.beginPath();
      bg2.arc(bgStars[p].pos.x, bgStars[p].pos.y, 5, twoPi, 0);
      ;
      bg2.fill();
    }
  }
  if (bgSparkle === 0) {
    bgSparkle = 2;
  }
  bg2.globalAlpha = 1;
  for (let k = 1; k > -1; k--) {
    for (let j = 0; j < 9; j++) {
      //bgPos[j] += direction[j]*5*Math.random();
      if (j === 8) {
        bgPos[k][j] += direction[k][j] * 0.2 * Math.random();
      }
      else {
        bgPos[k][j] += direction[k][j] * 1 * Math.random();
      }
      switch (j) {
        case 0:
          if ((direction[k][j] === 1 && bgPos[k][j] > -10) || (direction[k][j] === -1 && bgPos[k][j] < -200)) {
            direction[k][j] *= -1;
          }
          break;
        case 1:
          if ((direction[k][j] === 1 && bgPos[k][j] > 550 - k * 100) || (direction[k][j] === -1 && bgPos[k][j] < 450 - k * 100)) {
            direction[k][j] *= -1;
          }
          break;
        case 2:
          if ((direction[k][j] === 1 && bgPos[k][j] > 550) || (direction[k][j] === -1 && bgPos[k][j] < 0)) {
            direction[k][j] *= -1;
          }
          break;
        case 3:
          if ((direction[k][j] === 1 && bgPos[k][j] > 550 - k * 100) || (direction[k][j] === -1 && bgPos[k][j] < 450 - k * 100)) {
            direction[k][j] *= -1;
          }
          break;
        case 4:
          if ((direction[k][j] === 1 && bgPos[k][j] > 1150) || (direction[k][j] === -1 && bgPos[k][j] < 600)) {
            direction[k][j] *= -1;
          }
          break;
        case 5:
          if ((direction[k][j] === 1 && bgPos[k][j] > 550 - k * 100) || (direction[k][j] === -1 && bgPos[k][j] < 450 - k * 100)) {
            direction[k][j] *= -1;
          }
          break;
        case 6:
          if ((direction[k][j] === 1 && bgPos[k][j] > 1400) || (direction[k][j] === -1 && bgPos[k][j] < 1210)) {
            direction[k][j] *= -1;
          }
          break;
        case 7:
          if ((direction[k][j] === 1 && bgPos[k][j] > 550 - k * 100) || (direction[k][j] === -1 && bgPos[k][j] < 450 - k * 100)) {
            direction[k][j] *= -1;
          }
          break;
        case 8:
          if ((direction[k][j] === 1 && bgPos[k][j] > 357) || (direction[k][j] === -1 && bgPos[k][j] < 1)) {
            direction[k][j] *= -1;
          }
          break;
        default:
          break;
      }
    }
    if (getTransparency()) {
      boxFill = "hsla(" + bgPos[k][8] + ", 100%, 50%, " + (0.15 - k * 0.07) + ")";
      boxFillBG = "hsla(" + bgPos[k][8] + ", 100%, 50%, " + (0.13 - k * 0.07) + ")";
    }
    else {
      boxFill = "hsl(" + bgPos[k][8] + ", 100%, 7%)";
      boxFillBG = "hsl(" + bgPos[k][8] + ", 50%, 7%)";
    }
    bg2.fillStyle = boxFill;
    bg2.beginPath();
    bg2.moveTo(bgPos[k][0], bgPos[k][1]);
    bg2.bezierCurveTo(bgPos[k][2], bgPos[k][3], bgPos[k][4], bgPos[k][5], bgPos[k][6], bgPos[k][7]);
    if (k === 1) {
      bg2.lineTo(bgPos[0][6], bgPos[0][7]);
      bg2.bezierCurveTo(bgPos[0][4], bgPos[0][5], bgPos[0][2], bgPos[0][3], bgPos[0][0], bgPos[0][1]);
    }
    else {
      bg2.lineTo(1200, 750);
      bg2.lineTo(0, 750);
    }
    bg2.closePath();
    bg2.fill();
  }
};

export function snowBall(){
  this.size = (Math.random() > 0.02) ? Math.floor(Math.random()*3)+1 : Math.floor(Math.random()*3)+5;
  this.velx = this.size/5*(1-Math.random()*0.5);
  this.vely = Math.max(1,this.size/6);
  this.landed = false;
  this.melted = 0;
  this.x = activeStage.blastzone.min.x+40+Math.random()*(activeStage.blastzone.max.x - activeStage.blastzone.min.x - 40)+(this.size >= 5 ? Math.random()*60 : 0);
  this.y = activeStage.blastzone.max.y-60;
  this.prevX = this.x;
  this.prevY = this.y;
}

export function createSnow(){
  snowBalls = [];
  for (let i=0;i<1500;i++){
    snowBalls.push(new snowBall());
    snowBalls[i].y = activeStage.blastzone.min.y+(activeStage.blastzone.max.y-activeStage.blastzone.min.y)*Math.random();
  }
}

export function snowCollision(i){
  const s = snowBalls[i];
  for (let j=0;j<activeStage.ground.length;j++){
    if (s.x >= activeStage.ground[j][0].x && s.x <= activeStage.ground[j][1].x && s.prevY > activeStage.ground[j][0].y && s.y <= activeStage.ground[j][0].y){
      s.y = activeStage.ground[j][0].y;
      return true;
    }
  }
  for (let j=0;j<activeStage.platform.length;j++){
    if (j !== activeStage.movingPlat && s.x >= activeStage.platform[j][0].x && s.x <= activeStage.platform[j][1].x && s.prevY > activeStage.platform[j][0].y && s.y <= activeStage.platform[j][0].y){
      s.y = activeStage.platform[j][0].y;
      return true;
    }
  }
  for (let j=0;j<activeStage.wallR.length;j++){
    if (s.y <= activeStage.wallR[j][0].y && s.y >= activeStage.wallR[j][1].y && s.prevX > activeStage.wallR[j][0].x && s.x <= activeStage.wallR[j][0].x){
      s.x = activeStage.wallR[j][0].x;
      return true;
    }
  }
  return false;
}

export function drawSnow(){
  const melting = [];
  bg2.fillStyle = "white";
  fg2.fillStyle = "white";
  fg2.beginPath();
  bg2.beginPath();
  for (let i=0;i<snowCount;i++){
    if (snowBalls[i].landed){
      snowBalls[i].melted++;
      if (snowBalls[i].melted > snowMeltTime){
        snowBalls[i] = new snowBall();
      } else {
        melting.push(i);
      }
    }
    else {
      snowBalls[i].prevX = snowBalls[i].x;
      snowBalls[i].prevY = snowBalls[i].y;
      snowBalls[i].x -= snowBalls[i].velx;
      snowBalls[i].y -= snowBalls[i].vely;
      if (snowBalls[i].y < activeStage.blastzone.min.y+30){
        snowBalls[i] = new snowBall();
      }
      else if (snowBalls[i].x < activeStage.blastzone.min.x+40){
        snowBalls[i] = new snowBall();
      }
      else {
        if (snowBalls[i].size >= 2 && snowBalls[i].size < 5){
          if (snowCollision(i)){
            snowBalls[i].landed = true;
            snowBalls[i].size += 1;
          }
        }
      }
      const x = (snowBalls[i].x*activeStage.scale)+activeStage.offset[0];
      const y = (snowBalls[i].y*-activeStage.scale)+activeStage.offset[1];
      if (snowBalls[i].size >= 5){
        fg2.moveTo(x,y);
        fg2.arc(x,y,snowBalls[i].size,0,twoPi);
      }
      else {
        bg2.moveTo(x,y);
        bg2.arc(x,y,snowBalls[i].size,0,twoPi);
      }
    }
  }
  fg2.closePath();
  fg2.fill();
  bg2.closePath();
  bg2.fill();
  for (let i=0;i<melting.length;i++){
    bg2.fillStyle = "rgba(255,255,255,"+(1-(snowBalls[melting[i]].melted/snowMeltTime))+")";
    bg2.beginPath();
    bg2.arc((snowBalls[melting[i]].x*activeStage.scale)+activeStage.offset[0],(snowBalls[melting[i]].y*-activeStage.scale)+activeStage.offset[1],snowBalls[melting[i]].size,0,twoPi);
    bg2.closePath();
    bg2.fill();
  }
}
