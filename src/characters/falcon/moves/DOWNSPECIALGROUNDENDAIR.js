import WAIT from "characters/shared/moves/WAIT";
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {sounds} from "main/sfx";
import {turnOffHitboxes, reduceByTraction} from "physics/actionStateShortcuts";

import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "DOWNSPECIALGROUNDENDAIR",
  setVelocities : [0,0.51374,0.59547,0.60863,0.55322,0.42924,0.32122],
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  canEdgeCancel : true,
  disableTeeter : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALGROUNDENDAIR";
    player[p].timer = 0;
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer > 1) {
        if (player.timer < 7) {
          player[p].phys.cVel.x = 1.0346 * player[p].phys.face;
        }
        if (player.timer === 7) {
          player[p].phys.cVel.x = 1.24691 * player[p].phys.face;
        }
        if (player[p].timer > 7) {
          player[p].phys.cVel.y = Math.max(player[p].phys.cVel.y-player[p].charAttributes.gravity, -player[p].charAttributes.terminalV);
          player[p].phys.cVel.x = Math.sign(player[p].phys.cVel.x) * Math.max(Math.abs(player[p].phys.cVel.x)-player[p].charAttributes.airFriction, 0);
        }
        else {
          player[p].phys.cVel.y = this.setVelocities[player[p].timer-1];
        }
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 30){
      if (player[p].phys.grounded){
        WAIT.init(p,input);
      }
      else {
        FALL.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input) {
    player[p].actionState = "DOWNSPECIALGROUNDENDGROUND";
  }
};
