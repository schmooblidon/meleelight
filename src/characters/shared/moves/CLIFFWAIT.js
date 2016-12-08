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
};

