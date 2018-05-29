
import WAIT from "characters/shared/moves/WAIT";
import CATCHCUT from "characters/shared/moves/CATCHCUT";
import {framesData} from "main/characters";
import { characterSelections, player} from "main/main";
import {sounds} from "main/sfx";
import {articles} from "physics/article";
import {randomShout, turnOffHitboxes, actionStates} from "physics/actionStateShortcuts";

import {hitQueue} from 'physics/hitDetection';
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "THROWBACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "THROWBACK";
    player[p].timer = 0;
    const grabbing = player[p].phys.grabbing;
    if(grabbing === -1){
      return;
    }
    actionStates[characterSelections[grabbing]].THROWNFALCONBACK.init(grabbing);
    const frame = framesData[characterSelections[grabbing]].THROWNFALCONBACK;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
    randomShout(characterSelections[p]);
    this.main(p,input);
  },
  main : function(p,input){
    const prevFrame = player[p].timer;
    player[p].timer+=20/player[p].phys.releaseFrame;
    if (!this.interrupt(p,input)){
      if (player[p].timer >= 12 && prevFrame < 12) {
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwbackextra.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.throwbackextra.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.throwbackextra.id2;
        player[p].hitboxes.active = [true, true, true, false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer >= 20 && prevFrame < 20) {
        turnOffHitboxes(p);
      }
      if (Math.floor(player[p].timer+0.01) >= 20 && prevFrame < 20){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
        player[p].hitboxes.active = [true, false, false, false];
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 49){
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
