import {characterSelections, player} from "main/main";
import {actionStates, turnOffHitboxes} from "physics/actionStateShortcuts";

import {framesData} from 'main/characters';
export default {
  name : "CATCHWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CATCHWAIT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].CATCHWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CATCHWAIT.interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      actionStates[characterSelections[p]].CATCHATTACK.init(p);
      return true;
    }
    else if ((player[p].inputs.lsY[0] > 0.7 && player[p].inputs.lsY[1] <= 0.7) || (player[p].inputs.csY[0] > 0.7 && player[p].inputs.csY[1] <= 0.7)){
      actionStates[characterSelections[p]].THROWUP.init(p);
      return true;
    }
    else if ((player[p].inputs.lsY[0] < -0.7 && player[p].inputs.lsY[1] >= -0.7) || player[p].inputs.csY[0] < -0.7){
      actionStates[characterSelections[p]].THROWDOWN.init(p);
      return true;
    }
    else if ((player[p].inputs.lsX[0]*player[p].phys.face < -0.7 && player[p].inputs.lsX[1]*player[p].phys.face >= -0.7) || (player[p].inputs.csX[0]*player[p].phys.face < -0.7 && player[p].inputs.csX[1]*player[p].phys.face >= -0.7)){
      actionStates[characterSelections[p]].THROWBACK.init(p);
      return true;
    }
    else if ((player[p].inputs.lsX[0]*player[p].phys.face > 0.7 && player[p].inputs.lsX[1]*player[p].phys.face <= 0.7) || (player[p].inputs.csX[0]*player[p].phys.face > 0.7 && player[p].inputs.csX[1]*player[p].phys.face <= 0.7)){
      actionStates[characterSelections[p]].THROWFORWARD.init(p);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].CATCHWAIT){
      actionStates[characterSelections[p]].CATCHWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
