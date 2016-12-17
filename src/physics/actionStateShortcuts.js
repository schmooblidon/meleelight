import {characterSelections, player, gameMode, versusMode, playerType} from "main/main";
import {sounds} from "main/sfx";
import {intangibility, actionSounds} from "main/characters";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../main/util/Vec2D";
import {gameSettings} from "settings";
import {deepCopyObject} from "../main/util/deepCopyObject";
/* eslint-disable */
export function randomShout (char){
  //playSfx("shout"+Math.round(0.5+Math.random()*5.99));
  switch (char) {
    case 0:
      var shout = Math.round(0.5 + Math.random() * 5.99);
      switch (shout) {
        case 1:
          sounds.shout1.play();
          break;
        case 2:
          sounds.shout2.play();
          break;
        case 3:
          sounds.shout3.play();
          break;
        case 4:
          sounds.shout4.play();
          break;
        case 5:
          sounds.shout5.play();
          break;
        case 6:
          sounds.shout6.play();
          break;
        default:
          break;
      }
      break;
    case 1:
      var shout = Math.round(0.5 + Math.random() * 4.99);
      switch (shout) {
        case 1:
          sounds.puffshout1.play();
          break;
        case 2:
          sounds.puffshout2.play();
          break;
        case 3:
          sounds.puffshout3.play();
          break;
        case 4:
          sounds.puffshout4.play();
          break;
        case 5:
          sounds.puffshout5.play();
          break;
        default:
          break;
      }
      break;
    case 2:
      var shout = Math.round(0.5 + Math.random() * 4.99);
      switch (shout) {
        case 1:
          sounds.foxshout1.play();
          break;
        case 2:
          sounds.foxshout2.play();
          break;
        case 3:
          sounds.foxshout3.play();
          break;
        case 4:
          sounds.foxshout4.play();
          break;
        case 5:
          sounds.foxshout5.play();
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
}

export function executeIntangibility (actionStateName,p){
  if (player[p].timer == intangibility[characterSelections[p]][actionStateName][0]) {
    player[p].phys.intangibleTimer = intangibility[characterSelections[p]][actionStateName][1];
    player[p].phys.hurtBoxState = 1;
  }
}

export function playSounds (actionStateName,p){
  for (var i = 0; i < actionSounds[characterSelections[p]][actionStateName].length; i++) {
    if (player[p].timer == actionSounds[characterSelections[p]][actionStateName][i][0]) {
      sounds[actionSounds[characterSelections[p]][actionStateName][i][1]].play();
    }
  }
}

export function isFinalDeath (){
  if (gameMode == 5){
    return true;
  } else if (versusMode) {
    return false;
  } else {
    let finalDeaths = 0;
    let totalPlayers = 0;
    for (let j = 0; j < 4; j++) {
      if (playerType[j] > -1) {
        totalPlayers++;
        if (player[j].stocks == 0) {
          finalDeaths++;
        }
      }
    }
    return (finalDeaths >= Math.max(1,totalPlayers - 1));
  }
}

export function getAngle (x,y){
  var angle = 0;
  if (x != 0 || y != 0) {
    angle = Math.atan2(y, x);
  }
  return angle;
}
//aC = 180/Math.PI;
export function turnOffHitboxes (p){
  player[p].hitboxes.active = [false,false,false,false];
  player[p].hitboxes.hitList = [];
}

export function shieldTilt (p,shieldstun,input){
  if (!shieldstun && !player[p].inCSS){
    var x = input[p][0].lsX;
    var y = input[p][0].lsY;
    var targetOffset = Math.sqrt(x * x + y * y) * 3;
    var targetAngle = getAngle(x, y);
    var targetPosition = new Vec2D(Math.cos(targetAngle) * targetOffset, Math.sin(targetAngle) * targetOffset);
    player[p].phys.shieldPosition = new Vec2D(
      player[p].phys.shieldPosition.x + ((targetPosition.x - player[p].phys.shieldPosition.x) / 5 + 0.01),
      player[p].phys.shieldPosition.y + ((targetPosition.y - player[p].phys.shieldPosition.y) / 5 + 0.01));
  }
  player[p].phys.shieldPositionReal = new Vec2D(player[p].phys.pos.x + player[p].phys.shieldPosition.x + (player[p].charAttributes
    .shieldOffset[0] * player[p].phys.face / 4.5), player[p].phys.pos.y + player[p].phys.shieldPosition.y + (
    player[p].charAttributes.shieldOffset[1] / 4.5));
}

export function reduceByTraction (p,applyDouble){
  if (player[p].phys.cVel.x > 0){
    if (applyDouble && player[p].phys.cVel.x > player[p].charAttributes.maxWalk){
      player[p].phys.cVel.x -= player[p].charAttributes.traction*2;
    }
    else {
      player[p].phys.cVel.x -= player[p].charAttributes.traction;
    }
    if (player[p].phys.cVel.x < 0) {
      player[p].phys.cVel.x = 0;
    }
  } else {
    if (applyDouble && player[p].phys.cVel.x < -player[p].charAttributes.maxWalk) {
      player[p].phys.cVel.x += player[p].charAttributes.traction * 2;
    } else {
      player[p].phys.cVel.x += player[p].charAttributes.traction;
    }
    if (player[p].phys.cVel.x > 0) {
      player[p].phys.cVel.x = 0;
    }
  }
}

export function airDrift (p,input){
  if (Math.abs(input[p][0].lsX) < 0.3){
    var tempMax = 0
  } else {
    var tempMax = player[p].charAttributes.aerialHmaxV * input[p][0].lsX;
  }

  if ((tempMax < 0 && player[p].phys.cVel.x < tempMax) || (tempMax > 0 && player[p].phys.cVel.x > tempMax)) {
    if (player[p].phys.cVel.x > 0) {
      player[p].phys.cVel.x -= player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x < 0) {
        player[p].phys.cVel.x = 0;
      }
    } else {
      player[p].phys.cVel.x += player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x > 0) {
        player[p].phys.cVel.x = 0;
      }
    }
  } else if (Math.abs(input[p][0].lsX) > 0.3 && ((tempMax < 0 && player[p].phys.cVel.x > tempMax) ||
      (tempMax > 0 && player[p].phys.cVel.x < tempMax))) {
    player[p].phys.cVel.x += (player[p].charAttributes.airMobA * input[p][0].lsX) + (Math.sign(
      input[p][0].lsX) * player[p].charAttributes.airMobB);
  }


  if (Math.abs(input[p][0].lsX) < 0.3) {
    if (player[p].phys.cVel.x > 0) {
      player[p].phys.cVel.x -= player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x < 0) {
        player[p].phys.cVel.x = 0;
      }
    } else {
      player[p].phys.cVel.x += player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x > 0) {
        player[p].phys.cVel.x = 0;
      }
    }
  }
}

