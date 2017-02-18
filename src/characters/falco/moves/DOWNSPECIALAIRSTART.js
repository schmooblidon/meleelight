/* eslint-disable */
//import DOWNSPECIALAIRLOOP from "characters/falco/moves/DOWNSPECIALAIRLOOP";
import {player} from "main/main";
import {sounds} from "main/sfx";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

export default {
  name : "DOWNSPECIALAIRSTART",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALAIRSTART";
    player[p].timer = 0;
    player[p].inShine = 0;
    sounds.foxshine.play();
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("shine",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+6));
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecial.id0;
    this.main(p,input);
  },
  main : function(p,input) {
    player[p].timer++;
    player[p].inShine++;
    if (!this.interrupt(p,input)){
      if (player[p].phys.cVel.x > 0){
        if (player[p].phys.cVel.x > 0.85){
          player[p].phys.cVel.x -= 0.03;
        }
        else {
          player[p].phys.cVel.x -= 0.02;
        }
        if (player[p].phys.cVel.x < 0){
          player[p].phys.cVel.x = 0;
        }
      }
      else if (player[p].phys.cVel.x < 0){
        if (player[p].phys.cVel.x < -0.85){
          player[p].phys.cVel.x += 0.03;
        }
        else {
          player[p].phys.cVel.x += 0.02;
        }
        if (player[p].phys.cVel.x > 0){
          player[p].phys.cVel.x = 0;
        }
      }

      if (player[p].timer === 1){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
        player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,1);
      }
      if (player[p].timer === 2){
        turnOffHitboxes(p);
        player[p].hitboxes.id[0] = player[p].charHitboxes.reflector.id0;
      }
    }
  },
  interrupt : function(p,input) {
    if (player.timer > 3) {
      //DOWNSPECIALAIRLOOP.init(p,input);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input) {
    player[p].actionState = "DOWNSPECIALGROUNDSTART";
  }
};