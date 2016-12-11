import {sounds, sounds} from "main/sfx";
import {executeIntangibility, playSounds, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "ESCAPEB",
  setVelocities : [],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "ESCAPEB";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    actionStates[characterSelections[p]].ESCAPEB.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("ESCAPEB",p);
    if (!actionStates[characterSelections[p]].ESCAPEB.interrupt(p,input)){
      player[p].phys.cVel.x = actionStates[characterSelections[p]].ESCAPEB.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("ESCAPEB",p);
      if (player[p].timer == 4){
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].ESCAPEB){
      player[p].phys.cVel.x = 0;
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

