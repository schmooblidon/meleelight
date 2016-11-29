import {Box2D, Vec2D} from "main/characters";
import {player,ui, changeGamemode, setCookie, layers, clearScreen, deepCopyObject} from "main/main";
import {sounds} from "main/sfx";
import {handGrab, handOpen} from "menus/css";
import {twoPi} from "main/render";
import {startTargetGame} from "target/targetplay";
import {targetStages, customTargetStages, setCustomTargetStages} from "stages/stages";
import {boxFill, drawBackground} from "stages/stagerender";
/* eslint-disable */

export let crossHairPos = new Vec2D(0,0);
export let unGriddedCrossHairPos = new Vec2D(0,0);
export let targetBuilder = 0;
export let targetTool = 0;
export let showingCode = false;
export let toolInfoTimer = 0;
export let toolInfo = ["Box","Platform","Ledge","Target","Move","Delete"];
export let holdingA = false;
export let drawingBox = new Box2D([0,0],[0,0]);
export let drawingPlatform = [new Vec2D(0,0),new Vec2D(0,0)];
export let editingStage = -1;

export let tooSmallTimer = 0;
export let tooSmallPos = new Vec2D(0,0);

export var stageTemp = {
  box : [],
  platform : [],
  ground : [],
  ceiling : [],
  wallL : [],
  wallR : [],
  target : [],
  startingPoint : new Vec2D(0,0),
  ledge : [],
  blastzone : new Box2D([-250,-250],[250,250]),
  scale : 3,
  offset : [600,375],
  draw : {
    box : [],
    platform : [],
    ground : [],
    ceiling : [],
    wallL : [],
    wallR : [],
    target : [],
    startingPoint : new Vec2D(600,375),
    ledge : []
  }
};
let grabbedItem = 0;
let hoverItem = 0;
let ledgeHoverItem = 0;
let builderPaused = false;
let builderPauseSelected = 0;
const undoList = [];
let hoverToolbar = 1;
const gridSizes = [80, 40, 20, 10, 0];
let gridType = 1;

export function createTargetCode (){
    let tCode = "";
    tCode += stageTemp.startingPoint.x+","+stageTemp.startingPoint.y+"~";
    for (let i=0;i<stageTemp.box.length;i++){
        tCode += stageTemp.box[i].min.x+","+stageTemp.box[i].min.y+","+stageTemp.box[i].max.x+","+stageTemp.box[i].max.y;
        if (i != stageTemp.box.length - 1){
            tCode += "#";
        }
    }
    tCode += "~";
    for (let i=0;i<stageTemp.platform.length;i++){
        tCode += stageTemp.platform[i][0].x+","+stageTemp.platform[i][1].x+","+stageTemp.platform[i][0].y;
        if (i != stageTemp.platform.length - 1){
            tCode += "#";
        }
    }
    tCode += "~";
    for (let i=0;i<stageTemp.ledge.length;i++){
        tCode += stageTemp.ledge[i][0]+","+stageTemp.ledge[i][1];
        if (i != stageTemp.ledge.length - 1){
            tCode += "#";
        }
    }
    tCode += "~";
    for (let i=0;i<stageTemp.target.length;i++){
        tCode += stageTemp.target[i].x+","+stageTemp.target[i].y;
        if (i != stageTemp.target.length - 1){
            tCode += "#";
        }
    }
    tCode += "~"+stageTemp.scale;
    return tCode;
}
export function undo (){
  let num = undoList.length-1;
  if (num >= 0){
    let item = undoList[num];
    stageTemp[item].pop();
    stageTemp.draw[item].pop();
    if (item == "box") {
      stageTemp.ground.pop();
      stageTemp.ceiling.pop();
      stageTemp.wallL.pop();
      stageTemp.wallR.pop();
      stageTemp.draw.ground.pop();
      stageTemp.draw.ceiling.pop();
      stageTemp.draw.wallL.pop();
      stageTemp.draw.wallR.pop();
    }
    undoList.pop();
  }
}

export function createStageCode (){
  let tCode = "s";
  tCode += stageTemp.startingPoint.x.toFixed(2)+","+stageTemp.startingPoint.y.toFixed(2)+"&b";
  for (let i=0;i<stageTemp.box.length;i++){
    tCode += stageTemp.box[i].min.x.toFixed(2)+","+stageTemp.box[i].min.y.toFixed(2)+","+stageTemp.box[i].max.x.toFixed(2)+","+stageTemp.box[i].max.y.toFixed(2);
    if (i != stageTemp.box.length - 1){
      tCode += ",";
    }
  }
  /*tCode += "&";
  for (let i=0;i<stageTemp.ground.length;i++){
    tCode += "[new Vec2D("+stageTemp.ground[i][0].x+","+stageTemp.ground[i][0].y+"),new Vec2D("+stageTemp.ground[i][1].x+","+stageTemp.ground[i][1].y+")]";
    if (i != stageTemp.ground.length - 1){
      tCode += ",";
    }
  }
  tCode += "],ceiling:[";
  for (let i=0;i<stageTemp.ceiling.length;i++){
    tCode += "[new Vec2D("+stageTemp.ceiling[i][0].x+","+stageTemp.ceiling[i][0].y+"),new Vec2D("+stageTemp.ceiling[i][1].x+","+stageTemp.ceiling[i][1].y+")]";
    if (i != stageTemp.ceiling.length - 1){
      tCode += ",";
    }
  }
  tCode += "],wallL:[";
  for (let i=0;i<stageTemp.wallL.length;i++){
    tCode += "[new Vec2D("+stageTemp.wallL[i][0].x+","+stageTemp.wallL[i][0].y+"),new Vec2D("+stageTemp.wallL[i][1].x+","+stageTemp.wallL[i][1].y+")]";
    if (i != stageTemp.wallL.length - 1){
      tCode += ",";
    }
  }
  tCode += "],wallR:[";
  for (let i=0;i<stageTemp.wallR.length;i++){
    tCode += "[new Vec2D("+stageTemp.wallR[i][0].x+","+stageTemp.wallR[i][0].y+"),new Vec2D("+stageTemp.wallR[i][1].x+","+stageTemp.wallR[i][1].y+")]";
    if (i != stageTemp.wallR.length - 1){
      tCode += ",";
    }
  }*/
  tCode += "&p";
  for (let i=0;i<stageTemp.platform.length;i++){
    tCode += stageTemp.platform[i][0].x.toFixed(2)+","+stageTemp.platform[i][0].y.toFixed(2)+","+stageTemp.platform[i][1].x.toFixed(2)+","+stageTemp.platform[i][1].y.toFixed(2);
    if (i != stageTemp.platform.length - 1){
      tCode += ",";
    }
  }
  tCode += "&l";
  for (let i=0;i<stageTemp.ledge.length;i++){
    tCode += stageTemp.ledge[i][0]+","+stageTemp.ledge[i][1];
    if (i != stageTemp.ledge.length - 1){
      tCode += ",";
    }
  }
  tCode += "&t";
  for (let i=0;i<stageTemp.target.length;i++){
    tCode += stageTemp.target[i].x.toFixed(2)+","+stageTemp.target[i].y.toFixed(2);
    if (i != stageTemp.target.length - 1){
      tCode += ",";
    }
  }
  //tCode += "],scale:"+stageTemp.scale+",blastzone:new Box2D([-250,-250],[250,250]),offset:[600,375]}";
  return tCode;
}

