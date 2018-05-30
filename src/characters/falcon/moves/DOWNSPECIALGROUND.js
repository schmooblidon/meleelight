import WAIT from "characters/shared/moves/WAIT";
import DOWNSPECIALGROUNDENDAIR from "characters/falcon/moves/DOWNSPECIALGROUNDENDAIR";
import DOWNSPECIALGROUNDENDGROUND from "characters/falcon/moves/DOWNSPECIALGROUNDENDGROUND";
import UPSPECIALTHROW from "characters/falcon/moves/UPSPECIALTHROW";
import {player} from "main/main";
import {sounds} from "main/sfx";
import {turnOffHitboxes, reduceByTraction} from "physics/actionStateShortcuts";

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
  specialWallCollide: true,
  airborneState : "DOWNSPECIALGROUND",
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].hitboxes.id[0] = player[p].charHitboxes.falconkickgroundClean.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.falconkickgroundClean.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.falconkickgroundClean.id2;
    turnOffHitboxes(p);
    sounds.falconkickshout.play();
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer >= 12) {
        player[p].phys.cVel.x = 2.67586 * player[p].phys.face;
        if (player[p].timer%2){
          drawVfx({
            name: "firefoxtail",
            pos: new Vec2D(player[p].phys.pos.x+12*player[p].phys.face,player[p].phys.pos.y+3),
            face: player[p].phys.face
          });
        }
      }
      if (player[p].timer === 14){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.falconkick.play();
      }
      if (player[p].timer > 14 && player[p].timer < 33){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 17){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.falconkickgroundMid.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.falconkickgroundMid.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.falconkickgroundMid.id2;
      }
      if (player[p].timer === 25){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.falconkickgroundLate.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.falconkickgroundLate.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.falconkickgroundLate.id2;
      }
      if (player[p].timer === 33){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 39){
      if (player[p].phys.grounded){
        DOWNSPECIALGROUNDENDGROUND.init(p,input);
      }
      else {
        DOWNSPECIALGROUNDENDAIR.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  onWallCollide: function (p, input, wallFace, wallNum) {
    if ((wallFace === "R" && player[p].phys.face === -1) || (wallFace === "L" && player[p].phys.face === 1)) {
      player[p].phys.grounded = false;
      UPSPECIALTHROW.init(p,input);
    }
  },
};
