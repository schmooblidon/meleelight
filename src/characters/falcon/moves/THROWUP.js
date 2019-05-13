
import WAIT from "characters/shared/moves/WAIT";
import CATCHCUT from "characters/shared/moves/CATCHCUT";
import {framesData} from "main/characters";
import { characterSelections, player} from "main/main";
import {articles} from "physics/article";
import {sounds} from "main/sfx";
import {turnOffHitboxes, actionStates} from "physics/actionStateShortcuts";

import {hitQueue} from 'physics/hitDetection';
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "THROWUP",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "THROWUP";
    player[p].timer = 0;
    const grabbing = player[p].phys.grabbing;
    if(grabbing === -1){
      return;
    }
    actionStates[characterSelections[grabbing]].THROWNFALCONUP.init(grabbing,input);
    turnOffHitboxes(p);
    const frame = framesData[characterSelections[grabbing]].THROWNFALCONUP;
    player[p].phys.releaseFrame = frame+1;
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
    this.main(p,input);
  },
  main : function(p,input){
    const prevFrame = player[p].timer;
    player[p].timer+=15/player[p].phys.releaseFrame;
    if (!this.interrupt(p,input)){
      if (Math.floor(player[p].timer+0.01) >= 15 && Math.floor(prevFrame+0.01) < 15){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
        player[p].hitboxes.active = [true,false,false,false];
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }
      if (player[p].timer >= 11 && prevFrame < 11){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwupextra.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.throwupextra.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.throwupextra.id2;
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
      }

    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 43){
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
