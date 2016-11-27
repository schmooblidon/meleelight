/* globals player, sounds, turnOffHitboxes, reduceByTraction */

import WAIT from "characters/shared/moves/WAIT";

export default {
  name : "DOWNATTACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DOWNATTACK";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downattack1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.downattack1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.downattack1.id2;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer === 1){
        player[p].phys.intangibleTimer = 26;
      }
      if (player[p].timer === 17){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 17 && player[p].timer < 20){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 20){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 24){
        player[p].hitboxes.id[0] = player[p].charHitboxes.downattack2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.downattack2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.downattack2.id2;
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 24 && player[p].timer < 27){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 27){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
