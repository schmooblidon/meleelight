import {player, playerType, cS,stage} from "main/main";
import {gameSettings} from "settings";
/* eslint-disable */

let a = 0;
export function NearestEnemy(cpu,p){
  let nearestEnemy = -1;
  let enemyDistance = 100000;
  for (let i = 0; i < 4; i++) {
    if (playerType[i] > -1) {
      if (playerType[i] > -1 && i != p && player[i].actionState != "SLEEP") {
        if (i != p) {
          const dist = Math.pow(cpu.phys.pos.x - player[i].phys.pos.x, 2) + Math.pow(cpu.phys.pos.y - player[i].phys.pos.y,
                  2);
          if (dist < enemyDistance) {
            enemyDistance = dist;
            nearestEnemy = i;
          }
        }
      }
    }
  }
  if (nearestEnemy == -1) {
    nearestEnemy = 0;
    console.log("cant find nearest enemy");
    // fail safe so it doesnt crash at least
  }
  return nearestEnemy;
}
export function generalAI(i) {
  player[i].inputs.lStickAxis[0].x = 0;
  player[i].inputs.lStickAxis[0].y = 0;
  player[i].inputs.x[0] = false;
  player[i].inputs.b[0] = false;
  player[i].inputs.l[0] = 0;
  player[i].inputs.lAnalog[0] = 0;
  player[i].inputs.cStickAxis[0].x = 0;
  player[i].inputs.cStickAxis[0].y = 0;
  player[i].inputs.a[0] = false;
  var willWalk = false;
  const paction = player[i].actionState;
  const px = player[i].phys.pos.x;
  const py = player[i].phys.pos.y;
  const pcyx = player[i].phys.cVel.x;
  const pcyy = player[i].phys.cVel.y;
  const pdiff = player[i].difficulty;
  const aerialAttacks = ["ATTACKAIRN","ATTACKAIRF","ATTACKAIRB","ATTACKAIRU","ATTACKAIRD"];
  const idleActions = ["WAIT","OTTOTTOWAIT","WALK","LANDING"];
  //const tilts = ["DOWNTILT","UTILT","FTILT","JAB1"];
  const groundAttacks = ["DOWNTILT","UTILT","FTILT","JAB1","JAB2","JAB3","FSMASH","DSMASH","USMASH","ATTACKDASH"];
  const ptimer = player[i].timer;
  const pgrounded = player[i].phys.grounded;
  // if (a > 5) {
  // if (cS[i] == 2) {
  // var distx = player[i].phys.pos.x - player[NearestEnemy(player[i],i)].phys.pos.x;
  // player[i].phys.pos.x = ((Math.random() * 50) - 25) + player[i].phys.pos.x - (Math.sign(player[i].phys.pos.x - player[NearestEnemy(player[i],i)].phys.pos.x) * 1.0 * Math.min(5,Math.abs(player[i].phys.pos.x - (player[NearestEnemy(player[i],i)].phys.pos.x + ((Math.random() * 50) - 20)))));
  // px = ((Math.random() * 50) - 25) + px - (Math.sign(px - player[NearestEnemy(player[i],i)].phys.pos.y) * 1.0 * Math.min(5,Math.abs(px - (player[NearestEnemy(player[i],i)].phys.pos.y + ((Math.random() * 50) - 20)))));
  // player[NearestEnemy(player[i],i)].phys.pos.x += ((Math.random() * 8) - 4);
  // player[NearestEnemy(player[i],i)].phys.pos.y += ((Math.random() * 8) - 4);
  // if (Math.abs(distx) < 50 && !(player[NearestEnemy(player[i],i)].actionState.substr(0,4) == "DEAD")) {
  // player[NearestEnemy(player[i],i)].hitstun = 50;
  // player[NearestEnemy(player[i],i)].actionState = "DAMAGEFLYN";
  // player[NearestEnemy(player[i],i)].phys.kVel.y = 1.0;
  // player[NearestEnemy(player[i],i)].phys.kVel.x = 1.0;
  // player[NearestEnemy(player[i],i)].phys.cVel.x = ((Math.random() * 10) - 5) / 4;
  // player[NearestEnemy(player[i],i)].phys.cVel.x = ((Math.random() * 10) - 5) / 4;
  // }
  // }
  // }
  //if (player[i].currentAction == "CLIFFWAIT")
  if (paction == "GRABRELEASE"){
	  if(ptimer >= 2 && ["WAIT","OTTOTTOWAIT","DAMAGEFALL","FALL","JUMPF","LANDING","JAB1","ESCAPEF","ESCAPEB","FORWARDSMASH","DOWNTILT"].indexOf(paction) != -1) {
	  player[i].currentAction = "NONE";
	  player[i].currentSubaction = "NONE";
	  }
  }
  if (paction == "CATCHWAIT") { //filler AI

    var randomSeed = Math.floor((Math.random() * 10) + 1);
    if (randomSeed <= 2) {
      player[i].inputs.lStickAxis[0].x = 1.0;
    } else if (randomSeed <= 4) {
      player[i].inputs.lStickAxis[0].x = -1.0;
    } else if (randomSeed <= 6) {
      player[i].inputs.lStickAxis[0].y = 1.0;
    } else if (randomSeed <= 8) {
      player[i].inputs.lStickAxis[0].y = -1.0;
    } else {
      player[i].inputs.a[0] = 1.0;
    }
    return;
  }
  if (player[i].currentAction == "DROPTHROUGHPLATFORM" && paction != "SQUAT") {
    player[i].currentAction = "NONE";
    player[i].currentSubaction = "NONE";
  } else if (player[i].currentAction == "DROPTHROUGHPLATFORM") {
    //if (ptimer <= 2) {
    player[i].inputs.lStickAxis[0].y = -1.0;
    //player[i].currentAction = "NONE";
    //}
    return;
  }
  if ((player[i].currentSubaction == "LEFT" || player[i].currentSubaction == "RIGHT") && player[i].currentAction ==
    "NONE") {
    player[i].currentSubaction = "NONE";
  }
  if (player[i].currentAction == "RUNOFFPLATFORM") {
    if (!(pgrounded) && isOffstage(player[i])) {
      player[i].currentAction = "NONE";
      player[i].currentSubaction = "NONE";
    }
    if (["FALL", "DASH", "RUN", "SMASHTURN", "TURN", "WALK"].indexOf(paction) == -1) {
      player[i].currentAction = "NONE";
      player[i].currentSubaction = "NONE";
    } else {
      if (paction == "WALK") {
        player[i].inputs.lStickAxis[0] = player[i].phys.pos.face * -1.0;
      }
      if (paction == "SMASHTURN") {
        if (ptimer < 2) {
          return;
        }
      }
      if (player[i].currentSubaction == "LEFT") {
        if (pgrounded) {
          player[i].inputs.lStickAxis[0].x = -1.0;
        } else {
          player[i].inputs.lStickAxis[0].x = -1.0;
          if (ptimer == 2 && player[i].phys.cVel.y <= 0) { //fast fall
            player[i].inputs.lStickAxis[0].y = -1.0;
          }
          return;
        }
      } else {
        if (pgrounded) {
          player[i].inputs.lStickAxis[0].x = 1.0;
        } else {
          player[i].inputs.lStickAxis[0].x = -1.0;
          if (ptimer == 2 && player[i].phys.cVel.y <= 0) { //fast fall
            player[i].inputs.lStickAxis[0].y = -1.0;
          }
          return;
        }
      }
    }
  }
  if (player[i].currentSubaction == "UPTILT" && paction != "UPTILT") {
    player[i].currentSubaction = "NONE";
  }
  var nearest = NearestEnemy(player[i], i);
  if (pdiff >= 2) {
    if (player[i].currentAction == "NONE") {
	if (["OTTOTTOWAIT", "WAIT", "SMASHTURN", "WALKF", "WALK", "SQUAT"].indexOf(
        paction) != -1 && isAboveGround(player[i].phys.pos.x, px + 1.0)[1] ==
      "platform" && pgrounded && py - player[nearest].phys.pos.y > 0 && Math.abs(player[
        nearest].phys.pos.x - player[i].phys.pos.x) <= 40) {
      //is above platform
      //console.log("H");
      var randomSeed = Math.floor((Math.random() * 10) + 1);
      //randomSeed = 5;
      if (randomSeed <= 3) {
        player[i].inputs.lStickAxis[0].y = -1.0;
        player[i].currentAction = "DROPTHROUGHPLATFORM";
        return;
      } else if (randomSeed <= 5) {
        player[i].currentAction = "SHIELD";
        player[i].inputs.l[0] = 1.0;
        if (player[i].inputs.l[0]) {
          player[i].inputs.lAnalog[0] = 1;
        }
        return;
      } else if (randomSeed >= 6) {
        player[i].currentAction = "RUNOFFPLATFORM";
        var randomSeed = Math.floor((Math.random() * 2) + 1);
        if (randomSeed == 1) {
          player[i].currentSubaction = "LEFT";
          player[i].inputs.lStickAxis[0].x = -1.0;
          return;
        } else {
          player[i].currentSubaction = "RIGHT";
          player[i].inputs.lStickAxis[0].x = 1.0;
          return;
        }
      }
     }
   }
  }
  if (player[i].currentAction == "SHIELD") {
    if (["GUARD", "GUARDON", "WAIT", "DASH", "OTTOTTOWAIT", "SMASHTURN"].indexOf(paction) == -1) {
      player[i].currentAction = "NONE";
      player[i].currentSubaction = "NONE";
    } else {
      //is shielding
      var inputs = CPUShield(player[i], i);
      player[i].inputs.lStickAxis[0].x = isNaN(inputs.lstickX) ? 0 : inputs.lstickX;
      player[i].inputs.lStickAxis[0].y = isNaN(inputs.lstickY) ? 0 : inputs.lstickY;
      player[i].inputs.x[0] = inputs.x;
      player[i].inputs.b[0] = inputs.b;
      player[i].inputs.l[0] = inputs.l;
      player[i].inputs.cStickAxis[0].x = isNaN(inputs.cstickX) ? 0 : inputs.cstickX;
      player[i].inputs.cStickAxis[0].y = isNaN(inputs.cstickY) ? 0 : inputs.cstickY;
      player[i].inputs.a[0] = inputs.a;
      if (player[i].inputs.l[0]) {
        player[i].inputs.lAnalog[0] = 1;
      }
      return;
    }
  }
  if (player[i].currentAction == "LEDGESTALL") {
    if (player[i].currentSubaction == "FALL") {
      if (["CLIFFWAIT", "JUMPF", "FALL", "FALLAERIAL", "JUMPAERIAL", "JUMPAERIALF", "JUMPAERIAL1", "JUMPAERIALB"].indexOf(
          paction) == -1) {
        player[i].currentAction = "NONE";
        player[i].currentSubaction = "NONE";
      }
    } else if (player[i].currentSubaction == "GRAB") { //grab ledge
      if (["UPSPECIAL", "UPSPECIALCHARGE", "UPSPECIALLAUNCH", "JUMPAERIAL", "CLIFFWAIT", "FALL", "JUMPAERIAL1",
          "FALLAERIAL", "JUMPAERIALF", "JUMPAERIALB", "JUMPF"
        ].indexOf(player[i].currentAction) == -1) {
        player[i].currentAction = "NONE";
        player[i].currentSubaction = "NONE";
      }
    }
  }
  if (["TOURNAMENTWINNER", "LEDGEGETUP", "LEDGEATTACK", "LEDGEROLL"].indexOf(player[i].currentAction) != -1) {
    if (!(paction.substr(0, 5) == "CLIFF")) {
      player[i].currentAction = "NONE";
    }
  }
  if (player[i].currentAction == "LEDGEDASH") {
    if (["CLIFFWAIT", "JUMPAERIALF", "JUMPAERIALB", "FALLAERIAL", "ESCAPEAIR", "FALL", "JUMPAERIAL1", "JUMPAERIAL"].indexOf(
        paction) == -1) {
      player[i].currentAction = "NONE";
    } else {
      var inputs = CPULedge(player[i], i);
      //do inputs
      player[i].inputs.lStickAxis[0].x = isNaN(inputs.lstickX) ? 0 : inputs.lstickX;
      player[i].inputs.lStickAxis[0].y = isNaN(inputs.lstickY) ? 0 : inputs.lstickY;
      player[i].inputs.x[0] = inputs.x;
      player[i].inputs.b[0] = inputs.b;
      player[i].inputs.l[0] = inputs.l;
      player[i].inputs.cStickAxis[0].x = isNaN(inputs.cstickX) ? 0 : inputs.cstickX;
      player[i].inputs.cStickAxis[0].y = isNaN(inputs.cstickY) ? 0 : inputs.cstickY;
      player[i].inputs.a[0] = inputs.a;
      if (player[i].inputs.l[0]) {
        player[i].inputs.lAnalog[0] = 1;
      }
      return;
    }
  }
  if (pdiff == 4 && player[i].hit.hitlag > 0 && isOffstage(player[i]) && !(pgrounded)) { //SDI
    var inputs = CPUSDItoStage(player[i], i);
    player[i].inputs.lAnalog[0] = 1;
    player[i].inputs.l[0] = true;
    player[i].inputs.lStickAxis[0].x = isNaN(inputs.lstickX) ? 0 : inputs.lstickX;
    player[i].inputs.lStickAxis[0].y = isNaN(inputs.lstickY) ? 0 : inputs.lstickY;
    return;
  }
  if (!(player[i].grounded) && isOffstage(player[i]) && player[i].currentAction == "NONE") {
    var inputs = CPUrecover(player[i], i);
    //do inputs
    player[i].inputs.lStickAxis[0].x = isNaN(inputs.lstickX) ? 0 : inputs.lstickX;
    player[i].inputs.lStickAxis[0].y = isNaN(inputs.lstickY) ? 0 : inputs.lstickY;
    player[i].inputs.x[0] = inputs.x;
    player[i].inputs.b[0] = inputs.b;
  }
  if (player[i].currentAction == "REVERSEUPTILT") {
    if (["SMASHTURN", "WAIT", "UPTILT", "LANDING", "OTTOTTOWAIT"].indexOf(paction) != -1) {
      player[i].currentAction = "NONE";
      player[i].currentSubaction = "NONE";
    } else {
      if (player[i].currentSubaction == "REVERSE") { //smash turn
        player[i].inputs.lStickAxis[0].x = -1.0 * player[i].phys.face;
        player[i].currentSubaction = "UPTILT";
        return;
      } else if (player[i].currentSubaction == "UPTILT" && ptimer > 1) {
        player[i].inputs.lStickAxis[0].x = 0.0;
        player[i].currentAction = "NONE";
        player[i].currentSubaction = "NONE";
        player[i].inputs.lStickAxis[0].y = .50;
        player[i].inputs.a[0] = true;
        return;
      }
    }
  }
  if (player[i].currentAction == "MASHING" && paction == "WAIT" && ptimer > 2) {
    player[i].currentAction = "NONE";
  }
  //if (player[i].currentSubaction.substr(0,2) == "TUMBLE" && !(paction == "DAMAGEFALL") {
  //	  player[i].currentSubaction = "NONE";
  //}
  if (player[i].currentAction == "SMASHTURN") {
    if (paction == "WAIT" || ptimer > 0) {
      player[i].currentAction = "NONE";
    }
  }
  if (player[i].currentAction == "TECH" || player[i].currentAction == "MISSEDTECH") {
    if (paction == "CLIFFWAIT" || paction == "FALLN" || paction == "WAIT") {
      player[i].currentAction = "NONE";
    }
  }
  if ((paction == "DAMAGEFALL" || paction == "DAMAGEFLYN") && (!isOffstage(player[i])) &&
    pdiff > 0) {
    //if ((px - (1.5 * player[i].phys.kVel.y)) - NearestFloor(player[i]) < 0) {
    //if (px - NearestFloor(player[i]) < 5 && player[i].phys.kVel > 0) {
    if (player[i].hit.hitstun <= 0) {
      let extra = 0;
      if (!player[i].phys.doubleJumped || (player[i].phys.jumpsUsed < 5 && player[i].charAttributes.multiJump)) {
        extra = 3
      }
      var randomSeed = Math.floor((Math.random() * (2 + extra)) + 1);
      if (randomSeed == 1) { //left
        player[i].inputs.lStickAxis[0].x = -1.0;
      } else if (randomSeed == 2) { //right
        player[i].inputs.lStickAxis[0].x = 1.0;
      } else { //jump
        player[i].inputs.x[0] = true;
      }
      player[i].currentAction = "NONE";
      return;
    }
    //console.log("SS");
    player[i].currentAction = "TECH";
    var inputs = CPUTech(player[i], i);
    player[i].inputs.lStickAxis[0].x = isNaN(inputs.lstickX) ? 0 : inputs.lstickX;
    player[i].inputs.l[0] = inputs.l;
    if (player[i].inputs.l[0]) {
      player[i].inputs.lAnalog[0] = 1;
    }
    return;
    //}
  }
  //if (paction == "DAMAGEFALL") {
  //	var inputs = CPUTumble(player[i],i);
  //	player[i].inputs.lStickAxis[0].x = inputs.lstickX;
  //}
  if (paction == "DOWNWAIT") { //missed tech options
    player[i].currentAction = "MISSEDTECH";
    var inputs = CPUMissedTech(player[i], i);
    player[i].inputs.lStickAxis[0].x = isNaN(inputs.lstickX) ? 0 : inputs.lstickX;
    player[i].inputs.lStickAxis[0].y = isNaN(inputs.lstickY) ? 0 : inputs.lstickY;
    player[i].inputs.a[0] = inputs.a;
  }
  if (paction != "DOWNWAIT") {

    if (paction.substr(0, 7) == "CAPTURE" && pdiff > 0 && paction !=
      "CAPTURECUT") { //break out of grabs
      player[i].currentAction = "MASHING";
      player[i].lastMash += 1;
      if (player[i].lastMash > (8 - (2 * (pdiff)))) {
        player[i].lastMash = 0;
        player[i].inputs.lStickAxis[0].y = 1.0;
        player[i].inputs.lAnalog[0] = 1;
        if (!player[i].inputs.a[1]) {
          player[i].inputs.a[0] = true;
          player[i].inputs.x[0] = true;
          player[i].inputs.lStickAxis[0].x = -1.0;
          player[i].inputs.cStickAxis[0].x = -1.0;
          //player[i].inputs.r[0] = true;
        } else {
          player[i].inputs.y[0] = true;
          player[i].inputs.lStickAxis[0].x = 1.0;
          player[i].inputs.b[0] = true;
          player[i].inputs.cStickAxis[0].x = 1.0;
          //player[i].inputs.l[0] = true;
        }
    }
      }
    if (player[i].currentAction == "WAVESHINEANY") {
      var inputs = CPUWaveshineAny(player[i], i);
      player[i].inputs.lStickAxis[0].x = isNaN(inputs.lstickX) ? 0 : inputs.lstickX;
      player[i].inputs.lStickAxis[0].y = isNaN(inputs.lstickY) ? 0 : inputs.lstickY;
      player[i].inputs.x[0] = inputs.x;
      player[i].inputs.b[0] = inputs.b;
      player[i].inputs.l[0] = inputs.l;
      if (player[i].inputs.l[0]) {
        player[i].inputs.lAnalog[0] = 1;
      }
      return;
    }
    if (player[i].currentAction != "WAVESHINEANY" && (paction == "CAPTURECUT" || player[i].currentAction ==
        "GRABRELEASE")) {
      player[i].currentAction = "GRABRELEASE";
      var inputs = CPUGrabRelease(player[i], i);
      player[i].inputs.lStickAxis[0].x = isNaN(inputs.lstickX) ? 0 : inputs.lstickX;
      player[i].inputs.lStickAxis[0].y = isNaN(inputs.lstickY) ? 0 : inputs.lstickY;
      player[i].inputs.x[0] = inputs.x;
      player[i].inputs.b[0] = inputs.b;
      player[i].inputs.l[0] = inputs.l;
      player[i].inputs.cStickAxis[0].x = isNaN(inputs.cstickX) ? 0 : inputs.cstickX;
      player[i].inputs.cStickAxis[0].y = isNaN(inputs.cstickY) ? 0 : inputs.cstickY;
      player[i].inputs.a[0] = inputs.a;
      if (player[i].inputs.l[0]) {
        player[i].inputs.lAnalog[0] = 1;
      }
      return;
    }
    if (player[i].currentAction == "MASHING" && !(paction.substr(0, 7) == "CAPTURE")) {
      player[i].currentAction == "NONE";
      player[i].lastMash = 0;
    }
    if (player[i].hit.hitstun > 0) { //stops action if they get interrupt. pretty simple? could also expand for DI
      player[i].currentAction = "NONE";
    }
    if (paction == "REBIRTHWAIT") {
      player[i].inputs.lStickAxis[0].y = -1.0;
    }
    if ((player[i].currentAction == "NONE" && (paction == "CLIFFWAIT")) || (player[i].currentAction ==
        "LEDGEDASH" || player[i].currentAction == "LEDGEAIRATTACK2" || player[i].currentAction == "LEDGEAIRATTACK" ||
        player[i].currentAction == "LEDGEGETUP" || player[i].currentAction == "LEDGEATTACK" || player[i].currentAction ==
        "LEDGEJUMP" || player[i].currentAction == "LEDGEROLL" || player[i].currentAction == "LEDGEJUMP" || player[i].currentAction ==
        "TOURNAMENTWINNER")) {
      var inputs = CPULedge(player[i], i);
      //do inputs
      player[i].inputs.lStickAxis[0].x = isNaN(inputs.lstickX) ? 0 : inputs.lstickX;
      player[i].inputs.lStickAxis[0].y = isNaN(inputs.lstickY) ? 0 : inputs.lstickY;
      player[i].inputs.x[0] = inputs.x;
      player[i].inputs.b[0] = inputs.b;
      player[i].inputs.l[0] = inputs.l;
      player[i].inputs.cStickAxis[0].x = isNaN(inputs.cstickX) ? 0 : inputs.cstickX;
      player[i].inputs.cStickAxis[0].y = isNaN(inputs.cstickY) ? 0 : inputs.cstickY;
      player[i].inputs.a[0] = inputs.a;
      if (player[i].inputs.l[0]) {
        player[i].inputs.lAnalog[0] = 1;
      }
      return;
    }
  }
  if (player[i].inputs.l[0]) {
    player[i].inputs.lAnalog[0] = 1;
  }
  if (pdiff > 1) {
    var distx = player[i].phys.pos.x - player[nearest].phys.pos.x;
    var disty = py - player[nearest].phys.pos.y;
    if (player[i].currentAction == "NONE" && player[i].currentSubaction == "NONE" && (paction == "WAIT" ||
        paction == "OTTOTTOWAIT" || paction == "WALK")) { //walk towards enemy
      if (Math.abs(distx) >= 23 && (player[nearest].phys.grounded || isAboveGround(player[
          nearest].phys.pos.x, player[nearest].phys.pos.y)[0])) {
        player[i].inputs.lStickAxis[0].x = 0.75 * (-1.0 * (Math.sign(distx)));
      }
    }
    //console.log(player[i].currentAction);
  }
  //run character specific stuff
  const ais = [marthAI, jiggsAI, foxAI];
  ais[cS[i]](i); //calls that character's AI.
}
export function marthAI(i) {
  const paction = player[i].actionState;
  const px = player[i].phys.pos.x;
  const py = player[i].phys.pos.y;
  const pcyx = player[i].phys.cVel.x;
  const pcyy = player[i].phys.cVel.y;
  const pdiff = player[i].difficulty;
  const aerialAttacks = ["ATTACKAIRN","ATTACKAIRF","ATTACKAIRB","ATTACKAIRU","ATTACKAIRD"];
  const idleActions = ["WAIT","OTTOTTOWAIT","WALK","LANDING"];
  //const tilts = ["DOWNTILT","UTILT","FTILT","JAB1"];
  const groundAttacks = ["DOWNTILT","UTILT","FTILT","JAB1","JAB2","JAB3","FSMASH","DSMASH","USMASH","ATTACKDASH"];
  const ptimer = player[i].timer;
  const pgrounded = player[i].phys.grounded;
  if (player[i].currentAction == "LEDGESTALL") {
    player[i].inputs.lStickAxis[0].x = 0.0;
    if (player[i].currentSubaction == "FALL") {
      if (ptimer == 7) {
        //player[i].inputs.lStickAxis[0].y = -1.0;
        player[i].inputs.lStickAxis[0].y = -1.0;
        player[i].inputs.x[0] = 1.0;
        player[i].currentSubaction = "GRAB";
      } else {
        player[i].inputs.lStickAxis[0].y = -1.0;
      }
      return;
    } else if (player[i].currentSubaction == "GRAB") {
      player[i].inputs.lStickAxis[0].x = 0.0;
      if (paction.substr(0, 4) == "CLIFF" && paction == "CLIFFCATCH") { //end of action
        player[i].currentAction = "NONE";
        player[i].currentSubaction = "NONE";
      }
      return;
    }
  }
  const nearest = NearestEnemy(player[i], i);
  if (player[i].currentAction == "NONE") {
    var distx = px - player[nearest].phys.pos.x;
    var disty = py - player[nearest].phys.pos.y;
  }
  if (pdiff >= 2 && player[i].currentAction == "NONE") {
  if ((pgrounded && ((paction ==
      "WAIT" || (pgrounded && gameSettings.turbo && player[i].hasHit && (Math.floor((Math.random() *
        10) + 1) >= 8 - (2 * pdiff)))) && Math.abs(distx) > 15) || ((pdiff > 0 &&
      player[i].hasHit && gameSettings.turbo && pgrounded) || paction == "WAIT") || (
      paction == "LANDING" && ptimer > 3))) { //smash turn to face enemy
    if (!(player[i].phys.face == -1.0 * (Math.sign(distx)))) {
      player[i].currentAction = "SMASHTURN";
      player[i].inputs.lStickAxis[0].x = -1.0 * player[i].phys.face;
      return;
    } else {
      if (player[i].currentAction == "NONE" && ["WAIT","WALK","OTTOTTOWAIT","LANDING"].indexOf(paction) != -1 && player[nearest].phys.hurtBoxState == 0) {
        if (Math.abs(distx) < 23 && Math.abs(disty) < 15) {
          var randomSeed = Math.floor((Math.random() * 100) + 1);
          if (randomSeed <= 10) { //grab
            player[i].inputs.z = true;
            /*
				  player[i].inputs.l[0] = true;
				  player[i].inputs.lAnalog[0] = 1;
				  player[i].inputs.a = true;
				  */
          } else if (randomSeed <= 25) { //tilt
            const randomSeed1 = Math.floor((Math.random() * 100) + 1);
            if (randomSeed1 <= 25) { //f-tilt
              player[i].inputs.lStickAxis[0].x = 0.50;
            } else if (randomSeed1 <= 50) { //d-tilt
              player[i].inputs.lStickAxis[0].y = -0.50;
            } else if (randomSeed1 <= 75) { //up-tilt
              if (cS[i] == 1 || cS[i] == 2) {
                if (!(1.0 * Math.sign(distx) == player[i].phys.face)) {
                  player[i].currentAction = "REVERSEUPTILT";
                  player[i].currentSubaction = "REVERSE";
                  return;
                } else {
                  player[i].inputs.lStickAxis[0].y = 0.50;
                  player[i].inputs.a[0] = true;
                }
              } else {
                //console.log(Math.sign(distx),":",player[i].phys.face)
                player[i].inputs.lStickAxis[0].y = 0.50;
                player[i].inputs.a[0] = true;
              }
            }
            player[i].inputs.a[0] = true;
            return;
          }
          /* else if (randomSeed <= 20) {//shield
				  player[i].inputs.l[0] = true;
				  player[i].inputs.lAnalog[0] = 1;
			  } */
        }
      }
    }
  }
  }
  if (pdiff >= 3) {
	if (player[nearest].phys.hurtBoxState == 0) {
    if (["WAIT", "OTTOTTOWAIT", "WALK", "DASH", "RUN"].indexOf(paction) != -1) {
      if (Math.abs(py - player[nearest].phys.pos.y) <= 3) {
        if ((player[i].phys.face == -1.0 * (Math.sign(distx)))) {
          var randomSeed = Math.floor((Math.random() * 100) + 1);
          if (randomSeed <= 40) {
            if (isEnemyApproaching(player[i], player[nearest]) || player[nearest].actionState.substr(0, 5) == "GUARD") {
              if (Math.abs(px - player[nearest].phys.pos.x) <= 20) {
                player[i].inputs.l[0] = true;
                player[i].inputs.lAnalog[0] = 1.0;
                player[i].inputs.a[0] = true;
              }
            } else if (randomSeed <= 25 && Math.abs(px - player[nearest].phys.pos.x) < 12.5 && ["DOWNBOUND","DOWNSTANDF","DOWNSTANDB","DOWNSTANDN"].indexOf(paction) == -1) {
                player[i].inputs.l[0] = true;
                player[i].inputs.lAnalog[0] = 1.0;
                player[i].inputs.a[0] = true;
			}
          }
        }
      }
    }
  }
  }
}

