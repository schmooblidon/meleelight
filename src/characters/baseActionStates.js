import {player, characterSelections,  screenShake, percentShake, finishGame, palettes, pPal} from "main/main";
import {sounds} from "main/sfx";
import { actionSounds,framesData} from "main/characters";
import {actionStates, reduceByTraction, checkForSpecials, checkForTilts, checkForSmashes, checkForJump, checkForAerials,checkForDoubleJump, checkForMultiJump,
    checkForDash
    , checkForSmashTurn
    , checkForTiltTurn
    , tiltTurnDashBuffer
    , getAngle
    , airDrift
    , fastfall
    , executeIntangibility
    , playSounds
    , shieldTilt
    , shieldSize
    , isFinalDeath
    , turnOffHitboxes
    , mashOut
    , checkForSquat
    , shieldDepletion
} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {blendColours} from "main/vfx/blendColours";
import {activeStage} from "../stages/activeStage";
import {Vec2D} from "../main/util/Vec2D";
/* eslint-disable */

// BASE ActionStates

export const baseActionStates = {

"WAIT" : {
  name : "WAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "WAIT";
    player[p].timer = 1;
	player[p].cStickJump = false;
    actionStates[characterSelections[p]].WAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer += 1;
    if (!actionStates[characterSelections[p]].WAIT.interrupt(p,input)){
      reduceByTraction(p,false);
      if (player[p].timer > framesData[characterSelections[p]].WAIT){
        actionStates[characterSelections[p]].WAIT.init(p,input);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].inCSS){
      var b = [false,false];
      var t = [false,false];
    }
    else {
      var b = checkForSpecials(p,input);
      var t = checkForTilts(p,input);
    }
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if (j[0] && !player[p].inCSS){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p,input);
      return true;
    }
    else if (checkForSquat(p,input) && !player[p].inCSS){
      actionStates[characterSelections[p]].SQUAT.init(p,input);
      return true;
    }
    else if (checkForDash(p,input) && !player[p].inCSS){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else if (checkForSmashTurn(p,input) && !player[p].inCSS){
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
      return true;
    }
    else if (checkForTiltTurn(p,input) && !player[p].inCSS){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
      actionStates[characterSelections[p]].TILTTURN.init(p,input);
      return true;
    }
    else if (Math.abs(input[p][0].lsX) > 0.3 && !player[p].inCSS){
      actionStates[characterSelections[p]].WALK.init(p,true,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"DASH" : {
  name : "DASH",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "DASH";
    player[p].timer = 0;
	player[p].cStickJump = false;
    sounds.dash.play();
    actionStates[characterSelections[p]].DASH.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DASH.interrupt(p,input)){
      if (player[p].timer == 2){
        player[p].phys.cVel.x += player[p].charAttributes.dInitV * player[p].phys.face;
        if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.dMaxV){
          player[p].phys.cVel.x = player[p].charAttributes.dMaxV * player[p].phys.face;
        }
      }
      if (player[p].timer == 4){
        drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
      }
      if (player[p].timer > 1){
        if (Math.abs(input[p][0].lsX) < 0.3){
          reduceByTraction(p,false);
        }
        else {
          var tempMax = input[p][0].lsX * player[p].charAttributes.dMaxV;
          //var tempAcc = (player[p].charAttributes.dAcc - (1 - Math.abs(input[p][0].lsX))*(player[p].charAttributes.dAcc))*player[p].phys.face;
          var tempAcc = input[p][0].lsX*player[p].charAttributes.dAccA;

          player[p].phys.cVel.x += tempAcc;
          if ((tempMax > 0 && player[p].phys.cVel.x > tempMax) || (tempMax < 0 && player[p].phys.cVel.x < tempMax)){
            reduceByTraction(p,false);
            if ((tempMax > 0 && player[p].phys.cVel.x < tempMax) || (tempMax < 0 && player[p].phys.cVel.x > tempMax)){
              player[p].phys.cVel.x = tempMax;
            }
          }
          else {
            player[p].phys.cVel.x += tempAcc;
            if ((tempMax > 0 && player[p].phys.cVel.x > tempMax) || (tempMax < 0 && player[p].phys.cVel.x < tempMax)){
              player[p].phys.cVel.x = tempMax;
            }
          }

        }
      }
    }
  },
  interrupt : function(p,input){
    var j = checkForJump(p,input);
    if (input[p][0].l || input[p][0].r){
      player[p].phys.cVel.x *= 0.25;
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      player[p].phys.cVel.x *= 0.25;
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].a && !input[p][1].a){
      if (player[p].timer < 4 && input[p][0].lsX*player[p].phys.face >= 0.8){
        player[p].phys.cVel.x *= 0.25;
        actionStates[characterSelections[p]].FORWARDSMASH.init(p,input);
      }
      else if (input[p][0].lA > 0 || input[p][0].rA > 0){
        actionStates[characterSelections[p]].GRAB.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].ATTACKDASH.init(p,input);
      }
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].b && !input[p][1].b && Math.abs(input[p][0].lsX) > 0.6){
      player[p].phys.face = Math.sign(input[p][0].lsX);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p,input);
      }
      return true;
    }
    else if (player[p].timer > 4 && checkForSmashTurn(p,input)){
      player[p].phys.cVel.x *= 0.25;
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
      return true;
    }
    else if (player[p].timer > player[p].charAttributes.dashFrameMax && input[p][0].lsX * player[p].phys.face > 0.79 && input[p][2].lsX * player[p].phys.face < 0.3){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else if (player[p].timer > player[p].charAttributes.dashFrameMin && input[p][0].lsX * player[p].phys.face > 0.62){
      actionStates[characterSelections[p]].RUN.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].DASH){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"RUN" : {
  name : "RUN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "RUN";
    player[p].timer = 1;
    actionStates[characterSelections[p]].RUN.main(p,input);
	player[p].cStickJump = false;
  },
  main : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].RUN){
      player[p].timer = 1;
    }
    if (!actionStates[characterSelections[p]].RUN.interrupt(p,input)){
      var footstep = [false,false];
      if (player[p].timer < 2){
        footstep[0] = true;
      }
      if (player[p].timer < 10){
        footstep[1] = true;
      }
      var tempMax = input[p][0].lsX * player[p].charAttributes.dMaxV;

      //Current Run Acceleration = ((MaxRunVel * Xinput) - PreviousFrameVelocity) * (1/(MaxRunVel * 2.5)) * (DRAA + (DRAB/Math.sign(Xinput)))

      var tempAcc = ((player[p].charAttributes.dMaxV * input[p][0].lsX) - player[p].phys.cVel.x) * (1/(player[p].charAttributes.dMaxV * 2.5)) * (player[p].charAttributes.dAccA + (player[p].charAttributes.dAccB / Math.sign(input[p][0].lsX)));


      player[p].phys.cVel.x += tempAcc;
      if (player[p].phys.cVel.x * player[p].phys.face > tempMax * player[p].phys.face){
        player[p].phys.cVel.x = tempMax;
      }

      var time = (player[p].phys.cVel.x * player[p].phys.face) / player[p].charAttributes.dMaxV;
      if (time > 0){
        player[p].timer += time;
      }
      if (player[p].timer > framesData[characterSelections[p]].RUN){
        player[p].timer = 1;
      }
      if ((footstep[0] && player[p].timer >= 2) || (footstep[1] && player[p].timer >= 10)){
        sounds.footstep.play();
      }
    }
  },
  interrupt : function(p,input){
    var j = checkForJump(p,input);
    if (input[p][0].a && !input[p][1].a){
      if (input[p][0].lA > 0 || input[p][0].rA > 0){
        actionStates[characterSelections[p]].GRAB.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].ATTACKDASH.init(p,input);
      }
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].b && !input[p][1].b && Math.abs(input[p][0].lsX) > 0.6){
      player[p].phys.face = Math.sign(input[p][0].lsX);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p,input);
      }
      return true;
    }
    else if (input[p][0].b && !input[p][1].b && input[p][0].lsY < -0.58){
      actionStates[characterSelections[p]].DOWNSPECIALGROUND.init(p,input);
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (Math.abs(input[p][0].lsX) < 0.62){
      actionStates[characterSelections[p]].RUNBRAKE.init(p,input);
      return true;
    }
    else if (input[p][0].lsX * player[p].phys.face < -0.3){
      actionStates[characterSelections[p]].RUNTURN.init(p,input);
      return true;
    }
  }
},

"SMASHTURN" : {
  name : "SMASHTURN",
  canEdgeCancel : true,
  reverseModel : true,
  canBeGrabbed : true,
  disableTeeter : true,
  init : function(p,input){
    player[p].actionState = "SMASHTURN";
    player[p].timer = 0;
    player[p].phys.face *= -1;
    actionStates[characterSelections[p]].SMASHTURN.main(p,input);
	player[p].cStickJump = false;
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SMASHTURN.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    var t = checkForTilts(p,input);
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].b && !input[p][1].b && Math.abs(input[p][0].lsX) > 0.6){
      player[p].phys.face = Math.sign(input[p][0].lsX);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p,input);
      }
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p,input);
    }
    else if (player[p].timer == 2 && input[p][0].lsX * player[p].phys.face > 0.79){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else if (player[p].timer > 11){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"TILTTURN" : {
  name : "TILTTURN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  disableTeeter : true,
  init : function(p,input){
    player[p].actionState = "TILTTURN";
    player[p].timer = 0;
	player[p].cStickJump = false;
    actionStates[characterSelections[p]].TILTTURN.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (player[p].timer == 6){
      player[p].phys.face *= -1;
    }
    if (!actionStates[characterSelections[p]].TILTTURN.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer < 6){
      var t = checkForTilts(p,input,-1);
    }
    else {
      var t = checkForTilts(p,input);
    }
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].b && !input[p][1].b && Math.abs(input[p][0].lsX) > 0.6){
      player[p].phys.face = Math.sign(input[p][0].lsX);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p,input);
      }
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      if (player[p].timer < 6){
        player[p].phys.face *= -1;
      }
      actionStates[characterSelections[p]][t[1]].init(p,input);
    }
    else if (player[p].timer > 11){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else if (player[p].timer == 6 && input[p][0].lsX * player[p].phys.face > 0.79 && player[p].phys.dashbuffer){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"RUNBRAKE" : {
  name : "RUNBRAKE",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "RUNBRAKE";
    player[p].timer = 0;
    sounds.runbrake.play();
	player[p].cStickJump = false;
    actionStates[characterSelections[p]].RUNBRAKE.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].RUNBRAKE.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    var j = checkForJump(p,input);
    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (player[p].timer > 1 && checkForSquat(p,input)){
      actionStates[characterSelections[p]].SQUAT.init(p,input);
      return true;
    }
    else if (input[p][0].lsX * player[p].phys.face < -0.3){
      actionStates[characterSelections[p]].RUNTURN.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].RUNBRAKE){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"RUNTURN" : {
  name : "RUNTURN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "RUNTURN";
    player[p].timer = 0;
	player[p].cStickJump = false;
    actionStates[characterSelections[p]].RUNTURN.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].RUNTURN.interrupt(p,input)){
      if (player[p].timer == player[p].charAttributes.runTurnBreakPoint+1){
        player[p].phys.face *= -1;
      }

      if (player[p].timer <= player[p].charAttributes.runTurnBreakPoint && input[p][0].lsX * player[p].phys.face < -0.3){
        var tempAcc = (player[p].charAttributes.dAccA - (1 - Math.abs(input[p][0].lsX))*(player[p].charAttributes.dAccA))*player[p].phys.face;
        player[p].phys.cVel.x -= tempAcc;
      }
      else if (player[p].timer > player[p].charAttributes.runTurnBreakPoint && input[p][0].lsX * player[p].phys.face > 0.3){
        var tempAcc = (player[p].charAttributes.dAccA - (1 - Math.abs(input[p][0].lsX))*(player[p].charAttributes.dAccA))*player[p].phys.face;
        player[p].phys.cVel.x += tempAcc;
      }
      else {
        reduceByTraction(p,true);
      }

      /* if make more chars add this, but marth cant have it for a boost run
      if (player[p].timer > 18 && player[p].phys.cVel.x * player[p].phys.face > player[p].charAttributes.dMaxV){
        reduceByTraction(p,true);
      }*/

      if (player[p].timer == player[p].charAttributes.runTurnBreakPoint){
        if (player[p].phys.cVel.x * player[p].phys.face > 0){
          player[p].timer--;
        }
      }
    }
  },
  interrupt : function(p,input){
    var j = checkForJump(p,input);
    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].RUNTURN){
      if(input[p][0].lsX * player[p].phys.face > 0.6){
        actionStates[characterSelections[p]].RUN.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].WAIT.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  }
},

