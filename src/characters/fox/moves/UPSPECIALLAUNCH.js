/* globals player, sounds, Vec2D, drawVfx, reduceByTraction, fastfall, airDrift, turnOffHitboxes */

import WAIT from "characters/shared/moves/WAIT";
import FALLSPECIAL from "characters/shared/moves/FALLSPECIAL";
import FIREFOXBOUNCE from "./FIREFOXBOUNCE";

export default {
  name : "UPSPECIALLAUNCH",
  canPassThrough : true,
  canGrabLedge : [true,true],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  canEdgeCancel : true,
  disableTeeter : true,
  airborneState : "UPSPECIALLAUNCH",
  landType : 1,
  init : function(p){
    player[p].actionState = "UPSPECIALLAUNCH";
    player[p].timer = 0;
    sounds.foxupbshout.play();
    sounds.foxupblaunch.play();
    player[p].hitboxes.id[0] = player[p].charHitboxes.upb2.id0;
    player[p].hitboxes.active = [true,false,false,false];
    player[p].hitboxes.frame = 0;
    player[p].rotation = (player[p].phys.upbAngleMultiplier-Math.PI/2)*-1;
    //console.log(player[p].rotation*180/Math.PI);
    if (player[p].rotation < 0){
      player[p].phys.face = -1;
    }
    else if (player[p].rotation > 0 && !(player[p].rotation === Math.PI)){
      player[p].phys.face = 1;
    }
    player[p].rotationPoint = new Vec2D(0,40);
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      if (player[p].timer < 31){
        if (player[p].timer%2){
          drawVfx("firefoxtail",player[p].phys.posPrev,player[p].phys.face);
        }
        drawVfx("firefoxlaunch",player[p].phys.pos,player[p].phys.face,p);
      }
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
      if (player[p].timer >= 31){
        if (player[p].phys.grounded){
          reduceByTraction(p);
        }
        else {
          fastfall(p);
          airDrift(p);
        }
      }
      else if (player[p].timer >= 6){
        player[p].phys.cVel.y -= 0.1*Math.sin(player[p].phys.upbAngleMultiplier);
        player[p].phys.cVel.x -= 0.1*Math.cos(player[p].phys.upbAngleMultiplier);
      }
      else if (player[p].timer >= 1){
        player[p].phys.grounded = false;
        player[p].phys.cVel.y = 3.8*Math.sin(player[p].phys.upbAngleMultiplier);
        player[p].phys.cVel.x = 3.8*Math.cos(player[p].phys.upbAngleMultiplier);
      }
      if (player[p].timer > 1 && player[p].timer < 31){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 31){
        turnOffHitboxes(p);
        player[p].rotation = 0;
        player[p].rotationPoint = new Vec2D(0,0);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 50){
      if (player[p].phys.grounded){
        WAIT.init(p);
      }
      else {
        FALLSPECIAL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].timer < 31){
      // BOUNCE
      drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
      FIREFOXBOUNCE.init(p);
    }
    else {
      drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    }
  }
};
