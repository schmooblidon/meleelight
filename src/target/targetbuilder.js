
import {player,ui, changeGamemode, setCookie, layers, clearScreen, characterSelections} from "main/main";
import {sounds} from "main/sfx";
import {handGrab, handOpen} from "menus/css";
import {twoPi, curveFromArray} from "main/render";
import {startTargetGame} from "target/targetplay";
import {boxFill, boxFillBG, drawBackground, calculateDamageWallColours, drawDamageLine} from "stages/stagerender";
import {deepCopyObject} from "main/util/deepCopy";
import {Vec2D} from "../main/util/Vec2D";
import {Box2D} from "../main/util/Box2D";
import {setCustomTargetStages, customTargetStages} from "../stages/activeStage";
import {intersectsAny, distanceToPolygon, distanceToLine, lineDistanceToLines} from "../stages/util/detectIntersections";
import {getConnected} from "./util/getConnected";
import {manhattanDist, euclideanDist} from "../main/linAlg";
import {createStageCode} from "../stages/encode";
/* eslint-disable */

export let drawConnectIndicator = false;
export let connectIndicatorPos = new Vec2D(0,0);
export let connectPoint = false;
export let crossHairPos = new Vec2D(0,0);
export let prevCrossHairPos = new Vec2D(0,0);
export let prevRealCrossHair = new Vec2D(0,0);
export let unGriddedCrossHairPos = new Vec2D(0,0);
export let targetBuilder = 0;
export let targetTool = 0;
export let wallType = "ground";
export let wallTypeIndex = 0;
export let wallTypeList = ["ground","ceiling","wallL","wallR"];
export let damageType = "fire";
export let damageTypeIndex = 0;
export let damageTypeList = ["fire","electric","slash","darkness"];
export let dTypeReal = [3,4,1,5];
export let showingCode = false;
export let toolInfoTimer = 0;
export let toolInfo = ["Polygon","Platform","Wall","Ledge","Damage","Target","Move","Delete","Scale","Draw Mode"];
export let holdingA = false;
export let amDrawingPolygon = false;
export let drawingWall = [new Vec2D(0,0),new Vec2D(0,0)];
export let drawingPolygon = [];
export let drawingPlatform = [new Vec2D(0,0),new Vec2D(0,0)];
export let editingStage = -1;
export let scaleScroll = 0;
export let drawMode = 0;

export let badAngleTimer = 0;
export let badAnglePos = new Vec2D(0,0);
export let tooSmallTimer = 0;
export let tooSmallPos = new Vec2D(0,0);
export let wallsTooCloseTimer = 0;
export let wallsTooClosePos = new Vec2D(0,0);

export var stageTemp = {
  polygon : [],
  polygonMap : [],
  platform : [],
  ground : [],
  ceiling : [],
  wallL : [],
  wallR : [],
  target : [],
  startingPoint : [new Vec2D(-10,0),new Vec2D(10,0),new Vec2D(-30,0),new Vec2D(30,0)],
  ledge : [],
  blastzone : new Box2D([-250,-250],[250,250]),
  scale : 3,
  offset : [600,375],
  connected : [],
  background : {
    polygon : [],
    line : []
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
    if (item == "box") {
      stageTemp.ground.pop();
      stageTemp.ceiling.pop();
      stageTemp.wallL.pop();
      stageTemp.wallR.pop();
    }
    undoList.pop();
  }
}

let currentPolygonLines = [];
let denied = false;

export function calculateGriddedCrossHair(){
  if (gridType == 4){
    crossHairPos.x = unGriddedCrossHairPos.x;
    crossHairPos.y = unGriddedCrossHairPos.y;
  } else {
    if (unGriddedCrossHairPos.x == 0) {
      crossHairPos.x = (600 % gridSizes[gridType]) / stageTemp.scale;
    } else {
      crossHairPos.x = (Math.round(unGriddedCrossHairPos.x / (gridSizes[gridType] / stageTemp.scale)) * gridSizes[gridType] / stageTemp.scale) +
            (600 % gridSizes[gridType]) / stageTemp.scale;
    }
    if (unGriddedCrossHairPos.y == 0) {
      crossHairPos.y = (375 % gridSizes[gridType]) / stageTemp.scale;
    } else {
      crossHairPos.y = (Math.round(unGriddedCrossHairPos.y / (gridSizes[gridType] / -stageTemp.scale)) * gridSizes[gridType] /
            -stageTemp.scale) + (375 % gridSizes[gridType]) / stageTemp.scale;
    }
  }
}

let stopShowingCode = false;
function clickFunction() {
  stopShowingCode = true;
}