export function jiggsAI(i) {
  const paction = player[i].actionState;
  const px = player[i].phys.pos.x;
  const py = player[i].phys.pos.y;
  const pcyx = player[i].phys.cVel.x;
  const pcyy = player[i].phys.cVel.y;
  const pdiff = player[i].difficulty;
  const aerialAttacks = ["ATTACKAIRN","ATTACKAIRF","ATTACKAIRB","ATTACKAIRU","ATTACKAIRD"];
  const idleActions = ["WAIT","OTTOTTOWAIT","WALK","LANDING"];
  //const tilts = ["DOWNTILT","UTILT","FTILT","JAB1"];
  const groundAttacks = ["DOWNTILT","UTILT","FTILT","JAB1","JAB2","JAB3","FSMASH","DSMASH","USMASH","ATTACKDASH"];
  const ptimer = player[i].timer;
  const pgrounded = player[i].phys.grounded;
  const nearest = NearestEnemy(player[i], i);
  if (player[i].currentAction == "NONE") {
    var distx = px - player[nearest].phys.pos.x;
    var disty = py - player[nearest].phys.pos.y;

    if (pdiff >= 2 && player[i].currentAction == "NONE") {
    if (pgrounded && ((paction ==
        "WAIT" || (pgrounded && gameSettings.turbo && player[i].hasHit && (Math.floor((Math.random() *
          10) + 1) >= 8 - (2 * pdiff)))) && Math.abs(distx) > 15) || ((pdiff > 0 &&
        player[i].hasHit && gameSettings.turbo && pgrounded) || paction == "WAIT") || (
        paction == "LANDING" && ptimer > 3)) { //smash turn to face enemy
      if (!(player[i].phys.face == -1.0 * (Math.sign(distx)))) {
        player[i].currentAction = "SMASHTURN";
        player[i].inputs.lStickAxis[0].x = -1.0 * player[i].phys.face;
        return;
      } else {
        if (cS[i] == 2 && Math.abs(distx) > 80 && Math.abs(disty) < 15) { //is fox
          var randomSeed = Math.floor((Math.random() * 10) + 1);
          if (randomSeed == 1) {
            player[i].currentAction = "SHDL";
            player[i].currentSubaction = "LASER1";
          }
        }
        if (player[i].currentAction == "NONE") {
          if (Math.abs(distx) < 23 && Math.abs(disty) < 15) {
            var randomSeed = Math.floor((Math.random() * 100) + 1);
            if (randomSeed <= 10) { //grab
              player[i].inputs.z = true;
              /*
				  player[i].inputs.l[0] = true;
				  player[i].inputs.lAnalog[0] = 1;
				  player[i].inputs.a = true;
				  */
            } else if (randomSeed <= 25) { //tilt
              const randomSeed1 = Math.floor((Math.random() * 100) + 1);
              if (randomSeed1 <= 25) { //f-tilt
                player[i].inputs.lStickAxis[0].x = 0.50;
              } else if (randomSeed1 <= 50) { //d-tilt
                player[i].inputs.lStickAxis[0].y = -0.50;
              } else if (randomSeed1 <= 75) { //up-tilt
                if (cS[i] == 1 || cS[i] == 2) {
                  if (!(1.0 * Math.sign(distx) == player[i].phys.face)) {
                    player[i].currentAction = "REVERSEUPTILT";
                    player[i].currentSubaction = "REVERSE";
                    return;
                  } else {
                    player[i].inputs.lStickAxis[0].y = 0.50;
                    player[i].inputs.a[0] = true;
                  }
                } else {
                  //console.log(Math.sign(distx),":",player[i].phys.face)
                  player[i].inputs.lStickAxis[0].y = 0.50;
                  player[i].inputs.a[0] = true;
                }
              }
              player[i].inputs.a[0] = true;
              return;
            }
            /* else if (randomSeed <= 20) {//shield
				  player[i].inputs.l[0] = true;
				  player[i].inputs.lAnalog[0] = 1;
			  } */
          }
        }
      }
    }
  }
  }
  if (pdiff >= 3) {
	if (player[nearest].phys.hurtBoxState == 0) {
    if (["WAIT", "OTTOTTOWAIT", "WALK", "DASH", "RUN"].indexOf(paction) != -1) {
      if (Math.abs(py - player[nearest].phys.pos.y) <= 3) {
        if ((player[i].phys.face == -1.0 * (Math.sign(distx)))) {
          var randomSeed = Math.floor((Math.random() * 100) + 1);
          if (randomSeed <= 30) {
            if (isEnemyApproaching(player[i], player[nearest]) || player[nearest].actionState.substr(0, 5) == "GUARD") {
              if (Math.abs(px - player[nearest].phys.pos.x) <= 13) {
                player[i].inputs.l[0] = true;
                player[i].inputs.lAnalog[0] = 1.0;
                player[i].inputs.a[0] = true;
              }
            } else if (randomSeed <= 20 && Math.abs(px - player[nearest].phys.pos.x) < 8 && ["DOWNBOUND","DOWNSTANDF","DOWNSTANDB","DOWNSTANDN"].indexOf(paction) == -1) {
                player[i].inputs.l[0] = true;
                player[i].inputs.lAnalog[0] = 1.0;
                player[i].inputs.a[0] = true;
			}
          }
        }
      }
    }
  }
  }
}