"WALK" : {
  name : "WALK",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,addInitV,input){
    player[p].actionState = "WALK";
    player[p].timer = 1;
	player[p].cStickJump = false;
    if (addInitV){
      var tempInit = player[p].charAttributes.walkInitV * player[p].phys.face;
      if ((tempInit > 0 && player[p].phys.cVel.x < tempInit) || (tempInit < 0 && player[p].phys.cVel.x > tempInit)){
        player[p].phys.cVel.x += player[p].charAttributes.walkInitV * player[p].phys.face;
      }
    }
    actionStates[characterSelections[p]].WALK.main(p,input);
  },
  main : function(p,input){

    if (!actionStates[characterSelections[p]].WALK.interrupt(p,input)){
      var footstep = [false,false];
      if (player[p].timer < 5){
        footstep[0] = true;
      }
      if (player[p].timer < 15){
        footstep[1] = true;
      }

      //Current Walk Acceleration = ((MaxWalkVel * Xinput) - PreviousFrameVelocity) * (1/(MaxWalkVel * 2)) * (InitWalkVel * WalkAcc)
      var tempMax = player[p].charAttributes.walkMaxV * input[p][0].lsX;

      if (Math.abs(player[p].phys.cVel.x) > Math.abs(tempMax)){
        reduceByTraction(p,true);
      }
      else {

        var tempAcc = (tempMax - player[p].phys.cVel.x) * (1/(player[p].charAttributes.walkMaxV*2)) * (player[p].charAttributes.walkInitV + player[p].charAttributes.walkAcc);

        player[p].phys.cVel.x += tempAcc;
        if (player[p].phys.cVel.x * player[p].phys.face > tempMax * player[p].phys.face){
          player[p].phys.cVel.x = tempMax;
        }
      }
      var time = (player[p].phys.cVel.x * player[p].phys.face) / player[p].charAttributes.walkMaxV;
      if (time > 0){
        player[p].timer += time;
      }
      if ((footstep[0] && player[p].timer >= 5) || (footstep[1] && player[p].timer >= 15)){
        sounds.footstep.play();
      }
    }
  },
  interrupt : function(p,input){
    var b = checkForSpecials(p,input);
    var t = checkForTilts(p,input);
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if (player[p].timer > framesData[characterSelections[p]].WALK){
      actionStates[characterSelections[p]].WALK.init(p,false,input);
      return true;
    }
    if (input[p][0].lsX == 0){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p,input);
      return true;
    }
    else if (checkForSquat(p,input)){
      actionStates[characterSelections[p]].SQUAT.init(p,input);
      return true;
    }
    else if (checkForDash(p,input)){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else if (checkForSmashTurn(p,input)){
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
      return true;
    }
    else if (checkForTiltTurn(p,input)){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
      actionStates[characterSelections[p]].TILTTURN.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"KNEEBEND" : {
  name : "KNEEBEND",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p,type,input){
    player[p].actionState = "KNEEBEND";
    player[p].timer = 0;
    player[p].phys.jumpType = 1;
    player[p].phys.jumpSquatType = type;
    actionStates[characterSelections[p]].KNEEBEND.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].KNEEBEND.interrupt(p,input)){
      reduceByTraction(p,true);
      // if jumpsquat initiated by stick
	  if (player[p].cStickJump) {
		  if (input[p][0].csY < 0.67) {
			  player[p].phys.jumpType = 0;
		  }
	  } else if (player[p].phys.jumpSquatType){
        if (input[p][0].lsY < 0.67){
          player[p].phys.jumpType = 0;
        }
      }
      // else if jumpsquat initiated by button
      else {
        if (!input[p][0].x && !input[p][0].y){
          player[p].phys.jumpType = 0;
        }
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer == player[p].charAttributes.jumpSquat){
      // so they can be detected as above current surface instantly
      player[p].phys.pos.y += 0.001;
    }
    if (player[p].timer > player[p].charAttributes.jumpSquat){
      if (input[p][2].lsX * player[p].phys.face >= -0.3){
        actionStates[characterSelections[p]].JUMPF.init(p,player[p].phys.jumpType,input);
      }
      else {
        actionStates[characterSelections[p]].JUMPB.init(p,player[p].phys.jumpType,input);
      }
      return true;
    }
    else if (input[p][0].a && !input[p][1].a && (input[p][0].lA > 0 || input[p][0].rA > 0)){
      actionStates[characterSelections[p]].GRAB.init(p,input);
      return true;
    }
    else if ((input[p][0].a && !input[p][1].a && input[p][0].lsY >= 0.8 && input[p][3].lsY < 0.3) || (!(player[p].cStickJump) && (input[p][0].csY >= 0.8 && input[p][3].csY < 0.3))){
      actionStates[characterSelections[p]].UPSMASH.init(p,input);
      return true;
    }
    else if (input[p][0].b && !input[p][1].b && input[p][0].lsY > 0.58){
      actionStates[characterSelections[p]].UPSPECIAL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"JUMPF" : {
  name : "JUMPF",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,type,input){
	player[p].cStickJump = false;
    player[p].actionState = "JUMPF";
    player[p].timer = 0;
    if (type){
      player[p].phys.cVel.y += player[p].charAttributes.fHopInitV;
    }
    else {
      player[p].phys.cVel.y += player[p].charAttributes.sHopInitV;
    }

    player[p].phys.cVel.x = (player[p].phys.cVel.x * player[p].charAttributes.groundToAir) + (input[p][0].lsX * player[p].charAttributes.jumpHinitV);
    if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.jumpHmaxV){
      player[p].phys.cVel.x = player[p].charAttributes.jumpHmaxV * Math.sign(player[p].phys.cVel.x);
    }

    player[p].phys.grounded = false;
    sounds.jump2.play();
    actionStates[characterSelections[p]].JUMPF.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("JUMP",p);
    if (!actionStates[characterSelections[p]].JUMPF.interrupt(p,input)){
      if (player[p].timer > 1){
        fastfall(p,input);
        airDrift(p,input);
      }
    }
  },
  interrupt : function(p,input){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    }
    else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    }
    else if (checkForDoubleJump(p,input)){
      if (input[p][0].lsX*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
      }
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].JUMPF){
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"JUMPB" : {
  name : "JUMPB",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,type,input){
    player[p].cStickJump = false;
    player[p].actionState = "JUMPB";
    player[p].timer = 0;
    if (type){
      player[p].phys.cVel.y += player[p].charAttributes.fHopInitV;
    }
    else {
      player[p].phys.cVel.y += player[p].charAttributes.sHopInitV;
    }

    player[p].phys.cVel.x = (player[p].phys.cVel.x * player[p].charAttributes.groundToAir) + (input[p][0].lsX * player[p].charAttributes.jumpHinitV);
    if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.jumpHmaxV){
      player[p].phys.cVel.x = player[p].charAttributes.jumpHmaxV * Math.sign(player[p].phys.cVel.x);
    }

    player[p].phys.grounded = false;
    sounds.jump2.play();
    actionStates[characterSelections[p]].JUMPB.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].JUMPB.interrupt(p,input)){
      if (player[p].timer > 1){
        fastfall(p,input);
        airDrift(p,input);
      }
    }
  },
  interrupt : function(p,input){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    }
    else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    }
    else if (checkForDoubleJump(p,input)){
      if (input[p][0].lsX*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
      }
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].JUMPB){
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"LANDING" : {
  name : "LANDING",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "LANDING";
    player[p].timer = 0;
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    actionStates[characterSelections[p]].LANDING.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].LANDING.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 4 && player[p].timer <= 30){
      var b = checkForSpecials(p,input);
      var t = checkForTilts(p,input);
      var s = checkForSmashes(p,input);
      var j = checkForJump(p,input);
      if (j[0]){
        actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
        return true;
      }
      else if (input[p][0].l || input[p][0].r){
        actionStates[characterSelections[p]].GUARDON.init(p,input);
        return true;
      }
      else if (input[p][0].lA > 0 || input[p][0].rA > 0){
        actionStates[characterSelections[p]].GUARDON.init(p,input);
        return true;
      }
      else if (b[0]){
        actionStates[characterSelections[p]][b[1]].init(p,input);
        return true;
      }
      else if (s[0]){
        actionStates[characterSelections[p]][s[1]].init(p,input);
        return true;
      }
      else if (t[0]){
        actionStates[characterSelections[p]][t[1]].init(p,input);
        return true;
      }
      else if (checkForDash(p,input)){
        actionStates[characterSelections[p]].DASH.init(p,input);
        return true;
      }
      else if (checkForSmashTurn(p,input)){
        actionStates[characterSelections[p]].SMASHTURN.init(p,input);
        return true;
      }
      else if (checkForTiltTurn(p,input)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
        actionStates[characterSelections[p]].TILTTURN.init(p,input);
        return true;
      }
      else if (Math.abs(input[p][0].lsX) > 0.3){
        actionStates[characterSelections[p]].WALK.init(p,true,input);
        return true;
      }
      else if (player[p].timer == 5 && input[p][0].lsY < -0.5){
        actionStates[characterSelections[p]].SQUATWAIT.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 30){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"ESCAPEAIR" : {
  name : "ESCAPEAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  vCancel : true,
  init : function(p,input){
    player[p].actionState = "ESCAPEAIR";
    player[p].timer = 0;
    if (Math.abs(input[p][0].lsX) > 0 || Math.abs(input[p][0].lsY) > 0){
      var ang = getAngle(input[p][0].lsX,input[p][0].lsY);
      player[p].phys.cVel.x = 3.1 * Math.cos(ang);
      player[p].phys.cVel.y = 3.1 * Math.sin(ang);
    }
    else {
      player[p].phys.cVel.x = 0;
      player[p].phys.cVel.y = 0;
    }
    player[p].phys.fastfalled = false;
    player[p].phys.landingMultiplier = 3;
    actionStates[characterSelections[p]].ESCAPEAIR.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].ESCAPEAIR.interrupt(p,input)){
      if (player[p].timer < 30){
        player[p].phys.cVel.x *= 0.9;
        player[p].phys.cVel.y *= 0.9;
      }
      else {
        airDrift(p,input);
        fastfall(p,input);
      }
      executeIntangibility("ESCAPEAIR",p);
      playSounds("ESCAPEAIR",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 49){
      actionStates[characterSelections[p]].FALLSPECIAL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    player[p].phys.intangibleTimer = 0;
    player[p].phys.hurtBoxState = 0;
    actionStates[characterSelections[p]].LANDINGFALLSPECIAL.init(p,input);
  }
},

"LANDINGFALLSPECIAL" : {
  name : "LANDINGFALLSPECIAL",
  canEdgeCancel : true,
  canGrabLedge : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "LANDINGFALLSPECIAL";
    player[p].timer = 0;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    actionStates[characterSelections[p]].LANDINGFALLSPECIAL.main(p,input);
  },
  main : function(p,input){
    player[p].timer += player[p].phys.landingMultiplier;
    if (!actionStates[characterSelections[p]].LANDINGFALLSPECIAL.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 30){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"FALL" : {
  name : "FALL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,input,disableInputs){
    var dInputs = disableInputs || false;
    player[p].actionState = "FALL";
    player[p].timer = 0;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].FALL.main(p,input,dInputs);
  },
  main : function(p,input,disableInputs){
    player[p].timer++;
    if (disableInputs){
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      airDrift(p,input);
    }
    else {
      if (!actionStates[characterSelections[p]].FALL.interrupt(p,input,input)){
        fastfall(p,input);
        airDrift(p,input);
      }
    }
  },
  interrupt : function(p,input,disableInputs){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    }
    else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    }
    else if (checkForDoubleJump(p,input)){
      if (input[p][0].lsX*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
      }
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].FALL){
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"FALLAERIAL" : {
  name : "FALLAERIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,input){
    player[p].actionState = "FALLAERIAL";
    player[p].timer = 0;
    actionStates[characterSelections[p]].FALLAERIAL.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].FALLAERIAL.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
    }
  },
  interrupt : function(p,input){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    }
    else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    }
    else if (checkForDoubleJump(p,input)){
      if (input[p][0].lsX*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
      }
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].FALLAERIAL){
      actionStates[characterSelections[p]].FALLAERIAL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},


