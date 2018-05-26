import WAIT from "characters/shared/moves/WAIT";
import {sounds} from "main/sfx";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
import { player} from "main/main";
import {drawVfx} from "main/vfx/drawVfx";

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
