
import WAIT from "characters/shared/moves/WAIT";
import FALLSPECIAL from "characters/shared/moves/FALLSPECIAL";
import FIREFOXBOUNCE from "characters/falco/moves/FIREFOXBOUNCE";
import {turnOffHitboxes, airDrift, fastfall, reduceByTraction} from "physics/actionStateShortcuts";
import { player} from "main/main";
import {sounds} from "main/sfx";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

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
  init : function(p,input){
    player[p].actionState = "UPSPECIALLAUNCH";
    player[p].timer = 0;
    sounds.firebirdlaunch.play();
    sounds.falcofirebird.play();
    player[p].hitboxes.id[0] = player[p].charHitboxes.upspecial.id0;
    player[p].hitboxes.active = [true,false,false,false];
    player[p].hitboxes.frame = 0;
    player[p].rotation = Math.PI / 2 - player[p].phys.upbAngleMultiplier;
    if (player[p].phys.upbAngleMultiplier !== Math.PI / 2) {
      if (Math.abs(player[p].phys.upbAngleMultiplier) > Math.PI / 2) {
        player[p].phys.face = -1;
      } else {
        player[p].phys.face = 1;
      }
    }
    player[p].rotationPoint = new Vec2D(0,40);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer < 23){
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
      if (player[p].timer >= 23){
        if (player[p].phys.grounded){
          reduceByTraction(p);
        }
        else {
          fastfall(p,input);
          airDrift(p,input);
        }
      }
      else if (player[p].timer >= 4){
        player[p].phys.cVel.y -= 0.17*Math.sin(player[p].phys.upbAngleMultiplier);
        player[p].phys.cVel.x -= 0.17*Math.cos(player[p].phys.upbAngleMultiplier);
      }
      else if (player[p].timer >= 1){
        player[p].phys.grounded = false;
        player[p].phys.cVel.y = 4.2*Math.sin(player[p].phys.upbAngleMultiplier);
        player[p].phys.cVel.x = 4.2*Math.cos(player[p].phys.upbAngleMultiplier);
      }
      if (player[p].timer > 1 && player[p].timer < 23){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 23){
        turnOffHitboxes(p);
        player[p].rotation = 0;
        player[p].rotationPoint = new Vec2D(0,0);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 42){
      if (player[p].phys.grounded){
        WAIT.init(p,input);
      }
      else {
        FALLSPECIAL.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    if (player[p].timer < 23){
      // BOUNCE
      drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
      FIREFOXBOUNCE.init(p,input);
    }
    else {
      drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    }
  }
};
