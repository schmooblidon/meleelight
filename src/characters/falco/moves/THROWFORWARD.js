
import WAIT from "characters/shared/moves/WAIT";
import CATCHCUT from "characters/shared/moves/CATCHCUT";
import {randomShout, turnOffHitboxes, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
import {hitQueue} from 'physics/hitDetection';
export default {
  name : "THROWFORWARD",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [-0.09,-0.16,-0.03,0.28,0.78,1.13,1.17,0.89,0.65,0.65,0.65,0.65,0.64,0.64,0.63,0.62,0.61,0.59,0.58,0.56,0.54,0.52,0.49,0.47,0.44,0.41,0,0,0,0,0,0,0],
  init : function(p,input){
    player[p].actionState = "THROWFORWARD";
    player[p].timer = 0;
    actionStates[characterSelections[player[p].phys.grabbing]].THROWNFALCOFORWARD.init(player[p].phys.grabbing,input);
    const frame = framesData[characterSelections[player[p].phys.grabbing]].THROWNFALCOFORWARD;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwforward.id0;
    randomShout(characterSelections[p]);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer+=11/player[p].phys.releaseFrame;
    if (!this.interrupt(p,input)){
      player[p].phys.cVel.x = this.setVelocities[Math.floor(player[p].timer+0.01)-1]*player[p].phys.face;
      if (Math.floor(player[p].timer+0.01) === 11){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }
      /*if (player[p].timer == 11){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwforwardextra.id0;
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 12){
        turnOffHitboxes(p);
      }*/
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 33){
      player[p].phys.grabbing = -1;
      WAIT.init(p,input);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy !== p){
      CATCHCUT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
