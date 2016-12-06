import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "CAPTURECUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  canBeGrabbed : true,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CAPTURECUT";
    player[p].timer = 0;
    player[p].phys.grabbedBy = -1
    player[p].phys.cVel.x = -1*player[p].phys.face;
    actionStates[characterSelections[p]].CAPTURECUT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CAPTURECUT.interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.grabTech = false;
      }
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].CAPTURECUT){
      actionStates[characterSelections[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

