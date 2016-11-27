/* globals player, turnOffHitboxes, reduceByTraction, sounds */

import WAIT from "characters/shared/moves/WAIT";

export default {
  name : "GRAB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "GRAB";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.grab.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.grab.id1;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer === 7){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.grab.play();
      }
      if (player[p].timer > 7 && player[p].timer < 9){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 9){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
