
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
  setVelocities : [-0.08,-0.14,-0.03,0.24,0.68,0.99,1.02,0.78,0.57,0.57,0.57,0.57,0.56,0.56,0.55,0.54,0.53,0.52,0.50,0.49,0.47,0.45,0.43,0.41,0.39,0.36,0,0,0,0,0,0,0],
  init : function(p,input){
    player[p].actionState = "THROWFORWARD";
    player[p].timer = 0;
    const grabbing = player[p].phys.grabbing;
    if(grabbing === -1){
      return;
    }
    actionStates[characterSelections[grabbing]].THROWNFOXFORWARD.init(grabbing,input);
    const frame = framesData[characterSelections[grabbing]].THROWNFOXFORWARD;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwforward.id0;
    randomShout(characterSelections[p]);
    this.main(p,input);
  },
  main : function(p,input){
    const prevFrame = player[p].timer;
    player[p].timer+=11/player[p].phys.releaseFrame;
    if (!this.interrupt(p,input)){
      player[p].phys.cVel.x = this.setVelocities[Math.floor(player[p].timer+0.01)-1]*player[p].phys.face;
      if (Math.floor(player[p].timer+0.01) >= 11 && prevFrame < 11){
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
    else {
      const grabbing = player[p].phys.grabbing;
      if(grabbing === -1){
        return;
      }
      if (player[p].timer < player[p].phys.releaseFrame && player[grabbing].phys.grabbedBy !== p){
        CATCHCUT.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
  }
};
