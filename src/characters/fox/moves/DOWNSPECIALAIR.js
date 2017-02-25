/* eslint-disable */
import DOWNSPECIALGROUND from "characters/fox/moves/DOWNSPECIALGROUND";
import JUMPAERIALB from "characters/shared/moves/JUMPAERIALB";
import JUMPAERIALF from "characters/shared/moves/JUMPAERIALF";
import WAIT from "characters/shared/moves/WAIT";
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {sounds} from "main/sfx";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {gameSettings} from "settings";

export default {
  name : "DOWNSPECIALAIR",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.cVel.y = 0;
    player[p].phys.cVel.x *= 0.5;
    player[p].shineLoop = 6;
    player[p].phys.inShine = 0;
    sounds.foxshine.play();
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
      if (player[p].phys.grounded){
        player[p].actionState = "DOWNSPECIALGROUND";
        player[p].timer--;
        DOWNSPECIALGROUND.main(p,input);
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
          drawVfx({
            name: "shineloop",
            pos: new Vec2D(0, 0), face: p
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


    }
  },
  interrupt : function(p,input){
    if (player[p].timer >= 4 && player[p].timer <= 32){
      if (!player[p].phys.doubleJumped){
        if ((input[p][0].x && !input[p][1].x) || (input[p][0].y && !input[p][1].y) || (gameSettings["tapJumpOffp" + (p + 1)] == false && input[p][0].lsY >= 0.7 && input[p][3].lsY < 0.7)){
          if (input[p][0].lsX*player[p].phys.face < -0.3){
            JUMPAERIALB.init(p,input);
          }
          else {
            JUMPAERIALF.init(p,input);
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
  land : function(p,input){
    player[p].actionState = "DOWNSPECIALGROUND";
    if (player[p].timer >= 4 && player[p].timer <= 35){
      player[p].hitboxes.id[0] = player[p].charHitboxes.reflector.id0;
      player[p].hitboxes.active = [true,false,false,false];
      player[p].hitboxes.frame = 0;
    }
  }
};