export function foxAI(i) {
  const paction = player[i].actionState;
  const px = player[i].phys.pos.x;
  const py = player[i].phys.pos.y;
  const pcyx = player[i].phys.cVel.x;
  const pcyy = player[i].phys.cVel.y;
  const pdiff = player[i].difficulty;
  const aerialAttacks = ["ATTACKAIRN","ATTACKAIRF","ATTACKAIRB","ATTACKAIRU","ATTACKAIRD"];
  const idleActions = ["WAIT","OTTOTTOWAIT","WALK","LANDING"];
  //const tilts = ["DOWNTILT","UTILT","FTILT","JAB1"];
  const groundAttacks = ["DOWNTILT","UTILT","FTILT","JAB1","JAB2","JAB3","FSMASH","DSMASH","USMASH","ATTACKDASH"];
  const ptimer = player[i].timer;
  const pgrounded = player[i].phys.grounded;
  if (player[i].currentAction == "LEDGESTALL") {
    player[i].inputs.lStickAxis[0].x = 0.0;
    if (player[i].currentSubaction == "FALL") {
      if (ptimer == 1) {
        //player[i].inputs.lStickAxis[0].y = -1.0;
        player[i].inputs.lStickAxis[0].y = 1.0;
        player[i].inputs.b[0] = true;
        player[i].currentSubaction = "GRAB";
      } else {
        player[i].inputs.lStickAxis[0].y = -1.0;
      }
      return;
    } else if (player[i].currentSubaction == "GRAB") {
      player[i].inputs.lStickAxis[0].x = 0.0;
      if (paction.substr(0, 4) == "CLIFF") { //end of action
        player[i].currentAction = "NONE";
        player[i].currentSubaction = "NONE";
      }
      return;
    }
  }
  let isDead = false;
  let deadDude = "NONE";
  for (let aa = 0; aa < 4; aa++) {
    if (playerType[aa] != -1 && !(i == aa)) {
      if (player[aa].actionState.substr(0, 4) == "DEAD" || player[aa].actionState.substr(0, 7) == "REBIRTH") { //"DEADDOWN","REBIRTH","REBIRTHWAIT"]) {
        isDead = true;
        deadDude = aa;
      } else {
        //console.log(player[aa].actionState);
      }
    }
  }
  if (isDead) {
    if (player[i].currentSubaction == "NONE" && player[i].currentAction == "NONE" && pgrounded && pdiff >= 3) { //can do it
      player[i].currentAction = "RESPAWNMULTISHINE";
      player[i].currentSubaction = "SHINE";
      return;
    }
  }
  if (player[i].currentAction == "RESPAWNMULTISHINE") {
    if (player[i].currentSubaction == "NONE") {
      if (!(isDead)) { //should finish multishining
        player[i].currentAction = "NONE";
      } else {
        player[i].currentSubaction = "JUMP";
      }
    }
    if ((["DOWNSPECIALGROUND", "DOWNSPECIALAIR", "KNEEBEND", "JUMPF", "JUMPB", "WAIT", "WALK", "WALKF", "OTTOTTOWAIT"].indexOf(
        paction) == -1.0)) {
      player[i].currentAction = "NONE";
      player[i].currentSubaction = "NONE";
    }
    if (player[i].currentSubaction == "SHINE") {
      player[i].inputs.lStickAxis[0].y = -1.0;
      player[i].inputs.b[0] = true;
      player[i].currentSubaction = "JUMP";
    } else if (player[i].currentSubaction == "JUMP") {
      player[i].inputs.b[0] = true;
      if ((ptimer == 3 && paction == "DOWNSPECIALGROUND") || (ptimer == 6 && paction ==
          "DOWNSPECIALGROUND")) {
        player[i].inputs.x[0] = true;
        player[i].currentSubaction = "SHINE2";
      }
    } else if (player[i].currentSubaction == "SHINE2") {
      if (paction == "KNEEBEND" && ptimer == 3) {
        player[i].inputs.lStickAxis[0].y = -1.0;
        player[i].inputs.b[0] = true;
        player[i].currentSubaction = "NONE";
      }
    }
    if (player[i].currentAction == "RESPAWNMULTISHINE") {
      return;
    }
    if (player[i].currentSubaction in ["LASER1", "LASER2", "REVERSE"]) {
      if (player[i].hit.hitstun >= 0) {
        player[i].currentSubaction = "NONE";
      }
    }
  }
  const nearest = NearestEnemy(player[i], i);
  if (player[i].currentAction == "NONE") {
    var distx = px - player[nearest].phys.pos.x;
    var disty = py - player[nearest].phys.pos.y;
  if (pdiff >= 2 && player[i].currentAction == "NONE") {
  if ((pgrounded && ((paction ==
        "WAIT" || (pgrounded && gameSettings.turbo && player[i].hasHit && (Math.floor((Math.random() *
          10) + 1) >= 8 - (2 * pdiff)))) && Math.abs(distx) > 15) || ((pdiff > 0 &&
        player[i].hasHit && gameSettings.turbo && pgrounded) || paction == "WAIT") || (
        paction == "LANDING" && ptimer > 3))) { //smash turn to face enemy
      if (!(player[i].phys.face == -1.0 * (Math.sign(distx)))) {
        player[i].currentAction = "SMASHTURN";
        player[i].inputs.lStickAxis[0].x = -1.0 * player[i].phys.face;
        return;
      } else {
        if (cS[i] == 2 && Math.abs(distx) > 80 && Math.abs(disty) < 15) { //is fox
          var randomSeed = Math.floor((Math.random() * 10) + 1);
          if (randomSeed == 1) {
            player[i].currentAction = "SHDL";
            player[i].currentSubaction = "LASER1";
          }
        }
        if (player[i].currentAction == "NONE") {
          if (Math.abs(distx) < 23 && Math.abs(disty) < 15) {
            var randomSeed = Math.floor((Math.random() * 100) + 1);
            if (randomSeed <= 10) { //grab
              player[i].inputs.z = true;
            } else if (randomSeed <= 25) { //tilt
              const randomSeed1 = Math.floor((Math.random() * 100) + 1);
              if (randomSeed1 <= 25) { //f-tilt
                player[i].inputs.lStickAxis[0].x = 0.50;
              } else if (randomSeed1 <= 50) { //d-tilt
                player[i].inputs.lStickAxis[0].y = -0.50;
              } else if (randomSeed1 <= 75) { //up-tilt
                if (cS[i] == 1 || cS[i] == 2) {
                  if (!(1.0 * Math.sign(distx) == player[i].phys.face)) {
                    player[i].currentAction = "REVERSEUPTILT";
                    player[i].currentSubaction = "REVERSE";
                    return;
                  } else {
                    player[i].inputs.lStickAxis[0].y = 0.50;
                    player[i].inputs.a[0] = true;
                  }
                } else {
                  //console.log(Math.sign(distx),":",player[i].phys.face)
                  player[i].inputs.lStickAxis[0].y = 0.50;
                  player[i].inputs.a[0] = true;
                }
              }
              player[i].inputs.a[0] = true;
              return;
            }
          }
        }
      }
    }
  }
  }
  if (pdiff >= 3) {
	if (player[nearest].phys.hurtBoxState == 0) {
    if (["WAIT", "OTTOTTOWAIT", "WALK", "DASH", "RUN"].indexOf(paction) != -1) {
      if (Math.abs(py - player[nearest].phys.pos.y) <= 3) {
        if ((player[i].phys.face == -1.0 * (Math.sign(distx)))) {
          var randomSeed = Math.floor((Math.random() * 100) + 1);
          if (randomSeed <= 30) {
            if (isEnemyApproaching(player[i], player[nearest]) || player[nearest].actionState.substr(0, 5) == "GUARD") {
              if (Math.abs(px - player[nearest].phys.pos.x) <= 12) {
                player[i].inputs.l[0] = true;
                player[i].inputs.lAnalog[0] = 1.0;
                player[i].inputs.a[0] = true;
              }
            } else if (randomSeed <= 20 && Math.abs(px - player[nearest].phys.pos.x) < 8 && ["DOWNBOUND","DOWNSTANDF","DOWNSTANDB","DOWNSTANDN"].indexOf(paction) == -1) {
                player[i].inputs.l[0] = true;
                player[i].inputs.lAnalog[0] = 1.0;
                player[i].inputs.a[0] = true;
			}
          }
        }
      }
    }
  }
  }
  if (player[i].currentAction == "SHDL") {
    const inputs = CPUSHDL(player[i], i);
    player[i].inputs.x[0] = inputs.x;
    player[i].inputs.b[0] = inputs.b;
  }
}


