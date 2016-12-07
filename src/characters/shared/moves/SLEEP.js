import {characterSelections, player} from "main/main";
import {actionStates} from "physics/actionStateShortcuts";
export default {
  name : "SLEEP",
  canBeGrabbed : false,
  init : function(p,input){
    player[p].actionState = "SLEEP";
    player[p].timer = 0;
    player[p].hit.hitstun = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.pos.x = 300;
    actionStates[characterSelections[p]].SLEEP.main(p,input);
  },
  main : function(p,input){
    player[p].phys.outOfCameraTimer = 0;
  },
  interrupt : function(p,input){
    return false;
  }
};