"FALLSPECIAL" : {
  name : "FALLSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  vCancel : true,
  init : function(p,input){
    player[p].actionState = "FALLSPECIAL";
    player[p].timer = 0;
    actionStates[characterSelections[p]].FALLSPECIAL.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].FALLSPECIAL.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].FALLSPECIAL){
      actionStates[characterSelections[p]].FALLSPECIAL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    actionStates[characterSelections[p]].LANDINGFALLSPECIAL.init(p,input);
  }
},

"SQUAT" : {
  name : "SQUAT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  crouch : true,
  disableTeeter : true,
  init : function(p,input){
    player[p].actionState = "SQUAT";
    player[p].timer = 0;
	player[p].shouldDropThrough = 0;
    actionStates[characterSelections[p]].SQUAT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SQUAT.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    var b = checkForSpecials(p,input);
    var t = checkForTilts(p,input);
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if ((player[p].timer == 4 || player[p].timer == 5) && (input[p][0].lsY < -0.65 || input[p][1].lsY < -0.65 || input[p][2].lsY < -0.65) && input[p][6].lsY > -0.3 && player[p].phys.onSurface[0] == 1){
      if(player[p].timer == 5 && player[p].shouldDropThrough == 0) {
		player[p].shouldDropThrough = 7;
		return false;
	  } else {
	  if (player[p].shouldDropThrough == 0) {
	  if (input[p][2].lsY < -0.65) {
	  actionStates[characterSelections[p]].PASS.init(p,input);
      return true;
	  }
	  if (!(input[p][1].lsY < -0.65) && (input[p][0].lsY < -0.65)) {
	  player[p].shouldDropThrough = 6;
	  return false;
	  } else if (input[p][1].lsY < -0.65) {
	  player[p].shouldDropThrough = 5;
	  return false;
	  }
	  }
	  }
	  }
	if (player[p].timer == player[p].shouldDropThrough && player[p].shouldDropThrough != 0) {
	  actionStates[characterSelections[p]].PASS.init(p,input);
      return true;
	}
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].SQUAT){
      actionStates[characterSelections[p]].SQUATWAIT.init(p,input);
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else {
      return false;
    }
  }
},

"SQUATWAIT" : {
  name : "SQUATWAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  crouch : true,
  disableTeeter : true,
  init : function(p,input){
    player[p].actionState = "SQUATWAIT";
    player[p].timer = 0;
    actionStates[characterSelections[p]].SQUATWAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SQUATWAIT.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    var b = checkForSpecials(p,input);
    var t = checkForTilts(p,input);
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if (input[p][0].lsY > -0.61){
      actionStates[characterSelections[p]].SQUATRV.init(p,input);
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p,input);
      return true;
    }
    else if (checkForDash(p,input)){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else if (checkForSmashTurn(p,input)){
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].SQUATWAIT){
      actionStates[characterSelections[p]].SQUATWAIT.init(p,input);
    }
    else {
      return false;
    }
  }
},

"SQUATRV" : {
  name : "SQUATRV",
  canEdgeCancel : true,
  canBeGrabbed : true,
  crouch : true,
  disableTeeter : true,
  init : function(p,input){
    player[p].actionState = "SQUATRV";
    player[p].timer = 0;
    actionStates[characterSelections[p]].SQUATRV.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SQUATRV.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    var b = checkForSpecials(p,input);
    var t = checkForTilts(p,input);
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if (player[p].timer > framesData[characterSelections[p]].SQUATRV){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p,input);
      return true;
    }
    /*else if (checkForDash(p,input)){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }*/
    else if (checkForSmashTurn(p,input)){
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
      return true;
    }
    else if (Math.abs(input[p][0].lsX) > 0.3){
      actionStates[characterSelections[p]].WALK.init(p,true,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"JUMPAERIALF" : {
  name : "JUMPAERIALF",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,input){
    player[p].actionState = "JUMPAERIALF";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;

    player[p].phys.cVel.y = player[p].charAttributes.fHopInitV * player[p].charAttributes.djMultiplier;

    player[p].phys.cVel.x = input[p][0].lsX * player[p].charAttributes.djMomentum;
    drawVfx("doubleJumpRings",player[p].phys.pos,player[p].phys.face);
    sounds.jump2.play();
    actionStates[characterSelections[p]].JUMPAERIALF.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("JUMPAERIAL",p);
    if (!actionStates[characterSelections[p]].JUMPAERIALF.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
    }
  },
  interrupt : function(p,input){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    }
    else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].JUMPAERIALF){
      actionStates[characterSelections[p]].FALLAERIAL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"JUMPAERIALB" : {
  name : "JUMPAERIALB",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,input){
    player[p].actionState = "JUMPAERIALB";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;

    player[p].phys.cVel.y = player[p].charAttributes.fHopInitV * player[p].charAttributes.djMultiplier;

    player[p].phys.cVel.x = input[p][0].lsX * player[p].charAttributes.djMomentum;
    drawVfx("doubleJumpRings",player[p].phys.pos,player[p].phys.face);
    sounds.jump2.play();
    actionStates[characterSelections[p]].JUMPAERIALB.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("JUMPAERIAL",p);
    if (!actionStates[characterSelections[p]].JUMPAERIALB.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
    }
  },
  interrupt : function(p,input){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    }
    else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].JUMPAERIALB){
      actionStates[characterSelections[p]].FALLAERIAL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"PASS" : {
  name : "PASS",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p,input){
    player[p].actionState = "PASS";
    player[p].timer = 0;
    player[p].phys.grounded = false;
    player[p].phys.passFastfall = false;
    player[p].phys.abovePlatforms[player[p].phys.onSurface[1]] = false;
    player[p].phys.cVel.y = -0.5;
    actionStates[characterSelections[p]].PASS.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (player[p].timer > 1){
      if (!actionStates[characterSelections[p]].PASS.interrupt(p,input)){
        if (player[p].phys.passFastfall){
          fastfall(p,input);
        }
        else {
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
          if (input[p][0].lsY > -0.3){
            player[p].phys.passFastfall = true;
          }
        }
        airDrift(p,input);
      }
    }
  },
  interrupt : function(p,input){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    }
    else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    }
    else if (checkForDoubleJump(p,input)){
      if (input[p][0].lsX*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
      }
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].PASS){
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"GUARDON" : {
  name : "GUARDON",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p,input){
    player[p].actionState = "GUARDON";
    player[p].timer = 0;
	player[p].willUnshield = false;
    player[p].phys.shielding = true;
    player[p].phys.shieldPosition = new Vec2D(0,0);
    player[p].phys.powerShielded = false;
	player[p].cStickJump = false;
    shieldSize(p,true,input);
    if (Math.max(input[p][0].lA,input[p][0].rA) == 1){
      player[p].phys.powerShieldActive = true;
      player[p].phys.powerShieldReflectActive = true;
    }
    else {
      player[p].phys.powerShieldActive = false;
      player[p].phys.powerShieldReflectActive = false;
    }
    actionStates[characterSelections[p]].GUARDON.main(p,input);
  },
  main : function(p,input){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true,input);
    }
    else {
      player[p].timer++;
      playSounds("GUARDON",p);
      if (player[p].timer == 3){
        player[p].phys.powerShieldReflectActive = false;
      }
      if (player[p].timer == 5){
        player[p].phys.powerShieldActive = false;
      }
      /*if (player[p].timer == 2 && Math.max(input[p][0].lA,input[p][0].rA) == 1){
        player[p].phys.powerShieldActive = true;
      }*/
      if (!actionStates[characterSelections[p]].GUARDON.interrupt(p,input)){
        if (player[p].timer == 1){
          sounds.shieldup.play();
        }
        if (!player[p].inCSS){
          reduceByTraction(p,false);
          shieldDepletion(p,input);
        }
        shieldTilt(p,false,input);
        shieldSize(p,null,input);
      }
    }
  },
  interrupt : function(p,input){
    if (input[p][0].lA < 0.3 && input[p][0].rA < 0.3){
		player[p].willUnshield = true;
    }
    if (!player[p].inCSS){
      var j = checkForJump(p,input);
      if (j[0] || input[p][0].csY > 0.65){
        player[p].phys.shielding = false;
		player[p].cStickJump = true;
        actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
        return true;
      }
      else if (input[p][0].a && !input[p][1].a){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].GRAB.init(p,input);
        return true;
      }
      else if ((input[p][0].lsY < -0.7 && input[p][4].lsY > -0.3) || input[p][0].csY < -0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEN.init(p,input);
        return true;
      }
      else if ((input[p][0].lsX*player[p].phys.face > 0.7 && input[p][4].lsX*player[p].phys.face < 0.3) || input[p][0].csX*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEF.init(p,input);
        return true;
      }
      else if ((input[p][0].lsX*player[p].phys.face < -0.7 && input[p][4].lsX*player[p].phys.face > -0.3) || input[p][0].csX*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEB.init(p,input);
        return true;
      }
      else if (player[p].timer > 1 && input[p][0].lsY < -0.65 && input[p][6].lsY > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].PASS.init(p,input);
        return true;
      }
      else if (player[p].timer > framesData[characterSelections[p]].GUARDON){
        actionStates[characterSelections[p]].GUARD.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].timer > 8){
        actionStates[characterSelections[p]].GUARD.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
  }
},