export function runAI (i){
  generalAI(i); //calls general AI
  //console.log(player[i].difficulty);
  //These are the player Inputs
}
export function isEnemyApproaching(cpu,player) {

  if (Math.abs(cpu.phys.pos.x - (player.phys.pos.x + player.phys.cVel.x)) < Math.abs(cpu.phys.pos.x - player.phys.pos.x)) {
    return true;
  } else {
    return false;
  }
}
export function NearestLedge(cpu) {

  let closest = [0, 10000]; //used to measure which ledge is closer
  for (let i = 0; i < stage.ledgePos.length; i++) {
    const closeness = Math.abs(cpu.phys.pos.x - stage.ledgePos[i].x) + Math.abs(cpu.phys.pos.y - stage.ledgePos[i].y); //distance from ledge
    if (closeness < closest[1]) { //if closer to that ledge than others, update closest.
      closest = [i, closeness];
    }
  }
  //closestIndex = closest[0];
  closest = stage.ledgePos[closest[0]]; //updates closest to instead be the closest ledge.
  return closest;
}

export function NearestFloor(cpu) {
  // for each platform
  let nearestDist = 1000;
  let nearestY = -1000;
  for (var i = 0; i < stage.platform.length; i++) {
    // if cpu is above platform
    if (cpu.phys.pos.y > stage.platform[i][0].y && cpu.phys.pos.x >= stage.platform[i][0].x && cpu.phys.pos.x <= stage.platform[
        i][1].x) {
      if (cpu.phys.pos.y - stage.platform[i][0].y < nearestDist) {
        nearestDist = cpu.phys.pos.y - stage.platform[i][0].y;
        nearestY = stage.platform[i][0].y;
      }
    }
  }
  for (var i = 0; i < stage.ground.length; i++) {
    // if cpu is above platform
    if (cpu.phys.pos.y > stage.ground[i][0].y && cpu.phys.pos.x >= stage.ground[i][0].x && cpu.phys.pos.x <= stage.ground[
        i][1].x) {
      if (cpu.phys.pos.y - stage.ground[i][0].y < nearestDist) {
        nearestDist = cpu.phys.pos.y - stage.ground[i][0].y;
        nearestY = stage.ground[i][0].y;
      }
    }
  }
  return nearestY;
}

