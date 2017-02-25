/* eslint-disable */
import DOWNSPECIALGROUNDLOOP from "characters/falco/moves/DOWNSPECIALGROUNDLOOP";
import {player} from "main/main";
import {sounds} from "main/sfx";
import {turnOffHitboxes, reduceByTraction} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

export default {
  name : "DOWNSPECIALGROUNDSTART",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  canEdgeCancel : true,
  disableTeeter : true,
  airborneState : "DOWNSPECIALAIRSTART",
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALGROUNDSTART";
    player[p].timer = 0;
    player[p].phys.inShine = 0;
    player[p].shineLoop = 6;
    sounds.foxshine.play();
    drawVfx({
      name:"impactLand",
      pos:player[p].phys.pos,
      face:player[p].phys.face
    });
    drawVfx({
      name:"shine",
      pos:new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+6)
    });
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecial.id0;
    this.main(p,input);
  },
  main : function(p,input) {
    player[p].timer++;
    player[p].phys.inShine++;
    if (!this.interrupt(p,input)){
      if (player[p].phys.onSurface[0] === 1 && player[p].timer > 1){
        if (input[p][0].lsY < -0.66 && input[p][6].lsY >= 0){
          player[p].phys.grounded = false;
          player[p].phys.passing = true;
          player[p].phys.cVel.y = -0.5;
          player[p].actionState = "DOWNSPECIALAIRSTART";
        }
      }
      reduceByTraction(p);

      if (player[p].timer === 1){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
        player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,1);
      }
      if (player[p].timer === 2){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input) {
    if (player[p].timer > 3) {
      DOWNSPECIALGROUNDLOOP.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};