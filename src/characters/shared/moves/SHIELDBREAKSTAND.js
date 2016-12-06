import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "SHIELDBREAKSTAND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "SHIELDBREAKSTAND";
    player[p].timer = 0;
    actionStates[characterSelections[p]].SHIELDBREAKSTAND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SHIELDBREAKSTAND.interrupt(p)){
      reduceByTraction(p,true);
      player[p].phys.intangibleTimer = 1;
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].SHIELDBREAKSTAND){
      actionStates[characterSelections[p]].FURAFURA.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

