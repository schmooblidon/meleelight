import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "SHIELDBREAKSTAND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "SHIELDBREAKSTAND";
    player[p].timer = 0;
    actionStates[characterSelections[p]].SHIELDBREAKSTAND.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SHIELDBREAKSTAND.interrupt(p,input)){
      reduceByTraction(p,true);
      player[p].phys.intangibleTimer = 1;
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].SHIELDBREAKSTAND){
      actionStates[characterSelections[p]].FURAFURA.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

