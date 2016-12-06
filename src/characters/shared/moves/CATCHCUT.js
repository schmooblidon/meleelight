import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";

import {framesData} from 'main/characters';
export default {
  name : "CATCHCUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  canBeGrabbed : true,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CATCHCUT";
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.cVel.x = -1*player[p].phys.face;
    actionStates[characterSelections[p]].CATCHCUT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CATCHCUT.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].CATCHCUT){
      actionStates[characterSelections[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