export function isAboveGround (x,y) {
  let returnValue = [false, "none", 0];
  let closest = 1000;
  let dist;
  for (var i = 0; i < stage.ground.length; i++) {
    if (x >= stage.ground[i][0].x && x <= stage.ground[i][1].x && y >= stage.ground[i][0].y) {
      dist = y - stage.ground[i][0].y;
      if (dist < closest) {
        closest = dist;
        returnValue = [true, "ground", stage.ground[i][0].y];
      }
    }
  }
  for (var i = 0; i < stage.platform.length; i++) {
    if (x >= stage.platform[i][0].x && x <= stage.platform[i][1].x && y >= stage.platform[i][0].y) {
      dist = y - stage.platform[i][0].y;
      if (dist < closest) {
        closest = dist;
        returnValue = [true, "platform", stage.platform[i][0].y];
      }
    }
  }
  return returnValue;
}

export function isOffstage (cpu){
  // if on a ledge
  if (cpu.phys.onLedge > -1) {
    return false;
  }
  if (!cpu.phys.grounded) {
    for (var i = 0; i < stage.ground.length; i++) {
      if (cpu.phys.pos.x >= stage.ground[i][0].x && cpu.phys.pos.x <= stage.ground[i][1].x && cpu.phys.ECBp[0].y >=
        stage.ground[i][0].y) {
        return false;
      }
    }
    for (var i = 0; i < stage.platform.length; i++) {
      if (cpu.phys.pos.x >= stage.platform[i][0].x && cpu.phys.pos.x <= stage.platform[i][1].x && cpu.phys.ECBp[0].y >=
        stage.platform[i][0].y) {
        return false;
      }
    }
  }
  return true;
}
export function CPUSHDL (cpu, p) {
  const returnInput = {
    x: false,
    b: false
  };
  if (cpu.actionState == "WAIT" || cpu.actionState == "DASH" || (cpu.actionState == "LANDING" && cpu.timer > 3)) { //jump
    returnInput.x = true;
  } else if (cpu.actionState == "KNEEBEND" && cpu.timer >= 3) {
    returnInput.b = true;
    cpu.currentSubaction = "LASER2";
  } else {
    if (cpu.timer == 10) {
      returnInput.b = true;
      cpu.currentSubaction = "NONE";
      cpu.currentAction = "NONE";
    }
  }
  return returnInput;
}
export function CPUTech (cpu, p) {
  const returnInput = {
    lstickX: 0.0,
    l: false,
    lAnalog: 0.0
  };
  //console.log("1");
  //console.log("pos" , cpu.phys.pos.y);
  //console.log("nearest" , NearestFloor(cpu));
  if (cpu.phys.pos.y - NearestFloor(cpu) <= 3 && cpu.phys.kVel.y + cpu.phys.cVel.y <= 0) {
    //console.log("trying to tech");
    const MissedTechPercent = 85 - (cpu.difficulty * 20); //how often the CPU miss techs. difficulty: {1: 65%,2: 45%,3: 25%,4: 5%}
    const randomSeed = Math.floor((Math.random() * (100 + MissedTechPercent)) + 1);
    if (randomSeed <= 34) { //inplace
      returnInput.lstickX = 0.0;
      returnInput.l = true;
      returnInput.lAnalog = 1.0;
      //console.log("techinplace");
    } else if (randomSeed <= 67) { //roll left
      returnInput.l = true;
      returnInput.lstickX = -1.0;
      returnInput.lAnalog = 1.0;
      //console.log("techrollleft");
    } else if (randomSeed <= 100) { //roll right
      returnInput.l = true;
      returnInput.lstickX = 1.0;
      returnInput.lAnalog = 1.0;
      //console.log("techrollright");
    } //otherwise miss tech
    //console.log("4");
  }
  return returnInput;

}
export function CPUMissedTech (cpu,p) {
  const returnInput = {
    lstickX: 0.0,
    lstickY: 0.0,
    a: false
  };
  //console.log(randomSeed);
  const randomSeed = Math.floor((Math.random() * 10) + 1);
  //console.log(randomSeed);
  //console.log("2");
  if (randomSeed <= 2) { //getup attack
    returnInput.a = true;
    //returnInput.lstickX = -1.0;
  } else if (randomSeed <= 4) { //roll
    const randomSeeds = Math.floor((Math.random() * 2) + 1);
    if (randomSeeds == 1) { //left
      returnInput.lstickX = -1.0;
    } else { //right
      returnInput.lstickX = 1.0;
    }
  } else if (randomSeed <= 6) { //getup
    returnInput.lstickY = 1.0;
  } //else do nothing
  //console.log("3");
  return returnInput;
}
export function CPUWaveshineAny (cpu,p) {
  const returnInput = {
    lstickX: 0.0,
    lstickY: 0.0,
    x: false,
    b: false,
    l: false,
  };

  if (cpu.actionState == "WAIT") {
    returnInput.lstickY = -1.0;
    returnInput.b = true;
  }
  if (cpu.actionState == "DOWNSPECIALGROUND") {
    if (cpu.timer == 4) {
      returnInput.x = true;
    }
  } else if (cpu.actionState == "KNEEBEND" && (cpu.timer == 3)) {
    const randomSeed = Math.floor((Math.random() * 3) + 1);
    if (randomSeed == 1) { //foward
      returnInput.lstickX = cpu.phys.face * 0.75;
      returnInput.lstickY = -1.0;
      returnInput.l = true;
      cpu.currentAction = "NONE";
    } else if (randomSeed == 2) { //in place
      returnInput.lstickX = 0;
      returnInput.lstickY = -1.0;
      returnInput.l = true;
      cpu.currentAction = "NONE";
    } else { //backwards
      returnInput.lstickX = cpu.phys.face * -0.75;
      returnInput.lstickY = -1.0;
      returnInput.l = true;
      cpu.currentAction = "NONE";
    }
  }
  return returnInput;
}
export function CPUGrabRelease(cpu,p) {
  const returnInput = {
    lstickX: 0.0,
    lstickY: 0.0,
    x: false,
    b: false,
    l: false,
    cstickX: 0.0,
    cstickY: 0.0,
    a: false
  };
  if (cpu.actionState == "WAIT" || cpu.actionState == "CAPTURECUT") {
    if (cS[p] == 2) { //is fox
      var randomSeed = Math.floor((Math.random() * 125) + 1);
      if (randomSeed < 4) { //waveshine
        returnInput.b = true;
        returnInput.lstickY = -1.0;
        cpu.currentAction = "WAVESHINEANY";
        return returnInput;
      } else if (randomSeed < 45) { //jab
        returnInput.a = true;
        //cpu.currentAction = "NONE";
      } else if (randomSeed == 85) { //roll
        returnInput.l = true;
        var randomSeed1 = Math.floor((Math.random() * 3) + 1);
        if (randomSeed1 == 1) {
          returnInput.cstickX = 1.0;
        } else if (randomSeed1 == 2) {
          returnInput.cstickY = -1.0;
        } else {
          returnInput.cstickX = -1.0;
        }
        //cpu.currentAction = "NONE";
      } else if (randomSeed <= 125) { //jump
        returnInput.x = true;
        //cpu.currentAction = "NONE";
      }
    } else { //all other characters
      var randomSeed = Math.floor((Math.random() * 5) + 1);
      if (randomSeed == 1) { //f-smash
        returnInput.cstickX = cpu.phys.face;
        //cpu.currentAction = "NONE";
      } else if (randomSeed == 2) { //jab
        returnInput.a = true;
        //cpu.currentAction = "NONE";
      } else if (randomSeed == 3) { //roll
        returnInput.l = true;
        var randomSeed1 = Math.floor((Math.random() * 3) + 1);
        if (randomSeed1 == 1) {
          returnInput.cstickX = 1.0;
        } else if (randomSeed1 == 2) {
          returnInput.cstickY = -1.0;
        } else {
          returnInput.cstickX = -1.0;
        }
        //cpu.currentAction = "NONE";
      } else if (randomSeed == 4) { //jump
        returnInput.x = true;
        //cpu.currentAction = "NONE";
      }
    }
  }
  return returnInput;
}