export function createStageObject (s){
  let tCode = "{startingPoint:new Vec2D(";
  tCode += targetStages[s].startingPoint.x.toFixed(1)+","+targetStages[s].startingPoint.y.toFixed(1)+"),box:[";
  for (let i=0;i<targetStages[s].box.length;i++){
    tCode += "new Box2D(["+targetStages[s].box[i].min.x.toFixed(1)+","+targetStages[s].box[i].min.y.toFixed(1)+"],["+targetStages[s].box[i].max.x.toFixed(1)+","+targetStages[s].box[i].max.y.toFixed(1)+"])";
    if (i != targetStages[s].box.length - 1){
      tCode += ",";
    }
  }
  tCode += "],ground:[";
  for (let i=0;i<targetStages[s].ground.length;i++){
    tCode += "[new Vec2D("+targetStages[s].ground[i][0].x.toFixed(1)+","+targetStages[s].ground[i][0].y.toFixed(1)+"),new Vec2D("+targetStages[s].ground[i][1].x.toFixed(1)+","+targetStages[s].ground[i][1].y.toFixed(1)+")]";
    if (i != targetStages[s].ground.length - 1){
      tCode += ",";
    }
  }
  tCode += "],ceiling:[";
  for (let i=0;i<targetStages[s].ceiling.length;i++){
    tCode += "[new Vec2D("+targetStages[s].ceiling[i][0].x.toFixed(1)+","+targetStages[s].ceiling[i][0].y.toFixed(1)+"),new Vec2D("+targetStages[s].ceiling[i][1].x.toFixed(1)+","+targetStages[s].ceiling[i][1].y.toFixed(1)+")]";
    if (i != targetStages[s].ceiling.length - 1){
      tCode += ",";
    }
  }
  tCode += "],wallL:[";
  for (let i=0;i<targetStages[s].wallL.length;i++){
    tCode += "[new Vec2D("+targetStages[s].wallL[i][0].x.toFixed(1)+","+targetStages[s].wallL[i][0].y.toFixed(1)+"),new Vec2D("+targetStages[s].wallL[i][1].x.toFixed(1)+","+targetStages[s].wallL[i][1].y.toFixed(1)+")]";
    if (i != targetStages[s].wallL.length - 1){
      tCode += ",";
    }
  }
  tCode += "],wallR:[";
  for (let i=0;i<targetStages[s].wallR.length;i++){
    tCode += "[new Vec2D("+targetStages[s].wallR[i][0].x.toFixed(1)+","+targetStages[s].wallR[i][0].y.toFixed(1)+"),new Vec2D("+targetStages[s].wallR[i][1].x.toFixed(1)+","+targetStages[s].wallR[i][1].y.toFixed(1)+")]";
    if (i != targetStages[s].wallR.length - 1){
      tCode += ",";
    }
  }
  tCode += "],platform:[";
  for (let i=0;i<targetStages[s].platform.length;i++){
    tCode += "[new Vec2D("+targetStages[s].platform[i][0].x.toFixed(1)+","+targetStages[s].platform[i][0].y.toFixed(1)+"),new Vec2D("+targetStages[s].platform[i][1].x.toFixed(1)+","+targetStages[s].platform[i][1].y.toFixed(1)+")]";
    if (i != targetStages[s].platform.length - 1){
      tCode += ",";
    }
  }
  tCode += "],ledge:[";
  for (let i=0;i<targetStages[s].ledge.length;i++){
    tCode += "["+targetStages[s].ledge[i][0].toFixed(1)+","+targetStages[s].ledge[i][1].toFixed(1)+"]";
    if (i != targetStages[s].ledge.length - 1){
      tCode += ",";
    }
  }
  tCode += "],target:[";
  for (let i=0;i<targetStages[s].target.length;i++){
    tCode += "new Vec2D("+targetStages[s].target[i].x.toFixed(1)+","+targetStages[s].target[i].y.toFixed(1)+")";
    if (i != targetStages[s].target.length - 1){
      tCode += ",";
    }
  }
  tCode += "],scale:" + targetStages[s].scale + ",blastzone:new Box2D([-250,-250],[250,250]),offset:[600,375]}";
  return tCode;
}

