import FALLSPECIAL from "characters/shared/moves/FALLSPECIAL";
import LANDINGFALLSPECIAL from "characters/shared/moves/LANDINGFALLSPECIAL";
import {articles} from "physics/article";
import {sounds} from "main/sfx";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
import { player} from "main/main";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

export default {
  name : "SIDESPECIALAIRHIT",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "SIDESPECIALAIRHIT";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].hitboxes.id[0] = player[p].charHitboxes.raptorboostairhit.id0;
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      player[p].phys.cVel.y -= 0.05;
      if (player[p].timer === 4){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 4 && player[p].timer < 9) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 9){
        turnOffHitboxes(p);
      }
      if (player[p].timer >= 4 && player[p].timer < 9) {
        drawVfx({
          name: "firefoxtail",
          pos: new Vec2D(player[p].phys.pos.x+player[p].hitboxes.id[0].offset[player[p].hitboxes.frame].x*player[p].phys.face,player[p].phys.pos.y+player[p].hitboxes.id[0].offset[player[p].hitboxes.frame].y),
          face: player[p].phys.face
        });
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 45){
      FALLSPECIAL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    LANDINGFALLSPECIAL.init(p,input);
  }
};