"GUARD" : {
  name : "GUARD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p,input){
    player[p].actionState = "GUARD";
    player[p].timer = 0;
	player[p].cStickJump = false;
    player[p].phys.powerShieldActive = false;
    player[p].phys.powerShieldReflectActive = false;
    actionStates[characterSelections[p]].GUARD.main(p,input);
  },
  main : function(p,input){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true,input);
    }
    else {
      player[p].timer++;
      if (!actionStates[characterSelections[p]].GUARD.interrupt(p,input)){
        if (!player[p].inCSS){
          reduceByTraction(p,false);
          shieldDepletion(p,input);
        }
        shieldTilt(p,false,input);
        shieldSize(p,null,input);
      }
    }
  },
  interrupt : function(p,input){
	if (player[p].willUnshield === true){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].GUARDOFF.init(p,input);
        return;		
	}
    if (!player[p].inCSS){
      var j = checkForJump(p,input);
      if (j[0] || input[p][0].csY > 0.66){
        player[p].phys.shielding = false;
		player[p].cStickJump = true;
        actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
        return true;
      }
      else if (input[p][0].a && !input[p][1].a){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].GRAB.init(p,input);
        return true;
      }
      else if ((input[p][0].lsY < -0.7 && input[p][4].lsY > -0.3) || input[p][0].csY < -0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEN.init(p,input);
        return true;
      }
      else if ((input[p][0].lsX*player[p].phys.face > 0.7 && input[p][4].lsX*player[p].phys.face < 0.3) || input[p][0].csX*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEF.init(p,input);
        return true;
      }
      else if ((input[p][0].lsX*player[p].phys.face < -0.7 && input[p][4].lsX*player[p].phys.face > -0.3) || input[p][0].csX*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEB.init(p,input);
        return true;
      }
      else if (input[p][0].lsY < -0.65 && input[p][6].lsY > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].PASS.init(p,input);
        return true;
      }
      else if (input[p][0].lA < 0.3 && input[p][0].rA < 0.3){
		console.log(player[p].actionState);
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].GUARDOFF.init(p,input);
        return true;
      }
      else if (player[p].timer > 1){
        actionStates[characterSelections[p]].GUARD.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (input[p][0].lA < 0.3 && input[p][0].rA < 0.3){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].GUARDOFF.init(p,input);
        return true;
      }
      else if (player[p].timer > 1){
        actionStates[characterSelections[p]].GUARD.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
  }
},

"GUARDOFF" : {
  name : "GUARDOFF",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p,input){
	player[p].cStickJump = false;
    player[p].actionState = "GUARDOFF";
    player[p].timer = 0;
	player[p].cStickJump = false;
    sounds.shieldoff.play();
    actionStates[characterSelections[p]].GUARDOFF.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("GUARDOFF",p);
    if (!actionStates[characterSelections[p]].GUARDOFF.interrupt(p,input)){
      reduceByTraction(p,false);
      //shieldDepletion(p,input);
      //shieldSize(p,null,input);
    }
  },
  interrupt : function(p,input){
    var j = checkForJump(p,input);
    if (player[p].timer > framesData[characterSelections[p]].GUARDOFF){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    } else if (player[p].phys.powerShielded){	
      if (!player[p].inCSS){
        var t = checkForTilts(p,input);
        var s = checkForSmashes(p,input);
        if (s[0]){
          actionStates[characterSelections[p]][s[1]].init(p,input);
          return true;
        }
        else if (t[0]){
          actionStates[characterSelections[p]][t[1]].init(p,input);
          return true;
        }
        else if (checkForSquat(p,input)){
          actionStates[characterSelections[p]].SQUAT.init(p,input);
          return true;
        }
        else if (checkForDash(p,input)){
          actionStates[characterSelections[p]].DASH.init(p,input);
          return true;
        }
        else if (checkForSmashTurn(p,input)){
          actionStates[characterSelections[p]].SMASHTURN.init(p,input);
          return true;
        }
        else if (checkForTiltTurn(p,input)){
          player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
          actionStates[characterSelections[p]].TILTTURN.init(p,input);
          return true;
        }
        else if (Math.abs(input[p][0].lsX) > 0.3){
          actionStates[characterSelections[p]].WALK.init(p,true,input);
          return true;
        }
        else {
          return false;
        }
      } else {
        var s = checkForSmashes(p,input);
        if (s[0]){
          actionStates[characterSelections[p]][s[1]].init(p,input);
          return true;
        } else {
          return false;
        }
      }
    } else {
	  if ((input[p][0].lsY < -0.7 && input[p][4].lsY > -0.3) || input[p][0].csY < -0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEN.init(p,input);
        return true;
      } else if (j[0]) {
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
        return true;
      } else if (input[p][0].csY > 0.66){
        player[p].phys.shielding = false;
		player[p].cStickJump = true;
        actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
        return true;
      }
      return false;
    }
  }
},