function CPUSDItoStage(cpu, p) {
  const closest = NearestLedge(cpu);
  const returnInput = {
    lStickX: 0.0,
    lStickY: 0.0
  };
  if (cpu.timer % 2 == 0) {
    var imperfection = 0;
    var theta = Math.atan(((closest.y - 3.5) - cpu.phys.pos.y) / (closest.x - cpu.phys.pos.x)) + imperfection; //some trig to get angles //(cpu.phys.ledgeSnapBoxF.max.y-cpu.phys.ledgeSnapBoxF.min.y)/2
    var newX = Math.cos(theta); //* Math.sqrt(2);
    var newY = Math.sin(theta); //* Math.sqrt(2);
    if (closest.x < cpu.phys.pos.x) {
      newX *= -1;
      newY *= -1;
    }
    // dont go past 1.0 or -1.0
    newX = Math.sign(newX) * Math.min(1.0, Math.abs(newX));
    newY = Math.sign(newY) * Math.min(1.0, Math.abs(newY));

    returnInput.lstickX = newX;
    returnInput.lstickY = newY;
  } else {
    var imperfection = 0;
    var theta = Math.atan(((closest.y - 3.5) - cpu.phys.pos.y) / (closest.x - cpu.phys.pos.x)) + imperfection; //some trig to get angles //(cpu.phys.ledgeSnapBoxF.max.y-cpu.phys.ledgeSnapBoxF.min.y)/2
    theta = theta + 0.25 * ((Math.floor((Math.random() * 2) + 1) - 1) * -1.0) * Math.PI;
    var newX = Math.cos(theta); //* Math.sqrt(2);
    var newY = Math.sin(theta); //* Math.sqrt(2);
    if (closest.x < cpu.phys.pos.x) {
      newX *= -1;
      newY *= -1;
    }
    // dont go past 1.0 or -1.0
    newX = Math.sign(newX) * Math.min(1.0, Math.abs(newX));
    newY = Math.sign(newY) * Math.min(1.0, Math.abs(newY));

    returnInput.lstickX = newX;
    returnInput.lstickY = newY;
  }
  return returnInput;
}

