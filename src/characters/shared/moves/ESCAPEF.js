import {sounds} from "main/sfx";
import {executeIntangibility, playSounds, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "ESCAPEF",
  setVelocities : [],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "ESCAPEF";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    actionStates[characterSelections[p]].ESCAPEF.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("ESCAPEF",p);
    if (!actionStates[characterSelections[p]].ESCAPEF.interrupt(p,input)){
      player[p].phys.cVel.x = actionStates[characterSelections[p]].ESCAPEF.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("ESCAPEF",p);
      if (player[p].timer === 4){
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].ESCAPEF){
      player[p].phys.cVel.x = 0;
      player[p].phys.face *= -1;
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

