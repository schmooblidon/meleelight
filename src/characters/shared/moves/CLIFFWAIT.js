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
    if ((input[p].lsX[0]*player[p].phys.face < -0.2 && input[p].lsX[1]*player[p].phys.face >= -0.2) || (input[p].lsY[0] < -0.2 && input[p].lsY[1] >= -0.2) || (input[p].csX[0]*player[p].phys.face < -0.2 && input[p].csX[1]*player[p].phys.face >= -0.2) || (input[p].csY[0] < -0.2 && input[p].csY[1] >= -0.2)){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      actionStates[characterSelections[p]].FALL.init(p,input,true);
      return true;
    }
    else if ((input[p].x[0] && !input[p].x[1]) || (input[p].y[0] && !input[p].y[1]) || (input[p].lsY[0] > 0.65 && input[p].lsY[1] <= 0.65)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFJUMPQUICK.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].CLIFFJUMPSLOW.init(p,input);
      }
      return true;
    }
    else if ((input[p].lsX[0]*player[p].phys.face > 0.2 && input[p].lsX[1]*player[p].phys.face <= 0.2) || (input[p].lsY[0] > 0.2 && input[p].lsY[1] <= 0.2)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFGETUPQUICK.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].CLIFFGETUPSLOW.init(p,input);
      }
      return true;
    }
    else if ((input[p].a[0] && !input[p].a[1]) || (input[p].b[0] && !input[p].b[1]) || (input[p].csY[0] > 0.65 && input[p].csY[1] <= 0.65)){
      if (player[p].percent < 100){
        actionStates[characterSelections[p]].CLIFFATTACKQUICK.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].CLIFFATTACKSLOW.init(p,input);
      }
      return true;
    }
    else if ((input[p].lA[0] > 0.3 && input[p].lA[1] <= 0.3) || (input[p].rA[0] > 0.3 && input[p].rA[1] <= 0.3) || (input[p].csX[0]*player[p].phys.face > 0.8 && input[p].csX[1]*player[p].phys.face <= 0.8)){
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
};

