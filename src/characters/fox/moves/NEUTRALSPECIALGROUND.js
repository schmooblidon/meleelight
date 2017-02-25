
import WAIT from "characters/shared/moves/WAIT";
import {articles} from "physics/article";
import { player} from "main/main";
import {sounds} from "main/sfx";
import {reduceByTraction} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

export default {
  name : "NEUTRALSPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  airborneState : "NEUTRALSPECIALAIR",
  init : function(p,input){
    player[p].actionState = "NEUTRALSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.laserCombo = false;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      reduceByTraction(p);
      if (player[p].timer >= 4 && player[p].timer <= 16){
        if (input[p][0].b && !input[p][1].b){
          player[p].phys.laserCombo = true;
        }
      }
      if (player[p].timer === 17){
        if (player[p].phys.laserCombo){
          player[p].timer = 7;
          player[p].phys.laserCombo = false;
        }
      }
      if (player[p].timer === 9){
        sounds.foxlasercock.play();
      }
      if (player[p].timer === 12){
        sounds.foxlaserfire.play();
        // laser instance
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+7),
          face:player[p].phys.face,
          f:0,
          color1:{r:255,g:59,b:59},
          color2:{r:255,g:57,b:87}
        });
        articles.LASER.init({
          p: p,
          x: 8,
          y: 7,
          rotate: 0
        });
      }
      if (player[p].timer === 37){
        sounds.foxlaserholster.play();
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 40){
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
