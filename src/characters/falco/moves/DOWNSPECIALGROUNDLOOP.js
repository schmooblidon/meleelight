/* eslint-disable */
import DOWNSPECIALGROUNDEND from "characters/falco/moves/DOWNSPECIALGROUNDEND";
import DOWNSPECIALGROUNDTURN from "characters/falco/moves/DOWNSPECIALGROUNDTURN";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import {player} from "main/main";
import {turnOffHitboxes, reduceByTraction, checkForJump} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

export default {
  name : "DOWNSPECIALGROUNDLOOP",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  canEdgeCancel : true,
  disableTeeter : true,
  airborneState : "DOWNSPECIALAIRLOOP",
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALGROUNDLOOP";
    player[p].timer = 0;
    player[p].hitboxes.id[0] = player[p].charHitboxes.reflector.id0;
    turnOffHitboxes(p);
    player[p].hitboxes.active = [true,false,false,false];
    player[p].hitboxes.frame = 0;
    this.main(p,input);
  },
  main : function(p,input) {
    player[p].timer++;
    player[p].phys.inShine++;
    if (!this.interrupt(p,input)){
      if (player[p].phys.onSurface[0] === 1){
        if (input[p][0].lsY < -0.66 && input[p][6].lsY >= 0){
          player[p].phys.grounded = false;
          player[p].phys.passing = true;
          player[p].phys.cVel.y = -0.5;
          player[p].actionState = "DOWNSPECIALAIRLOOP";
        }
      }
      reduceByTraction(p);

      if (player[p].shineLoop === 6){
        player[p].shineLoop = 0;
      }
      player[p].shineLoop++;
      drawVfx("shineloop",new Vec2D(0,0),p);
    }
  },
  interrupt : function(p,input) {
    const j = checkForJump(p,input);
    if (input[p][0].lsX*player[p].phys.face < 0){
      DOWNSPECIALGROUNDTURN.init(p,input);
      return true;
    }
    else if (player[p].phys.inShine >= 22 && !input[p][0].b){
      DOWNSPECIALGROUNDEND.init(p,input);
      return true;
    }
    else if (j[0]) {
      turnOffHitboxes(p);
      KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (player[p].timer > 28) {
      this.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};