
import FALL from "characters/shared/moves/FALL";
import {articles} from "physics/article";
import { player} from "main/main";
import {sounds} from "main/sfx";
import {airDrift, fastfall} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

export default {
  name : "NEUTRALSPECIALAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p,input){
    player[p].actionState = "NEUTRALSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.laserCombo = false;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
      if (player[p].timer >= 4 && player[p].timer <= 14){
        if (input[p][0].b && !input[p][1].b){
          player[p].phys.laserCombo = true;
        }
      }
      if (player[p].timer === 15){
        if (player[p].phys.laserCombo){
          player[p].timer = 5;
          player[p].phys.laserCombo = false;
        }
      }
      if (player[p].timer === 7){
        sounds.foxlasercock.play();
      }
      if (player[p].timer === 10){
        sounds.foxlaserfire.play();
        // laser instance
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+9),
          face:player[p].phys.face,
          f:0,
          color1:{r:255,g:59,b:59},
          color2:{r:255,g:57,b:87}
        });
        articles.LASER.init({
          p: p,
          x: 8,
          y: 9,
          rotate: 0
        });
      }
      if (player[p].timer === 30){
        sounds.foxlaserholster.play();
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 36){
      FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
