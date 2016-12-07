import {executeIntangibility, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";

import {framesData} from 'main/characters';
export default {
  name : "DOWNSTANDF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p,input){
    player[p].actionState = "DOWNSTANDF";
    player[p].timer = 0;
    actionStates[characterSelections[p]].DOWNSTANDF.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNSTANDF.interrupt(p,input)){
      player[p].phys.cVel.x = actionStates[characterSelections[p]].DOWNSTANDF.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("DOWNSTANDF",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].DOWNSTANDF){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