export function targetBuilderControls (p){
  if (!showingCode){
    if (!builderPaused){
      hoverItem = 0;
      ledgeHoverItem = 0;
      /*if (player[p].inputs.z[0] && !player[p].inputs.z[1]){
        // so i can create permanent stages
        let code = createStageCode();
        console.log(code);
      }*/
      //hoverButton = -1;
      let multi = (player[p].inputs.y[0] || player[p].inputs.x[0])?1:5;
      unGriddedCrossHairPos.x += player[p].inputs.lStickAxis[0].x*multi;
      unGriddedCrossHairPos.y += player[p].inputs.lStickAxis[0].y*multi;
      if (gridType == 4){
        crossHairPos.x = unGriddedCrossHairPos.x;
        crossHairPos.y = unGriddedCrossHairPos.y;
      } else {
        if (unGriddedCrossHairPos.x == 0) {
          crossHairPos.x = (600 % gridSizes[gridType]) / 3;
        } else {
          crossHairPos.x = (Math.round(unGriddedCrossHairPos.x / (gridSizes[gridType] / 3)) * gridSizes[gridType] / 3) +
            (600 % gridSizes[gridType]) / 3;
        }
        if (unGriddedCrossHairPos.y == 0) {
          crossHairPos.y = (375 % gridSizes[gridType]) / 3;
        } else {
          crossHairPos.y = (Math.round(unGriddedCrossHairPos.y / (gridSizes[gridType] / -3)) * gridSizes[gridType] /
            -3) + (375 % gridSizes[gridType]) / 3;
        }
      }
      let realCrossHair = new Vec2D(crossHairPos.x*3+600,crossHairPos.y*-3+375)
      /*if (realCrossHair.x >= 700 && realCrossHair.x <= 1110 && realCrossHair.y >= 650 && realCrossHair.y <= 710){
        hoverButton = Math.floor((realCrossHair.x-695)/70);
      }*/
      if (crossHairPos.x > 200){
        crossHairPos.x = 200;
        realCrossHair.x = 1200;
      }
      if (crossHairPos.x < -200) {
        crossHairPos.x = -200;
        realCrossHair.x = 0;
      }
      if (crossHairPos.y > 125) {
        crossHairPos.y = 125;
        realCrossHair.y = 0;
      }
      if (crossHairPos.y < -125) {
        crossHairPos.y = -125;
        realCrossHair.y = 750;
      }
      if (realCrossHair.x > 670 && realCrossHair.y > 630) {
        hoverToolbar = 0.3;
      } else {
        hoverToolbar = 1;
      }
      if (player[p].inputs.z[0] && !player[p].inputs.z[1]) {
        gridType++;
        if (gridType > 4) {
          gridType = 0;
        }
      }
      if (player[p].inputs.l[0] && !player[p].inputs.l[1]) {
        sounds.menuSelect.play();
        targetTool--;
        if (targetTool == -1) {
          targetTool = 5;
        }
        toolInfoTimer = 120;
      } else if (player[p].inputs.r[0] && !player[p].inputs.r[1]) {
        sounds.menuSelect.play();
        targetTool++;
        if (targetTool == 6) {
          targetTool = 0;
        }
        toolInfoTimer = 120;
      }
      switch (targetTool) {
        case 0:
          //BOX
          if (!holdingA) {
            if (player[p].inputs.a[0] && !player[p].inputs.a[1] && !player[p].inputs.z[0]) {
              // initiate build
              if (stageTemp.box.length < 120) {
                drawingBox.min = new Vec2D(realCrossHair.x, realCrossHair.y);
                drawingBox.max = new Vec2D(realCrossHair.x, realCrossHair.y);
                holdingA = true;
              } else {
                sounds.deny.play();
              }
            }
          } else {
            if (player[p].inputs.a[0]) {
              // stretch
              drawingBox.max = new Vec2D(realCrossHair.x, realCrossHair.y);
            } else {
              //RELEASE
              drawingBox.max = new Vec2D(realCrossHair.x,realCrossHair.y);
              if (Math.abs(drawingBox.min.x-drawingBox.max.x) >= 3.73*3 && Math.abs(drawingBox.min.y-drawingBox.max.y) >= 2.8*3){
                stageTemp.draw.box.push(new Box2D([Math.min(drawingBox.min.x,drawingBox.max.x),Math.max(drawingBox.min.y,drawingBox.max.y)],[Math.max(drawingBox.min.x,drawingBox.max.x),Math.min(drawingBox.min.y,drawingBox.max.y)]));
                let b = stageTemp.draw.box[stageTemp.draw.box.length-1];
                stageTemp.draw.ground.push([new Vec2D(b.min.x,b.max.y),new Vec2D(b.max.x,b.max.y)]);
                stageTemp.draw.ceiling.push([new Vec2D(b.min.x,b.min.y),new Vec2D(b.max.x,b.min.y)]);
                stageTemp.draw.wallL.push([new Vec2D(b.min.x,b.max.y),new Vec2D(b.min.x,b.min.y)]);
                stageTemp.draw.wallR.push([new Vec2D(b.max.x,b.max.y),new Vec2D(b.max.x,b.min.y)]);

                stageTemp.box.push(new Box2D([(Math.min(drawingBox.min.x,drawingBox.max.x)-600)/3,(Math.max(drawingBox.min.y,drawingBox.max.y)-375)/-3],[(Math.max(drawingBox.min.x,drawingBox.max.x)-600)/3,(Math.min(drawingBox.min.y,drawingBox.max.y)-375)/-3]));
                 b = stageTemp.box[stageTemp.box.length-1];
                stageTemp.ground.push([new Vec2D(b.min.x,b.max.y),new Vec2D(b.max.x,b.max.y)]);
                stageTemp.ceiling.push([new Vec2D(b.min.x,b.min.y),new Vec2D(b.max.x,b.min.y)]);
                stageTemp.wallL.push([new Vec2D(b.min.x,b.max.y),new Vec2D(b.min.x,b.min.y)]);
                stageTemp.wallR.push([new Vec2D(b.max.x,b.max.y),new Vec2D(b.max.x,b.min.y)]);
                undoList.push("box");
              } else {
                tooSmallTimer = 60;
                tooSmallPos = new Vec2D(realCrossHair.x, realCrossHair.y);
              }
              holdingA = false;
              sounds.blunthit.play();
            }
          }
          break;
        case 1:
          //PLATFORM
          if (!holdingA) {
            if (player[p].inputs.a[0] && !player[p].inputs.a[1] && !player[p].inputs.z[0]) {
              // initiate build
              if (stageTemp.platform.length < 120) {
                drawingPlatform[0] = new Vec2D(realCrossHair.x, realCrossHair.y);
                drawingPlatform[1] = new Vec2D(realCrossHair.x, drawingPlatform[0].y);
                holdingA = true;
              } else {
                sounds.deny.play();
              }
            }
          } else {
            if (player[p].inputs.a[0]) {
              // stretch
              drawingPlatform[1] = new Vec2D(realCrossHair.x, drawingPlatform[0].y);
            } else {
              //RELEASE
              drawingPlatform[1] = new Vec2D(realCrossHair.x, drawingPlatform[0].y);
              /*[new 682.25625 512.19375 Vec2D(27.418750000000955,-85.46249999999999),new Vec2D(-29.268749999999045,-85.46249999999999)]*/
              //console.log(drawingPlatform);
              if (Math.abs(drawingPlatform[0].x - drawingPlatform[1].x) >= 10) {
                stageTemp.draw.platform.push([new Vec2D(Math.min(drawingPlatform[0].x, drawingPlatform[1].x),
                  drawingPlatform[0].y), new Vec2D(Math.max(drawingPlatform[0].x, drawingPlatform[1].x),
                  drawingPlatform[1].y)]);
                stageTemp.platform.push([new Vec2D((Math.min(drawingPlatform[0].x, drawingPlatform[1].x) - 600) / 3,
                  (drawingPlatform[0].y - 375) / -3), new Vec2D((Math.max(drawingPlatform[0].x, drawingPlatform[
                  1].x) - 600) / 3, (drawingPlatform[1].y - 375) / -3)]);
                if (stageTemp.platform[stageTemp.platform.length - 1][0].x > stageTemp.platform[stageTemp.platform.length -
                    1][1].x) {
                  console.log("wtf")
                }
                undoList.push("platform");
              } else {
                tooSmallTimer = 60;
                tooSmallPos = new Vec2D(realCrossHair.x, realCrossHair.y);
              }
              holdingA = false;
              sounds.blunthit.play();
            }
          }
          break;
        case 2:
          //LEDGE
          ledgeHoverItem = 0;
          for (let i=0;i<stageTemp.box.length;i++){
            if (realCrossHair.x >= stageTemp.draw.box[i].min.x-5 && realCrossHair.x <= stageTemp.draw.box[i].max.x+5 && realCrossHair.y >= stageTemp.draw.box[i].max.y-5 && realCrossHair.y <= stageTemp.draw.box[i].min.y+5){
              ledgeHoverItem = ["box",i];
              break;
            }
          }
          if (ledgeHoverItem != 0) {
            if (Math.abs(realCrossHair.x - stageTemp.draw.box[i].min.x) < Math.abs(realCrossHair.x - stageTemp.draw.box[
                i].max.x)) {
              ledgeHoverItem.push(0);
            } else {
              ledgeHoverItem.push(1);
            }
            if (player[p].inputs.a[0] && !player[p].inputs.a[1] && !player[p].inputs.z[0]){
              let alreadyExist = false;
              for (let j=0;j<stageTemp.ledge.length;j++){
                if (stageTemp.ledge[j][0] == ledgeHoverItem[1] && stageTemp.ledge[j][1] == ledgeHoverItem[2]){
                  stageTemp.ledge.splice(j,1);
                  alreadyExist = true;
                  break;
                }
              }
              if (!alreadyExist) {
                stageTemp.ledge.push([ledgeHoverItem[1], ledgeHoverItem[2]]);
                undoList.push("ledge");
              }
              sounds.blunthit.play();
            }
          }
          break;
        case 3:
          //TARGET
          if (player[p].inputs.a[0] && !player[p].inputs.a[1] && !player[p].inputs.z[0]) {
            if (stageTemp.target.length < 20) {
              stageTemp.draw.target.push(new Vec2D(realCrossHair.x, realCrossHair.y));
              stageTemp.target.push(new Vec2D(crossHairPos.x, crossHairPos.y));
              undoList.push("target");
              sounds.blunthit.play();
            } else {
              sounds.deny.play();
            }
          }
          break;
        case 4:
          //MOVE
          if (grabbedItem == 0) {
            if (Math.abs(realCrossHair.x - stageTemp.draw.startingPoint.x) <= 30 && Math.abs(realCrossHair.y -
                stageTemp.draw.startingPoint.y) <= 30) {
              hoverItem = ["startingPoint", 0];
            } else {
              if (!findTarget(realCrossHair)) {
                if (!findPlatform(realCrossHair)) {
                  if (!findBox(realCrossHair)) {
                    hoverItem = 0;
                  }
                }
              }
            }
          } else {
            hoverItem = grabbedItem;
          }
          if (hoverItem != 0) {
            if (!holdingA) {
              if (player[p].inputs.a[0] && !player[p].inputs.a[1] && !player[p].inputs.z[0]) {
                // initiate build
                centerItem(hoverItem, realCrossHair);
                grabbedItem = hoverItem;
                holdingA = true;
              }
            } else {
              if (player[p].inputs.a[0]) {
                //MOVING
                centerItem(hoverItem, realCrossHair);
              } else {
                //RELEASE
                centerItem(hoverItem, realCrossHair);
                holdingA = false;
                grabbedItem = 0;
                sounds.blunthit.play();
              }
            }
          }

          break;
        case 5:
          //DELETE
          if (Math.abs(realCrossHair.x - stageTemp.draw.startingPoint.x) <= 30 && Math.abs(realCrossHair.y -
              stageTemp.draw.startingPoint.y) <= 30) {
            hoverItem = ["startingPoint", 0];
          } else {
            if (!findTarget(realCrossHair)) {
              if (!findPlatform(realCrossHair)) {
                if (!findBox(realCrossHair)) {
                  hoverItem = 0;
                }
              }
            }
          }
          if (hoverItem != 0) {
            if (player[p].inputs.a[0] && !player[p].inputs.a[1] && !player[p].inputs.z[0]) {
              switch (hoverItem[0]) {
                case "startingPoint":
                  sounds.deny.play();
                  break;
                case "platform":
                case "target":
                  stageTemp.draw[hoverItem[0]].splice(hoverItem[1], 1);
                  stageTemp[hoverItem[0]].splice(hoverItem[1], 1);
                  sounds.menuBack.play();
                  break;
                case "box":
                  let ledgeDeleteQueue = [];
                  for (let j=0;j<stageTemp.ledge.length;j++){
                    if (stageTemp.ledge[j][0] == hoverItem[1]){
                      ledgeDeleteQueue.push(j);
                    }
                  }
                  for (let k=0;k<ledgeDeleteQueue.length;k++){
                    stageTemp.ledge.splice(ledgeDeleteQueue[k]-k,1);
                  }
                  for (let n=0;n<stageTemp.ledge.length;n++){
                    if (stageTemp.ledge[n][0] > hoverItem[1]){
                      stageTemp.ledge[n][0]--;
                    }
                  }
                  stageTemp.draw.box.splice(hoverItem[1], 1);
                  stageTemp.box.splice(hoverItem[1], 1);
                  stageTemp.draw.ground.splice(hoverItem[1], 1);
                  stageTemp.ground.splice(hoverItem[1], 1);
                  stageTemp.draw.wallL.splice(hoverItem[1], 1);
                  stageTemp.wallL.splice(hoverItem[1], 1);
                  stageTemp.draw.wallR.splice(hoverItem[1], 1);
                  stageTemp.wallR.splice(hoverItem[1], 1);
                  stageTemp.draw.ceiling.splice(hoverItem[1], 1);
                  stageTemp.ceiling.splice(hoverItem[1], 1);
                  sounds.menuBack.play();
                  break;
                default:
                  break;
              }
              hoverItem = 0;
            }
          }
          break;
        default:
          break;
      }
      if (player[p].inputs.s[0] && !player[p].inputs.s[1]) {
        builderPaused = true;
        sounds.pause.play();
      }
    } else {
      if (player[p].inputs.lStickAxis[0].y >= 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) {
        builderPauseSelected--;
        if (builderPauseSelected < 0) {
          builderPauseSelected = 2;
        }
        sounds.menuSelect.play();
      } else if (player[p].inputs.lStickAxis[0].y <= -0.7 && player[p].inputs.lStickAxis[1].y > -0.7) {
        builderPauseSelected++;
        if (builderPauseSelected > 2) {
          builderPauseSelected = 0;
        }
        sounds.menuSelect.play();
      }
      if (player[p].inputs.a[0] && !player[p].inputs.a[1]) {
        switch (builderPauseSelected) {
          case 0:
            sounds.menuForward.play();
            startTargetGame(targetBuilder, true);
            break;
          case 1:
            sounds.menuForward.play();
            showingCode = true;
            let code = createStageCode();
            $("#customStageContainer").show();
            $("#cStageEdit").select().val(code);
            $("#cStageTitleEdit").empty().append("Share this code");

            // deep copy temp stage into custom stage array
            if (editingStage > -1){
              setCookie("custom"+editingStage,code,36500);
                setCustomTargetStages(customTargetStages[editingStage],{});
                setCustomTargetStages(customTargetStages[editingStage],deepCopyObject(true,customTargetStages[editingStage],stageTemp));
              $("#cStageInfoEdit").empty().append("Custom stage "+(editingStage+1)+" updated!");
            }
            else {
              if (customTargetStages.length < 10){
                setCookie("custom"+customTargetStages.length,code,36500);
                  setCustomTargetStages(customTargetStages[customTargetStages.length], {});
                  setCustomTargetStages(customTargetStages[customTargetStages.length],deepCopyObject(true,customTargetStages[customTargetStages.length-1],stageTemp));
                $("#cStageInfoEdit").empty().append("Saved as Custom stage "+customTargetStages.length);
              }
              else {
                // limit reached
                $("#cStageInfoEdit").empty().append(
                  "Stage Limit Reached! Delete stages on the target test select to free space");
              }
            }
            //console.log(customTargetStages);
            break;
          case 2:
            sounds.menuForward.play();
            changeGamemode(1);
            break;
          default:
            break;
        }
      } else if (player[p].inputs.s[0] && !player[p].inputs.s[1]) {
        builderPaused = false;
        builderPauseSelected = 0;
        sounds.menuBack.play();
      }
    }
  } else {
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]) {
      showingCode = false;
      $("#customStageContainer").hide();
      sounds.menuForward.play();
    }
  }

}

