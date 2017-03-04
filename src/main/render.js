
import {
  player,
  characterSelections,
  mainScene,
  versusMode,
  matchTimer,
  playerType,
  palettes,
  pPal,
  hasTag,
  tagText, 
	gameMode,
  startTimer,
  holiday
} from "main/main";
import {gameSettings} from "settings";
import {makeColour} from "main/vfx/makeColour";
import {actionStates} from "physics/actionStateShortcuts";
import {blendColours} from "main/vfx/blendColours";
import {activeStage} from "stages/activeStage";
import {Vec2D} from "./util/Vec2D";
import {framesData} from "./characters";
import * as THREE from "three";
import {drawBezierCurves, makeRectShape, makeDiskShape, makePolygonShape, drawShape, drawLine} from "../render/threeUtil";
import {createOrUpdateBufferGeometry} from "../render/createOrUpdateBufferGeometry";
import {drawECB} from "../render/drawECB";
import {stageTransform} from "../render/stageTransform";
import {getObjectByNameNonRecursive} from "./util/renderUtils";
import {polygonGeometry, lineMaterial} from "../render/lineGeometry";

export const hurtboxColours = ["#ffed46", "#2a39ff", "#36ff25"];
export const twoPi = Math.PI * 2;

export let lostStockQueue = [];
export function rotateVector(vecx, vecy, ang) {
  return new Vec2D( vecx * Math.cos(ang) - vecy * Math.sin(ang)
                  , vecx * Math.sin(ang) + vecy * Math.cos(ang));
}

/* global animations */
window.animations;

export function loadCharacterAnimationFrames ( scene, characters ) {
  const animationsGroup = new THREE.Group();
  animationsGroup.name = "animationFrames";
  // make animations frames visible on screen at first to force them to render & upload to GPU
  //animationsGroup.visible = false; 
  animationsGroup.matrixAutoUpdate = false;
  for (let i =0; i < characters.length; i++) {
    const character = characters[i];
    const characterGroup = new THREE.Group();
    characterGroup.name = "character"+characters[i];
    animationsGroup.add(characterGroup);
    const actionStates = Object.keys(animations[character]);
    for (let j = 0; j < actionStates.length; j++) {
      const actionState = actionStates[j];
      const actionStateGroup = new THREE.Group();
      actionStateGroup.name = actionState;
      characterGroup.add(actionStateGroup);
      for (let f = 0; f < animations[character][actionState].length; f++) {
        drawBezierCurves(actionStateGroup, animations[character][actionState][f]);
      }
    }
  }
  scene.add(animationsGroup);
  animationsGroup.updateMatrixWorld = function() {};
}

export function renderFrameTransformed(scene, animFrame, col, transform ) {
  const cloned = animFrame.clone();
  const rpX = transform.rpX;
  const rpY = transform.rpY;
  cloned.material.color.set (new THREE.Color(col));
  cloned.material.transparent = false;
  const sX = transform.sX;
  const sY = transform.sY;
  cloned.scale.set( sX, sY , 1);
  cloned.translateX(transform.tX-rpX);
  cloned.translateY(transform.tY-rpY);
  cloned.rotateZ( transform.rotation );
  cloned.translateX(rpX);
  cloned.translateY(rpY);
  cloned.matrixAutoUpdate = false;
  cloned.updateMatrix();
  cloned.updateMatrixWorld();
  cloned.name = "animFrame";
  scene.add(cloned);
}

export function getFace(i, frame) {
  if (   actionStates[characterSelections[i]][player[i].actionState].reverseModel
      || (player[i].actionState === "TILTTURN" && frame > 5)
      || (player[i].actionState === "RUNTURN" && frame > player[i].charAttributes.runTurnBreakPoint)
      // JIGGS MULTIJUMP TURN
      || (player[i].actionState.substring(0, player[i].actionState.length - 1) === "AERIALTURN" && player[i].timer >5)
      // MARTH BAIR
      || (player[i].actionState === "ATTACKAIRB" && characterSelections[i] === 0 && frame > 29)
      // FOX/FALCO BTHROW
      || (player[i].actionState === "THROWBACK" && (characterSelections[i] === 2 || characterSelections[i] === 3) && frame >= 10) ) {
    return -player[i].phys.face;
  }
  else {
    return player[i].phys.face;
  }
}