export function fastfall (p,input){
  if (!player[p].phys.fastfalled){
    player[p].phys.cVel.y -= player[p].charAttributes.gravity;
    if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV) {
      player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
    }
    if (input[p][0].lsY < -0.65 && input[p][3].lsY > -0.1 && player[p].phys.cVel.y <
      0) {
      sounds.fastfall.play();
      player[p].phys.fastfalled = true;
      player[p].phys.cVel.y = -player[p].charAttributes.fastFallV;
    }
  }
}

export function shieldDepletion (p,input){
  //(0.28*input - (1-input/10))
  var input = Math.max(input[p][0].lA, input[p][0].rA);
  player[p].phys.shieldHP -= 0.28 * input - ((1 - input) / 10);
  if (player[p].phys.shieldHP <= 0) {
    player[p].phys.shielding = false;
    player[p].phys.kVel.y = player[p].charAttributes.shieldBreakVel;
    player[p].phys.kDec.y = 0.051;
    player[p].phys.kDec.x = 0;
    player[p].phys.grounded = false;
    player[p].phys.shieldHP = 0;
    drawVfx("breakShield", player[p].phys.pos, player[p].phys.face);
    sounds.shieldbreak.play();
    actionStates[characterSelections[p]].SHIELDBREAKFALL.init(p,input);
  }
}

