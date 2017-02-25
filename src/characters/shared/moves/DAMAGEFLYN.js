import { characterSelections, player} from "main/main";
import {actionStates, turnOffHitboxes} from "physics/actionStateShortcuts";
import {framesData} from "main/characters";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "DAMAGEFLYN",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 2,
  init : function(p,input,drawStuff){
    player[p].actionState = "DAMAGEFLYN";
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.grabbedBy = -1;
    player[p].phys.fastfalled = false;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    player[p].colourOverlayBool = false;
    if (drawStuff){
      // drawVfx("hitSparks",player[p].hit.hitPoint,player[p].phys.face);
      // drawVfx("hitFlair",player[p].hit.hitPoint,player[p].phys.face);
      // drawVfx("hitCurve",player[p].hit.hitPoint,player[p].phys.face,player[p].hit.angle);
    }
    player[p].hitboxes.id[0] = player[p].charHitboxes.thrown.id0;
    /*player[p].phys.grounded = false;
    player[p].phys.pos.y += 0.0001;*/
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].DAMAGEFLYN.main(p,input);
  },
  main : function(p,input){
    if (player[p].phys.thrownHitbox){
      if (player[p].timer === 1 && player[p].phys.cVel.y+player[p].phys.kVel.y > 0){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 1 && player[p].phys.cVel.y+player[p].phys.kVel.y > 0){
        //player[p].hitboxes.frame++;
      }
      if (player[p].phys.cVel.y+player[p].phys.kVel.y <= 0){
        turnOffHitboxes(p);
      }
    }
    if (player[p].timer < framesData[characterSelections[p]].DAMAGEFLYN){
      player[p].timer++;
    }
    if (player[p].hit.hitstun % 10 === 0){
      drawVfx({
        name: "flyingDust",
        pos: player[p].phys.pos
      });
    }
    if (!actionStates[characterSelections[p]].DAMAGEFLYN.interrupt(p,input)){
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
        if (!player[p].phys.grounded){
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
        }
      }
    }
    else {
      player[p].phys.thrownHitbox = false;
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 1 && player[p].hit.hitstun === 0){
      actionStates[characterSelections[p]].DAMAGEFALL.init(p,input);
      player[p].phys.thrownHitbox = false;
      return true;
    }
    else {
      return false;
    }
  }
};

