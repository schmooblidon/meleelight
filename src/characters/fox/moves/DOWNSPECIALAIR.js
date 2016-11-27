/* globals player, Vec2D, turnOffHitboxes, sounds, drawVfx */

import DOWNSPECIALGROUND from "./DOWNSPECIALGROUND";
import JUMPAERIALB from "characters/shared/moves/JUMPAERIALB";
import JUMPAERIALF from "characters/shared/moves/JUMPAERIALF";
import WAIT from "characters/shared/moves/WAIT";
import FALL from "characters/shared/moves/FALL";

export default {
  name : "DOWNSPECIALAIR",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "DOWNSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.cVel.y = 0;
    player[p].phys.cVel.x *= 0.5;
    player[p].shineLoop = 6;
    player[p].phys.inShine = 0;
    sounds.foxshine.play();
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
      if (player[p].phys.grounded){
        player[p].actionState = "DOWNSPECIALGROUND";
        player[p].timer--;
        DOWNSPECIALGROUND.main(p);
      }
      else {
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
        if (player[p].timer >= 5){
          player[p].phys.cVel.y -= 0.02667;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
        }

        if (player[p].timer >= 4 && player[p].timer <= 32){
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


    }
  },
  interrupt : function(p){
    if (player[p].timer >= 4 && player[p].timer <= 32){
      if (!player[p].phys.doubleJumped){
        if ((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y >= 0.7 && player[p].inputs.lStickAxis[3].y < 0.7)){
          if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
            JUMPAERIALB.init(p);
          }
          else {
            JUMPAERIALF.init(p);
          }
          turnOffHitboxes(p);
          return true;
        }
        else {
          return false;
        }
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
  },
  land : function(p){
    player[p].actionState = "DOWNSPECIALGROUND";
    if (player[p].timer >= 4 && player[p].timer <= 35){
      player[p].hitboxes.id[0] = player[p].charHitboxes.reflector.id0;
      player[p].hitboxes.active = [true,false,false,false];
      player[p].hitboxes.frame = 0;
    }
  }
};
