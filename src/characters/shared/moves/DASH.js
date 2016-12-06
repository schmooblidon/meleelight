import {checkForSmashTurn, checkForJump, reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import { characterSelections, player} from "main/main";
import {sounds} from "main/sfx";

import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "DASH",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DASH";
    player[p].timer = 0;
    sounds.dash.play();
    actionStates[characterSelections[p]].DASH.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DASH.interrupt(p)){
      if (player[p].timer === 2){
        player[p].phys.cVel.x += player[p].charAttributes.dInitV * player[p].phys.face;
        if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.dMaxV){
          player[p].phys.cVel.x = player[p].charAttributes.dMaxV * player[p].phys.face;
        }
      }
      if (player[p].timer === 4){
        drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
      }
      if (player[p].timer > 1){
        if (Math.abs(player[p].inputs.lsX[0]) < 0.3){
          reduceByTraction(p,false);
        }
        else {
          const tempMax = player[p].inputs.lsX[0] * player[p].charAttributes.dMaxV;
          //var tempAcc = (player[p].charAttributes.dAcc - (1 - Math.abs(player[p].inputs.lsX[0]))*(player[p].charAttributes.dAcc))*player[p].phys.face;
          const tempAcc = player[p].inputs.lsX[0] * player[p].charAttributes.dAccA;

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
  interrupt : function(p){
    const j = checkForJump(p);
    if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      player[p].phys.cVel.x *= 0.25;
      actionStates[characterSelections[p]].GUARDON.init(p);
      return true;
    }
    else if (player[p].inputs.lA[0] > 0 || player[p].inputs.rA[0] > 0){
      player[p].phys.cVel.x *= 0.25;
      actionStates[characterSelections[p]].GUARDON.init(p);
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      if (player[p].timer < 4 && player[p].inputs.lsX[0]*player[p].phys.face >= 0.8){
        player[p].phys.cVel.x *= 0.25;
        actionStates[characterSelections[p]].FORWARDSMASH.init(p);
      }
      else if (player[p].inputs.lA[0] > 0 || player[p].inputs.rA[0] > 0){
        actionStates[characterSelections[p]].GRAB.init(p);
      }
      else {
        actionStates[characterSelections[p]].ATTACKDASH.init(p);
      }
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lsX[0]) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lsX[0]);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p);
      }
      return true;
    }
    else if (player[p].timer > 4 && checkForSmashTurn(p)){
      player[p].phys.cVel.x *= 0.25;
      actionStates[characterSelections[p]].SMASHTURN.init(p);
      return true;
    }
    else if (player[p].timer > player[p].charAttributes.dashFrameMax && player[p].inputs.lsX[0] * player[p].phys.face > 0.79 && player[p].inputs.lsX[2] * player[p].phys.face < 0.3){
      actionStates[characterSelections[p]].DASH.init(p);
      return true;
    }
    else if (player[p].timer > player[p].charAttributes.dashFrameMin && player[p].inputs.lsX[0] * player[p].phys.face > 0.62){
      actionStates[characterSelections[p]].RUN.init(p);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].DASH){
      actionStates[characterSelections[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