function CPUShield(cpu, p) {
  const returnInput = {
    lstickX: 0.0,
    lstickY: 0.0,
    x: false,
    b: false,
    a: false,
    l: true,
    cstickX: 0.0,
    cstickY: 0.0,
  };
  let shouldDoSomething = false;
  const doSomethingChance = Math.min(100, 25 * Math.tan((Math.PI / 121) * (60 - cpu.phys.shieldHP)));
  //console.log(doSomethingChance);
  var randomSeed = Math.floor((Math.random() * 100) + 1);
  if (randomSeed <= doSomethingChance) { //do something
    returnInput.l = false;
    const extra = Math.max(0, 15 - cpu.difficulty);
    var randomSeed = Math.floor((Math.random() * 30) + 1) + extra;
    if (randomSeed <= 30) { //jump or shield drop
      if (isAboveGround(cpu.phys.pos.x, cpu.phys.pos.x)[1] == "platform" && cpu.difficulty >= 3) {
        //can shield drop
        var randomSeed = Math.floor((Math.random() * 2) + 1) + extra;
        if (randomSeed != 1) { //shield drop
          returnInput.lstickY = -0.66;
          cpu.currentAction = "NONE";
        } else {
          returnInput.x = true;
          cpu.currentAction = "NONE";
        }
      } else {
        returnInput.x = true;
        cpu.currentAction = "NONE";
      }
    }
  }

  return returnInput;
}
function CPULedge(cpu, p) {
  //var returnInput = [0.0,0.0,false,false,0.0,0.0,0.0,false];
  const returnInput = {
    lstickX: 0.0,
    lstickY: 0.0,
    x: false,
    b: false,
    l: false,
    cstickX: 0.0,
    cstickY: 0.0,
    a: false
  }; //lStickX,lstickY,x,b,Lanalog,cStickX,cStickY,A
  if (cpu.actionState == "LANDINGFALLSPECIAL" && cpu.currentAction == "LEDGEDASH") {
    cpu.currentAction = "NONE";
    return returnInput;
  } else if (cpu.currentAction == "TOURNAMENTWINNER") {
    if (cpu.actionState == "FALLAERIAL") {
      cpu.curentAction = "NONE";
    }
  }
  if (cpu.currentAction == "NONE") {
    var randomSeed = Math.floor((Math.random() * 30) + 1); //highest number of randomSeed can be increased or decrease to add artificial "difficulty level". Higher seeds = less difficulty
    //var randomSeed = 20;
    //var randomSeed = 16;
    if (randomSeed <= 3) { //normal getup
      cpu.currentAction = "LEDGEGETUP";
      returnInput.lstickX = cpu.phys.face;
    } else if (randomSeed <= 5) { //getup roll
      cpu.currentAction = "LEDGEROLL";
      returnInput.l = true;
    } else if (randomSeed <= 8) { //getup attack
      cpu.currentAction = "LEDGEATTACK";
      returnInput.a = true;
    } else if (randomSeed <= 9) { //tournament winner
      cpu.currentAction = "TOURNAMENTWINNER";
      returnInput.lstickY = 1.0;
    } else if (randomSeed <= 12) { //ledge jump
      cpu.currentAction = "LEDGEJUMP";
      returnInput.lstickY = -1.0;
      returnInput.x = true;
    } else if (randomSeed <= 16) { //ledgedash
      if (player[p].difficulty >= 1) {
        //cpu.timer = 0;
        cpu.currentAction = "LEDGEDASH";
        returnInput.lstickY = -1.0;
        returnInput.x = true;
      }
    } else if (randomSeed <= 20) { //ledgeairattack
      if (player[p].difficulty > 1) {
        cpu.currentAction = "LEDGEAIRATTACK";
        returnInput.lstickY = -1.0;
      }
    } else if (randomSeed <= 22) { //ledgestall
      if (player[p].difficulty >= 1) {
        if (cS[p] != 1) {
          cpu.currentAction = "LEDGESTALL";
          cpu.currentSubaction = "FALL";
          returnInput.lstickY = -1.0;
        }
      }
    } //else does nothing
  } else if (cpu.currentAction == "LEDGEDASH") {
    //fox waits 4 frames
    //jiggs waits 5 frames
    //marth waits 17 frames...
    if (cS[p] == 0) { //is marth
      //might be one frame too late or early on timing on my end. pls fix?
      //if (player[i].timer == 18) {
      //	console.log(1.0 * Math.sign(cpu.phys.face));
      //returnInput.lstickX = cpu.phys.face;
      //returnInput.lstickY = -1.0;
      //returnInput.l = true;
      //}

      /*if (cpu.timer == 18) {//ledgedash?
      	returnInput.lstickX = cpu.phys.face;
      	returnInput.lstickY = -1.0;
      	returnInput.l = true;
      } else if (cpu.timer == 1 && cpu.actionState == "FALL") {
      	returnInput.x = true;
      	returnInput.lstickX = cpu.phys.face;
      } else {
      	returnInput.lstickX = cpu.phys.face;
      }
      return returnInput;
      */
      if (cpu.timer == 18) {
        returnInput.lstickX = cpu.phys.face;
        returnInput.lstickY = -1.0;
        returnInput.l = true;
      } else {
        returnInput.x = true;
        returnInput.lstickX = cpu.phys.face;
      }
    } else if (cS[p] == 1) { //is jiggsc
      if (cpu.timer == 6 && cpu.actionState == "JUMPAERIAL1") {
        returnInput.lstickX = cpu.phys.face;
        returnInput.lstickY = -1.0;
        returnInput.l = true;
      } else {
        returnInput.x = true;
        returnInput.lstickX = cpu.phys.face;
      }
    } else if (cS[p] == 2) { //is fox
      if (cpu.timer == 5) {
        returnInput.lstickX = cpu.phys.face;
        returnInput.lstickY = -1.0;
        returnInput.l = true;
      } else {
        returnInput.x = true;
        returnInput.lstickX = cpu.phys.face;
      }
    }
  } else if (cpu.currentAction == "LEDGEJUMP") {
    if (cpu.phys.grounded) {
      returnInput.lstickX = 0;
      cpu.currentAction = "NONE";
    } else {
      if (cpu.actionState == "FALL") {
        returnInput.x = true;
      }
      returnInput.lstickX = cpu.phys.face; //moves forward?
    }
  } else if (cpu.currentAction == "LEDGEAIRATTACK") {
    if (cS[p] == 0) { //marth
      if (cpu.timer == 1) {
        returnInput.x = true; // jump
      } else if (cpu.timer == 3) {
        var randomSeed = Math.floor((Math.random() * 4) + 1); //aerial to chose
        returnInput.lstickX = cpu.phys.face;
        if (randomSeed <= 2) { //fair
          returnInput.cstickX = cpu.phys.face;
        } else if (randomSeed == 3) { //nair
          returnInput.lstickX = 0;
          returnInput.a = true;
        } else { //uair
          returnInput.cstickY = 1.0;
        }
        cpu.currentAction = "LEDGEAIRATTACK2";
      } else {
        returnInput.lstickX = cpu.phys.face;
      }
    } else if (cS[p] == 1) { //puff
      if (cpu.timer == 1) {
        returnInput.x = true; //jump
      } else if (cpu.timer == 3) {
        var randomSeed = Math.floor((Math.random() * 4) + 1); //aerial to chose
        returnInput.lstickX = cpu.phys.face;
        if (randomSeed <= 2) { //fair
          returnInput.cstickX = cpu.phys.face;
        } else if (randomSeed == 3) { //nair
          returnInput.lstickX = 0;
          returnInput.a = true;
        } else { //uair
          returnInput.cstickY = 1.0;
        }
        cpu.currentAction = "LEDGEAIRATTACK2";
      } else {
        returnInput.lstickX = cpu.phys.face;
      }
    } else if (cS[p] == 2) { //fox
      if (cpu.timer == 3) {
        returnInput.x = true; //jump
      } else if (cpu.timer == 6) {
        var randomSeed = Math.floor((Math.random() * 4) + 1); //aerial to chose
        returnInput.cstickX = 0.0;
        returnInput.a = false;
        returnInput.lstickX = cpu.phys.face;
        if (randomSeed <= 2) { //nair
          returnInput.lstickX = 0;
          returnInput.a = true;
        } else if (randomSeed == 3) { //dair
          returnInput.cstickY = -1.0;
        } else { //uair
          returnInput.cstickY = 1.0;
        }
        cpu.currentAction = "LEDGEAIRATTACK2";
      } else {
        returnInput.lstickX = cpu.phys.face;
      }
    }
  } else if (cpu.currentAction == "LEDGEAIRATTACK2") {
    returnInput.lstickX = cpu.phys.face;
    //l cancel
    if (cpu.actionState == "ATTACKAIRN" || cpu.actionState == "ATTACKAIRF" || cpu.actionState == "ATTACKAIRB" || cpu.actionState ==
      "ATTACKAIRU" || cpu.actionState == "ATTACKAIRD") {
      if (!isOffstage(cpu)) {
        if (cpu.phys.pos.y - NearestFloor(cpu) <= 5) {
          //press the fucking l button
          returnInput.l = true;
        }
        if (cpu.phys.cVel.y <= 0) {
          if (!(cpu.phys.fastfalled)) {
            if (cpu.phys.pos.y - NearestFloor(cpu) >= 0) {
              returnInput.lstickY = -1.0;
            }
          }
        }
        //other shit
      }
    }
    //l cancel
    //fast fall
    //other shit
    if (cpu.phys.grounded || cpu.phys.onLedge > -1) {
      cpu.currentAction = "NONE";
    }
  }
  return returnInput;
}
//Recovering:
//cpu is a reference to the current cpu. Replace it if you want
//expect cases of jigglypuff's accidently battlefielding themselves sometimes.
//Fox angles should be perfectly imperfect.
export function CPUrecover (cpu,p) {
    //Where ledges is a list of the ledges on the current stage in the following format. [[ledge1XPos, ledge1YPos],[ledge2XPos,ledge3Ypos],[...]...]
    //ledgepos is where a character can grab the ledge
    const closest = NearestLedge(cpu);
    var returnInput = [0.0, 0.0, false, false];
    var returnInput = {
      lstickX: 0.0,
      lstickY: 0.0,
      x: false,
      b: false
    }; //format is [x joystick float, y joystick float, x button, b button]
    // if charSelect of player num is 2 meaning Fox
    if (cS[p] == 2) {
      //perfect imperfect firefox angles
      if (cpu.actionState == "UPSPECIALCHARGE") {
        returnInput.lStickX = 0.0;
        returnInput.lStickY = 0.0;
        if ((cpu.timer >= 40 && cpu.timer <= 43)) {
          //var imperfection = Math.floor(((Math.random() * 20) + 1) - 10) / 2000;
          const imperfection = 0;
          const theta = Math.atan(((closest.y - 3.5) - cpu.phys.pos.y) / (closest.x - cpu.phys.pos.x)) + imperfection; //some trig to get angles //(cpu.phys.ledgeSnapBoxF.max.y-cpu.phys.ledgeSnapBoxF.min.y)/2
          let newX = Math.cos(theta); //* Math.sqrt(2);
          let newY = Math.sin(theta); //* Math.sqrt(2);
          if (closest.x < cpu.phys.pos.x) {
            newX *= -1;
            newY *= -1;
          }
          // dont go past 1.0 or -1.0
          newX = Math.sign(newX) * Math.min(1.0, Math.abs(newX));
          newY = Math.sign(newY) * Math.min(1.0, Math.abs(newY));

          returnInput.lstickX = newX;
          returnInput.lstickY = newY;
          return returnInput;
        }
      } else if (cpu.actionState == "UPSPECIALLAUNCH") {
        returnInput.lStickX = 0.0;
        returnInput.lStickY = 0.0;
        return returnInput;
      }
    }
    if (cpu.actionState.substr(0, 4) == "JUMP" || cpu.actionState == "FALLAERIAL" || cpu.actionState == "DAMAGEFALL" ||
      cpu.actionState == "FALL" || cpu.actionState == "FALLSPECIAL") {
      //not in up-b or some shit
      if (cpu.phys.pos.x < closest.x) {
        returnInput.lstickX = 1.0;
      } else if (cpu.phys.pos.x > closest.x) {
        returnInput.lstickX = -1.0;
      }
      if (cS[p] == 0 && ((Math.abs(closest.x - cpu.phys.pos.x) > 25) && (!cpu.phys.doubleJumped || (cpu.phys.jumpsUsed <
          5 && cpu.charAttributes.multiJump)) && ((closest.y - cpu.phys.pos.y < 5) || ((closest.y - cpu.phys.pos.y <
          30 && Math.abs(closest.x - cpu.phys.pos.x) > 40))))) {
        //side-b
        //console.log("HI");
        if (Math.abs(cpu.phys.cVel.x) > 0.8) {
          if (cpu.phys.pos.x < closest.x) {
            returnInput.lstickX = 1.0;
          } else if (cpu.phys.pos.x > closest.x) {
            returnInput.lstickX = -1.0;
          } else {
            returnInput.lstickX = 0.0;
          }
          if (!(cpu.actionState.substr(0, 7) == "SPECIAL")) {
            //console.log("HEY");
            returnInput.lstickY = 0.0;
            returnInput.b = true;
            return returnInput;
          }
        }
      } else {
        if (cpu.phys.cVel.y <= 0 && ((closest.y - cpu.phys.pos.y > 10 && (Math.abs(closest.x - cpu.phys.pos.x) > 25)) ||
            (closest.y - cpu.phys.pos.y > 25 && (Math.abs(closest.x - cpu.phys.pos.x) <= 25)))) { //is falling
          if (!cpu.phys.doubleJumped || (cpu.phys.jumpsUsed < 5 && cpu.charAttributes.multiJump)) { //if jumps isn't .jumps thats unintuitive on your part. only tries to jump if it can jump
            var randomSeed = Math.floor((Math.random() * 1000) + 1);

            if (randomSeed <= 300) { //will jump
              returnInput.x = true;
            } else if (randomSeed <= 301) { //will up-b
              if (cS[p] != 1) { //not jigglypuff
                returnInput.lstickX = 0.0;
                returnInput.lstickY = 1.0;
                returnInput.b = true;
              }
            }
          } else {
            if (cS[p] == 0) { //is marth
              if ((Math.abs(closest.x - cpu.phys.pos.x) <= 20 && closest.y - cpu.phys.pos.y > 30) || closest.y - cpu.phys
                .pos.y > 60) {
                returnInput.lstickY = 1.0;
                returnInput.b = true;
              } //else moves towards ledge
            }
            if (cS[p] == 2) { //is fox
              if ((Math.abs(closest.y - cpu.phys.pos.y) <= 10) && (Math.abs(closest.x - cpu.phys.pos.x) >= 30 && Math.abs(
                  closest.x - cpu.phys.pos.x) <= 77)) { //can side-b?
                randomSeed = Math.floor((Math.random() * 10) + 1);
                if (randomSeed <= 4) {
                  returnInput.lstickY = 0.0;
                  returnInput.lstickX = 1 * Math.sign(closest.x - cpu.phys.pos.x);
                  returnInput.b = true;
                  return returnInput;
                }
                /* else if (randomSeed <= 4) {
                					//returnInput.lstickX = 0.0;
                					//returnInput.lstickY = 1.0;
                					//returnInput.b = true;
                				}*/
              }
              if (closest.y - cpu.phys.pos.y >= 40 || Math.abs(closest.x - cpu.phys.pos.x) >= 50) {
                returnInput.lstickX = 0.0;
                returnInput.lstickY = 1.0;
                returnInput.b = true;
              }
            }
          }
        }
      }
      if (cS[p] == 2 && returnInput.lStickY == 1.0) {
        returnInput.lStickX = 0.0;
      }
    } else {
      //hi
    }
    return returnInput;
  }