export function getPlayerColour(i) {
  let col = "rgb(0,0,0)";
  if (!actionStates[characterSelections[i]][player[i].actionState].dead) {
    if (player[i].phys.shielding && player[i].phys.powerShielded && player[i].hit.hitlag > 0) {
      col = "rgb(255,255,255)";
    } 
    else if (   gameSettings.flashOnLCancel && player[i].actionState.substr(0, 10) === "LANDINGATT" 
             && player[i].phys.landingLagScaling === 2 && Math.round(player[i].timer) % 3 === 0 ) {
      col = "rgb(255,255,255)";
    } 
    else if (player[i].phys.intangibleTimer % 9 > 3 || player[i].phys.invincibleTimer % 9 > 3 || player[i].hit.hitlag > 0) {
      col = palettes[pPal[i]][1];
    } 
    else if (player[i].phys.charging && player[i].phys.chargeFrames % 9 > 3) {
      col = "rgb(252, 255, 91)";
    } 
    else if (player[i].actionState === "FURAFURA" && player[i].timer % 30 < 6) {
      col = palettes[pPal[i]][3];
    } 
    else if (player[i].colourOverlayBool) {
      col = player[i].colourOverlay;
    } 
    else if (player[i].shocked > 0) {
      let originalColour = palettes[pPal[i]][0];
      originalColour = originalColour.substr(4, originalColour.length - 5);
      const colourArray = originalColour.split(",");
      let newCol;
      if (player[i].shocked % 2) {
        newCol = blendColours(colourArray, [14, 0, 131], 0.7);
      } else {
        newCol = blendColours(colourArray, [255, 255, 255], 0.7);
      }
      col = "rgb(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + ")";
    } 
    else if (player[i].burning > 0) {
      let originalColour = palettes[pPal[i]][0];
      originalColour = originalColour.substr(4, originalColour.length - 5);
      const colourArray = originalColour.split(",");
      const part = player[i].burning % 3;
      let newCol;
      if (part) {
        if (part === 1) {
          newCol = blendColours(colourArray, [253, 255, 161], 0.7);
        } 
        else {
          newCol = blendColours(colourArray, [198, 57, 5], 0.7);
        }
        col = "rgb(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + ")";
      } 
      else {
        col = palettes[pPal[i]][0];
      }
    }
    else {
      col = palettes[pPal[i]][0];
    }
  }
  return col;
}

