/* globals player, reduceByTraction, sounds, drawVfx, Vec2D, articles */

import WAIT from "characters/shared/moves/WAIT";

export default {
  name : "NEUTRALSPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  airborneState : "NEUTRALSPECIALAIR",
  init : function(p){
    player[p].actionState = "NEUTRALSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.laserCombo = false;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      reduceByTraction(p);
      if (player[p].timer >= 4 && player[p].timer <= 16){
        if (player[p].inputs.b[0] && !player[p].inputs.b[1]){
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
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+7),player[p].phys.face,0);
        articles.LASER.init(p,8,7,0);
      }
      if (player[p].timer === 37){
        sounds.foxlaserholster.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
