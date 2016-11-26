/* globals player, sounds, turnOffHitboxes, drawVfx, reduceByTraction */

import UPSPECIALLAUNCH from "./UPSPECIALLAUNCH";

export default {
  name : "UPSPECIALCHARGE",
  canPassThrough : false, // ???
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  canEdgeCancel : true,
  disableTeeter : true,
  airborneState : "UPSPECIALCHARGE",
  landType : 1,
  init : function(p){
    player[p].actionState = "UPSPECIALCHARGE";
    player[p].timer = 0;
    player[p].phys.cVel.x *= 0.8;
    player[p].phys.cVel.y = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.landingMultiplier = 10;
    sounds.foxupbburn.play();
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upb1.id0;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      const frame = (player[p].timer-1) % 10;
      drawVfx("firefoxcharge",player[p].phys.pos,player[p].phys.face,frame);

      if (player[p].phys.grounded){
        reduceByTraction(p);
      }
      else {
        if (player[p].phys.cVel.x > 0){
          player[p].phys.cVel.x -= player[p].charAttributes.airFriction;
          if (player[p].phys.cVel.x < 0){
            player[p].phys.cVel.x = 0;
          }
        }
        else if (player[p].phys.cVel.x < 0){
          player[p].phys.cVel.x += player[p].charAttributes.airFriction;
          if (player[p].phys.cVel.x > 0){
            player[p].phys.cVel.x = 0;
          }
        }
      }

      if (player[p].timer === 42){
        let ang = Math.PI/2;
        if (player[p].inputs.lStickAxis[0].x === 0 && player[p].inputs.lStickAxis[0].y === 0){
          if (player[p].phys.grounded){
            if (player[p].phys.face === 1){
              ang = 0;
            }
            else {
              ang = Math.PI;
            }
          }
        }
        else {
          ang = Math.atan(player[p].inputs.lStickAxis[0].y/player[p].inputs.lStickAxis[0].x);
        }

        if (player[p].inputs.lStickAxis[0].x < 0){
          if (player[p].inputs.lStickAxis[0].y < 0){
            ang += Math.PI;
          }
          else {
            ang += Math.PI;
          }
        }
        if (player[p].phys.grounded){
          if (ang < 0){
            ang = 0;
          }
          else if (ang > Math.PI){
            ang = Math.PI;
          }
        }
        player[p].phys.upbAngleMultiplier = ang;
      }
      else if (player[p].timer >= 16 && !player[p].phys.grounded){
        player[p].phys.cVel.y -= 0.015;
      }

      if (player[p].timer > 19 && player[p].timer < 34) {
        switch (player[p].timer % 2) {
          case 0:
            player[p].hitboxes.active = [true,false,false,false];
            player[p].hitboxes.frame = 0;
            break;
          case 1:
            turnOffHitboxes(p);
            break;
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 42){
      UPSPECIALLAUNCH.init(p);
    }
    else {
      return false;
    }
  },
  land : function(p){
    // do nothing
  }
};
