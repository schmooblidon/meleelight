
import DOWNSPECIALAIR from "characters/fox/moves/DOWNSPECIALAIR";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import WAIT from "characters/shared/moves/WAIT";
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {sounds} from "main/sfx";
import {turnOffHitboxes, reduceByTraction, checkForJump} from "physics/actionStateShortcuts";

import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
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
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.inShine = 0;
    sounds.foxshine.play();
    player[p].shineLoop = 6;
    drawVfx({
      name: "impactLand",
      pos: player[p].phys.pos,
      face: player[p].phys.face
    });
    drawVfx({
      name: "shine",
      pos: new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y + 6)
    });
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecial.id0;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    player[p].phys.inShine++;
    if (!this.interrupt(p,input)){
      if (player[p].phys.onSurface[0] === 1 && player[p].timer > 1){
        if (input[p][0].lsY < -0.66 && input[p][6].lsY >= 0){
          player[p].phys.grounded = false;
          player[p].phys.passing = true;
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
          drawVfx({
            name: "shineloop",
            pos: new Vec2D(0, 0),
            face: p
          });
        }
        if (player[p].timer === 35){
          player[p].phys.face *= -1;
          player[p].timer = 4;
        }
        if (player[p].timer >= 4 && player[p].timer <= 32){
          if (input[p][0].lsX*player[p].phys.face < 0){
            player[p].timer = 32;
          }
          else if (player[p].phys.inShine >= 22){
            if (!input[p][0].b){
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
        DOWNSPECIALAIR.main(p,input);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer >= 4 && player[p].timer <= 32){
      const j = checkForJump(p,input);
      if (j[0]){
        KNEEBEND.init(p,j[1],input);
        turnOffHitboxes(p);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 49){
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
  }
};
