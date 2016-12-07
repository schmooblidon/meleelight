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
  init : function(p,input){
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
        else if (input[p].l[0] || input[p].r[0]){
          actionStates[characterSelections[p]].GUARDON.init(p,input);
          return true;
        }
        else if (input[p].lA[0] > 0 || input[p].rA[0] > 0){
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
        else if (Math.abs(input[p].lsX[0]) > 0.3){
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
        else if ((input[p].l[0] && !input[p].l[1]) || (input[p].r[0] && !input[p].r[1])){
          actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
          return true;
        }
        else if (((input[p].x[0] && !input[p].x[1]) || (input[p].y[0] && !input[p].y[1]) || (input[p].lsY[0] > 0.7 && input[p].lsY[1] <= 0.7)) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
          if (input[p].lsX[0]*player[p].phys.face < -0.3){
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
        else if ((input[p].lsX[0] > 0.7 && input[p].lsX[1] < 0.7) || (input[p].lsX[0] < -0.7 && input[p].lsX[1] > -0.7) || (input[p].lsY[0] > 0.7 && input[p].lsY[1] < 0.7) || (input[p].lsY[0] < -0.7 && input[p].lsY[1] > -0.7)){
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
};

