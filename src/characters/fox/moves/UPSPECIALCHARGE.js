
import UPSPECIALLAUNCH from "characters/fox/moves/UPSPECIALLAUNCH";
import {reduceByTraction, turnOffHitboxes} from "physics/actionStateShortcuts";
import { player} from "main/main";
import {sounds} from "main/sfx";
import {drawVfx} from "main/vfx/drawVfx";

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
  init : function(p,input){
    player[p].actionState = "UPSPECIALCHARGE";
    player[p].timer = 0;
    player[p].phys.cVel.x *= 0.8;
    player[p].phys.cVel.y = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.landingMultiplier = 10;
    sounds.foxupbburn.play();
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upb1.id0;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
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
        if (input[p][0].lsX === 0 && input[p][0].lsY === 0){
          if (player[p].phys.grounded){
            ang = Math.PI / 2;
          }
        }
        else {
          if (player[p].phys.grounded) {
            if (Math.abs(input[p][0].lsX) < 0.66 && input[p][0].lsY < 0.66) {
              ang = 0; 
            } else if (!(Math.abs(input[p][0].lsX) < 0.66) && input[p][0].lsY < 0.66) {
              if (input[p][0].lsX < -0.66) {
                ang = Math.PI;
              } else {
                ang = 0;
              }
            } else if (input[p][0].lsY > 0) {
              ang = Math.atan(input[p][0].lsY/input[p][0].lsX);              
            }
          } else {
            ang = Math.atan(input[p][0].lsY/input[p][0].lsX);
          }
        }

        if (input[p][0].lsX < 0){
          if (input[p][0].lsY < 0){
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
  interrupt : function(p,input){
    if (player[p].timer > 42){
      UPSPECIALLAUNCH.init(p,input);
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    // do nothing
  }
};