export function renderPlayer(scene, i) {
  if (!actionStates[characterSelections[i]][player[i].actionState].dead) {
    let frame = Math.floor(player[i].timer);
    if (frame === 0) {
      frame = 1;
    }
    if (frame > framesData[characterSelections[i]][player[i].actionState]) {
      frame = framesData[characterSelections[i]][player[i].actionState];
    }
    let temX = (player[i].phys.pos.x * activeStage.scale) + activeStage.offset[0];
    const temY = (player[i].phys.pos.y * -activeStage.scale) + activeStage.offset[1];
    const face = getFace(i, frame);

    const animFrame = getObjectByNameNonRecursive(getObjectByNameNonRecursive(getObjectByNameNonRecursive(mainScene,"animationFrames"),"character" + characterSelections[i]),player[i].actionState).children[frame-1];
    const col = getPlayerColour(i);

    if (player[i].phys.chargeFrames % 4 === 3) {
      temX += 2;
    } 
    else if (player[i].phys.chargeFrames % 4 === 1) {
      temX -= 2;
    }
    if (temX > 1220 || temX < -20 || temY > 880 || temY < -30) {
      const pA = new Vec2D(temX - 600, temY - 375);
      const pB = new Vec2D(0, 0);
      const s = (pA.y - pB.y) / (pA.x - pB.x);
      if (-375 <= s * 600 && s * 600 <= 375) {
        if (pA.x > pB.x) {
          player[i].miniViewPoint = new Vec2D(1150, s * 600 + 375);
          player[i].miniViewSide = 0;
        } 
        else {
          player[i].miniViewPoint = new Vec2D(50, -s * 600 + 375);
          player[i].miniViewSide = 1;
        }
        player[i].miniView = true;
        player[i].phys.outOfCameraTimer++;
      } 
      else if (-600 <= 375 / s && 375 / s <= 600) {
        if (pA.y > pB.y) {
          if (temX < 50) {
            player[i].miniViewPoint = new Vec2D(50, 700);
          } 
          else if (temX > 1150) {
            player[i].miniViewPoint = new Vec2D(1150, 700);
          } 
          else {
            //player[i].miniViewPoint = new Vec2D(375/s+stage.offset[0],700);
            player[i].miniViewPoint = new Vec2D(temX, 700);
          }
          player[i].miniViewSide = 2;
        } 
        else {
          player[i].miniViewPoint = new Vec2D(-375 / s + activeStage.offset[0], 50);
          player[i].miniViewSide = 2;
        }
        player[i].miniView = true;
        player[i].phys.outOfCameraTimer++;
      } 
      else {
        player[i].miniView = false;
        player[i].phys.outOfCameraTimer = 0;
      }
    } 
    else {
      player[i].miniView = false;
      player[i].phys.outOfCameraTimer = 0;
    }

    if (player[i].miniView && player[i].actionState !== "SLEEP" && player[i].actionState !== "REBIRTH" && player[i].actionState !== "REBIRTHWAIT") {
      const miniViewBubble = makeDiskShape(0, 0, 35 );
      const bubblePosition = new THREE.Vector3(  player[i].miniViewPoint.x
                                              ,  player[i].miniViewPoint.y
                                              , -0.1);
      createOrUpdateBufferGeometry(scene, "miniViewBubble"+i, { shape : miniViewBubble, position : bubblePosition, linewidth : 5, fill : 0x000000, stroke : palettes[pPal[i]][0] });
      renderFrameTransformed(scene, animFrame, col, { tX : player[i].miniViewPoint.x
                                                    , tY : player[i].miniViewPoint.y + 30  
                                                    , sX : player[i].charAttributes.miniScale * face 
                                                    , sY : player[i].charAttributes.miniScale
                                                    , rotation : player[i].rotation
                                                    , rpX : player[i].rotationPoint.x
                                                    , rpY : player[i].rotationPoint.y } );
    } 
    else if (player[i].actionState === "ENTRANCE") {
      renderFrameTransformed(scene, animFrame, col, { tX : temX
                                                    , tY : temY
                                                    , sX : player[i].charAttributes.charScale * face * (activeStage.scale / 4.5) 
                                                    , sY : Math.max(0.01, Math.min(player[i].charAttributes.charScale, player[i].charAttributes.charScale * (1.5 - startTimer)) * (activeStage.scale / 4.5))
                                                    , rotation : player[i].rotation
                                                    , rpX : player[i].rotationPoint.x
                                                    , rpY : player[i].rotationPoint.y } );
    } 
    else {
      renderFrameTransformed(scene, animFrame, col, { tX : temX
                                                    , tY : temY
                                                    , sX : player[i].charAttributes.charScale * face * (activeStage.scale / 4.5) 
                                                    , sY : player[i].charAttributes.charScale * (activeStage.scale / 4.5)
                                                    , rotation : player[i].rotation
                                                    , rpX : player[i].rotationPoint.x
                                                    , rpY : player[i].rotationPoint.y } );
    }
    if (player[i].phys.shielding) {
      if (!(player[i].phys.powerShielded && player[i].hit.hitlag > 0)) {
        let sCol = palettes[pPal[i]][2];
        if (Math.floor(player[i].hit.shieldstun) > 0) {
          sCol = palettes[pPal[i]][4];
        }
        sCol = "rgb" + sCol.slice(4, -2) + ")";
        const shieldBubble = makeDiskShape(0, 0, activeStage.scale);
        const shieldPos = new THREE.Vector3(player[i].phys.shieldPositionReal.x * activeStage.scale + activeStage.offset[0], - player[i].phys.shieldPositionReal.y * activeStage.scale + activeStage.offset[1], 0.05);
        createOrUpdateBufferGeometry(scene, "shieldBubble"+i, { scale : new THREE.Vector3(player[i].phys.shieldSize,player[i].phys.shieldSize,1)
                                                              , position: shieldPos, shape : shieldBubble, fill : sCol, opacity : 0.6 * player[i].phys.shieldAnalog});
      }
    }
    if (hasTag[i]) {
      /*
      fg2.fillStyle = makeColour(0, 0, 0, 0.5);
      fg2.strokeStyle = palettes[pPal[i]][0];
      const size = 10 * tagText[i].length;
      fg2.fillRect(temX - size / 2, temY - 130 * (activeStage.scale / 4.5), size, 20);
      fg2.strokeRect(temX - size / 2, temY - 130 * (activeStage.scale / 4.5), size, 20);
      fg2.font = "13px Lucida Console, monaco, monospace";
      fg2.textAlign = "center";
      fg2.fillStyle = "white";
      fg2.fillText(tagText[i], temX, temY + 15 - 130 * (activeStage.scale / 4.5));
      fg2.fillStyle = palettes[pPal[i]][0];
      fg2.beginPath();
      fg2.moveTo(temX - 8, temY + 20 - 130 * (activeStage.scale / 4.5));
      fg2.lineTo(temX + 8, temY + 20 - 130 * (activeStage.scale / 4.5));
      fg2.lineTo(temX, temY + 28 - 130 * (activeStage.scale / 4.5));
      fg2.closePath();
      fg2.fill();
      fg2.textAlign = "start";
      */
    }
    if (player[i].actionState === "REBIRTH" || player[i].actionState === "REBIRTHWAIT") {
      const rebirthPlatform = makePolygonShape( [ new Vec2D(  18   * (activeStage.scale / 4.5), 13.5 * (activeStage.scale / 4.5) )
                                                , new Vec2D(  31.5 * (activeStage.scale / 4.5), 0                                )
                                                , new Vec2D(- 31.5 * (activeStage.scale / 4.5), 0                                )
                                                , new Vec2D(- 18   * (activeStage.scale / 4.5), 13.5 * (activeStage.scale / 4.5) ) ]
                                              , true );
      const platPosition = new THREE.Vector3( temX, temY, 0.01);
      createOrUpdateBufferGeometry(scene, "rebirthPlatform"+i, { position: platPosition, shape : rebirthPlatform, fill : palettes[pPal[i]][1], stroke : palettes[pPal[i]][0], linewidth : 2 });
    }
    if (player[i].showLedgeGrabBox) {
      const ledgeGrabBox = makeRectShape( 0, 14 * activeStage.scale, 0, - 10 * activeStage.scale );
      const grabBoxFPos = new THREE.Vector3(  player[i].phys.ledgeSnapBoxF.min.x * activeStage.scale + activeStage.offset[0]
                                           , -player[i].phys.ledgeSnapBoxF.min.y * activeStage.scale + activeStage.offset[1]);
      const grabBoxBPos = new THREE.Vector3(  player[i].phys.ledgeSnapBoxB.min.x * activeStage.scale + activeStage.offset[0]
                                           , -player[i].phys.ledgeSnapBoxB.min.y * activeStage.scale + activeStage.offset[1]);
      createOrUpdateBufferGeometry(scene, "ledgeGrabBoxF"+i, { position : grabBoxFPos, shape : ledgeGrabBox, stroke : "#4478ff", linewidth : 3 });
      createOrUpdateBufferGeometry(scene, "ledgeGrabBoxB"+i, { position : grabBoxBPos, shape : ledgeGrabBox, stroke : "#ff4444", linewidth : 3 });
    }
    if (player[i].showECB) {
      drawECB(scene, player[i].phys.ECB1, { fill : "#ff8d2f" }, "ECB1"+i, 0 );
      drawECB(scene, player[i].phys.ECBp, { stroke : "white" }, "ECBp"+i, 0.1 );
      /*
      drawLine(scene, new THREE.LineBasicMaterial({ color : "white", linewidth : 3 }), temX, temY-6, temX, temY+6 );
      drawLine(scene, new THREE.LineBasicMaterial({ color : "white", linewidth : 3 }), temX+6, temY, temX-6, temY );
      */
    }
    if (player[i].showHitbox) {
      /* TODO: redo
      const hitboxGroup = new THREE.Group();
      const hurtboxMat = new THREE.MeshBasicMaterial({ color : hurtboxColours[player[i].phys.hurtBoxState], opacity : 0.6 });
      hurtboxMat.side = THREE.DoubleSide;
      hurtboxMat.transparent = true;
      const hurtboxShape = makeRectShape( player[i].phys.hurtbox.min.x
                                        , player[i].phys.hurtbox.min.x + player[i].charAttributes.hurtboxOffset[0] * 2
                                        , player[i].phys.hurtbox.min.y
                                        , player[i].phys.hurtbox.min.y - player[i].charAttributes.hurtboxOffset[1]  );
      drawShape(hitboxGroup, hurtboxShape, hurtboxMat, null, null, 1);
      hitboxGroup.scale.set(activeStage.scale,-activeStage.scale,1);
      hitboxGroup.translateX(activeStage.offset[0]);
      hitboxGroup.translateY(activeStage.offset[1]);
      */

      /*
      fg2.fillStyle = hurtboxColours[player[i].phys.hurtBoxState];
      fg2.fillRect(player[i].phys.hurtbox.min.x * activeStage.scale + activeStage.offset[0], player[i].phys.hurtbox.min.y * -activeStage.scale +
          activeStage.offset[1], player[i].charAttributes.hurtboxOffset[0] * 2 * activeStage.scale, player[i].charAttributes.hurtboxOffset[
              1] * activeStage.scale);
      fg2.fillStyle = makeColour(255, 29, 29, 0.69);
      for (let j = 0; j < 4; j++) {
        switch (j) {
          case 0:
            fg2.fillStyle = makeColour(255, 29, 29, 0.69);
            fg2.strokeStyle = makeColour(255, 126, 126, 0.69);
            break;
          case 1:
            fg2.fillStyle = makeColour(47, 255, 29, 0.69);
            fg2.strokeStyle = makeColour(126, 252, 115, 0.69);
            break;
          case 2:
            fg2.fillStyle = makeColour(29, 208, 255, 0.69);
            fg2.strokeStyle = makeColour(117, 226, 255, 0.69);
            break;
          case 3:
            fg2.fillStyle = makeColour(203, 29, 255, 0.69);
            fg2.strokeStyle = makeColour(216, 116, 246, 0.69);
            break;
          default:
            break;
        }
        if (player[i].hitboxes.active[j]) {
          let offset = player[i].hitboxes.id[j].offset[player[i].hitboxes.frame];
          if (player[i].actionState === "DAMAGEFLYN") {
            offset = player[i].hitboxes.id[j].offset[0];
          }
          fg2.beginPath();
          fg2.arc(((offset.x * player[i].phys.face + player[i].phys.pos.x) * activeStage.scale) + activeStage.offset[0], ((offset.y +
              player[i].phys.pos.y) * -activeStage.scale) + activeStage.offset[1], player[i].hitboxes.id[j].size * activeStage.scale,
              Math.PI * 2, 0);
          fg2.fill();
          if (player[i].phys.prevFrameHitboxes.active[j]) {
            offset = player[i].phys.prevFrameHitboxes.id[j].offset[player[i].phys.prevFrameHitboxes.frame];
            if (player[i].actionState === "DAMAGEFLYN") {
              offset = player[i].phys.prevFrameHitboxes.id[j].offset[0];
            }
            fg2.beginPath();
            fg2.arc(((offset.x * player[i].phys.facePrev + player[i].phys.posPrev.x) * activeStage.scale) + activeStage.offset[0],
                ((offset.y + player[i].phys.posPrev.y) * -activeStage.scale) + activeStage.offset[1], player[i].phys.prevFrameHitboxes
                    .id[j].size * activeStage.scale, Math.PI * 2, 0);
            fg2.fill();

            //console.log(player[i].phys.interPolatedHitbox[j]);
            fg2.beginPath();
            fg2.moveTo((player[i].phys.interPolatedHitbox[j][0].x * activeStage.scale) + activeStage.offset[0], (player[i].phys.interPolatedHitbox[
                    j][0].y * -activeStage.scale) + activeStage.offset[1]);
            fg2.lineTo((player[i].phys.interPolatedHitbox[j][1].x * activeStage.scale) + activeStage.offset[0], (player[i].phys.interPolatedHitbox[
                    j][1].y * -activeStage.scale) + activeStage.offset[1]);
            fg2.lineTo((player[i].phys.interPolatedHitbox[j][2].x * activeStage.scale) + activeStage.offset[0], (player[i].phys.interPolatedHitbox[
                    j][2].y * -activeStage.scale) + activeStage.offset[1]);
            fg2.lineTo((player[i].phys.interPolatedHitbox[j][3].x * activeStage.scale) + activeStage.offset[0], (player[i].phys.interPolatedHitbox[
                    j][3].y * -activeStage.scale) + activeStage.offset[1]);
            fg2.closePath();
            fg2.fill();
            fg2.stroke();
          }
        }
      }
      */
    }
  }
} 


