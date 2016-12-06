import {executeIntangibility, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";

import {framesData} from 'main/characters';
export default {
  name : "DOWNSTANDB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p){
    player[p].actionState = "DOWNSTANDB";
    player[p].timer = 0;
    actionStates[characterSelections[p]].DOWNSTANDB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNSTANDB.interrupt(p)){
      player[p].phys.cVel.x = actionStates[characterSelections[p]].DOWNSTANDB.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("DOWNSTANDB",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].DOWNSTANDB){
      actionStates[characterSelections[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

