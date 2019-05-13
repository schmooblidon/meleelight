import WAIT from "characters/shared/moves/WAIT";
import {sounds} from "main/sfx";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
import { player} from "main/main";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

export default {
  name : "SIDESPECIALGROUNDHIT",
  canPassThrough : false,
  canEdgeCancel : false,
  disableTeeter : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "SIDESPECIALGROUNDHIT";
    player[p].timer = 0;
    player[p].hitboxes.id[0] = player[p].charHitboxes.raptorboostgroundhit.id0;
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].phys.timer < 18) {
        player[p].phys.cVel.x = 0.30313 * player[p].phys.face;
      }
      else {
        player[p].phys.cVel.x = 0;
      }
      if (player[p].timer === 4){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 4 && player[p].timer < 9) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 9){
        turnOffHitboxes(p);
      }
      if (player[p].timer >= 4 && player[p].timer < 9) {
        drawVfx({
          name: "firefoxtail",
          pos: new Vec2D(player[p].phys.pos.x+player[p].hitboxes.id[0].offset[player[p].hitboxes.frame].x*player[p].phys.face,player[p].phys.pos.y+player[p].hitboxes.id[0].offset[player[p].hitboxes.frame].y),
          face: player[p].phys.face
        });
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 25){
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