export function renderOverlay(showStock) {
  // stocks, percent, timer

  if (!versusMode || gameMode === 5) {
    ui.fillStyle = "white";
    ui.lineWidth = 2;
    ui.font = "900 40px Arial";
    ui.textAlign = "center";
    const min = (Math.floor(matchTimer / 60)).toString();
    const sec = (matchTimer % 60).toFixed(2);
    ui.fillText(((min.length < 2) ? "0" + min : min) + ":" + ((sec.length < 5) ? "0" + sec[0] : sec[0] + sec[1]), 590,
          70);
    ui.strokeText(((min.length < 2) ? "0" + min : min) + ":" + ((sec.length < 5) ? "0" + sec[0] : sec[0] + sec[1]),
          590, 70);
    ui.font = "900 25px Arial";
    ui.fillText(((sec.length < 5) ? sec[2] + sec[3] : sec[3] + sec[4]), 670, 70);
    ui.strokeText(((sec.length < 5) ? sec[2] + sec[3] : sec[3] + sec[4]), 670, 70);
  }
  if (showStock) {
    ui.font = "900 53px Arial";
    ui.lineWidth = (holiday === 1) ? 3 : 2;
    ui.textAlign = "end";
    ui.save();
    ui.scale(0.8, 1);
    for (let i = 0; i < 4; i++) {
      if (playerType[i] > -1) {
        ui.fillStyle = "rgb(255," + Math.max(255 - player[i].percent, 0) + ", " + Math.max(255 - player[i].percent, 0) +
              ")";
        ui.fillText(Math.floor(player[i].percent) + "%", (450 + i * 145 + player[i].percentShake.x) * 1.25, 670 +
              player[i].percentShake.y);
        ui.strokeText(Math.floor(player[i].percent) + "%", (450 + i * 145 + player[i].percentShake.x) * 1.25, 670 +
              player[i].percentShake.y);
      }
    }
    ui.restore();
    for (let i = 0; i < 4; i++) {
      if (playerType[i] > -1) {
        ui.fillStyle = palettes[pPal[i]][0];
        for (let j = 0; j < player[i].stocks; j++) {
          ui.beginPath();
          ui.arc(337 + i * 145 + j * 30, 600, 12, 0, twoPi);
          ui.closePath();
          ui.fill();
          ui.stroke();
        }
      }
    }
    const lostStockPopQueue = [];
    ui.fillStyle = "white";
    ui.strokeStyle = "white";
    for (let i = 0; i < lostStockQueue.length; i++) {
      lostStockQueue[i][2]++;
      if (lostStockQueue[i][2] > 20) {
        lostStockPopQueue.push(i);
      } 
      else {
        ui.save();
        ui.translate(337 + lostStockQueue[i][0] * 145 + lostStockQueue[i][1] * 30 - 2, 600 - 2);
        ui.fillRect(lostStockQueue[i][2], 0, 4, 4);
        ui.fillRect(lostStockQueue[i][2], lostStockQueue[i][2], 4, 4);
        ui.fillRect(-lostStockQueue[i][2], lostStockQueue[i][2], 4, 4);
        ui.fillRect(lostStockQueue[i][2], -lostStockQueue[i][2], 4, 4);
        ui.fillRect(-lostStockQueue[i][2], -lostStockQueue[i][2], 4, 4);
        ui.fillRect(-lostStockQueue[i][2], 0, 4, 4);
        ui.fillRect(0, lostStockQueue[i][2], 4, 4);
        ui.fillRect(0, -lostStockQueue[i][2], 4, 4);
        ui.beginPath();
        ui.arc(2, 2, lostStockQueue[i][2] / 2, 0, twoPi);
        ui.closePath();
        ui.stroke();
        ui.restore();
      }
    }
    for (let k = 0; k < lostStockPopQueue.length; k++) {
      lostStockQueue.splice(lostStockPopQueue[k] - k, 1);
    }
    ui.textAlign = "start";
  }
}

