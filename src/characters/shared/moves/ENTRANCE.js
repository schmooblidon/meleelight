import {characterSelections, player} from "main/main";
import {actionStates} from "physics/actionStateShortcuts";
export default {
  name : "ENTRANCE",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = "ENTRANCE";
    player[p].timer = 0;
    player[p].phys.grounded = false;
    actionStates[characterSelections[p]].ENTRANCE.main(p);
  },
  main : function(p){
    player[p].timer++;
    actionStates[characterSelections[p]].ENTRANCE.interrupt(p);
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      actionStates[characterSelections[p]].FALL.init(p);
    }
  }
};

