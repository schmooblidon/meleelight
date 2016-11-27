/* globals player, turnOffHitboxes, fastfall, airDrift, sounds */

import LANDING from "characters/shared/moves/LANDING";
import LANDINGATTACKAIRD from "characters/shared/moves/LANDINGATTACKAIRD";
import FALL from "characters/shared/moves/FALL";

export default {
  name : "ATTACKAIRD",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "ATTACKAIRD";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dair.id1;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer === 4){
        player[p].phys.autoCancel = false;
      }

      if (player[p].timer > 4 && player[p].timer < 26){
        switch (player[p].timer % 3){
          case 2:
            player[p].hitboxes.active = [true,true,false,false];
            player[p].hitboxes.frame = 0;
            sounds.normalswing2.play();
            break;
          case 0:
            player[p].hitboxes.frame++;
            break;
          case 1:
            turnOffHitboxes(p);
            break;

        }
      }

      if (player[p].timer === 32){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      LANDING.init(p);
    }
    else {
      LANDINGATTACKAIRD.init(p);
    }
  }
};