/*export function setLostStockQueue(index,val){
  lostStockQueue[index]=val;
}

export function renderForeground() {
  // pause UI
  ui.textAlign = "start";
  ui.fillStyle = "#8e8e8e";
  ui.save();
  ui.fillRect(45, 48, 300, 24);
  ui.fillStyle = "#3724a6";
  ui.fillRect(60, 50, 50, 20);
  ui.beginPath();
  ui.arc(60, 60, 10, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.beginPath();
  ui.arc(110, 60, 10, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.restore();
  ui.save();
  ui.translate(950, 650);
  ui.fillRect(0, 0, 8, 45);
  ui.fillRect(0, 25, 200, 20);
  ui.fillRect(192, 0, 8, 45);
  ui.fillRect(0, 0, 12, 4);
  ui.fillRect(188, 0, 12, 4);
  let xPos = 54;
  for (let j = 0; j < 3; j++) {
    ui.fillRect(xPos - 2, -6, 4, 12);
    ui.fillRect(xPos - 6, -2, 12, 4);
    xPos += 46;
  }
  ui.beginPath();
  ui.arc(169, 2, 12, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "#21792f";
  ui.beginPath();
  ui.arc(123, 2, 15, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "#9a2622";
  ui.beginPath();
  ui.arc(40, 62, 12, 0, twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "#636363";
  ui.beginPath();
  ui.arc(31, 2, 15, 0.8 * Math.PI, twoPi);
  ui.closePath();
  ui.fill();
  ui.beginPath();
  ui.arc(77, 2, 15, twoPi / 2, 0.2 * Math.PI);
  ui.closePath();
  ui.fill();
  //ui.fillRect(20,59,4,12)
  ui.fillRect(14, 55, 4, 12);
  ui.fillRect(10, 59, 12, 4);
  ui.fillRect(60, 52, 140, 20);
  ui.fillStyle = "black";
  ui.font = "800 20px Arial";
  ui.fillText("S", 158, 8);
  ui.fillText("B", 32, 70);
  ui.fillText("Z", -872, -583);
  ui.font = "800 17px Arial";
  ui.fillText("T", 170, 9);
  ui.scale(1.2, 1);
  ui.font = "900 24px Arial";
  ui.fillText("RESET", 72, 43);
  ui.fillText("L", 17, 7);
  ui.fillText("R", 56, 7);
  ui.fillText("A", 93, 9);
  ui.font = "900 20px Arial";
  ui.fillText("RUNBACK", 53, 70);
  ui.font = "900 18px Arial";
  ui.fillText("FRAME ADVANCE", -685, -584);
  ui.restore();
}

export function resetLostStockQueue(){
  lostStockQueue = [];
}
*/