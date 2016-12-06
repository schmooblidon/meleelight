import {checkForAerials, tiltTurnDashBuffer, checkForTiltTurn, checkForSmashTurn, checkForDash, checkForSquat,
    checkForJump
    , checkForSmashes
    , checkForTilts
    , checkForSpecials
    , reduceByTraction
    , actionStates
    , turnOffHitboxes
} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from "main/characters";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "DAMAGEN2",
  canEdgeCancel : true,
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  missfoot : true,
  init : function(p){
    player[p].actionState = "DAMAGEN2";
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.grabbedBy = -1;
    player[p].phys.fastfalled = false;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    player[p].colourOverlayBool = false;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].DAMAGEN2.main(p);
  },
  main : function(p){
    if (player[p].inCSS){
      player[p].timer+= 0.7;
    }
    else {
      player[p].timer++;
    }
    if (!actionStates[characterSelections[p]].DAMAGEN2.interrupt(p)){
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
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].DAMAGEN2){
      if (player[p].hit.hitstun > 0){
        player[p].timer--;
        return false;
      }
      else {
        if (player[p].phys.grounded || player[p].inCSS){
          actionStates[characterSelections[p]].WAIT.init(p);
        }
        else {
          actionStates[characterSelections[p]].FALL.init(p);
        }
        return true;
      }
    }
    else if (player[p].hit.hitstun <= 0 && !player[p].inCSS){
      if (player[p].phys.grounded){
        var b = checkForSpecials(p);
        var t = checkForTilts(p);
        var s = checkForSmashes(p);
        var j = checkForJump(p);
        if (j[0]){
          actionStates[characterSelections[p]].KNEEBEND.init(p,j[1]);
          return true;
        }
        else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
          actionStates[characterSelections[p]].GUARDON.init(p);
          return true;
        }
        else if (player[p].inputs.lA[0] > 0 || player[p].inputs.rA[0] > 0){
          actionStates[characterSelections[p]].GUARDON.init(p);
          return true;
        }
        else if (b[0]){
          actionStates[characterSelections[p]][b[1]].init(p);
          return true;
        }
        else if (s[0]){
          actionStates[characterSelections[p]][s[1]].init(p);
          return true;
        }
        else if (t[0]){
          actionStates[characterSelections[p]][t[1]].init(p);
          return true;
        }
        else if (checkForSquat(p)){
          actionStates[characterSelections[p]].SQUAT.init(p);
          return true;
        }
        else if (checkForDash(p)){
          actionStates[characterSelections[p]].DASH.init(p);
          return true;
        }
        else if (checkForSmashTurn(p)){
          actionStates[characterSelections[p]].SMASHTURN.init(p);
          return true;
        }
        else if (checkForTiltTurn(p)){
          player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
          actionStates[characterSelections[p]].TILTTURN.init(p);
          return true;
        }
        else if (Math.abs(player[p].inputs.lsX[0]) > 0.3){
          actionStates[characterSelections[p]].WALK.init(p,true);
          return true;
        }
        else {
          return false;
        }
      }
      else {
        var a = checkForAerials(p);
        var b = checkForSpecials(p);
        if (a[0]){
          actionStates[characterSelections[p]][a[1]].init(p);
          return true;
        }
        else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
          actionStates[characterSelections[p]].ESCAPEAIR.init(p);
          return true;
        }
        else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lsY[0] > 0.7 && player[p].inputs.lsY[1] <= 0.7)) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
          if (player[p].inputs.lsX[0]*player[p].phys.face < -0.3){
            actionStates[characterSelections[p]].JUMPAERIALB.init(p);
          }
          else {
            actionStates[characterSelections[p]].JUMPAERIALF.init(p);
          }
          return true;
        }
        else if (b[0]){
          actionStates[characterSelections[p]][b[1]].init(p);
          return true;
        }
        else if ((player[p].inputs.lsX[0] > 0.7 && player[p].inputs.lsX[1] < 0.7) || (player[p].inputs.lsX[0] < -0.7 && player[p].inputs.lsX[1] > -0.7) || (player[p].inputs.lsY[0] > 0.7 && player[p].inputs.lsY[1] < 0.7) || (player[p].inputs.lsY[0] < -0.7 && player[p].inputs.lsY[1] > -0.7)){
          actionStates[characterSelections[p]].FALL.init(p);
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
  land : function(p){
    if (player[p].hit.hitstun <= 0){
      actionStates[characterSelections[p]].LANDING.init(p);
    }
  }
};

