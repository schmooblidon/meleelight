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
  init : function(p,input){
    player[p].actionState = "DASH";
    player[p].timer = 0;
    sounds.dash.play();
    actionStates[characterSelections[p]].DASH.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DASH.interrupt(p,input)){
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
        if (Math.abs(input[p][0].lsX) < 0.3){
          reduceByTraction(p,false);
        }
        else {
          const tempMax = input[p][0].lsX * player[p].charAttributes.dMaxV;
          //var tempAcc = (player[p].charAttributes.dAcc - (1 - Math.abs(input[p][0].lsX))*(player[p].charAttributes.dAcc))*player[p].phys.face;
          const tempAcc = input[p][0].lsX * player[p].charAttributes.dAccA;

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
    const j = checkForJump(p,input);
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
    else if (input[p][0].du) {
      actionStates[characterSelections[p]].APPEAL.init(p,input);
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
};
