import {characterSelections, player} from "main/main";
import {actionStates} from "physics/actionStateShortcuts";

import {framesData} from 'main/characters';
export default {
  name : "CLIFFWAIT",
  canGrabLedge : false,
  canBeGrabbed : false,
  wallJumpAble : false,
  posOffset : [],
  landType : 0,
  init : function(p){
    player[p].actionState = "CLIFFWAIT";
    player[p].timer = 0;
    actionStates[characterSelections[p]].CLIFFWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CLIFFWAIT.interrupt(p)){
      player[p].phys.ledgeHangTimer++;
    }
  },
  interrupt : function(p){
    if ((player[p].inputs.lsX[0]*player[p].phys.face < -0.2 && player[p].inputs.lsX[1]*player[p].phys.face >= -0.2) || (player[p].inputs.lsY[0] < -0.2 && player[p].inputs.lsY[1] >= -0.2) || (player[p].inputs.csX[0]*player[p].phys.face < -0.2 && player[p].inputs.csX[1]*player[p].phys.face >= -0.2) || (player[p].inputs.csY[0] < -0.2 && player[p].inputs.csY[1] >= -0.2)){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      actionStates[characterSelections[p]].FALL.init(p,true);
      return true;
    }
    else if ((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lsY[0] > 0.65 && player[p].inputs.lsY[1] <= 0.65)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFJUMPQUICK.init(p);
      }
      else {
        actionStates[characterSelections[p]].CLIFFJUMPSLOW.init(p);
      }
      return true;
    }
    else if ((player[p].inputs.lsX[0]*player[p].phys.face > 0.2 && player[p].inputs.lsX[1]*player[p].phys.face <= 0.2) || (player[p].inputs.lsY[0] > 0.2 && player[p].inputs.lsY[1] <= 0.2)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFGETUPQUICK.init(p);
      }
      else {
        actionStates[characterSelections[p]].CLIFFGETUPSLOW.init(p);
      }
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1]) || (player[p].inputs.csY[0] > 0.65 && player[p].inputs.csY[1] <= 0.65)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFATTACKQUICK.init(p);
      }
      else {
        actionStates[characterSelections[p]].CLIFFATTACKSLOW.init(p);
      }
      return true;
    }
    else if ((player[p].inputs.lA[0] > 0.3 && player[p].inputs.lA[1] <= 0.3) || (player[p].inputs.rA[0] > 0.3 && player[p].inputs.rA[1] <= 0.3) || (player[p].inputs.csX[0]*player[p].phys.face > 0.8 && player[p].inputs.csX[1]*player[p].phys.face <= 0.8)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFESCAPEQUICK.init(p);
      }
      else {
        actionStates[characterSelections[p]].CLIFFESCAPESLOW.init(p);
      }
      return true;
    }
    else if (player[p].phys.ledgeHangTimer > 600){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      actionStates[characterSelections[p]].DAMAGEFALL.init(p);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].CLIFFWAIT){
      actionStates[characterSelections[p]].CLIFFWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