export function shieldSize (p,lock,input){
   //shield size * 0.575 * model scaling
  //(shield size * 0.575 * hp/60) + (1-input)*0.60714*shieldsize
  player[p].phys.shieldAnalog = Math.max(input[p][0].lA, input[p][0].rA);
  if (player[p].phys.shieldAnalog === 0){
    player[p].phys.shieldAnalog = 1;
  }
  if (lock && player[p].phys.shieldAnalog == 0) {
    player[p].phys.shieldAnalog = 1;
  }
  player[p].phys.shieldSize = (player[p].charAttributes.shieldScale * 0.575 * player[p].charAttributes.modelScale * (
      player[p].phys.shieldHP / 60)) + ((1 - player[p].phys.shieldAnalog) * 0.6 * player[p].charAttributes.shieldScale) +
    ((60 - player[p].phys.shieldHP) / 60 * 2);
}

export function mashOut (p,input){
  if (input[p][0].a && !input[p][1].a){
    return true;
  } else if (input[p][0].b && !input[p][1].b) {
    return true;
  } else if (input[p][0].x && !input[p][1].x) {
    return true;
  } else if (input[p][0].y && !input[p][1].y) {
    return true;
  } else if (input[p][0].lsX > 0.8 && !input[p][1].lsX < 0.7) {
    return true;
  } else if (input[p][0].lsX < -0.8 && !input[p][1].lsX < -0.7) {
    return true;
  } else if (input[p][0].lsY > 0.8 && !input[p][1].lsY < 0.7) {
    return true;
  } else if (input[p][0].lsY < -0.8 && !input[p][1].lsY > -0.7) {
    return true;
  } else if (input[p][0].csX > 0.8 && !input[p][1].csX < 0.7) {
    return true;
  } else if (input[p][0].csX < -0.8 && !input[p][1].csX < -0.7) {
    return true;
  } else if (input[p][0].csY > 0.8 && !input[p][1].csY < 0.7) {
    return true;
  } else if (input[p][0].csY < -0.8 && !input[p][1].csY > -0.7) {
    return true;
  } else {
    return false;
  }
}

// Global Interrupts
export function checkForSmashes (p,input){
  if (input[p][0].a && !input[p][1].a){
    if (Math.abs(input[p][0].lsX) >= 0.79 && input[p][2].lsX*Math.sign(input[p][0].lsX) < 0.3){
      player[p].phys.face = Math.sign(input[p][0].lsX);
      return [true, "FORWARDSMASH"];
    } else if (input[p][0].lsY >= 0.66 && input[p][2].lsY < 0.3) {
      return [true, "UPSMASH"];
    } else if (input[p][0].lsY <= -0.66 && input[p][2].lsY > -0.3) {
      return [true, "DOWNSMASH"];
    } else {
      return [false, false];
    }
  } else if (Math.abs(input[p][0].csX) >= 0.79 && Math.abs(input[p][1].csX) < 0.79) {
    player[p].phys.face = Math.sign(input[p][0].csX);
    return [true, "FORWARDSMASH"];
  } else if (input[p][0].csY >= 0.66 && input[p][1].csY < 0.66) {
    return [true, "UPSMASH"];
  } else if (input[p][0].csY <= -0.66 && input[p][1].csY > -0.66) {
    return [true, "DOWNSMASH"];
  } else {
    return [false, false];
  }
}

export function checkForTilts (p,input,reverse){
  var reverse = reverse || 1;
  if (input[p][0].a && !input[p][1].a) {
    if (input[p][0].lsX * player[p].phys.face * reverse > 0.3 && Math.abs(input[p][0].lsX) - (Math.abs(input[p][0].lsY)) > -0.05) {
      return [true, "FORWARDTILT"];
    } else if (input[p][0].lsY < -0.3) {
      return [true, "DOWNTILT"];
    } else if (input[p][0].lsY > 0.3) {
      return [true, "UPTILT"];
    } else {
      return [true, "JAB1"];
    }
  } else {
    return [false, false];
  }
}

