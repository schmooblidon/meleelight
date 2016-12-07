import {characterSelections, player} from "main/main";
import {actionStates, turnOffHitboxes} from "physics/actionStateShortcuts";

import {framesData} from 'main/characters';
export default {
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
    if (input[p].a[0] && !input[p].a[1]){
      actionStates[characterSelections[p]].CATCHATTACK.init(p,input);
      return true;
    }
    else if ((input[p].lsY[0] > 0.7 && input[p].lsY[1] <= 0.7) || (input[p].csY[0] > 0.7 && input[p].csY[1] <= 0.7)){
      actionStates[characterSelections[p]].THROWUP.init(p,input);
      return true;
    }
    else if ((input[p].lsY[0] < -0.7 && input[p].lsY[1] >= -0.7) || input[p].csY[0] < -0.7){
      actionStates[characterSelections[p]].THROWDOWN.init(p,input);
      return true;
    }
    else if ((input[p].lsX[0]*player[p].phys.face < -0.7 && input[p].lsX[1]*player[p].phys.face >= -0.7) || (input[p].csX[0]*player[p].phys.face < -0.7 && input[p].csX[1]*player[p].phys.face >= -0.7)){
      actionStates[characterSelections[p]].THROWBACK.init(p,input);
      return true;
    }
    else if ((input[p].lsX[0]*player[p].phys.face > 0.7 && input[p].lsX[1]*player[p].phys.face <= 0.7) || (input[p].csX[0]*player[p].phys.face > 0.7 && input[p].csX[1]*player[p].phys.face <= 0.7)){
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
};
