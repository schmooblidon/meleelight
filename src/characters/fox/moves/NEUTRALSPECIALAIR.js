/* globals player, fastfall, airDrift, sounds, drawVfx, Vec2D, articles */

import FALL from "characters/shared/moves/FALL";

export default {
  name : "NEUTRALSPECIALAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "NEUTRALSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.laserCombo = false;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer >= 4 && player[p].timer <= 14){
        if (player[p].inputs.b[0] && !player[p].inputs.b[1]){
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
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+9),player[p].phys.face,0);
        articles.LASER.init(p,8,9,0);
      }
      if (player[p].timer === 30){
        sounds.foxlaserholster.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 36){
      FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
