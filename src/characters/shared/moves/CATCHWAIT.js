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
    if (input[p][0].a && !input[p][1].a){
      actionStates[characterSelections[p]].CATCHATTACK.init(p,input);
      return true;
    }
    else if ((input[p][0].lsY > 0.7 && input[p][1].lsY <= 0.7) || (input[p][0].csY > 0.7 && input[p][1].csY <= 0.7)){
      actionStates[characterSelections[p]].THROWUP.init(p,input);
      return true;
    }
    else if ((input[p][0].lsY < -0.7 && input[p][1].lsY >= -0.7) || input[p][0].csY < -0.7){
      actionStates[characterSelections[p]].THROWDOWN.init(p,input);
      return true;
    }
    else if ((input[p][0].lsX*player[p].phys.face < -0.7 && input[p][1].lsX*player[p].phys.face >= -0.7) || (input[p][0].csX*player[p].phys.face < -0.7 && input[p][1].csX*player[p].phys.face >= -0.7)){
      actionStates[characterSelections[p]].THROWBACK.init(p,input);
      return true;
    }
    else if ((input[p][0].lsX*player[p].phys.face > 0.7 && input[p][1].lsX*player[p].phys.face <= 0.7) || (input[p][0].csX*player[p].phys.face > 0.7 && input[p][1].csX*player[p].phys.face <= 0.7)){
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
