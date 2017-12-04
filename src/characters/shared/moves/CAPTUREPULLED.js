import { characterSelections, player} from "main/main";
import {actionStates} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "CAPTUREPULLED",
  canEdgeCancel : false,
  canBeGrabbed : false,
  inGrab : true,
  init : function(p,input){
    player[p].actionState = "CAPTUREPULLED";
    player[p].timer = 0;
    player[p].phys.grounded = true;
    const grabbedBy = player[p].phys.grabbedBy;
    if(grabbedBy === -1){
      return;
    }
    player[p].phys.face = -1*player[grabbedBy].phys.face;
    player[p].phys.onSurface = [player[grabbedBy].phys.onSurface[0],player[grabbedBy].phys.onSurface[1]];
    player[p].phys.stuckTimer = 100+(2*player[p].percent);
    sounds.grabbed.play();
    actionStates[characterSelections[p]].CAPTUREPULLED.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CAPTUREPULLED.interrupt(p,input)){
      if (player[p].timer === 2){
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x+(-16.41205*player[p].phys.face),player[grabbedBy].phys.pos.y);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 2){
      actionStates[characterSelections[p]].CAPTUREWAIT.init(p,input);
      const grabbedBy = player[p].phys.grabbedBy;
      if(grabbedBy === -1){
        return;
      }
      actionStates[characterSelections[p]].CATCHWAIT.init(grabbedBy,input);
      drawVfx({
        name: "tech",
        pos: new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y + 10)
      });
      return true;
    }
    else {
      return false;
    }
  }
};

