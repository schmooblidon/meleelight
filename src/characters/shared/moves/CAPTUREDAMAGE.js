import {player, characterSelections} from "main/main";
import {actionStates} from "physics/actionStateShortcuts";

import {framesData} from 'main/characters';
export default {
  name : "CAPTUREDAMAGE",
  canEdgeCancel : false,
  canBeGrabbed : false,
  setPositions : [9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.306,8.920,8.516,8.290,8.293,8.410,8.593,8.792,8.959,9.043,9.068],
  inGrab : true,
  init : function(p){
    player[p].actionState = "CAPTUREDAMAGE";
    player[p].timer = 0;
    actionStates[characterSelections[p]].CAPTUREDAMAGE.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CAPTUREDAMAGE.interrupt(p)){
      player[p].phys.pos.x = player[player[p].phys.grabbedBy].phys.pos.x+(-actionStates[characterSelections[p]].CAPTUREDAMAGE.setPositions[player[p].timer-1]*player[p].phys.face);
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].CAPTUREDAMAGE){
      actionStates[characterSelections[p]].CAPTUREWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

