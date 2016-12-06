import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "FURASLEEPEND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FURASLEEPEND";
    player[p].timer = 0;
    actionStates[characterSelections[p]].FURASLEEPEND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].FURASLEEPEND.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].FURASLEEPEND){
      actionStates[characterSelections[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

