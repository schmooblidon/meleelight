import {checkForJump, reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "RUNTURN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "RUNTURN";
    player[p].timer = 0;
    actionStates[characterSelections[p]].RUNTURN.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].RUNTURN.interrupt(p,input)){
      if (player[p].timer == player[p].charAttributes.runTurnBreakPoint+1){
        player[p].phys.face *= -1;
      }

      if (player[p].timer <= player[p].charAttributes.runTurnBreakPoint && input[p].lsX[0] * player[p].phys.face < -0.3){
        var tempAcc = (player[p].charAttributes.dAccA - (1 - Math.abs(input[p].lsX[0]))*(player[p].charAttributes.dAccA))*player[p].phys.face;
        player[p].phys.cVel.x -= tempAcc;
      }
      else if (player[p].timer > player[p].charAttributes.runTurnBreakPoint && input[p].lsX[0] * player[p].phys.face > 0.3){
        var tempAcc = (player[p].charAttributes.dAccA - (1 - Math.abs(input[p].lsX[0]))*(player[p].charAttributes.dAccA))*player[p].phys.face;
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
      if(input[p].lsX[0] * player[p].phys.face > 0.6){
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
};

