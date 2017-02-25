import {executeIntangibility, actionStates, playSounds} from "physics/actionStateShortcuts";
import {characterSelections,  player} from "main/main";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "TECHB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p,input){
    player[p].actionState = "TECHB";
    player[p].timer = 0;
    drawVfx({
      name: "tech",
      pos: player[p].phys.pos
    });
    sounds.tech.play();
    actionStates[characterSelections[p]].TECHB.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("TECH",p);
    if (!actionStates[characterSelections[p]].TECHB.interrupt(p,input)){
      executeIntangibility("TECHB",p);
      player[p].phys.cVel.x = actionStates[characterSelections[p]].TECHB.setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].TECHB){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