export function checkForSpecials (p,input){
  if (input[p][0].b && !input[p][1].b) {
    if (player[p].phys.grounded) {
      if (Math.abs(input[p][0].lsX) > 0.59 || (input[p][0].lsY > 0.54 && Math.abs(
          input[p][0].lsX) > input[p][0].lsY - 0.2)) {
        player[p].phys.face = Math.sign(input[p][0].lsX);
        return [true, "SIDESPECIALGROUND"];
      } else if (input[p][0].lsY > 0.54) {
        return [true, "UPSPECIAL"];
      } else if (input[p][0].lsY < -0.54) {
        return [true, "DOWNSPECIALGROUND"];
      } else {
        return [true, "NEUTRALSPECIALGROUND"];
      }
    } else {
      if (input[p][0].lsY > 0.54 || (Math.abs(input[p][0].lsX) > 0.59 && input[p]
              [0].lsY > Math.abs(input[p][0].lsX) - 0.2)) {
        return [true, "UPSPECIAL"];
      } else if (input[p][0].lsY < -0.54 || (Math.abs(input[p][0].lsX) > 0.59 && -
          input[p][0].lsY > Math.abs(input[p][0].lsX) - 0.2)) {
        return [true, "DOWNSPECIALAIR"];
      } else if (Math.abs(input[p][0].lsX) > 0.59) {
        player[p].phys.face = Math.sign(input[p][0].lsX);
        return [true, "SIDESPECIALAIR"];
      } else {
        if (input[p][0].lsX * player[p].phys.face < -0.25) {
          player[p].phys.face *= -1;
        } else if (player[p].phys.bTurnaroundTimer > 0) {
          player[p].phys.face = player[p].phys.bTurnaroundDirection;
        }
        return [true, "NEUTRALSPECIALAIR"];
      }
    }
  } else {
    return [false, false];
  }
}

export function checkForAerials (p,input){
  //console.log(p);
  //console.log(input);
  //console.log(input[p]);
  if (input[p][0].csX * player[p].phys.face >= 0.3 && input[p][1].csX * player[p].phys
    .face < 0.3 && Math.abs(input[p][0].csX) > Math.abs(input[p][0].csY) - 0.1) {
    return [true, "ATTACKAIRF"];
  } else if (input[p][0].csX * player[p].phys.face <= -0.3 && input[p][1].csX *
    player[p].phys.face > -0.3 && Math.abs(input[p][0].csX) > Math.abs(input[p][0].csY) - 0.1) {
    return [true, "ATTACKAIRB"];
  } else if (input[p][0].csY >= 0.3 && input[p][1].csY < 0.3) {
    return [true, "ATTACKAIRU"];
  } else if (input[p][0].csY < -0.3 && input[p][1].csY > -0.3) {
    return [true, "ATTACKAIRD"];
  } else if ((input[p][0].a && !input[p][1].a) || (input[p][0].z && !input[p][1].z)) {
    if (input[p][0].lsX * player[p].phys.face > 0.3 && Math.abs(input[p][0].lsX) >
      Math.abs(input[p][0].lsY) - 0.1) {
      return [true, "ATTACKAIRF"];
    } else if (input[p][0].lsX * player[p].phys.face < -0.3 && Math.abs(input[p][0].lsX) > Math.abs(input[p][0].lsY) - 0.1) {
      return [true, "ATTACKAIRB"];
    } else if (input[p][0].lsY > 0.3) {
      return [true, "ATTACKAIRU"];
    } else if (input[p][0].lsY < -0.3) {
      return [true, "ATTACKAIRD"];
    } else {
      return [true, "ATTACKAIRN"];
    }
  }
  return [false, 0];
}


export function checkForDash (p,input){
  return input[p][0].lsX * player[p].phys.face > 0.79 && input[p][2].lsX * player[p].phys.face < 0.3;
}