"CLIFFCATCH" : {
  name : "CLIFFCATCH",
  canGrabLedge : false,
  canBeGrabbed : false,
  posOffset : [],
  landType : 0,
  init : function(p,input){
    player[p].actionState = "CLIFFCATCH";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.thrownHitbox = false;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = false;
    player[p].phys.jumpsUsed = 0;
    player[p].phys.intangibleTimer = 38;
    player[p].phys.ledgeHangTimer = 0;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    player[p].colourOverlayBool = false;
    player[p].phys.chargeFrames = 0;
    player[p].phys.charging = false;
    turnOffHitboxes(p);
    drawVfx("cliffcatchspark",new Vec2D(activeStage.ledge[player[p].phys.onLedge][1]?activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.x:activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].min.x,activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.y),player[p].phys.face);
    actionStates[characterSelections[p]].CLIFFCATCH.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("CLIFFCATCH",p);
    if (!actionStates[characterSelections[p]].CLIFFCATCH.interrupt(p,input)){
      var x = activeStage.ledge[player[p].phys.onLedge][1]?activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.x:activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.y;
      player[p].phys.pos = new Vec2D(x+(actionStates[characterSelections[p]].CLIFFCATCH.posOffset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+actionStates[characterSelections[p]].CLIFFCATCH.posOffset[player[p].timer-1][1]);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].CLIFFCATCH){
      actionStates[characterSelections[p]].CLIFFWAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"CLIFFWAIT" : {
  name : "CLIFFWAIT",
  canGrabLedge : false,
  canBeGrabbed : false,
  wallJumpAble : false,
  posOffset : [],
  landType : 0,
  init : function(p,input){
    player[p].actionState = "CLIFFWAIT";
    player[p].timer = 0;
    actionStates[characterSelections[p]].CLIFFWAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CLIFFWAIT.interrupt(p,input)){
      player[p].phys.ledgeHangTimer++;
    }
  },
  interrupt : function(p,input){
    if ((input[p][0].lsX*player[p].phys.face < -0.2 && input[p][1].lsX*player[p].phys.face >= -0.2) || (input[p][0].lsY < -0.2 && input[p][1].lsY >= -0.2) || (input[p][0].csX*player[p].phys.face < -0.2 && input[p][1].csX*player[p].phys.face >= -0.2) || (input[p][0].csY < -0.2 && input[p][1].csY >= -0.2)){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      actionStates[characterSelections[p]].FALL.init(p,input,true);
      return true;
    }
    else if ((input[p][0].x && !input[p][1].x) || (input[p][0].y && !input[p][1].y) || (input[p][0].lsY > 0.65 && input[p][1].lsY <= 0.65)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFJUMPQUICK.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].CLIFFJUMPSLOW.init(p,input);
      }
      return true;
    }
    else if ((input[p][0].lsX*player[p].phys.face > 0.2 && input[p][1].lsX*player[p].phys.face <= 0.2) || (input[p][0].lsY > 0.2 && input[p][1].lsY <= 0.2)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFGETUPQUICK.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].CLIFFGETUPSLOW.init(p,input);
      }
      return true;
    }
    else if ((input[p][0].a && !input[p][1].a) || (input[p][0].b && !input[p][1].b) || (input[p][0].csY > 0.65 && input[p][1].csY <= 0.65)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFATTACKQUICK.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].CLIFFATTACKSLOW.init(p,input);
      }
      return true;
    }
    else if ((input[p][0].lA > 0.3 && input[p][1].lA <= 0.3) || (input[p][0].rA > 0.3 && input[p][1].rA <= 0.3) || (input[p][0].csX*player[p].phys.face > 0.8 && input[p][1].csX*player[p].phys.face <= 0.8)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFESCAPEQUICK.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].CLIFFESCAPESLOW.init(p,input);
      }
      return true;
    }
    else if (player[p].phys.ledgeHangTimer > 600){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      actionStates[characterSelections[p]].DAMAGEFALL.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].CLIFFWAIT){
      actionStates[characterSelections[p]].CLIFFWAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"DEADLEFT" : {
  name : "DEADLEFT",
  canBeGrabbed : false,
  ignoreCollision : true,
  dead : true,
  init : function(p,input){
    player[p].actionState = "DEADLEFT";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].percent = 0;
    drawVfx("blastzoneExplosion",player[p].phys.pos,90);
    if (!isFinalDeath()){
      screenShake(500);
      percentShake(500,p);
    }
    sounds.kill.play();
    actionStates[characterSelections[p]].DEADLEFT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("DEAD",p);
    if (!actionStates[characterSelections[p]].DEADLEFT.interrupt(p,input)){
      player[p].phys.outOfCameraTimer = 0;
      player[p].phys.intangibleTimer = 2;
      if (player[p].timer == 4){
        if (isFinalDeath()){
          finishGame(input);
        }
        else {
          screenShake(500);
          percentShake(500,p);
        }
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 60){
      if (player[p].stocks > 0){
        actionStates[characterSelections[p]].REBIRTH.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SLEEP.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  }
},

"DEADRIGHT" : {
  name : "DEADRIGHT",
  canBeGrabbed : false,
  ignoreCollision : true,
  dead : true,
  init : function(p,input){
    player[p].actionState = "DEADRIGHT";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].percent = 0;
    drawVfx("blastzoneExplosion",player[p].phys.pos,-90);
    if (!isFinalDeath()){
      screenShake(500);
      percentShake(500,p);
    }
    sounds.kill.play();
    actionStates[characterSelections[p]].DEADRIGHT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("DEAD",p);
    if (!actionStates[characterSelections[p]].DEADRIGHT.interrupt(p,input)){
      player[p].phys.outOfCameraTimer = 0;
      player[p].phys.intangibleTimer = 2;
      if (player[p].timer == 4){
        if (isFinalDeath()){
          finishGame(input);
        }
        else {
          screenShake(500);
          percentShake(500,p);
        }
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 60){
      if (player[p].stocks > 0){
        actionStates[characterSelections[p]].REBIRTH.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SLEEP.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  }
},

"DEADUP" : {
  name : "DEADUP",
  canBeGrabbed : false,
  ignoreCollision : true,
  dead : true,
  init : function(p,input){
    player[p].actionState = "DEADUP";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].percent = 0;
    drawVfx("blastzoneExplosion",player[p].phys.pos,180);
    if (!isFinalDeath()){
      screenShake(500);
      percentShake(500,p);
    }
    sounds.kill.play();
    actionStates[characterSelections[p]].DEADUP.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("DEAD",p);
    if (!actionStates[characterSelections[p]].DEADUP.interrupt(p,input)){
      player[p].phys.outOfCameraTimer = 0;
      player[p].phys.intangibleTimer = 2;
      if (player[p].timer == 4){
        if (isFinalDeath()){
          finishGame(input);
        }
        else {
          screenShake(500);
          percentShake(500,p);
        }
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 60){
      if (player[p].stocks > 0){
        actionStates[characterSelections[p]].REBIRTH.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SLEEP.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  }
},

"DEADDOWN" : {
  name : "DEADDOWN",
  canBeGrabbed : false,
  ignoreCollision : true,
  dead : true,
  init : function(p,input){
    player[p].actionState = "DEADDOWN";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].percent = 0;
    drawVfx("blastzoneExplosion",player[p].phys.pos,0);
    if (!isFinalDeath()){
      screenShake(500);
      percentShake(500,p);
    }
    sounds.kill.play();
    actionStates[characterSelections[p]].DEADDOWN.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("DEAD",p);
    if (!actionStates[characterSelections[p]].DEADDOWN.interrupt(p,input)){
      player[p].phys.outOfCameraTimer = 0;
      player[p].phys.intangibleTimer = 2;
      if (player[p].timer == 4){
        if (isFinalDeath()){
          finishGame(input);
        }
        else {
          screenShake(500);
          percentShake(500,p);
        }
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 60){
      if (player[p].stocks > 0){
        actionStates[characterSelections[p]].REBIRTH.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SLEEP.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  }
},

"REBIRTH" : {
  name : "REBIRTH",
  canBeGrabbed : false,
  ignoreCollision : true,
  init : function(p,input){
	player[p].cStickJump = false;
    player[p].actionState = "REBIRTH";
    player[p].timer = 1;
    player[p].phys.pos.x = activeStage.respawnPoints[p].x;
    player[p].phys.pos.y = activeStage.respawnPoints[p].y+135;
    //player[p].phys.grounded = true;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = -1.5;
    player[p].phys.face = activeStage.respawnFace[p];
    player[p].phys.doubleJumped = false;
    player[p].phys.fastfalled = false;
    player[p].phys.jumpsUsed = 0;
    player[p].phys.wallJumpCount = 0;
    player[p].phys.sideBJumpFlag = true;
    player[p].spawnWaitTime = 0;
    player[p].percent = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].hit.hitstun = 0;
    player[p].phys.shieldHP = 60;
    player[p].burning = 0;
    player[p].shocked = 0;
  },
  main : function(p,input){
    player[p].timer+= 1;
    if (!actionStates[characterSelections[p]].REBIRTH.interrupt(p,input)){
      player[p].phys.outOfCameraTimer = 0;
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 90){
      actionStates[characterSelections[p]].REBIRTHWAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"REBIRTHWAIT" : {
  name : "REBIRTHWAIT",
  canBeGrabbed : false,
  init : function(p,input){
    player[p].actionState = "REBIRTHWAIT";
    player[p].timer = 1;
    player[p].phys.cVel.y = 0;
  },
  main : function(p,input){
    player[p].timer+= 1;
    player[p].spawnWaitTime++;
    if (!actionStates[characterSelections[p]].REBIRTHWAIT.interrupt(p,input)){
      player[p].phys.outOfCameraTimer = 0;
    }
  },
  interrupt : function(p,input){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
	  player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    } else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
	  actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    } else if (((input[p][0].x && !input[p][1].x) || (input[p][0].y && !input[p][1].y) || (input[p][0].lsY > 0.7 && input[p][1].lsY <= 0.7)) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
	  if (input[p][0].lsX*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
      } else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
      }
	  
      return true;
    } else if (b[0]){
	  player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    if (player[p].timer > framesData[characterSelections[p]].WAIT){
      actionStates[characterSelections[p]].REBIRTHWAIT.init(p,input);
      return true;
    }
    else if (player[p].spawnWaitTime > 300){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else if (Math.abs(input[p][0].lsX) > 0.3 || Math.abs(input[p][0].lsY) > 0.3 ){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},


"DAMAGEFLYN" : {
  name : "DAMAGEFLYN",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 2,
  init : function(p,input,drawStuff){
	player[p].cStickJump = false;
    player[p].actionState = "DAMAGEFLYN";
	player[p].tumbleJumpBuffer = 0;
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.grabbedBy = -1;
    player[p].phys.fastfalled = false;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    player[p].colourOverlayBool = false;
    if (drawStuff){
      // drawVfx("hitSparks",player[p].hit.hitPoint,player[p].phys.face);
      // drawVfx("hitFlair",player[p].hit.hitPoint,player[p].phys.face);
      // drawVfx("hitCurve",player[p].hit.hitPoint,player[p].phys.face,player[p].hit.angle);
    }
    player[p].hitboxes.id[0] = player[p].charHitboxes.thrown.id0;
    /*player[p].phys.grounded = false;
    player[p].phys.pos.y += 0.0001;*/
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].DAMAGEFLYN.main(p,input);
  },
  main : function(p,input){                                                //look here tata
    if (player[p].tumbleJumpBuffer > 0) {
		player[p].tumbleJumpBuffer--;
	}
    if (player[p].phys.thrownHitbox){
      if (player[p].timer == 1 && player[p].phys.cVel.y+player[p].phys.kVel.y > 0){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 1 && player[p].phys.cVel.y+player[p].phys.kVel.y > 0){
        //player[p].hitboxes.frame++;
      }
      if (player[p].phys.cVel.y+player[p].phys.kVel.y <= 0){
        turnOffHitboxes(p);
      }
    }
    if (player[p].timer < framesData[characterSelections[p]].DAMAGEFLYN){
      player[p].timer++;
    }
    if (player[p].hit.hitstun % 10 == 0){
      drawVfx("flyingDust",player[p].phys.pos);
    }
    if (!actionStates[characterSelections[p]].DAMAGEFLYN.interrupt(p,input)){
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
        if (!player[p].phys.grounded){
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
        }
      }
    }
    else {
      player[p].phys.thrownHitbox = false;
    }
  },
  interrupt : function(p,input){
	if(checkForDoubleJump(p,input)) {
		player[p].tumbleJumpBuffer = 20;
	}
    if (player[p].timer > 1 && player[p].hit.hitstun == 0 && player[p].tumbleJumpBuffer > 0) {
	  if (input[p][0].lsX*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
		return true;
        } else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
		return true;
	    }
	}
    if (player[p].timer > 1 && player[p].hit.hitstun == 0){
      actionStates[characterSelections[p]].DAMAGEFALL.init(p,input);
      player[p].phys.thrownHitbox = false;
      return true;
    }
    else {
      return false;
    }
  }
},

"DAMAGEFALL" : {
  name : "DAMAGEFALL",
  canPassThrough : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 2,
  vCancel : true,
  init : function(p,input){
    player[p].actionState = "DAMAGEFALL";
    player[p].timer = 0;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].DAMAGEFALL.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
	fastfall(p,input); //can fastfall damagefall
    if (!actionStates[characterSelections[p]].DAMAGEFALL.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
    }
  },
  interrupt : function(p,input){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    } else if (checkForDoubleJump(p,input)){
      if (input[p][0].lsX*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
      }
      return true;
    } else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    } else if ((input[p][0].lsX > 0.7 && input[p][1].lsX < 0.7) || (input[p][0].lsX < -0.7 && input[p][1].lsX > -0.7)) {// || (input[p][0].lsY > 0.7 && input[p][1].lsY < 0.7) || (input[p][0].lsY < -0.7 && input[p][1].lsY > -0.7)){
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    } else if (player[p].timer > framesData[characterSelections[p]].DAMAGEFALL){
      actionStates[characterSelections[p]].DAMAGEFALL.init(p,input);
      return true;
    } else {
      return false;
    }
  }
},

"DAMAGEN2" : {
  name : "DAMAGEN2",
  canEdgeCancel : true,
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  missfoot : true,
  init : function(p,input){
	player[p].cStickJump = false;
    player[p].actionState = "DAMAGEN2";
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.grabbedBy = -1;
    player[p].phys.fastfalled = false;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    player[p].colourOverlayBool = false;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].DAMAGEN2.main(p,input);
  },
  main : function(p,input){
    if (player[p].inCSS){
      player[p].timer+= 0.7;
    }
    else {
      player[p].timer++;
    }
    if (!actionStates[characterSelections[p]].DAMAGEN2.interrupt(p,input)){
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
        if (!player[p].phys.grounded){
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
        }
        else {
          reduceByTraction(p,false);
        }
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].DAMAGEN2){
      if (player[p].hit.hitstun > 0){
        player[p].timer--;
        return false;
      }
      else {
        if (player[p].phys.grounded || player[p].inCSS){
          actionStates[characterSelections[p]].WAIT.init(p,input);
        }
        else {
          actionStates[characterSelections[p]].FALL.init(p,input);
        }
        return true;
      }
    }
    else if (player[p].hit.hitstun <= 0 && !player[p].inCSS){
      if (player[p].phys.grounded){
        var b = checkForSpecials(p,input);
        var t = checkForTilts(p,input);
        var s = checkForSmashes(p,input);
        var j = checkForJump(p,input);
        if (j[0]){
          actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
          return true;
        }
        else if (input[p][0].l || input[p][0].r){
          actionStates[characterSelections[p]].GUARDON.init(p,input);
          return true;
        }
        else if (input[p][0].lA > 0 || input[p][0].rA > 0){
          actionStates[characterSelections[p]].GUARDON.init(p,input);
          return true;
        }
        else if (b[0]){
          actionStates[characterSelections[p]][b[1]].init(p,input);
          return true;
        }
        else if (s[0]){
          actionStates[characterSelections[p]][s[1]].init(p,input);
          return true;
        }
        else if (t[0]){
          actionStates[characterSelections[p]][t[1]].init(p,input);
          return true;
        }
        else if (checkForSquat(p,input)){
          actionStates[characterSelections[p]].SQUAT.init(p,input);
          return true;
        }
        else if (checkForDash(p,input)){
          actionStates[characterSelections[p]].DASH.init(p,input);
          return true;
        }
        else if (checkForSmashTurn(p,input)){
          actionStates[characterSelections[p]].SMASHTURN.init(p,input);
          return true;
        }
        else if (checkForTiltTurn(p,input)){
          player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
          actionStates[characterSelections[p]].TILTTURN.init(p,input);
          return true;
        }
        else if (Math.abs(input[p][0].lsX) > 0.3){
          actionStates[characterSelections[p]].WALK.init(p,true,input);
          return true;
        }
        else {
          return false;
        }
      }
      else {
        var a = checkForAerials(p,input);
        var b = checkForSpecials(p,input);
        if (a[0]){
          actionStates[characterSelections[p]][a[1]].init(p,input);
          return true;
        }
        else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
          actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
          return true;
        }
        else if (checkForDoubleJump(p,input)){
          if (input[p][0].lsX*player[p].phys.face < -0.3){
            actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
          }
          else {
            actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
          }
          return true;
        }
        else if (b[0]){
          actionStates[characterSelections[p]][b[1]].init(p,input);
          return true;
        }
        else if ((input[p][0].lsX > 0.7 && input[p][1].lsX < 0.7) || (input[p][0].lsX < -0.7 && input[p][1].lsX > -0.7) || (input[p][0].lsY > 0.7 && input[p][1].lsY < 0.7) || (input[p][0].lsY < -0.7 && input[p][1].lsY > -0.7)){
          actionStates[characterSelections[p]].FALL.init(p,input);
          return true;
        }
        else {
          return false;
        }
      }
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    if (player[p].hit.hitstun <= 0){
      actionStates[characterSelections[p]].LANDING.init(p,input);
    }
  }
},

"LANDINGATTACKAIRN" : {
  name : "LANDINGATTACKAIRN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "LANDINGATTACKAIRN";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    actionStates[characterSelections[p]].LANDINGATTACKAIRN.main(p,input);
  },
  main : function(p,input){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!actionStates[characterSelections[p]].LANDINGATTACKAIRN.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].LANDINGATTACKAIRN){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"LANDINGATTACKAIRF" : {
  name : "LANDINGATTACKAIRF",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "LANDINGATTACKAIRF";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    actionStates[characterSelections[p]].LANDINGATTACKAIRF.main(p,input);
  },
  main : function(p,input){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!actionStates[characterSelections[p]].LANDINGATTACKAIRF.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].LANDINGATTACKAIRF){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"LANDINGATTACKAIRB" : {
  name : "LANDINGATTACKAIRB",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "LANDINGATTACKAIRB";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    actionStates[characterSelections[p]].LANDINGATTACKAIRB.main(p,input);
  },
  main : function(p,input){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!actionStates[characterSelections[p]].LANDINGATTACKAIRB.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].LANDINGATTACKAIRB){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"LANDINGATTACKAIRD" : {
  name : "LANDINGATTACKAIRD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "LANDINGATTACKAIRD";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    actionStates[characterSelections[p]].LANDINGATTACKAIRD.main(p,input);
  },
  main : function(p,input){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!actionStates[characterSelections[p]].LANDINGATTACKAIRD.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].LANDINGATTACKAIRD){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"LANDINGATTACKAIRU" : {
  name : "LANDINGATTACKAIRU",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "LANDINGATTACKAIRU";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    actionStates[characterSelections[p]].LANDINGATTACKAIRU.main(p,input);
  },
  main : function(p,input){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!actionStates[characterSelections[p]].LANDINGATTACKAIRU.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].LANDINGATTACKAIRU){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"ESCAPEB" : {
  name : "ESCAPEB",
  setVelocities : [],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "ESCAPEB";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    actionStates[characterSelections[p]].ESCAPEB.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("ESCAPEB",p);
    if (!actionStates[characterSelections[p]].ESCAPEB.interrupt(p,input)){
      player[p].phys.cVel.x = actionStates[characterSelections[p]].ESCAPEB.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("ESCAPEB",p);
      if (player[p].timer == 4){
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].ESCAPEB){
      player[p].phys.cVel.x = 0;
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"ESCAPEF" : {
  name : "ESCAPEF",
  setVelocities : [],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "ESCAPEF";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    actionStates[characterSelections[p]].ESCAPEF.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("ESCAPEF",p);
    if (!actionStates[characterSelections[p]].ESCAPEF.interrupt(p,input)){
      player[p].phys.cVel.x = actionStates[characterSelections[p]].ESCAPEF.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("ESCAPEF",p);
      if (player[p].timer == 4){
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].ESCAPEF){
      player[p].phys.cVel.x = 0;
      player[p].phys.face *= -1;
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"ESCAPEN" : {
  name : "ESCAPEN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "ESCAPEN";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    actionStates[characterSelections[p]].ESCAPEN.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("ESCAPEN",p);
    if (!actionStates[characterSelections[p]].ESCAPEN.interrupt(p,input)){
      if (player[p].timer == 1){
        sounds.spotdodge.play();
      }
      reduceByTraction(p,true);
      executeIntangibility("ESCAPEN",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].ESCAPEN){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"DOWNBOUND" : {
  name : "DOWNBOUND",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : false,
  downed : true,
  init : function(p,input){
    player[p].actionState = "DOWNBOUND";
    player[p].timer = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.jabReset = false;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    actionStates[characterSelections[p]].DOWNBOUND.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNBOUND.interrupt(p,input)){
      if (player[p].timer == 1){
        reduceByTraction(p,true);
      }
      else {
        player[p].phys.cVel.x = 0;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].DOWNBOUND){
      actionStates[characterSelections[p]].DOWNWAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"DOWNWAIT" : {
  name : "DOWNWAIT",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : false,
  downed : true,
  init : function(p,input){
    player[p].actionState = "DOWNWAIT";
    player[p].timer = 0;
    actionStates[characterSelections[p]].DOWNWAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNWAIT.interrupt(p,input)){
      reduceByTraction(p,true);
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].DOWNWAIT){
      actionStates[characterSelections[p]].DOWNWAIT.init(p,input);
      return true;
    }
    else if (player[p].phys.jabReset){
      if (player[p].hit.hitstun <= 0){
        if (input[p][0].lsX*player[p].phys.face < -0.7){
          actionStates[characterSelections[p]].DOWNSTANDB.init(p,input);
          return true;
        }
        else if (input[p][0].lsX*player[p].phys.face > 0.7){
          actionStates[characterSelections[p]].DOWNSTANDF.init(p,input);
          return true;
        }
        else if ((input[p][0].a && !input[p][1].a) || (input[p][0].b && !input[p][1].b)){
          actionStates[characterSelections[p]].DOWNATTACK.init(p,input);
          return true;
        }
        else {
          actionStates[characterSelections[p]].DOWNSTANDN.init(p,input);
          return true;
        }
      }
      else {
        return false;
      }
    }
    else if (input[p][0].lsX*player[p].phys.face < -0.7){
      actionStates[characterSelections[p]].DOWNSTANDB.init(p,input);
      return true;
    }
    else if (input[p][0].lsX*player[p].phys.face > 0.7){
      actionStates[characterSelections[p]].DOWNSTANDF.init(p,input);
      return true;
    }
    else if (input[p][0].lsY > 0.7){
      actionStates[characterSelections[p]].DOWNSTANDN.init(p,input);
      return true;
    }
    else if ((input[p][0].a && !input[p][1].a) || (input[p][0].b && !input[p][1].b)){
      actionStates[characterSelections[p]].DOWNATTACK.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"DOWNDAMAGE" : {
  name : "DOWNDAMAGE",
  canEdgeCancel : true,
  disableTeeter : true,
  airborneState : "DOWNDAMAGE",
  canBeGrabbed : true,
  downed : true,
  landType : 1,
  canGrabLedge : [false,false],
  init : function(p,input){
    player[p].actionState = "DOWNDAMAGE";
    player[p].timer = 0;
    player[p].phys.jabReset = true;
    player[p].phys.grounded = false;
    actionStates[characterSelections[p]].DOWNDAMAGE.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNDAMAGE.interrupt(p,input)){
      if (!player[p].phys.grounded){
        player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      }
      else {
        reduceByTraction(p,true);
      }
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 13){
      if (player[p].phys.grounded){
        if (player[p].hit.hitstun <= 0){
          actionStates[characterSelections[p]].DOWNSTANDN.init(p,input);
        }
        else {
          actionStates[characterSelections[p]].DOWNWAIT.init(p,input);
        }
      }
      else {
        actionStates[characterSelections[p]].FALL.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){

  }
},

"DOWNSTANDN" : {
  name : "DOWNSTANDN",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "DOWNSTANDN";
    player[p].timer = 0;
    actionStates[characterSelections[p]].DOWNSTANDN.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNSTANDN.interrupt(p,input)){
      reduceByTraction(p,true);
      executeIntangibility("DOWNSTANDN",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].DOWNSTANDN){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"DOWNSTANDB" : {
  name : "DOWNSTANDB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p,input){
    player[p].actionState = "DOWNSTANDB";
    player[p].timer = 0;
    actionStates[characterSelections[p]].DOWNSTANDB.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNSTANDB.interrupt(p,input)){
      player[p].phys.cVel.x = actionStates[characterSelections[p]].DOWNSTANDB.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("DOWNSTANDB",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].DOWNSTANDB){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"DOWNSTANDF" : {
  name : "DOWNSTANDF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p,input){
    player[p].actionState = "DOWNSTANDF";
    player[p].timer = 0;
    actionStates[characterSelections[p]].DOWNSTANDF.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNSTANDF.interrupt(p,input)){
      player[p].phys.cVel.x = actionStates[characterSelections[p]].DOWNSTANDF.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("DOWNSTANDF",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].DOWNSTANDF){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"TECHN" : {
  name : "TECHN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "TECHN";
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    actionStates[characterSelections[p]].TECHN.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].TECHN.interrupt(p,input)){
      reduceByTraction(p,true);
      executeIntangibility("TECHN",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].TECHN){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"TECHB" : {
  name : "TECHB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p,input){
    player[p].actionState = "TECHB";
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    actionStates[characterSelections[p]].TECHB.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].TECHB.interrupt(p,input)){
      executeIntangibility("TECHB",p);
      player[p].phys.cVel.x = actionStates[characterSelections[p]].TECHB.setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].TECHB){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"TECHF" : {
  name : "TECHF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p,input){
    player[p].actionState = "TECHF";
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    actionStates[characterSelections[p]].TECHF.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].TECHF.interrupt(p,input)){
      executeIntangibility("TECHF",p);
      player[p].phys.cVel.x = actionStates[characterSelections[p]].TECHF.setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].TECHF){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"SHIELDBREAKFALL" : {
  name : "SHIELDBREAKFALL",
  canPassThrough : false,
  canBeGrabbed : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "SHIELDBREAKFALL";
    player[p].timer = 0;
    actionStates[characterSelections[p]].SHIELDBREAKFALL.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SHIELDBREAKFALL.interrupt(p,input)){
      player[p].phys.intangibleTimer = 1;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].SHIELDBREAKFALL){
      actionStates[characterSelections[p]].SHIELDBREAKFALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    actionStates[characterSelections[p]].SHIELDBREAKDOWNBOUND.init(p,input);
  }
},

"SHIELDBREAKDOWNBOUND" : {
  name : "SHIELDBREAKDOWNBOUND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "SHIELDBREAKDOWNBOUND";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.y = 0;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    actionStates[characterSelections[p]].SHIELDBREAKDOWNBOUND.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SHIELDBREAKDOWNBOUND.interrupt(p,input)){
      player[p].phys.intangibleTimer = 1;
      if (player[p].timer == 1){
        reduceByTraction(p,true);
      }
      else {
        player[p].phys.cVel.x = 0;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].SHIELDBREAKDOWNBOUND){
      actionStates[characterSelections[p]].SHIELDBREAKSTAND.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"SHIELDBREAKSTAND" : {
  name : "SHIELDBREAKSTAND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "SHIELDBREAKSTAND";
    player[p].timer = 0;
    actionStates[characterSelections[p]].SHIELDBREAKSTAND.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SHIELDBREAKSTAND.interrupt(p,input)){
      reduceByTraction(p,true);
      player[p].phys.intangibleTimer = 1;
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].SHIELDBREAKSTAND){
      actionStates[characterSelections[p]].FURAFURA.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"FURAFURA" : {
  name : "FURAFURA",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "FURAFURA";
    player[p].timer = 0;
    player[p].phys.stuckTimer = 490;
    drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(4+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+11+Math.random()*3),player[p].phys.face);
    player[p].furaLoopID = sounds.furaloop.play();
    actionStates[characterSelections[p]].FURAFURA.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].FURAFURA.interrupt(p,input)){
      if (player[p].timer % 100 == 65){
        sounds[actionSounds[characterSelections[p]].FURAFURA[0][1]].play();
      }
      reduceByTraction(p,true);
      if (player[p].timer % 49 == 0){
        drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(3+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+11+Math.random()*3),player[p].phys.face);
      }
      if (player[p].timer % 49 == 20){
        drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(5+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+8+Math.random()*3),player[p].phys.face);
      }
      if (player[p].phys.shieldHP > 30){
        player[p].phys.shieldHP = 30;
      }
      player[p].phys.stuckTimer--;
      if (mashOut(p,input)){
        player[p].phys.stuckTimer -= 3;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].phys.stuckTimer <= 0){
      sounds.furaloop.stop(player[p].furaLoopID);
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].FURAFURA){
      player[p].timer = 1;
      return false;
    }
    else {
      return false;
    }
  }
},

"CAPTUREPULLED" : {
  name : "CAPTUREPULLED",
  canEdgeCancel : false,
  canBeGrabbed : false,
  inGrab : true,
  init : function(p,input){
    player[p].actionState = "CAPTUREPULLED";
    player[p].timer = 0;
    player[p].phys.grounded = true;
    player[p].phys.face = -1*player[player[p].phys.grabbedBy].phys.face;
    player[p].phys.onSurface = [player[player[p].phys.grabbedBy].phys.onSurface[0],player[player[p].phys.grabbedBy].phys.onSurface[1]];
    player[p].phys.stuckTimer = 100+(2*player[p].percent);
    sounds.grabbed.play();
    actionStates[characterSelections[p]].CAPTUREPULLED.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CAPTUREPULLED.interrupt(p,input)){
      if (player[p].timer == 2){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-16.41205*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 2){
      actionStates[characterSelections[p]].CAPTUREWAIT.init(p,input);
      actionStates[characterSelections[p]].CATCHWAIT.init(player[p].phys.grabbedBy,input);
      drawVfx("tech",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+10));
      return true;
    }
    else {
      return false;
    }
  }
},

"CAPTUREWAIT" : {
  name : "CAPTUREWAIT",
  canEdgeCancel : false,
  canBeGrabbed : false,
  inGrab : true,
  init : function(p,input){
    player[p].actionState = "CAPTUREWAIT";
    player[p].timer = 0;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
    actionStates[characterSelections[p]].CAPTUREWAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CAPTUREWAIT.interrupt(p,input)){
      player[p].phys.stuckTimer--;
      if (mashOut(p,input)){
        player[p].phys.stuckTimer -= 6;
        player[p].phys.pos.x += 0.5*Math.sign(Math.random()-0.5);
      } else {
        player[p].phys.pos.x = player[player[p].phys.grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].phys.stuckTimer < 0){
      actionStates[characterSelections[p]].CATCHCUT.init(player[p].phys.grabbedBy,input);
      actionStates[characterSelections[p]].CAPTURECUT.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].CAPTUREWAIT){
      actionStates[characterSelections[p]].CAPTUREWAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"CATCHWAIT" : {
  name : "CATCHWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  inGrab : true,
  init : function(p,input){
    player[p].actionState = "CATCHWAIT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].CATCHWAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CATCHWAIT.interrupt(p,input)){

    }
  },
  interrupt : function(p,input){
    if (input[p][0].a && !input[p][1].a){
      actionStates[characterSelections[p]].CATCHATTACK.init(p,input);
      return true;
    }
    else if ((input[p][0].lsY > 0.7 && input[p][1].lsY <= 0.7)) {
      actionStates[characterSelections[p]].THROWUP.init(p,input);
      return true;
    }
    else if ((input[p][0].lsY < -0.7 && input[p][1].lsY >= -0.7) || input[p][0].csY < -0.7){
      actionStates[characterSelections[p]].THROWDOWN.init(p,input);
      return true;
    }
    else if ((input[p][0].lsX*player[p].phys.face < -0.7 && input[p][1].lsX*player[p].phys.face >= -0.7)) {// || (input[p][0].csX*player[p].phys.face < -0.7 && input[p][1].csX*player[p].phys.face >= -0.7)){
      actionStates[characterSelections[p]].THROWBACK.init(p,input);
      return true;
    }
    else if ((input[p][0].lsX*player[p].phys.face > 0.7 && input[p][1].lsX*player[p].phys.face <= 0.7)) {// || (input[p][0].csX*player[p].phys.face > 0.7 && input[p][1].csX*player[p].phys.face <= 0.7)){
      actionStates[characterSelections[p]].THROWFORWARD.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].CATCHWAIT){
      actionStates[characterSelections[p]].CATCHWAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"CAPTURECUT" : {
  name : "CAPTURECUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  canBeGrabbed : true,
  inGrab : true,
  init : function(p,input){
    player[p].actionState = "CAPTURECUT";
    player[p].timer = 0;
    player[p].phys.grabbedBy = -1
    player[p].phys.cVel.x = -1*player[p].phys.face;
    actionStates[characterSelections[p]].CAPTURECUT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CAPTURECUT.interrupt(p,input)){
      if (player[p].timer == 2){
        player[p].phys.grabTech = false;
      }
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].CAPTURECUT){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"CATCHCUT" : {
  name : "CATCHCUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  canBeGrabbed : true,
  inGrab : true,
  init : function(p,input){
    player[p].actionState = "CATCHCUT";
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.cVel.x = -1*player[p].phys.face;
    actionStates[characterSelections[p]].CATCHCUT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CATCHCUT.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].CATCHCUT){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"CAPTUREDAMAGE" : {
  name : "CAPTUREDAMAGE",
  canEdgeCancel : false,
  canBeGrabbed : false,
  setPositions : [9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.306,8.920,8.516,8.290,8.293,8.410,8.593,8.792,8.959,9.043,9.068],
  inGrab : true,
  init : function(p,input){
    player[p].actionState = "CAPTUREDAMAGE";
    player[p].timer = 0;
    actionStates[characterSelections[p]].CAPTUREDAMAGE.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CAPTUREDAMAGE.interrupt(p,input)){
      player[p].phys.pos.x = player[player[p].phys.grabbedBy].phys.pos.x+(-actionStates[characterSelections[p]].CAPTUREDAMAGE.setPositions[player[p].timer-1]*player[p].phys.face);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].CAPTUREDAMAGE){
      actionStates[characterSelections[p]].CAPTUREWAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},


"WALLDAMAGE" : {
  name : "WALLDAMAGE",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  canBeGrabbed : true,
  headBonk : true,
  landType : 2,
  init : function(p,input){
    player[p].actionState = "WALLDAMAGE";
    player[p].timer = 0;
    sounds.bounce.play();
    actionStates[characterSelections[p]].WALLDAMAGE.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (player[p].hit.hitstun % 10 == 0){
      drawVfx("flyingDust",player[p].phys.pos);
    }
    if (player[p].timer == 2){
      player[p].phys.kVel.y *= 0.8;
      player[p].phys.kVel.x *= -0.8;
      player[p].phys.kDec.x *= -1;
    }
    if (!actionStates[characterSelections[p]].WALLDAMAGE.interrupt(p,input)){
      player[p].hit.hitstun--;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].WALLDAMAGE){
      actionStates[characterSelections[p]].DAMAGEFALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"WALLTECH" : {
  name : "WALLTECH",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p,input){
    player[p].actionState = "WALLTECH";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    if (player[p].phys.face == 1){
      drawVfx("tech",player[p].phys.ECBp[3]);
    }
    else {
      drawVfx("tech",player[p].phys.ECBp[1]);
    }
    // draw tech rotated
    actionStates[characterSelections[p]].WALLTECH.main(p,input);
  },
  main : function(p,input){
    if (player[p].timer < 1){
      player[p].timer+= 0.15;
      if (player[p].timer > 1){
        player[p].timer = 1;
      }
    }
    else {
      player[p].timer++;
    }
    if (!actionStates[characterSelections[p]].WALLTECH.interrupt(p,input)){
      if (player[p].timer == 2){
        sounds.walljump.play();
      }
      if (player[p].timer > 0.89 && player[p].timer < 0.91){
        player[p].phys.cVel.x = player[p].phys.face * 0.5;
      }
      if (player[p].timer >= 1){
        fastfall(p,input);
        airDrift(p,input);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 1){
      var a = checkForAerials(p,input);
      var b = checkForSpecials(p,input);
      if (a[0]){
        actionStates[characterSelections[p]][a[1]].init(p,input);
        return true;
      }
      else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
        actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
        return true;
      }
      else if (checkForDoubleJump(p,input)){
        if (input[p][0].lsX*player[p].phys.face < -0.3){
          actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
        }
        else {
          actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
        }
        return true;
      }
      else if (b[0]){
        actionStates[characterSelections[p]][b[1]].init(p,input);
        return true;
      }
      else if (player[p].timer > framesData[characterSelections[p]].WALLTECH){
        actionStates[characterSelections[p]].FALL.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
},

"WALLJUMP" : {
  name : "WALLJUMP",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p,input){
    player[p].actionState = "WALLJUMP";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    player[p].phys.cVel.x = player[p].phys.face * player[p].charAttributes.wallJumpVelX;
    player[p].phys.cVel.y = player[p].charAttributes.wallJumpVelY*(Math.pow(0.97,player[p].phys.wallJumpCount));
    player[p].phys.wallJumpCount++;
    player[p].hit.hitlag = 5;
    player[p].hit.knockback = 0;
    if (player[p].phys.face == 1){
      drawVfx("tech",player[p].phys.ECBp[3]);
    }
    else {
      drawVfx("tech",player[p].phys.ECBp[1]);
    }
    // draw tech rotated
    actionStates[characterSelections[p]].WALLJUMP.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (player[p].timer == 2){
      sounds.walljump.play();
    }
    if (!actionStates[characterSelections[p]].WALLJUMP.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 1){
      var a = checkForAerials(p,input);
      var b = checkForSpecials(p,input);
      if (a[0]){
        actionStates[characterSelections[p]][a[1]].init(p,input);
        return true;
      }
      else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
        actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
        return true;
      }
      else if (checkForDoubleJump(p,input)){
        if (input[p][0].lsX*player[p].phys.face < -0.3){
          actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
        }
        else {
          actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
        }
        return true;
      }
      else if (b[0]){
        actionStates[characterSelections[p]][b[1]].init(p,input);
        return true;
      }
      else if (player[p].timer > framesData[characterSelections[p]].WALLJUMP){
        actionStates[characterSelections[p]].FALL.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
},

"WALLTECHJUMP" : {
  name : "WALLTECHJUMP",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p,input){
    player[p].actionState = "WALLTECHJUMP";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    if (player[p].phys.face == 1){
      drawVfx("tech",player[p].phys.ECBp[3]);
    }
    else {
      drawVfx("tech",player[p].phys.ECBp[1]);
    }
    // draw tech rotated
    actionStates[characterSelections[p]].WALLTECHJUMP.main(p,input);
  },
  main : function(p,input){
    if (player[p].timer < 1){
      player[p].timer+= 0.15;
      if (player[p].timer > 1){
        player[p].timer = 1;
      }
    }
    else {
      player[p].timer++;
    }
    if (player[p].timer == 2){
      sounds.walljump.play();
    }
    if (!actionStates[characterSelections[p]].WALLTECH.interrupt(p,input)){
      if (player[p].timer > 0.89 && player[p].timer < 0.91){
        player[p].phys.cVel.x = player[p].phys.face * player[p].charAttributes.wallJumpVelX;
        player[p].phys.cVel.y = player[p].charAttributes.wallJumpVelY;
      }
      if (player[p].timer >= 1){
        fastfall(p,input);
        airDrift(p,input);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 1){
      var a = checkForAerials(p,input);
      var b = checkForSpecials(p,input);
      if (a[0]){
        actionStates[characterSelections[p]][a[1]].init(p,input);
        return true;
      }
      else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
        actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
        return true;
      }
      else if (checkForDoubleJump(p,input)){
        if (input[p][0].lsX*player[p].phys.face < -0.3){
          actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
        }
        else {
          actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
        }
        return true;
      }
      else if (b[0]){
        actionStates[characterSelections[p]][b[1]].init(p,input);
        return true;
      }
      else if (player[p].timer > framesData[characterSelections[p]].WALLJUMP){
        actionStates[characterSelections[p]].FALL.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
},

"OTTOTTO" : {
  name : "OTTOTTO",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "OTTOTTO";
    player[p].timer = 1;
    player[p].phys.cVel.x = 0;
    actionStates[characterSelections[p]].OTTOTTO.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].OTTOTTO.interrupt(p,input)){

    }
  },
  interrupt : function(p,input){
    var b = checkForSpecials(p,input);
    var t = checkForTilts(p,input);
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if (player[p].timer > framesData[characterSelections[p]].OTTOTTO){
      actionStates[characterSelections[p]].OTTOTTOWAIT.init(p,input);
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p,input);
      return true;
    }
    else if (checkForSquat(p,input)){
      actionStates[characterSelections[p]].SQUAT.init(p,input);
      return true;
    }
    else if (checkForDash(p,input)){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else if (checkForSmashTurn(p,input)){
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
      return true;
    }
    else if (checkForTiltTurn(p,input)){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
      actionStates[characterSelections[p]].TILTTURN.init(p,input);
      return true;
    }
    else if (Math.abs(input[p][0].lsX) > 0.6){
      actionStates[characterSelections[p]].WALK.init(p,true,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"OTTOTTOWAIT" : {
  name : "OTTOTTOWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "OTTOTTOWAIT";
    player[p].timer = 1;
    if (characterSelections[p] != 1){
      sounds[actionSounds[characterSelections[p]].OTTOTTOWAIT[0][1]].play();
    }
    player[p].phys.cVel.x = 0;
    actionStates[characterSelections[p]].OTTOTTOWAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (player[p].timer > framesData[characterSelections[p]].OTTOTTOWAIT){
      player[p].timer = 0
    }
    if (!actionStates[characterSelections[p]].OTTOTTOWAIT.interrupt(p,input)){

    }
  },
  interrupt : function(p,input){
    var b = checkForSpecials(p,input);
    var t = checkForTilts(p,input);
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p,input);
      return true;
    }
    else if (checkForSquat(p,input)){
      actionStates[characterSelections[p]].SQUAT.init(p,input);
      return true;
    }
    else if (checkForDash(p,input)){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else if (checkForSmashTurn(p,input)){
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
      return true;
    }
    else if (checkForTiltTurn(p,input)){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
      actionStates[characterSelections[p]].TILTTURN.init(p,input);
      return true;
    }
    else if (Math.abs(input[p][0].lsX) > 0.6){
      actionStates[characterSelections[p]].WALK.init(p,true,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"MISSFOOT" : {
  name : "MISSFOOT",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p,input){
    player[p].actionState = "MISSFOOT";
    player[p].timer = 0;
    player[p].hit.hitstun = 0;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].MISSFOOT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].MISSFOOT.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 26){
      actionStates[characterSelections[p]].DAMAGEFALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"FURASLEEPSTART" : {
  name : "FURASLEEPSTART",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "FURASLEEPSTART";
    player[p].timer = 0;
    player[p].phys.stuckTimer = 95+2*Math.floor(player[p].percent);
    sounds.fireweakhit.play();
    actionStates[characterSelections[p]].FURASLEEPSTART.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].FURASLEEPSTART.interrupt(p,input)){
      player[p].phys.stuckTimer--;
      reduceByTraction(p,true);
      var originalColour = palettes[pPal[p]][0];
      originalColour = originalColour.substr(4,originalColour.length-5);
      var colourArray = originalColour.split(",");
      //rgb(207, 45, 190)
      var part = player[p].timer%30;
      if (part < 25){
        player[p].colourOverlayBool = true;
        if (part < 13){
          var newCol = blendColours(colourArray,[207,45,190],Math.min(1,part/12));
        }
        else {
          var newCol = blendColours(colourArray,[207,45,190],Math.max(0,1-(part-12/12)));
        }
        player[p].colourOverlay = "rgb("+newCol[0]+","+newCol[1]+","+newCol[2]+")";
      }
      else {
        player[p].colourOverlayBool = false;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].phys.stuckTimer <= 0){
      player[p].colourOverlayBool = false;
      actionStates[characterSelections[p]].FURASLEEPEND.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].FURASLEEPSTART){
      player[p].colourOverlayBool = false;
      actionStates[characterSelections[p]].FURASLEEPLOOP.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"FURASLEEPLOOP" : {
  name : "FURASLEEPLOOP",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "FURASLEEPLOOP";
    player[p].timer = 0;
    actionStates[characterSelections[p]].FURASLEEPLOOP.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].FURASLEEPLOOP.interrupt(p,input)){
      player[p].phys.stuckTimer--;
      var originalColour = palettes[pPal[p]][0];
      originalColour = originalColour.substr(4,originalColour.length-5);
      var colourArray = originalColour.split(",");
      //rgb(207, 45, 190)
      var part = player[p].timer%30;
      if (part < 25){
        player[p].colourOverlayBool = true;
        if (part < 13){
          var newCol = blendColours(colourArray,[207,45,190],Math.min(1,part/12));
        }
        else {
          var newCol = blendColours(colourArray,[207,45,190],Math.max(0,1-(part-12/12)));
        }
        player[p].colourOverlay = "rgb("+newCol[0]+","+newCol[1]+","+newCol[2]+")";
      }
      else {
        player[p].colourOverlayBool = false;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].phys.stuckTimer <= 0){
      player[p].colourOverlayBool = false;
      actionStates[characterSelections[p]].FURASLEEPEND.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].FURASLEEPLOOP){
      player[p].timer = 1;
      player[p].colourOverlayBool = false;
      return false;
    }
    else {
      return false;
    }
  }
},

"FURASLEEPEND" : {
  name : "FURASLEEPEND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "FURASLEEPEND";
    player[p].timer = 0;
    actionStates[characterSelections[p]].FURASLEEPEND.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].FURASLEEPEND.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].FURASLEEPEND){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"STOPCEIL" : {
  name : "STOPCEIL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "STOPCEIL";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].STOPCEIL.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].STOPCEIL.interrupt(p,input)){
      if (player[p].timer == 2){
        player[p].phys.kVel.y *= -0.8;
        player[p].phys.kVel.x *= 0.8;
        player[p].phys.kDec.y *= -1
      }
      if (player[p].hit.hitstun > 0){
        if (player[p].hit.hitstun % 10 == 0){
          drawVfx("flyingDust",player[p].phys.pos);
        }
        player[p].hit.hitstun--;
        player[p].phys.cVel.y -= player[p].charAttributes.gravity;
        if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
          player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
        }
      }
      else {
        airDrift(p,input);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 5 && player[p].hit.hitstun <= 0){
      actionStates[characterSelections[p]].FALL.init(p,input);
    }
    else if (player[p].timer > framesData[characterSelections[p]].STOPCEIL){
      if (player[p].hit.hitstun <= 0){
        actionStates[characterSelections[p]].DAMAGEFALL.init(p,input);
        return true;
      }
      else {
        player[p].timer = framesData[characterSelections[p]].STOPCEIL;
        return false;
      }
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    if (player[p].hit.hitstun > 0){
      if (player[p].phys.techTimer > 0){
        if (input[p][0].lsX*player[p].phys.face > 0.5){
          actionStates[characterSelections[p]].TECHF.init(p,input);
        }
        else if (input[p][0].lsX*player[p].phys.face < -0.5){
          actionStates[characterSelections[p]].TECHB.init(p,input);
        }
        else {
          actionStates[characterSelections[p]].TECHN.init(p,input);
        }
      }
      else {
        actionStates[characterSelections[p]].DOWNBOUND.init(p,input);
      }
    }
    else {
      actionStates[characterSelections[p]].LANDING.init(p,input);
    }
  }
},

"TECHU" : {
  name : "TECHU",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p,input){
    player[p].actionState = "TECHU";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    drawVfx("tech",player[p].phys.ECBp[2]);
    sounds.tech.play();
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].TECHU.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].TECHU.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].TECHU){
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
},

"SLEEP" : {
  name : "SLEEP",
  canBeGrabbed : false,
  init : function(p,input){
    player[p].actionState = "SLEEP";
    player[p].timer = 0;
    player[p].hit.hitstun = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.pos.x = 300;
    actionStates[characterSelections[p]].SLEEP.main(p,input);
  },
  main : function(p,input){
    player[p].phys.outOfCameraTimer = 0;
  },
  interrupt : function(p,input){
    return false;
  }
},

"ENTRANCE" : {
  name : "ENTRANCE",
  canBeGrabbed : false,
  init : function(p,input){
    player[p].actionState = "ENTRANCE";
    player[p].timer = 0;
    player[p].phys.grounded = false;
    actionStates[characterSelections[p]].ENTRANCE.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    actionStates[characterSelections[p]].ENTRANCE.interrupt(p,input);
  },
  interrupt : function(p,input){
    if (player[p].timer > 60){
      actionStates[characterSelections[p]].FALL.init(p,input);
    }
  }
}
}
