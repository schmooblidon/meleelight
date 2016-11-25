/* globals player, turnOffHitboxes, sounds, drawVfx, Vec2D, checkForJump, reduceByTraction */

import DOWNSPECIALAIR from "./DOWNSPECIALAIR";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import WAIT from "characters/shared/moves/WAIT";
import FALL from "characters/shared/moves/FALL";

export default {
  name : "DOWNSPECIALGROUND",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  canEdgeCancel : true,
  disableTeeter : true,
  airborneState : "DOWNSPECIALAIR",
  init : function(p){
    player[p].actionState = "DOWNSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.inShine = 0;
    sounds.foxshine.play();
    player[p].shineLoop = 6;
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("shine",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+6));
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecial.id0;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    player[p].phys.inShine++;
    if (!this.interrupt(p)){
      if (player[p].phys.onSurface[0] === 1 && player[p].timer > 1){
        if (player[p].inputs.lStickAxis[0].y < -0.66 && player[p].inputs.lStickAxis[6].y >= 0){
          player[p].phys.grounded = false;
          player[p].phys.abovePlatforms[player[p].phys.onSurface[1]] = false;
          player[p].phys.cVel.y = -0.5;
        }
      }
      if (player[p].phys.grounded){
        reduceByTraction(p);
        if (player[p].timer >= 3){
          //shine turn
          // takes 3 frames, act on 4th
        }
        if (player[p].timer >= 4 && player[p].timer <= 35){
          if (player[p].shineLoop === 6){
            player[p].shineLoop = 0;
          }
          player[p].shineLoop++;
          drawVfx("shineloop",new Vec2D(0,0),p);
        }
        if (player[p].timer === 35){
          player[p].phys.face *= -1;
          player[p].timer = 4;
        }
        if (player[p].timer >= 4 && player[p].timer <= 32){
          if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < 0){
            player[p].timer = 32;
          }
          else if (player[p].phys.inShine >= 22){
            if (!player[p].inputs.b[0]){
              player[p].timer = 36;
            }
            else if (player[p].timer === 32){
              player[p].timer = 4;
            }
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
        if (player[p].timer === 4){
          player[p].hitboxes.active = [true,false,false,false];
          player[p].hitboxes.frame = 0;
        }
        if (player[p].timer === 36){
          turnOffHitboxes(p);
        }
      }
      else {
        player[p].actionState = "DOWNSPECIALAIR";
        player[p].timer--;
        DOWNSPECIALAIR.main(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer >= 4 && player[p].timer <= 32){
      const j = checkForJump(p);
      if (j[0]){
        KNEEBEND.init(p,j[1]);
        turnOffHitboxes(p);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 49){
      if (player[p].phys.grounded){
        WAIT.init(p);
      }
      else {
        FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};