export function targetBuilderControls (p, input){
  drawConnectIndicator = false;
  if (!showingCode){
    if (!builderPaused){
      hoverItem = 0;
      ledgeHoverItem = 0;
      /*if (input[p].z[0] && !input[p].z[1]){
        // so i can create permanent stages
        let code = createStageCode(stageTemp);
        console.log(code);
      }*/
      //hoverButton = -1;
      let multi = (input[p][0].y || input[p][0].x)?1:5;
      if (targetTool === 8) {
        multi = 0;
      }
      unGriddedCrossHairPos.x += input[p][0].lsX*multi*3/stageTemp.scale;
      unGriddedCrossHairPos.y += input[p][0].lsY*multi*3/stageTemp.scale;
      calculateGriddedCrossHair();
      let realCrossHair = new Vec2D(crossHairPos.x*stageTemp.scale+600,crossHairPos.y*-stageTemp.scale+375);
      /*if (realCrossHair.x >= 700 && realCrossHair.x <= 1110 && realCrossHair.y >= 650 && realCrossHair.y <= 710){
        hoverButton = Math.floor((realCrossHair.x-695)/70);
      }*/
      if (realCrossHair.x < 0){
        unGriddedCrossHairPos.x = -600 / stageTemp.scale;
        calculateGriddedCrossHair();
        realCrossHair.x = 0;
      }
      if (realCrossHair.x > 1200) {
        unGriddedCrossHairPos.x = 600 / stageTemp.scale;
        calculateGriddedCrossHair();
        realCrossHair.x = 1200;
      }
      if (realCrossHair.y > 750) {
        unGriddedCrossHairPos.y = 375 / -stageTemp.scale;
        calculateGriddedCrossHair();
        realCrossHair.y = 750;
      }
      if (realCrossHair.y < 0) {
        unGriddedCrossHairPos.y = -375 / -stageTemp.scale;
        calculateGriddedCrossHair();
        realCrossHair.y = 0;
      }
      if (realCrossHair.x > 600 && realCrossHair.y < 100) {
        hoverToolbar = 0.3;
      } else {
        hoverToolbar = 1;
      }
      if (input[p][0].z && !input[p][1].z) {
        gridType++;
        if (gridType > 4) {
          gridType = 0;
        }
      }
      if ((input[p][0].l && !input[p][1].l) || (input[p][0].dl && !input[p][1].dl)) {
        sounds.menuSelect.play();
        targetTool--;
        if (targetTool === -1) {
          targetTool = 9;
        }
        toolInfoTimer = 120;
        stopDrawingPolygon();
      } else if ((input[p][0].r && !input[p][1].r) || (input[p][0].dr && !input[p][1].dr)) {
        sounds.menuSelect.play();
        targetTool++;
        if (targetTool === 10) {
          targetTool = 0;
        } else if (drawMode && targetTool === 2) {
          targetTool = 6;
        }
        toolInfoTimer = 120;
        stopDrawingPolygon();
      } else if (targetTool === 2) {
        if (input[p][0].du && !input[p][1].du) {
          sounds.menuSelect.play();
          wallTypeIndex++;
          if (wallTypeIndex === 4) {
            wallTypeIndex = 0;
          }
          wallType = wallTypeList[wallTypeIndex];
          toolInfoTimer = 120;
        } else if (input[p][0].dd && !input[p][1].dd) {
          sounds.menuSelect.play();
          wallTypeIndex--;
          if (wallTypeIndex === -1) {
            wallTypeIndex = 3;
          }
          wallType = wallTypeList[wallTypeIndex];
          toolInfoTimer = 120;
        }
      } else if (targetTool === 4) {
        if (input[p][0].du && !input[p][1].du) {
          sounds.menuSelect.play();
          damageTypeIndex++;
          if (damageTypeIndex === 4) {
            damageTypeIndex = 0;
          }
          damageType = damageTypeList[damageTypeIndex];
          toolInfoTimer = 120;
        } else if (input[p][0].dd && !input[p][1].dd) {
          sounds.menuSelect.play();
          damageTypeIndex--;
          if (damageTypeIndex === -1) {
            damageTypeIndex = 3;
          }
          damageType = damageTypeList[damageTypeIndex];
          toolInfoTimer = 120;
        }
      }
      // if bg mode
      if (drawMode) {
        if (targetTool >= 2 && targetTool <= 4) {
          targetTool = 1;
        }
      }
      switch (targetTool) {
        case 0:
          //POLYGON
          if (input[p][0].a && !input[p][1].a && !input[p][0].z) {
            // initiate build
            if (!amDrawingPolygon) {
              if (stageTemp.polygon.length < 120) {
                currentPolygonLines = [];
                drawingPolygon = [new Vec2D(realCrossHair.x, realCrossHair.y), new Vec2D(realCrossHair.x, realCrossHair.y)];
                amDrawingPolygon = true;
                sounds.blunthit.play();
              } else {
                sounds.deny.play();
                break;
              }
            } else {
              //RELEASE
              const lg = drawingPolygon.length;
              const canClosePolygon = Math.abs(realCrossHair.x-drawingPolygon[0].x) < 2 && Math.abs(realCrossHair.y-drawingPolygon[0].y) < 2;
              if (lg > 3 && !denied) {
                currentPolygonLines.push([drawingPolygon[lg-4],drawingPolygon[lg-3]]);
              }
              const nextLine = [drawingPolygon[lg-2], new Vec2D(realCrossHair.x,realCrossHair.y)];
              const relevantPolygonLines = canClosePolygon? currentPolygonLines.slice(1) : currentPolygonLines;
              if (intersectsAny(nextLine, relevantPolygonLines) || (nextLine[0].x === nextLine[1].x && nextLine[0].y === nextLine[1].y)) {
                sounds.deny.play();
                denied = true;
              }
              else {
                sounds.blunthit.play();
                denied = false;
                // if close enough to start of polygon
                if (canClosePolygon) {
                  amDrawingPolygon = false;
                  // remove last point because same as origin
                  drawingPolygon.pop();
                  // if has enough sides, start building walls
                  if (drawingPolygon.length >= 3){
                    // find index direction of clockwise, also make polygon objects while we are looping
                    let area = 0;
                    for (let i=0;i<drawingPolygon.length;i++){
                      let nextPoint = (i === drawingPolygon.length - 1) ? 0 : i + 1;
                      area += (drawingPolygon[nextPoint].x - drawingPolygon[i].x)*(drawingPolygon[nextPoint].y + drawingPolygon[i].y);
                    }
                    let direction = Math.sign(area)*-1;

                    // if not a flat line then start making
                    if (direction != 0 && direction != -0) {
                      if (drawMode) {
                        stageTemp.background.polygon.push([]);
                      } else {
                        stageTemp.polygon.push([]);
                        stageTemp.polygonMap.push([]);
                      }
                      // loop through polygon and determine type
                      let curIndex = (direction === 1) ? 0 : drawingPolygon.length - 1;

                      for (let i=0;i<drawingPolygon.length;i++){
                        let nextIndex = curIndex + direction;
                        if (nextIndex === -1) {
                          nextIndex = drawingPolygon.length - 1;
                        } else if (nextIndex === drawingPolygon.length){
                          nextIndex = 0;
                        }

                        if (drawMode) {
                          stageTemp.background.polygon[stageTemp.background.polygon.length-1][i] = new Vec2D((drawingPolygon[curIndex].x-600)/stageTemp.scale,(drawingPolygon[curIndex].y-375)/-stageTemp.scale);
                        } else {
                          stageTemp.polygon[stageTemp.polygon.length-1][i] = new Vec2D((drawingPolygon[curIndex].x-600)/stageTemp.scale,(drawingPolygon[curIndex].y-375)/-stageTemp.scale);

                          let drawLine = [new Vec2D(drawingPolygon[curIndex].x, drawingPolygon[curIndex].y), new Vec2D(drawingPolygon[nextIndex].x, drawingPolygon[nextIndex].y)];
                          let realLine = [new Vec2D((drawLine[0].x-600)/stageTemp.scale, (drawLine[0].y-375)/-stageTemp.scale),new Vec2D((drawLine[1].x-600)/stageTemp.scale, (drawLine[1].y-375)/-stageTemp.scale)];
                          let angle = Math.atan2(realLine[1].y - realLine[0].y , realLine[1].x - realLine[0].x);
                          if (Math.sign(angle) === -1) {
                            angle += twoPi;
                          }
                          
                          if (angle <= Math.PI/6 || angle >= Math.PI*11/6) {
                            // is ground
                            stageTemp.ground.push([new Vec2D(realLine[0].x, realLine[0].y), new Vec2D(realLine[1].x, realLine[1].y)]);
                            stageTemp.polygonMap[stageTemp.polygonMap.length-1].push(["ground",stageTemp.ground.length-1]);
                          } else if (angle >= Math.PI*5/6 && angle <= Math.PI*7/6) {
                            // is ceiling
                            stageTemp.ceiling.push([new Vec2D(realLine[0].x, realLine[0].y), new Vec2D(realLine[1].x, realLine[1].y)]);
                            stageTemp.polygonMap[stageTemp.polygonMap.length-1].push(["ceiling",stageTemp.ceiling.length-1]);
                          } else if (angle > Math.PI) {
                            // is wallR
                            stageTemp.wallR.push([new Vec2D(realLine[0].x, realLine[0].y), new Vec2D(realLine[1].x, realLine[1].y)]);
                            stageTemp.polygonMap[stageTemp.polygonMap.length-1].push(["wallR",stageTemp.wallR.length-1]);
                          } else {
                            // is wallL
                            stageTemp.wallL.push([new Vec2D(realLine[0].x, realLine[0].y), new Vec2D(realLine[1].x, realLine[1].y)]);
                            stageTemp.polygonMap[stageTemp.polygonMap.length-1].push(["wallL",stageTemp.wallL.length-1]);
                          }
                        }
    
                        curIndex = nextIndex;
                      }
                    } else {
                      tooSmallTimer = 120;
                      tooSmallPos = new Vec2D(realCrossHair.x, realCrossHair.y);
                    }
                    drawingPolygon = [];
                  } else {
                    tooSmallTimer = 120;
                    tooSmallPos = new Vec2D(realCrossHair.x, realCrossHair.y);
                  }
                } else {
                  // continue drawing more points
                  drawingPolygon.push(new Vec2D(realCrossHair.x, realCrossHair.y));
                }
              }
            }
          } else {
            if (amDrawingPolygon){
              drawingPolygon[drawingPolygon.length-1] = new Vec2D(realCrossHair.x, realCrossHair.y);
              const canClosePolygon = Math.abs(realCrossHair.x-drawingPolygon[0].x) < 2 && Math.abs(realCrossHair.y-drawingPolygon[0].y) < 2;
              if (canClosePolygon && drawingPolygon.length >= 3) {
                drawConnectIndicator = true;
                connectIndicatorPos = new Vec2D(drawingPolygon[0].x,drawingPolygon[0].y);
              }
            }
            if (input[p][0].b && !input[p][1].b) {
              if (amDrawingPolygon) {
                if (drawingPolygon.length <= 2) {
                  drawingPolygon = [];
                  amDrawingPolygon = false;
                  currentPolygonLines = [];
                } else {
                  drawingPolygon.pop();
                  currentPolygonLines.pop();
                }
                sounds.menuBack.play();
              }
            }
          }
          stageTemp.connected = getConnected(stageTemp);
          break;
        case 1:
          //PLATFORM / LINE
          if (!holdingA) {
            if (input[p][0].a && !input[p][1].a && !input[p][0].z) {
              // initiate build
              drawingPlatform[0] = new Vec2D(realCrossHair.x, realCrossHair.y);
              drawingPlatform[1] = new Vec2D(realCrossHair.x, realCrossHair.y);
              holdingA = true;
            }
          } else {
            if (input[p][0].a) {
              // stretch
              drawingPlatform[1] = new Vec2D(realCrossHair.x, realCrossHair.y);
            } else {
              //RELEASE
              drawingPlatform[1] = new Vec2D(realCrossHair.x, realCrossHair.y);
              // if width at least 10 start trying to build
              if (Math.abs(drawingPlatform[0].x - drawingPlatform[1].x) >= 10 || (drawMode && manhattanDist(drawingPlatform[0], drawingPlatform[1]) >= 10)) {
                // calculate left and right points
                let left = (drawingPlatform[0].x - drawingPlatform[1].x < 0) ? 0 : 1;
                let right = 1 - left;
                let convertedLeft = new Vec2D((drawingPlatform[left].x - 600) / stageTemp.scale , (drawingPlatform[left].y - 375) / -stageTemp.scale);
                let convertedRight = new Vec2D((drawingPlatform[right].x - 600) / stageTemp.scale , (drawingPlatform[right].y - 375) / -stageTemp.scale);
                if (drawMode) {
                  stageTemp.background.line.push([new Vec2D(convertedLeft.x, convertedLeft.y), new Vec2D(convertedRight.x, convertedRight.y)]);
                } else {
                  // calculate angle
                  let angle = Math.atan2(convertedRight.y - convertedLeft.y, convertedRight.x - convertedLeft.x);
                  // if angle is within limit, build it
                  if (Math.abs(angle) <= Math.PI/6 && Math.abs(angle) >= -Math.PI/6) {
                    stageTemp.platform.push([new Vec2D(convertedLeft.x, convertedLeft.y), new Vec2D(convertedRight.x, convertedRight.y)]);
                  } else {
                    badAngleTimer = 120;
                    badAnglePos = new Vec2D(realCrossHair.x, realCrossHair.y);
                  }
                }
                //undoList.push("platform");
              } else {
                tooSmallTimer = 120;
                tooSmallPos = new Vec2D(realCrossHair.x, realCrossHair.y);
              }
              holdingA = false;
              sounds.blunthit.play();
            }
          }
          stageTemp.connected = getConnected(stageTemp);
          break;
        case 2:
          // WALL
          if (!holdingA) {
            if (input[p][0].a && !input[p][1].a && !input[p][0].z) {
              // initiate build
              drawingWall[0] = new Vec2D(realCrossHair.x, realCrossHair.y);
              drawingWall[1] = new Vec2D(realCrossHair.x, realCrossHair.y);
              holdingA = true;
            }
          } else {
            if (input[p][0].a) {
              // stretch
              drawingWall[1] = new Vec2D(realCrossHair.x, realCrossHair.y);
            } else {
              //RELEASE
              drawingWall[1] = new Vec2D(realCrossHair.x, realCrossHair.y);
              // if magnitude is less than 10, say too small
              if (manhattanDist(drawingWall[0], drawingWall[1]) >= 10) {
                let left = (drawingWall[0].x - drawingWall[1].x < 0) ? 0 : 1;
                let right = 1 - left;
                let convertedLeft = new Vec2D((drawingWall[left].x - 600) / stageTemp.scale , (drawingWall[left].y - 375) / -stageTemp.scale);
                let convertedRight = new Vec2D((drawingWall[right].x - 600) / stageTemp.scale , (drawingWall[right].y - 375) / -stageTemp.scale);
                let angle = Math.atan2(convertedRight.y - convertedLeft.y, convertedRight.x - convertedLeft.x);
                let distanceToOtherWalls;
                if (wallType === "wallL") {
                  distanceToOtherWalls = lineDistanceToLines([convertedLeft, convertedRight], stageTemp.wallR);
                }
                else if (wallType === "wallR") {
                  distanceToOtherWalls = lineDistanceToLines([convertedLeft, convertedRight], stageTemp.wallL);
                }
                if (distanceToOtherWalls !== undefined && distanceToOtherWalls < 2) {
                  wallsTooCloseTimer = 120;
                  wallsTooClosePos = new Vec2D(realCrossHair.x, realCrossHair.y);
                }
                else if (((wallType === "ground" || wallType === "ceiling") && Math.abs(angle) <= Math.PI/6) || ((wallType === "wallL" || wallType === "wallR") && Math.abs(angle) != 0 && Math.abs(angle) != Math.PI)) {
                  stageTemp[wallType].push([new Vec2D(convertedLeft.x, convertedLeft.y), new Vec2D(convertedRight.x, convertedRight.y)]);
                  // if wanting to connect, check each case
                } else {
                  badAngleTimer = 120;
                  badAnglePos = new Vec2D(realCrossHair.x, realCrossHair.y);
                }
                //undoList.push("platform");
              } else {
                tooSmallTimer = 120;
                tooSmallPos = new Vec2D(realCrossHair.x, realCrossHair.y);
              }
              holdingA = false;
              sounds.blunthit.play();
            }
          }
          if (wallType === "ground" || wallType === "platform") {
            stageTemp.connected = getConnected(stageTemp);
          }
          break;
        case 3:
          //LEDGE
          ledgeHoverItem = 0;
          let found = findLine(realCrossHair, false, ["platform", "ground"], true);
          if (found) {
            let toLeft = manhattanDist(crossHairPos, stageTemp[hoverItem[0]][hoverItem[1]][0]);
            let toRight = manhattanDist(crossHairPos, stageTemp[hoverItem[0]][hoverItem[1]][1]);
            if (toRight < toLeft) {
              ledgeHoverItem = [hoverItem[0], hoverItem[1], 1];
            } else {
              ledgeHoverItem = [hoverItem[0], hoverItem[1], 0];
            }
            if (input[p][0].a && !input[p][1].a && !input[p][0].z){
              let alreadyExist = false;
              for (let j=0;j<stageTemp.ledge.length;j++){
                if (stageTemp.ledge[j][0] === ledgeHoverItem[0] && stageTemp.ledge[j][1] === ledgeHoverItem[1] && stageTemp.ledge[j][2] == ledgeHoverItem[2]){
                  stageTemp.ledge.splice(j,1);
                  alreadyExist = true;
                  break;
                }
              }
              if (!alreadyExist) {
                stageTemp.ledge.push([ledgeHoverItem[0], ledgeHoverItem[1], ledgeHoverItem[2]]);
                //undoList.push("ledge");
              }
              sounds.blunthit.play();
            }
          }
          break;
        case 4:
          // DAMAGE
          if (!findLine(realCrossHair, false, ["wallL", "wallR", "ceiling", "ground"], true)) {
            hoverItem = 0;
          }
          if (hoverItem != 0) {
            if (input[p][0].a && !input[p][1].a && !input[p][0].z) {
              if (   stageTemp[hoverItem[0]][hoverItem[1]][2] === undefined 
                  || stageTemp[hoverItem[0]][hoverItem[1]][2].damageType !== damageType ) {
                stageTemp[hoverItem[0]][hoverItem[1]][2] = { damageType : damageType };
              }
              else {
                stageTemp[hoverItem[0]][hoverItem[1]][2] = { damageType : null };
              }
              sounds.menuSelect.play();
            }
          }          
          break;
        case 5:
          //TARGET
          if (input[p][0].a && !input[p][1].a && !input[p][0].z) {
            if (stageTemp.target.length < 20) {
              stageTemp.target.push(new Vec2D(crossHairPos.x, crossHairPos.y));
              undoList.push("target");
              sounds.blunthit.play();
            } else {
              sounds.deny.play();
            }
          }
          break;
        case 6:
          //MOVE
          if (grabbedItem == 0) {
            if (drawMode) {
              if (!findPolygon(crossHairPos, true)) {
                if (!findLine(realCrossHair, true, ["line"])) {
                  hoverItem = 0;
                }
              }
            } else {
              if (!findStartingPoint(realCrossHair)){
                if (!findTarget(realCrossHair)) {
                  if (!findPolygon(crossHairPos)) {
                    if (!findLine(realCrossHair)) {
                      hoverItem = 0;
                    }
                  }
                }
              }
            }
          } else {
            hoverItem = grabbedItem;
          }
          if (hoverItem != 0) {
            if (!holdingA) {
              if (input[p][0].a && !input[p][1].a && !input[p][0].z) {
                // initiate build
                centerItem(hoverItem, realCrossHair);
                grabbedItem = hoverItem;
                holdingA = true;
              }
            } else {
              if (input[p][0].a) {
                //MOVING
                centerItem(hoverItem, realCrossHair);
              } else {
                //RELEASE
                centerItem(hoverItem, realCrossHair);
                holdingA = false;
                grabbedItem = 0;
                sounds.blunthit.play();
                stageTemp.connected = getConnected(stageTemp);
              }
            }
          }

          break;
        case 7:
          //DELETE
          if (drawMode) {
            if (!findPolygon(crossHairPos, true)) {
              if (!findLine(realCrossHair, true, ["line"])) {
                hoverItem = 0;
              } 
            }
          } else {
            if (!findTarget(realCrossHair)) {
              if (!findPolygon(crossHairPos)) {
                if (!findLine(realCrossHair)) {
                  hoverItem = 0;
                }
              }
            }
          }
          if (hoverItem != 0) {
            if (input[p][0].a && !input[p][1].a && !input[p][0].z) {
              switch (hoverItem[0]) {
                case "platform":
                  if (hoverItem[0] === "platform") {
                    for (let n=0;n<stageTemp.ledge.length;n++) {
                      if (stageTemp.ledge[n][0] === "platform"){
                        if (stageTemp.ledge[n][1] > hoverItem[1]) {
                          stageTemp.ledge[n][1]--;
                        } else if (stageTemp.ledge[n][1] === hoverItem[1]) {
                          stageTemp.ledge.splice(n, 1);
                          n--;
                        }
                      }
                    }
                    stageTemp.connected[1].splice(hoverItem[1], 1);
                  }
                  stageTemp.platform.splice(hoverItem[1], 1);
                  sounds.menuBack.play();
                  break;
                case "target":
                  stageTemp[hoverItem[0]].splice(hoverItem[1], 1);
                  sounds.menuBack.play();
                  break;
                case "line":
                  stageTemp.background[hoverItem[0]].splice(hoverItem[1], 1);
                  sounds.menuBack.play();
                  break;
                case "ground":
                case "ceiling":
                case "wallL":
                case "wallR":
                  stageTemp[hoverItem[0]].splice(hoverItem[1], 1);
                  for (let p=0;p<stageTemp.polygonMap.length;p++){
                    if (stageTemp.polygonMap[p] !== null) {
                      for (let k=0;k<stageTemp.polygonMap[p].length;k++){
                        if (stageTemp.polygonMap[p][k][0] === hoverItem[0] && stageTemp.polygonMap[p][k][1] > hoverItem[1]){
                          stageTemp.polygonMap[p][k][1]--;
                        }
                      }
                    }
                  }
                  if (hoverItem[0] === "ground") {
                    for (let n=0;n<stageTemp.ledge.length;n++) {
                      if (stageTemp.ledge[n][0] === "ground"){
                        if (stageTemp.ledge[n][1] > hoverItem[1]) {
                            stageTemp.ledge[n][1]--;
                        } else if (stageTemp.ledge[n][1] === hoverItem[1]) {
                          stageTemp.ledge.splice(n, 1);
                          n--;
                        }
                      }
                    }
                    stageTemp.connected[0].splice(hoverItem[1], 1);
                  }
                  sounds.menuBack.play();
                  break;
                case "polygonBG":
                  stageTemp.background.polygon.splice(hoverItem[1], 1);
                  sounds.menuBack.play();
                  break;
                case "polygon":
                  if (stageTemp.polygonMap[hoverItem[1]] !== undefined && stageTemp.polygonMap[hoverItem[1]] !== null) {
                    for (let j=0;j<stageTemp.polygonMap[hoverItem[1]].length;j++){
                      let type = stageTemp.polygonMap[hoverItem[1]][j][0];
                      let index = stageTemp.polygonMap[hoverItem[1]][j][1];
                      stageTemp[type].splice(index, 1);
                      if (type === "ground") {
                        for (let n=0;n<stageTemp.ledge.length;n++) {
                          if (stageTemp.ledge[n][0] === "ground"){
                            if (stageTemp.ledge[n][1] > index) {
                              stageTemp.ledge[n][1]--;
                            } else if (stageTemp.ledge[n][1] === index) {
                              stageTemp.ledge.splice(n, 1);
                              n--;
                            }
                          }
                        }
                        stageTemp.connected[0].splice(index, 1);
                      }
                      for (let p=0;p<stageTemp.polygonMap.length;p++){
                        if (stageTemp.polygonMap[p] !== null ){ 
                          for (let k=0;k<stageTemp.polygonMap[p].length;k++){
                            if (stageTemp.polygonMap[p][k][0] === type && stageTemp.polygonMap[p][k][1] > index){
                              stageTemp.polygonMap[p][k][1]--;
                            }
                          }
                        }
                      }
                    }
                  }  
                  stageTemp.polygonMap.splice(hoverItem[1], 1);
                  stageTemp.polygon.splice(hoverItem[1], 1);
                  sounds.menuBack.play();
                  break;
                default:
                  break;
              }
              hoverItem = 0;
              stageTemp.connected = getConnected(stageTemp);
            }
          }
          break;
        case 8:
          // SCALE
          if (input[p][0].lsY > 0) {
            scaleScroll++;
            if (scaleScroll > 5) {
              scaleScroll = 0;
              stageTemp.scale += 0.1;
              sounds.menuSelect.play();
              if (stageTemp.scale > 6) {
                stageTemp.scale = 6;
              }
            }
          } else if (input[p][0].lsY < 0) {
            scaleScroll++;
            if (scaleScroll > 5) {
              scaleScroll = 0;
              stageTemp.scale -= 0.1
              sounds.menuSelect.play();
              if (stageTemp.scale < 2) {
                stageTemp.scale = 2;
              }
            }
          } else {
            scaleScroll = 0;
          }
          break;
        case 9:
          // MODE SWITCH
          if (input[p][0].a && !input[p][1].a) {
            drawMode = 1 - drawMode;
          }
          break;
        default:
          break;
      }
      if (input[p][0].s && !input[p][1].s) {
        builderPaused = true;
        sounds.pause.play();
      }
      prevRealCrossHair = new Vec2D(realCrossHair.x,realCrossHair.y);
      prevCrossHairPos = new Vec2D(crossHairPos.x,crossHairPos.y);
    } else {
      if (input[p][0].lsY >= 0.7 && input[p][1].lsY < 0.7) {
        builderPauseSelected--;
        if (builderPauseSelected < 0) {
          builderPauseSelected = 2;
        }
        sounds.menuSelect.play();
      } else if (input[p][0].lsY <= -0.7 && input[p][1].lsY > -0.7) {
        builderPauseSelected++;
        if (builderPauseSelected > 2) {
          builderPauseSelected = 0;
        }
        sounds.menuSelect.play();
      }
      if (input[p][0].a && !input[p][1].a) {
        switch (builderPauseSelected) {
          case 0:
            sounds.menuForward.play();
            startTargetGame(targetBuilder, true);
            break;
          case 1:
            sounds.menuForward.play();
            showingCode = true;
            const code = createStageCode(stageTemp);
            document.getElementById('aButton').addEventListener('click', clickFunction);
            $("#customStageContainer").show();
            $("#cStageEdit").select().val(code);
            $("#cStageTitleEdit").empty().append("Share this code");

            // deep copy temp stage into custom stage array
            if (editingStage > -1){
              setCookie("custom"+editingStage,code,36500);
                customTargetStages[editingStage] = deepCopyObject(true, stageTemp);
                setCustomTargetStages(editingStage, customTargetStages[editingStage]);
              $("#cStageInfoEdit").empty().append("Custom stage "+(editingStage+1)+" updated!");
            }
            else {
              if (customTargetStages.length < 10){
                setCookie("custom"+customTargetStages.length,code,36500);
                customTargetStages.push({});
                customTargetStages[customTargetStages.length - 1] = deepCopyObject(true, stageTemp);
                setCustomTargetStages(customTargetStages.length - 1, customTargetStages[customTargetStages.length - 1]);
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
      } else if (input[p][0].s && !input[p][1].s) {
        builderPaused = false;
        builderPauseSelected = 0;
        sounds.menuBack.play();
      }
    }
  } else { // showing code
    if ( stopShowingCode || (input[p][0].a && !input[p][1].a)) {
      stopShowingCode = false;
      document.getElementById('aButton').removeEventListener('click', clickFunction);
      showingCode = false;
      $("#customStageContainer").hide();
      sounds.menuForward.play();
    }
  }

}

function stopDrawingPolygon(){
  amDrawingPolygon = false;
  drawingPolygon = [];
  currentPolygonLines = [];
}

export function toPixel(p, axis = "both"){
  if (axis === 0) {
    return p * stageTemp.scale + stageTemp.offset[0];
  } else if (axis === 1) {
    return p * -stageTemp.scale + stageTemp.offset[1];
  } else {
    return new Vec2D(p.x * stageTemp.scale + stageTemp.offset[0], p.y * -stageTemp.scale + stageTemp.offset[1]);
  }
}

export function drawLinesOfType(type, colour) {
  ui.strokeStyle = colour;
  for (let i=0;i<stageTemp[type].length;i++){
    let lL = toPixel(stageTemp[type][i][0]);
    let lR = toPixel(stageTemp[type][i][1]);
    ui.beginPath();
    ui.moveTo(lL.x, lL.y);
    ui.lineTo(lR.x, lR.y);
    ui.closePath();
    ui.stroke();
  }
}

export function drawTargetStage (){
  for (let i=0;i<stageTemp.background.polygon.length;i++) {
    ui.fillStyle = (hoverItem[0] === "polygonBG" && hoverItem[1] === i) ? "rgba(255,255,255,0.5)" : boxFillBG;
    let p = stageTemp.background.polygon[i];
    let pn = toPixel(p[0]);
    ui.beginPath();
    ui.moveTo(pn.x,pn.y);
    for (let n=1;n<p.length;n++) {
      pn = toPixel(p[n]);
      ui.lineTo(pn.x,pn.y);
    }
    ui.closePath();
    ui.fill();
  }
  ui.strokeStyle = boxFillBG;
  ui.lineWidth = 3;
  for (let i=0;i<stageTemp.background.line.length;i++){
    let lL = toPixel(stageTemp.background.line[i][0]);
    let lR = toPixel(stageTemp.background.line[i][1]);
    ui.beginPath();
    ui.moveTo(lL.x, lL.y);
    ui.lineTo(lR.x, lR.y);
    ui.closePath();
    ui.stroke();
  }

  for (let i=0;i<stageTemp.polygon.length;i++){
    ui.fillStyle = (hoverItem[0] === "polygon" && hoverItem[1] === i) ? "rgba(255,255,255,0.5)" : boxFill;
    let p = stageTemp.polygon[i];
    let pn = toPixel(p[0]);
    ui.beginPath();
    ui.moveTo(pn.x,pn.y);
    for (let n=1;n<p.length;n++) {
      pn = toPixel(p[n]);
      ui.lineTo(pn.x,pn.y);
    }
    ui.closePath();
    ui.fill();
  }
  for (let i=0;i<stageTemp.target.length;i++){
    let x = toPixel(stageTemp.target[i].x, 0);
    let y = toPixel(stageTemp.target[i].y, 1);
    for (let j=0;j<5;j++){
      if (hoverItem[0] == "target" && hoverItem[1] == i){
        ui.fillStyle = (j%2)?"white":"rgb(241, 111, 111)";
      }
      else {
        ui.fillStyle = (j%2)?"white":"red";
      }
      ui.beginPath();
      ui.arc(x, y, 25 - j * 5, 0, twoPi);
      ui.closePath();
      ui.fill();
    }
  }
  ui.lineWidth = 1;

  drawLinesOfType("ground", "#db80cc");
  drawLinesOfType("platform", "#4794c6");
  drawLinesOfType("wallL", "#47c648");
  drawLinesOfType("wallR", "#9867de");
  drawLinesOfType("ceiling", "#f04c4c"); 

  calculateDamageWallColours();
  ui.lineWidth = 4;
  const types = ["wallL", "wallR", "ground", "ceiling"];
  for (let i=0;i<types.length;i++) {
    drawDamageLine(types[i],ui,stageTemp);
  }

  ui.strokeStyle = "#e7a44c";
  ui.lineWidth = 2;
  for (let i=0;i<stageTemp.ledge.length;i++){
    let e = stageTemp.ledge[i];
    let pA = toPixel(stageTemp[e[0]][e[1]][e[2]]);
    let pB = toPixel(stageTemp[e[0]][e[1]][1-e[2]]);
    let ang = Math.atan2((pB.y - pA.y) , (pB.x - pA.x));
    let magnitude = euclideanDist(pA, pB);
    let length = Math.min(0.25 * magnitude, 20);
    let pC = new Vec2D(pA.x + length * Math.cos(ang), pA.y + length * Math.sin(ang));
    ui.beginPath();
    ui.moveTo(pA.x, pA.y);
    ui.lineTo(pC.x, pC.y);
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
  ui.fillStyle = "rgba(255,255,255,0.5)";
  ui.beginPath();
  for (let i=0;i<stageTemp.connected.length;i++) {
    for (let j=0;j<stageTemp.connected[i].length;j++) {
      for (let k=0;k<stageTemp.connected[i][j].length;k++) {
        let w = stageTemp.connected[i][j][k];
        if (w != null) {
          let type = null;
          if (w[0] === "p") {
            type = "platform";
          }
          else if (w[0] === "g") {
            type = "ground";
          }
          if (type !== null) {
            let p = toPixel(stageTemp[type][w[1]][1-k]);
            ui.moveTo(p.x,p.y);
            ui.arc(p.x,p.y, 5, 0, twoPi);
          }
        }
      }
    }
  }
  ui.closePath();
  ui.fill();
  if (amDrawingPolygon){
    ui.strokeStyle = "white";
    ui.lineWidth = 4;
    ui.beginPath();
    ui.moveTo(drawingPolygon[0].x,drawingPolygon[0].y);
    for (let n=1;n<drawingPolygon.length;n++){
      ui.lineTo(drawingPolygon[n].x,drawingPolygon[n].y);
    }
    ui.stroke();
  }
  if (holdingA) {
    switch (targetTool) {
      case 0:
        //BOX
        /*ui.strokeStyle = "white";
        ui.lineWidth = 4;
        ui.strokeRect(Math.min(drawingBox.min.x, drawingBox.max.x), Math.min(drawingBox.min.y, drawingBox.max.y),
          Math.abs(drawingBox.min.x - drawingBox.max.x), Math.abs(drawingBox.min.y - drawingBox.max.y));*/
        break;
      case 1:
        //PLATFORM / LINE
        if (drawMode) {
          ui.strokeStyle = "rgb(255, 255, 255)";
        } else {
          ui.strokeStyle = "rgb(79, 244, 255)";
        }
        ui.lineWidth = 4;
        ui.beginPath();
        ui.moveTo(drawingPlatform[0].x, drawingPlatform[0].y);
        ui.lineTo(drawingPlatform[1].x, drawingPlatform[1].y);
        ui.stroke();
        ui.closePath();
        break;
      case 2:
        //WALL
        ui.strokeStyle = "rgb(255,255,255)";
        ui.lineWidth = 4;
        ui.beginPath();
        ui.moveTo(drawingWall[0].x, drawingWall[0].y);
        ui.lineTo(drawingWall[1].x, drawingWall[1].y);
        ui.stroke();
        ui.closePath();
        break;
      case 3:
        //LEDGE
        break;
      case 4:
        //TARGET
        break;
      case 5:
        //MOVE
        break;
      case 6:
        //DELETE
        break;
      default:
        break;
    }
  }
  ui.textAlign = "center";
  ui.lineWidth = 2;
  let spCol = ["rgb(0, 0, 0)",["rgb(110, 255, 66)","rgb(255, 74, 74)","rgb(38, 135, 255)","rgb(168, 31, 255)"]];
  let spColH = ["rgb(82, 82, 82)",["rgb(171, 255, 145)","rgb(254, 163, 163)","rgb(168, 207, 255)","rgb(214, 153, 255)"]];
  for (let n=0;n<stageTemp.startingPoint.length;n++) {
    let highlight = false;
    if (hoverItem[0] === "startingPoint" && hoverItem[1] === n){
      highlight = true;
    }
    ui.fillStyle = highlight ? spColH[0] : spCol[0];
    let sP = toPixel(stageTemp.startingPoint[n]);
    ui.fillRect(sP.x - 12, sP.y - 37, 24, 14);
    ui.fillRect(sP.x - 4, sP.y - 12, 8, 24);
    ui.fillRect(sP.x - 12, sP.y - 4, 24, 8);
    ui.fillRect(sP.x - 27, sP.y - 23, 54, 13);
    ui.fillStyle = highlight ? spColH[1][n] : spCol[1][n];
    ui.fillRect(sP.x - 2, sP.y - 10, 4, 20);
    ui.fillRect(sP.x - 10, sP.y - 2, 20, 4);
    ui.font = "900 14px Arial";
    ui.fillText("START", sP.x, sP.y - 12);
    ui.fillText("P"+(n+1), sP.x, sP.y - 25);
  }
  let i = hoverItem[1];
  if (hoverItem[0] === "line" || hoverItem[0] === "platform" || hoverItem[0] === "ground" || hoverItem[0] === "ceiling" || hoverItem[0] === "wallL" || hoverItem[0] === "wallR") {
    ui.lineWidth = 3;
    ui.strokeStyle = "rgba(255,255,255,0.7)";
    let line = 0;
    if (drawMode) {
      line = stageTemp.background[hoverItem[0]][i];
    } else {
      line = stageTemp[hoverItem[0]][i];
    }
    let p0 = toPixel(line[0]);
    let p1 = toPixel(line[1]);
    ui.beginPath();
    ui.moveTo(p0.x, p0.y);
    ui.lineTo(p1.x, p1.y);
    ui.closePath();
    ui.stroke();
  }

  if (ledgeHoverItem != 0) {
    ui.fillStyle = "rgb(255, 148, 70)";
    ui.beginPath();
    let p = toPixel(stageTemp[ledgeHoverItem[0]][ledgeHoverItem[1]][ledgeHoverItem[2]]);
    ui.arc(p.x, p.y, 10, 0, twoPi);
    ui.closePath();
    ui.fill();
  }

  if (drawConnectIndicator) {
    ui.strokeStyle = "rgb(128, 255, 98)";
    ui.lineWidth = 3;
    ui.beginPath();
    ui.arc(connectIndicatorPos.x,connectIndicatorPos.y,15,0,twoPi);
    ui.arc(connectIndicatorPos.x,connectIndicatorPos.y,20,0,twoPi);
    ui.closePath();
    ui.stroke();
  }

  if (toolInfoTimer > 0) {
    toolInfoTimer--;
  }
  ui.fillStyle = "rgb(255,255,255)";
  ui.font = "13px Lucida Console, monaco, monospace";

  for (let i=0;i<10;i++){
    if (targetTool == i){
      if (toolInfoTimer > 0){
        let j = i;
        if (i === 9) {
          j = -1.25;
        }
        let text = toolInfo[targetTool];
        if (i === 1 && drawMode) {
          text = "Line";
        }
        ui.save();
        ui.globalAlpha = 1 * hoverToolbar;
        ui.fillStyle = "rgba(0,0,0," + Math.min(toolInfoTimer / 60, 1) + ")";
        ui.fillRect(550 + j * 70, 85, 80, 30);
        ui.fillStyle = "rgba(255,255,255," + Math.min(toolInfoTimer / 60, 1) + ")";
        ui.fillText(text, 590 + j * 70, 103);
        ui.restore();
      }
      ui.globalAlpha = 0.6 * hoverToolbar;
      if ((targetTool === 2 || targetTool === 4) && toolInfoTimer > 0) {
        ui.save();
        ui.fillStyle = "rgba(255,255,255," + Math.min(toolInfoTimer / 60, 1) + ")";
        ui.strokeStyle = "rgba(0,0,0," + Math.min(toolInfoTimer / 60, 1) + ")";
        ui.lineWidth = 4;
        for (let n=0;n<3;n++) {
          let index = (targetTool === 2 ? wallTypeIndex : damageTypeIndex) + n + 1;
          if (index > 3) {
            index -= 4;
          }
          ui.beginPath();
          ui.moveTo(560 + i * 70, 30 + (n+1) * 70);
          ui.arc(570 + i * 70, 30 + (n+1) * 70, 10, Math.PI, Math.PI * 1.5);
          ui.lineTo(610 + i * 70, 20 + (n+1) * 70);
          ui.arc(610 + i * 70, 30 + (n+1) * 70, 10, Math.PI * 1.5, twoPi);
          ui.lineTo(620 + i * 70, 80 + (n+1) * 70);
          ui.arc(610 + i * 70, 70 + (n+1) * 70, 10, 0, Math.PI / 2);
          ui.lineTo(570 + i * 70, 80 + (n+1) * 70);
          ui.arc(570 + i * 70, 70 + (n+1) * 70, 10, Math.PI / 2, Math.PI);
          ui.closePath();
          ui.fill();
          ui.beginPath();
          switch (targetTool === 2 ? wallTypeList[index] : damageTypeList[index]) {
            case "ground":
              ui.moveTo(718, 57 + (n+1) * 70);
              ui.lineTo(742, 49 + (n+1) * 70);
              break;
            case "ceiling":
              ui.moveTo(718, 49 + (n+1) * 70);
              ui.lineTo(742, 57 + (n+1) * 70);
              break;
            case "wallL":
              ui.moveTo(734, 41 + (n+1) * 70);
              ui.lineTo(726, 65 + (n+1) * 70);
              break;
            case "wallR":
              ui.moveTo(726, 41 + (n+1) * 70);
              ui.lineTo(734, 65 + (n+1) * 70);
              break;
            case "fire":
              ui.save();
              ui.fillStyle = "rgba(255, 136, 49, 0.5)";
              break;
            case "electric":
              ui.save();
              ui.fillStyle = "rgba(0, 236, 255, 0.5)";
              break;
            case "slash":
              ui.save();
              ui.fillStyle = "rgba(210, 210, 210, 0.5)";
              break;
            case "darkness":
              ui.save();
              ui.fillStyle = "rgba(82, 23, 186, 0.5)";
              break;
            default:
              break;
          }
          if (targetTool === 2) {
            ui.stroke();
          } else {
            ui.arc(870, 53 + (n+1) * 70, 15, 0, twoPi);
            ui.fill();
            ui.restore();
          }
        }
        ui.restore();
      }
    } else {
      ui.globalAlpha = ((drawMode && i >= 2 && i <= 4) ? 0.1 : 0.2) * hoverToolbar;
    }
    if (i === 8) {
      ui.beginPath();
      ui.moveTo(570 + i*70, 40);
      ui.lineTo(590 + i*70, 25);
      ui.lineTo(610 + i*70, 40);
      ui.lineTo(605 + i*70, 40);
      ui.lineTo(590 + i*70, 30);
      ui.lineTo(575 + i*70, 40);
      ui.closePath();
      ui.fill();
      ui.beginPath();
      ui.moveTo(570 + i*70, 60);
      ui.lineTo(590 + i*70, 75);
      ui.lineTo(610 + i*70, 60);
      ui.lineTo(605 + i*70, 60);
      ui.lineTo(590 + i*70, 70);
      ui.lineTo(575 + i*70, 60);
      ui.closePath();
      ui.fill();
      ui.save();
      ui.font = "16px Lucida Console, monaco, monospace";
      ui.fillText(stageTemp.scale.toFixed(2),590+i*70,56);
      ui.restore();
    } else if (i === 9) {
      ui.save();
      ui.fillStyle = "#4c4c4c";
      ui.beginPath();
      ui.moveTo(460, 40);
      ui.arc(470, 40, 10, Math.PI, Math.PI * 1.5);
      ui.lineTo(540, 30);
      ui.arc(540, 40, 10, Math.PI * 1.5, twoPi);
      ui.lineTo(550, 70);
      ui.arc(540, 60, 10, 0, Math.PI / 2);
      ui.lineTo(470, 70);
      ui.arc(470, 60, 10, Math.PI / 2, Math.PI);
      ui.closePath();
      ui.fill();
      ui.restore();
      ui.save();
      ui.font = "14px Lucida Console, monaco, monospace";
      ui.fillText((drawMode ? "Background" : "Stage"),505,46);
      ui.font = "10px Lucida Console, monaco, monospace";
      ui.fillText((drawMode ? "(No Collision)" : "(Collision)"),505,63);
      ui.restore();
    } else {
      ui.beginPath();
      ui.moveTo(560 + i * 70, 30);
      ui.arc(570 + i * 70, 30, 10, Math.PI, Math.PI * 1.5);
      ui.lineTo(610 + i * 70, 20);
      ui.arc(610 + i * 70, 30, 10, Math.PI * 1.5, twoPi);
      ui.lineTo(620 + i * 70, 80);
      ui.arc(610 + i * 70, 70, 10, 0, Math.PI / 2);
      ui.lineTo(570 + i * 70, 80);
      ui.arc(570 + i * 70, 70, 10, Math.PI / 2, Math.PI);
      ui.closePath();
      ui.fill();
    }
  }
  ui.lineWidth = 4;
  ui.globalAlpha = 1;
  if (targetTool === 8) {
    let temX = (0 * stageTemp.scale) + stageTemp.offset[0];
    let temY = (0 * -stageTemp.scale) + stageTemp.offset[1];
    curveFromArray(ui, "rgb(250, 89, 89)", 1, temX, temY, animations[characterSelections[targetBuilder]].WAIT[0], player[targetBuilder].charAttributes.charScale * (stageTemp.scale / 4.5), player[targetBuilder].charAttributes.charScale * (stageTemp.scale / 4.5), 0, 0, 0);
  }
  ui.save();
  ui.globalAlpha = 1 * hoverToolbar;
  ui.fillStyle = "rgba(0,0,0,0.8)";
  ui.strokeStyle = "rgba(0,0,0,0.8)";
  ui.font = "600 14px Lucida Console, monaco, monospace";
  //ui.fillText(120 - stageTemp.box.length, 745, 707); 
  ui.beginPath();
  ui.moveTo(590,40);
  ui.lineTo(602,60);
  ui.lineTo(578,60);
  ui.closePath();
  ui.stroke();
  //ui.fillText(120 - stageTemp.platform.length, 815, 707);
  ui.beginPath();
  ui.moveTo(648, 50);
  ui.lineTo(672, 50);
  ui.stroke();
  ui.beginPath();
  switch (wallType) {
    case "ground":
      ui.moveTo(718, 57);
      ui.lineTo(742, 49);
      break;
    case "ceiling":
      ui.moveTo(718, 49);
      ui.lineTo(742, 57);
      break;
    case "wallL":
      ui.moveTo(734, 41);
      ui.lineTo(726, 65);
      break;
    case "wallR":
      ui.moveTo(726, 41);
      ui.lineTo(734, 65);
      break;
    default:
      break;
  }
  ui.stroke();
  ui.closePath();
  ui.save();
  ui.scale(0.8,1);
  ui.fillText(wallType, 730/0.8, 35);
  ui.restore();
  ui.beginPath();
  ui.moveTo(790, 60);
  ui.lineTo(790, 40);
  ui.lineTo(810, 40);
  ui.stroke();
  ui.closePath();
  ui.save();
  ui.beginPath();
  switch (damageType) {
    case "fire":
      ui.fillStyle = "rgba(255, 136, 49, 0.8)";
      break;
    case "electric":
      ui.fillStyle = "rgba(0, 236, 255, 0.8)";
      break;
    case "slash":
      ui.fillStyle = "rgba(210, 210, 210, 0.8)";
      break;
    case "darkness":
      ui.fillStyle = "rgba(82, 23, 186, 0.8)";
      break;
  }
  ui.arc(870, 53, 15, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.scale(0.8,1);
  ui.fillText(damageType, 870/0.8, 35);
  ui.restore();
  ui.globalAlpha = (drawMode ? 0.5 : 1) * hoverToolbar;
  ui.fillText(20 - stageTemp.target.length, 955, 77);
  ui.fillStyle = "rgba(255,0,0,0.8)";
  ui.beginPath();
  ui.arc(940, 50, 15, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "rgba(255,255,255,0.8)";
  ui.beginPath();
  ui.arc(940, 50, 10, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "rgba(255,0,0,0.8)";
  ui.beginPath();
  ui.arc(940, 50, 5, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.globalAlpha = 1 * hoverToolbar;
  ui.drawImage(handOpen, 997, 33, 29, 38);
  ui.font = "900 30px Arial";
  ui.fillStyle = "rgba(252, 45, 45, 0.8)";
  ui.fillText("X", 1080, 62);
  ui.restore();
  ui.font = "13px Lucida Console, monaco, monospace";
  if (tooSmallTimer > 0) {
    tooSmallTimer--;
    ui.fillStyle = "rgba(0,0,0," + Math.min(tooSmallTimer / 30, 1) + ")";
    ui.fillRect(tooSmallPos.x + 30, tooSmallPos.y, 80, 25);
    ui.fillStyle = "rgba(255,255,255," + Math.min(tooSmallTimer / 30, 1) + ")";
    ui.fillText("Too small", tooSmallPos.x + 70, tooSmallPos.y + 17);
  }
  if (badAngleTimer > 0) {
    badAngleTimer--;
    ui.fillStyle = "rgba(0,0,0," + Math.min(badAngleTimer / 30, 1) + ")";
    ui.fillRect(badAnglePos.x + 30, badAnglePos.y, 80, 25);
    ui.fillStyle = "rgba(255,255,255," + Math.min(badAngleTimer / 30, 1) + ")";
    ui.fillText("Bad angle", badAnglePos.x + 70, badAnglePos.y + 17);
  }
  if (wallsTooCloseTimer > 0) {
    wallsTooCloseTimer--;
    ui.fillStyle = "rgba(0,0,0," + Math.min(wallsTooCloseTimer / 30, 1) + ")";
    ui.fillRect(wallsTooClosePos.x + 25, wallsTooClosePos.y, 110, 25);
    ui.fillStyle = "rgba(255,255,255," + Math.min(wallsTooCloseTimer / 30, 1) + ")";
    ui.fillText("Walls too close", wallsTooClosePos.x + 70, wallsTooClosePos.y + 17);
  }
  if (targetTool == 6) {
    if (grabbedItem == 0) {
      ui.drawImage(handOpen, crossHairPos.x * stageTemp.scale + 600 - 18, crossHairPos.y * -stageTemp.scale + 375 - 24, 36, 48);
    } else {
      ui.drawImage(handGrab, crossHairPos.x * stageTemp.scale + 600 - 18, crossHairPos.y * -stageTemp.scale + 375 - 24, 36, 48);
    }
  } else if (targetTool == 7) {
    ui.font = "900 40px Arial";
    ui.fillStyle = "rgb(255, 83, 83)";
    ui.strokeStyle = "black";
    ui.fillText("X", crossHairPos.x * stageTemp.scale + 600, crossHairPos.y * -stageTemp.scale + 375 + 10);
    ui.strokeText("X", crossHairPos.x * stageTemp.scale + 600, crossHairPos.y * -stageTemp.scale + 375 + 10);
  } else {
    ui.fillStyle = "#ffffff";
    ui.fillRect(crossHairPos.x * stageTemp.scale + 600 - 2, crossHairPos.y * -stageTemp.scale + 375 - 10, 4, 20);
    ui.fillRect(crossHairPos.x * stageTemp.scale + 600 - 10, crossHairPos.y * -stageTemp.scale + 375 - 2, 20, 4);
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

export function findStartingPoint (realCrossHair){
  let found = false;
  for (let i=0;i<stageTemp.startingPoint.length;i++){
    if (Math.abs(crossHairPos.x - stageTemp.startingPoint[i].x) <= 5 && Math.abs(crossHairPos.y - stageTemp.startingPoint[i].y) <= 5){
      hoverItem = ["startingPoint",i];
      found = true;
      break;
    }
  }
  return found;
}

export function findTarget (realCrossHair){
  let found = false;
  for (let i=0;i<stageTemp.target.length;i++){
    if (Math.abs(crossHairPos.x - stageTemp.target[i].x) <= 5 && Math.abs(crossHairPos.y - stageTemp.target[i].y) <= 5){
      hoverItem = ["target",i];
      found = true;
      break;
    }
  }
  return found;
}

export function findLine (realCrossHair, background = false, types = ["platform","ground","ceiling","wallL","wallR"], ignorePolygon = false){
  let found = false;
  let line = 0;
  let closestDist = 11;
  let closest = [];
  let tempDist = 0;
  for (let i=0;i<types.length;i++) {
    if (background) {
      line = stageTemp.background[types[i]];
    } else {
      line = stageTemp[types[i]];
    }
    for (let j=0;j<line.length;j++) {
      tempDist = distanceToLine(crossHairPos, line[j]);
      if (tempDist <= closestDist){
        if (i === 0) {
          closestDist = tempDist;
          hoverItem = [background ? "line" : types[i],j];
          found = true;
        } else {
          let partOfPolygon = false;
          if (!ignorePolygon) {
            for (let p=0;p<stageTemp.polygonMap.length;p++) {
              if (stageTemp.polygonMap[p] !== null) {
                for (let k=0;k<stageTemp.polygonMap[p].length;k++) {
                  if (stageTemp.polygonMap[p][k][0] === types[i] && stageTemp.polygonMap[p][k][1] === j) {
                    partOfPolygon = true;
                    break;
                  }
                }
              }
              if (partOfPolygon) {
                break;
              }
            }
          }
          if (!partOfPolygon) {
            closestDist = tempDist;
            hoverItem = [types[i], j];
            found = true;
          }
        }
      }
    }
  }
  return found;
}

export function findPolygon (realCrossHair, background = false){
  let found = false;
  let poly = stageTemp.polygon;
  if (background) {
    poly = stageTemp.background.polygon;
  }
  for (let i=0;i<poly.length;i++){
    const d = distanceToPolygon(new Vec2D(realCrossHair.x, realCrossHair.y), poly[i]);
    if (d < 5) {
      hoverItem = [background ? "polygonBG" : "polygon",i];
      found = true;
      break;
    }
  }
  return found;
}

export function centerItem (item,realCrossHair){
  let offset = new Vec2D(crossHairPos.x - prevCrossHairPos.x, crossHairPos.y - prevCrossHairPos.y);
  let offsetR = new Vec2D(realCrossHair.x - prevRealCrossHair.x, realCrossHair.y - prevRealCrossHair.y);
  switch (item[0]){
    case "startingPoint":
      stageTemp.startingPoint[item[1]] = new Vec2D(crossHairPos.x, crossHairPos.y);
      break;
    case "target":
      stageTemp.target[item[1]] = new Vec2D(crossHairPos.x, crossHairPos.y);
      break;
    case "platform":
    case "ground":
    case "ceiling":
    case "wallL":
    case "wallR":
      stageTemp[item[0]][item[1]][0].x += offset.x;
      stageTemp[item[0]][item[1]][1].x += offset.x;
      stageTemp[item[0]][item[1]][0].y += offset.y;
      stageTemp[item[0]][item[1]][1].y += offset.y;
      break;
    case "polygon":
      for (let i=0;i<stageTemp.polygon[item[1]].length;i++){
        stageTemp.polygon[item[1]][i].x += offset.x;
        stageTemp.polygon[item[1]][i].y += offset.y;
        if (stageTemp.polygonMap[item[1]] !== null) {
          stageTemp[stageTemp.polygonMap[item[1]][i][0]][stageTemp.polygonMap[item[1]][i][1]][0].x += offset.x;
          stageTemp[stageTemp.polygonMap[item[1]][i][0]][stageTemp.polygonMap[item[1]][i][1]][1].x += offset.x;
          stageTemp[stageTemp.polygonMap[item[1]][i][0]][stageTemp.polygonMap[item[1]][i][1]][0].y += offset.y;
          stageTemp[stageTemp.polygonMap[item[1]][i][0]][stageTemp.polygonMap[item[1]][i][1]][1].y += offset.y;
        }
      }
      break;
    case "line":
      stageTemp.background[item[0]][item[1]][0].x += offset.x;
      stageTemp.background[item[0]][item[1]][1].x += offset.x;
      stageTemp.background[item[0]][item[1]][0].y += offset.y;
      stageTemp.background[item[0]][item[1]][1].y += offset.y;
      break;      
    case "polygonBG":
      for (let i=0;i<stageTemp.background.polygon[item[1]].length;i++){
        stageTemp.background.polygon[item[1]][i].x += offset.x;
        stageTemp.background.polygon[item[1]][i].y += offset.y;
      }
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