export function drawTargetStage (){
  ui.fillStyle = boxFill;
  for (let i=0;i<stageTemp.draw.box.length;i++){
    let b = stageTemp.draw.box[i];
    ui.fillRect(b.min.x,b.max.y,Math.abs(b.max.x-b.min.x),Math.abs(b.max.y-b.min.y));
  }
  for (let i=0;i<stageTemp.draw.target.length;i++){
    let x = stageTemp.draw.target[i].x;
    let y = stageTemp.draw.target[i].y;
    for (let j=0;j<5;j++){
      if (hoverItem[0] == "target" && hoverItem[1] == i){
        ui.fillStyle = (j%2)?"white":"rgb(241, 111, 111)";
      }
      ui.beginPath();
      ui.arc(x, y, 25 - j * 5, 0, twoPi);
      ui.closePath();
      ui.fill();
    }
  }

  ui.strokeStyle = "#db80cc";
  ui.lineWidth = 1;
  for (let i=0;i<stageTemp.draw.ground.length;i++){
    let g = stageTemp.draw.ground[i];
    ui.beginPath();
    ui.moveTo(g[0].x, g[0].y);
    ui.lineTo(g[1].x, g[1].y);
    ui.closePath();
    ui.stroke();
  }
  ui.strokeStyle = "#4794c6";
  for (let i=0;i<stageTemp.draw.platform.length;i++){
    let p = stageTemp.draw.platform[i];
    ui.beginPath();
    ui.moveTo(p[0].x, p[0].y);
    ui.lineTo(p[1].x, p[1].y);
    ui.closePath();
    ui.stroke();
  }
  ui.strokeStyle = "#47c648";
  for (let i=0;i<stageTemp.draw.wallL.length;i++){
    let w = stageTemp.draw.wallL[i];
    ui.beginPath();
    ui.moveTo(w[0].x, w[0].y);
    ui.lineTo(w[1].x, w[1].y);
    ui.closePath();
    ui.stroke();
  }
  ui.strokeStyle = "#9867de";
  for (let i=0;i<stageTemp.draw.wallR.length;i++){
    let w = stageTemp.draw.wallR[i];
    ui.beginPath();
    ui.moveTo(w[0].x, w[0].y);
    ui.lineTo(w[1].x, w[1].y);
    ui.closePath();
    ui.stroke();
  }
  ui.strokeStyle = "#f04c4c";
  for (let i=0;i<stageTemp.draw.ceiling.length;i++){
    let ce = stageTemp.draw.ceiling[i];
    ui.beginPath();
    ui.moveTo(ce[0].x, ce[0].y);
    ui.lineTo(ce[1].x, ce[1].y);
    ui.closePath();
    ui.stroke();
  }
  ui.strokeStyle = "#e7a44c";
  ui.lineWidth = 1;
  for (let i=0;i<stageTemp.ledge.length;i++){
    let e = stageTemp.ledge[i];
    ui.beginPath();
    if (e[1]) {
      ui.moveTo(stageTemp.draw.box[e[0]].max.x, stageTemp.draw.box[e[0]].max.y + Math.min(30, (stageTemp.draw.box[e[0]]
        .min.y - stageTemp.draw.box[e[0]].max.y) / 2));
      ui.lineTo(stageTemp.draw.box[e[0]].max.x, stageTemp.draw.box[e[0]].max.y);
      ui.lineTo(stageTemp.draw.box[e[0]].max.x - Math.min(30, (stageTemp.draw.box[e[0]].max.x - stageTemp.draw.box[e[
        0]].min.x) / 2), stageTemp.draw.box[e[0]].max.y);
    } else {
      ui.moveTo(stageTemp.draw.box[e[0]].min.x, stageTemp.draw.box[e[0]].max.y + Math.min(30, (stageTemp.draw.box[e[0]]
        .min.y - stageTemp.draw.box[e[0]].max.y) / 2));
      ui.lineTo(stageTemp.draw.box[e[0]].min.x, stageTemp.draw.box[e[0]].max.y);
      ui.lineTo(stageTemp.draw.box[e[0]].min.x + Math.min(30, (stageTemp.draw.box[e[0]].max.x - stageTemp.draw.box[e[
        0]].min.x) / 2), stageTemp.draw.box[e[0]].max.y);
    }
    ui.closePath();
    ui.stroke();
  }
}