export function checkForSmashTurn (p,input){
  return input[p][0].lsX * player[p].phys.face < -0.79 && input[p][2].lsX * player[p].phys.face > -0.3;
}

export function tiltTurnDashBuffer (p,input){
  return input[p][1].lsX * player[p].phys.face > -0.3;
}

export function checkForTiltTurn (p,input){
  return input[p][0].lsX * player[p].phys.face < -0.3;
}

export function checkForJump (p,input){
  if ((input[p][0].x && !input[p][1].x) || (input[p][0].y && !input[p][1].y)) {
    return [true, 0];
  }   else if ((gameSettings["tapJumpOffp" + (p + 1)] == false || (gameMode === 4)) &&  (input[p][0].lsY > 0.66 && input[p][3].lsY < 0.2)) { // == is on purpose
    return [true, 1];
  } else {
    return [false, false];
  }
}
export function checkForDoubleJump (p,input){
  return ((input[p][0].x && !input[p][1].x) || (input[p][0].y && !input[p][1].y) || ((gameSettings["tapJumpOffp" + (p + 1)] == false || (gameMode === 4)) && input[p][0].lsY > 0.7 && input[p][1].lsY <= 0.7)) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump));
}
export function checkForMultiJump (p,input){
  return !!(input[p][0].x || input[p][0].y || ((gameSettings["tapJumpOffp" + (p + 1)] == false || (gameMode === 4)) && input[p][0].lsY > 0.7));

}
export function checkForSquat (p,input){
  return input[p][0].lsY < -0.69;
}

export function turboAirborneInterrupt (p,input){
  var a = checkForAerials(p,input);
  var b = checkForSpecials(p,input);
  if (a[0] && a[1] != player[p].actionState) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]][a[1]].init(p,input);
    return true;
  } else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
    return true;
  } else if (((input[p][0].x && !input[p][1].x) || (input[p][0].y && !input[p][1].y) ||
      (input[p][0].lsY > 0.7 && input[p][1].lsY <= 0.7)) && (!player[p].phys.doubleJumped ||
      (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))) {
    turnOffHitboxes(p);
    if (input[p][0].lsX * player[p].phys.face < -0.3) {
      actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
    } else {
      actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
    }
    return true;
  } else if (b[0] && b[1] != player[p].actionState) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]][b[1]].init(p,input);
    return true;
  } else {
    return false;
  }
}

export function turboGroundedInterrupt (p,input){
  var b = checkForSpecials(p,input);
  var t = checkForTilts(p,input);
  var s = checkForSmashes(p,input);
  var j = checkForJump(p,input);
  if (j[0]) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].KNEEBEND.init(p, j[1],input);
    return true;
  } else if (input[p][0].l || input[p][0].r) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].GUARDON.init(p,input);
    return true;
  } else if (input[p][0].lA > 0 || input[p][0].rA > 0) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].GUARDON.init(p,input);
    return true;
  } else if (b[0] && b[1] != player[p].actionState) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]][b[1]].init(p,input);
    return true;
  } else if (s[0] && s[1] != player[p].actionState) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]][s[1]].init(p,input);
    return true;
  } else if (t[0] && t[1] != player[p].actionState) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]][t[1]].init(p,input);
    return true;
  } else if (checkForSquat(p,input)) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].SQUAT.init(p,input);
    return true;
  } else if (checkForDash(p,input)) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].DASH.init(p,input);
    return true;
  } else if (checkForSmashTurn(p,input)) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].SMASHTURN.init(p,input);
    return true;
  } else if (checkForTiltTurn(p,input)) {
    turnOffHitboxes(p);
    player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
    actionStates[characterSelections[p]].TILTTURN.init(p,input);
    return true;
  } else if (Math.abs(input[p][0].lsX) > 0.3) {
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].WALK.init(p, true,input);
    return true;
  } else {
    return false;
  }
}

export const actionStates = [];
export function setupActionStates(index, val){
  actionStates[index]= deepCopyObject(true,actionStates[index],  val);
}

/* char id:
0 - marth
1 - jiggs
2 - fox
*/
