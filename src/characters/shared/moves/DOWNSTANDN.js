import {executeIntangibility, reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "DOWNSTANDN",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DOWNSTANDN";
    player[p].timer = 0;
    actionStates[characterSelections[p]].DOWNSTANDN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNSTANDN.interrupt(p)){
      reduceByTraction(p,true);
      executeIntangibility("DOWNSTANDN",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].DOWNSTANDN){
      actionStates[characterSelections[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