export function renderTargetBuilder (){
  clearScreen();
  drawBackground();
  ui.strokeStyle = "rgba(255, 255, 255, 0.17)";
  ui.lineWidth = 2;
  if (gridType != 4) {
    ui.beginPath();
    for (let i=0;i<1200/gridSizes[gridType];i++){
      ui.moveTo(i*gridSizes[gridType],0);
      ui.lineTo(i*gridSizes[gridType],750);
    }
    for (let i=0;i<750/gridSizes[gridType];i++){
      ui.moveTo(0,i*gridSizes[gridType]);
      ui.lineTo(1200,i*gridSizes[gridType]);
    }
    ui.closePath();
    ui.stroke();
  }
  drawTargetStage();
  if (holdingA) {
    switch (targetTool) {
      case 0:
        //BOX
        ui.strokeStyle = "white";
        ui.lineWidth = 4;
        ui.strokeRect(Math.min(drawingBox.min.x, drawingBox.max.x), Math.min(drawingBox.min.y, drawingBox.max.y),
          Math.abs(drawingBox.min.x - drawingBox.max.x), Math.abs(drawingBox.min.y - drawingBox.max.y));
        break;
      case 1:
        //PLATFORM
        ui.strokeStyle = "rgb(79, 244, 255)";
        ui.lineWidth = 4;
        ui.beginPath();
        ui.moveTo(drawingPlatform[0].x, drawingPlatform[0].y);
        ui.lineTo(drawingPlatform[1].x, drawingPlatform[1].y);
        ui.stroke();
        ui.closePath();
        break;
      case 2:
        //LEDGE
        break;
      case 3:
        //TARGET
        break;
      case 4:
        //MOVE
        break;
      case 5:
        //DELETE
        break;
      default:
        break;
    }
  }
  ui.textAlign = "center";
  ui.lineWidth = 2;
  let spCol = ["rgb(0, 0, 0)","rgb(110, 255, 66)"];
  if (hoverItem[0] == "startingPoint"){
    spCol = ["rgb(82, 82, 82)","rgb(171, 255, 145)"];
  }
  ui.fillStyle = spCol[0];
  ui.fillRect(stageTemp.draw.startingPoint.x - 4, stageTemp.draw.startingPoint.y - 12, 8, 24);
  ui.fillRect(stageTemp.draw.startingPoint.x - 12, stageTemp.draw.startingPoint.y - 4, 24, 8);
  ui.fillRect(stageTemp.draw.startingPoint.x - 27, stageTemp.draw.startingPoint.y - 23, 54, 13);
  ui.fillStyle = spCol[1];
  ui.fillRect(stageTemp.draw.startingPoint.x - 2, stageTemp.draw.startingPoint.y - 10, 4, 20);
  ui.fillRect(stageTemp.draw.startingPoint.x - 10, stageTemp.draw.startingPoint.y - 2, 20, 4);
  ui.font = "900 14px Arial";
  ui.fillText("START", stageTemp.draw.startingPoint.x, stageTemp.draw.startingPoint.y - 12);
  //ui.strokeText("START",stageTemp.draw.startingPoint.x,stageTemp.draw.startingPoint.y-12);
  let i = hoverItem[1];
  if (hoverItem[0] == "box"){
    ui.strokeStyle = "#e9bee2";
    ui.lineWidth = 3;
    let g = stageTemp.draw.ground[i];
    ui.beginPath();
    ui.moveTo(g[0].x, g[0].y);
    ui.lineTo(g[1].x, g[1].y);
    ui.closePath();
    ui.stroke();

    ui.strokeStyle = "#86df87";
    let w = stageTemp.draw.wallL[i];
    ui.beginPath();
    ui.moveTo(w[0].x, w[0].y);
    ui.lineTo(w[1].x, w[1].y);
    ui.closePath();
    ui.stroke();

    ui.strokeStyle = "#b99fde";
     w = stageTemp.draw.wallR[i];
    ui.beginPath();
    ui.moveTo(w[0].x, w[0].y);
    ui.lineTo(w[1].x, w[1].y);
    ui.closePath();
    ui.stroke();

    ui.strokeStyle = "#fa9292";
    let ce = stageTemp.draw.ceiling[i];
    ui.beginPath();
    ui.moveTo(ce[0].x, ce[0].y);
    ui.lineTo(ce[1].x, ce[1].y);
    ui.closePath();
    ui.stroke();

    ui.strokeStyle = "#e8bd84";
    for (let j=0;j<stageTemp.ledge.length;j++){
      let e = stageTemp.ledge[j];
      if (e[0] == i){
        ui.beginPath();
        if (e[1]) {
          ui.moveTo(stageTemp.draw.box[e[0]].max.x, stageTemp.draw.box[e[0]].max.y + Math.min(30, (stageTemp.draw.box[
            e[0]].min.y - stageTemp.draw.box[e[0]].max.y) / 2));
          ui.lineTo(stageTemp.draw.box[e[0]].max.x, stageTemp.draw.box[e[0]].max.y);
          ui.lineTo(stageTemp.draw.box[e[0]].max.x - Math.min(30, (stageTemp.draw.box[e[0]].max.x - stageTemp.draw.box[
            e[0]].min.x) / 2), stageTemp.draw.box[e[0]].max.y);
        } else {
          ui.moveTo(stageTemp.draw.box[e[0]].min.x, stageTemp.draw.box[e[0]].max.y + Math.min(30, (stageTemp.draw.box[
            e[0]].min.y - stageTemp.draw.box[e[0]].max.y) / 2));
          ui.lineTo(stageTemp.draw.box[e[0]].min.x, stageTemp.draw.box[e[0]].max.y);
          ui.lineTo(stageTemp.draw.box[e[0]].min.x + Math.min(30, (stageTemp.draw.box[e[0]].max.x - stageTemp.draw.box[
            e[0]].min.x) / 2), stageTemp.draw.box[e[0]].max.y);
        }
        ui.closePath();
        ui.stroke();
      }
    }
  } else if (hoverItem[0] == "platform") {
    ui.lineWidth = 3;
    ui.strokeStyle = "#7eb3d5";
    let p = stageTemp.draw.platform[i];
    ui.beginPath();
    ui.moveTo(p[0].x, p[0].y);
    ui.lineTo(p[1].x, p[1].y);
    ui.closePath();
    ui.stroke();
  }

  if (ledgeHoverItem != 0) {
    ui.fillStyle = "rgb(255, 148, 70)";
    ui.beginPath();
    if (ledgeHoverItem[2]) {
      // if right side
      ui.arc(stageTemp.draw.box[ledgeHoverItem[1]].max.x, stageTemp.draw.box[ledgeHoverItem[1]].max.y, 10, 0, twoPi);
    } else {
      ui.arc(stageTemp.draw.box[ledgeHoverItem[1]].min.x, stageTemp.draw.box[ledgeHoverItem[1]].max.y, 10, 0, twoPi);
    }
    ui.closePath();
    ui.fill();
  }

  if (toolInfoTimer > 0) {
    toolInfoTimer--;
  }
  ui.fillStyle = "rgb(255,255,255)";
  ui.font = "13px Lucida Console, monaco, monospace";

  for (let i=0;i<6;i++){
    if (targetTool == i){
      if (toolInfoTimer > 0){
        ui.save();
        ui.globalAlpha = 1 * hoverToolbar;
        ui.fillStyle = "rgba(0,0,0," + Math.min(toolInfoTimer / 60, 1) + ")";
        ui.fillRect(690 + i * 70, 715, 80, 30);
        ui.fillStyle = "rgba(255,255,255," + Math.min(toolInfoTimer / 60, 1) + ")";
        ui.fillText(toolInfo[targetTool], 730 + i * 70, 733);
        ui.restore();
      }
      ui.globalAlpha = 0.6 * hoverToolbar;
    } else {
      ui.globalAlpha = 0.2 * hoverToolbar;
    }
    ui.beginPath();
    ui.moveTo(700 + i * 70, 660);
    ui.arc(710 + i * 70, 660, 10, Math.PI, Math.PI * 1.5);
    ui.lineTo(750 + i * 70, 650);
    ui.arc(750 + i * 70, 660, 10, Math.PI * 1.5, twoPi);
    ui.lineTo(760 + i * 70, 710);
    ui.arc(750 + i * 70, 700, 10, 0, Math.PI / 2);
    ui.lineTo(710 + i * 70, 710);
    ui.arc(710 + i * 70, 700, 10, Math.PI / 2, Math.PI);
    ui.closePath();
    ui.fill();
  }
  ui.lineWidth = 4;
  ui.globalAlpha = 1;
  ui.save();
  ui.globalAlpha = 1 * hoverToolbar;
  ui.fillStyle = "rgba(0,0,0,0.8)";
  ui.strokeStyle = "rgba(0,0,0,0.8)";
  ui.font = "600 14px Lucida Console, monaco, monospace";
  ui.fillText(120 - stageTemp.box.length, 745, 707);
  ui.strokeRect(720, 670, 20, 20);
  ui.fillText(120 - stageTemp.platform.length, 815, 707);
  ui.beginPath();
  ui.moveTo(788, 680);
  ui.lineTo(812, 680);
  ui.stroke();
  ui.closePath();
  ui.beginPath();
  ui.moveTo(860, 690);
  ui.lineTo(860, 670);
  ui.lineTo(880, 670);
  ui.stroke();
  ui.closePath();
  ui.fillText(20 - stageTemp.target.length, 955, 707);
  ui.fillStyle = "rgba(255,0,0,0.8)";
  ui.beginPath();
  ui.arc(940, 680, 15, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "rgba(255,255,255,0.8)";
  ui.beginPath();
  ui.arc(940, 680, 10, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "rgba(255,0,0,0.8)";
  ui.beginPath();
  ui.arc(940, 680, 5, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.drawImage(handOpen, 997, 663, 29, 38);
  ui.font = "900 30px Arial";
  ui.fillStyle = "rgba(252, 45, 45, 0.8)";
  ui.fillText("X", 1080, 692);
  ui.restore();
  ui.font = "13px Lucida Console, monaco, monospace";
  if (tooSmallTimer > 0) {
    tooSmallTimer--;
    ui.fillStyle = "rgba(0,0,0," + Math.min(tooSmallTimer / 60, 1) + ")";
    ui.fillRect(tooSmallPos.x + 30, tooSmallPos.y, 80, 25);
    ui.fillStyle = "rgba(255,255,255," + Math.min(tooSmallTimer / 60, 1) + ")";
    ui.fillText("Too small", tooSmallPos.x + 70, tooSmallPos.y + 17);
  }
  if (targetTool == 4) {
    if (grabbedItem == 0) {
      ui.drawImage(handOpen, crossHairPos.x * 3 + 600 - 18, crossHairPos.y * -3 + 375 - 24, 36, 48);
    } else {
      ui.drawImage(handGrab, crossHairPos.x * 3 + 600 - 18, crossHairPos.y * -3 + 375 - 24, 36, 48);
    }
  } else if (targetTool == 5) {
    ui.font = "900 40px Arial";
    ui.fillStyle = "rgb(255, 83, 83)";
    ui.strokeStyle = "black";
    ui.fillText("X", crossHairPos.x * 3 + 600, crossHairPos.y * -3 + 375 + 10);
    ui.strokeText("X", crossHairPos.x * 3 + 600, crossHairPos.y * -3 + 375 + 10);
  } else {
    ui.fillStyle = "#ffffff";
    ui.fillRect(crossHairPos.x * 3 + 600 - 2, crossHairPos.y * -3 + 375 - 10, 4, 20);
    ui.fillRect(crossHairPos.x * 3 + 600 - 10, crossHairPos.y * -3 + 375 - 2, 20, 4);
  }

  if (builderPaused) {
    ui.fillStyle = "rgba(0,0,0,0.4)";
    ui.fillRect(0,0,layers.UI.width,layers.UI.height);
    for (let i=0;i<3;i++){
      if (builderPauseSelected == i){
        ui.fillStyle = "rgba(255,255,255,0.9)";
      } else {
        ui.fillStyle = "rgba(255,255,255,0.2)";
      }
      ui.fillRect(400, 150 + i * 150, 400, 100);
    }
    ui.font = "900 50px Arial";
    ui.fillStyle = "rgba(0,0,0,0.8)";
    ui.fillText("Test stage", 600, 220);
    ui.fillText("Save stage", 600, 370);
    ui.fillText("Quit", 600, 520);
  }
}

export function findTarget (realCrossHair){
  let found = false;
  for (let i=0;i<stageTemp.target.length;i++){
    if (Math.abs(realCrossHair.x - stageTemp.draw.target[i].x) <= 30 && Math.abs(realCrossHair.y - stageTemp.draw.target[i].y) <= 30){
      hoverItem = ["target",i];
      found = true;
      break;
    }
  }
  return found;
}

export function findPlatform (realCrossHair){
  let found = false;
  for (let i=0;i<stageTemp.platform.length;i++){
    if (Math.abs(realCrossHair.x - (stageTemp.draw.platform[i][0].x+stageTemp.draw.platform[i][1].x)/2) <= Math.abs(stageTemp.draw.platform[i][0].x-stageTemp.draw.platform[i][1].x)/2 + 10 && Math.abs(realCrossHair.y - stageTemp.draw.platform[i][0].y) <= 20){
      hoverItem = ["platform",i];
      found = true;
      break;
    }
  }
  return found;
}

export function findBox (realCrossHair){
  let found = false;
  for (let i=0;i<stageTemp.box.length;i++){
    if (realCrossHair.x >= stageTemp.draw.box[i].min.x-5 && realCrossHair.x <= stageTemp.draw.box[i].max.x+5 && realCrossHair.y >= stageTemp.draw.box[i].max.y-5 && realCrossHair.y <= stageTemp.draw.box[i].min.y+5){
      hoverItem = ["box",i];
      found = true;
      break;
    }
  }
  return found;
}

export function centerItem (item,realCrossHair){
  switch (item[0]){
    case "startingPoint":
      stageTemp.draw.startingPoint = new Vec2D(realCrossHair.x, realCrossHair.y);
      stageTemp.startingPoint = new Vec2D(crossHairPos.x, crossHairPos.y);
      break;
    case "target":
      stageTemp.draw.target[item[1]] = new Vec2D(realCrossHair.x, realCrossHair.y);
      stageTemp.target[item[1]] = new Vec2D(crossHairPos.x, crossHairPos.y);
      break;
    case "platform":
      var w = Math.abs((stageTemp.platform[item[1]][0].x - stageTemp.platform[item[1]][1].x)) / 2;
      var wd = Math.abs((stageTemp.draw.platform[item[1]][0].x - stageTemp.draw.platform[item[1]][1].x)) / 2;
      stageTemp.draw.platform[item[1]] = [new Vec2D(realCrossHair.x - wd, realCrossHair.y), new Vec2D(realCrossHair.x +
        wd, realCrossHair.y)];
      stageTemp.platform[item[1]] = [new Vec2D(crossHairPos.x - w, crossHairPos.y), new Vec2D(crossHairPos.x + w,
        crossHairPos.y)];
      break;
    case "box":
      var w = Math.abs((stageTemp.box[item[1]].max.x - stageTemp.box[item[1]].min.x))/2;
      let h = Math.abs((stageTemp.box[item[1]].max.y - stageTemp.box[item[1]].min.y))/2;
      var wd = Math.abs((stageTemp.draw.box[item[1]].max.x - stageTemp.draw.box[item[1]].min.x))/2;
      let hd = Math.abs((stageTemp.draw.box[item[1]].min.y - stageTemp.draw.box[item[1]].max.y))/2;
      stageTemp.box[item[1]] = new Box2D([crossHairPos.x-w,crossHairPos.y-h],[crossHairPos.x+w,crossHairPos.y+h]);
      stageTemp.draw.box[item[1]] = new Box2D([realCrossHair.x-wd,realCrossHair.y+hd],[realCrossHair.x+wd,realCrossHair.y-hd]);

      let b = stageTemp.draw.box[item[1]];
      stageTemp.draw.ground[item[1]] = [new Vec2D(b.min.x,b.max.y),new Vec2D(b.max.x,b.max.y)];
      stageTemp.draw.ceiling[item[1]] = [new Vec2D(b.min.x,b.min.y),new Vec2D(b.max.x,b.min.y)];
      stageTemp.draw.wallL[item[1]] = [new Vec2D(b.min.x,b.max.y),new Vec2D(b.min.x,b.min.y)];
      stageTemp.draw.wallR[item[1]] = [new Vec2D(b.max.x,b.max.y),new Vec2D(b.max.x,b.min.y)];

      var b = stageTemp.box[item[1]];
      stageTemp.ground[item[1]] = [new Vec2D(b.min.x, b.max.y), new Vec2D(b.max.x, b.max.y)];
      stageTemp.ceiling[item[1]] = [new Vec2D(b.min.x, b.min.y), new Vec2D(b.max.x, b.min.y)];
      stageTemp.wallL[item[1]] = [new Vec2D(b.min.x, b.max.y), new Vec2D(b.min.x, b.min.y)];
      stageTemp.wallR[item[1]] = [new Vec2D(b.max.x, b.max.y), new Vec2D(b.max.x, b.min.y)];
      break;
    default:
      break;
  }

}
export function setEditingStage(val){
    editingStage = val;
}
export function setShowingCode(val){
  showingCode = val;
}
export function setTargetBuilder(val){
    targetBuilder = val;
}
export function resetStageTemp(){
  stageTemp = {};
}
export function setStageTemp(val){
  stageTemp = val;
}