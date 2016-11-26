/* globals player, turnOffHitboxes, reduceByTraction, sounds, cS, randomShout */

import WAIT from "characters/shared/moves/WAIT";

export default {
  name : "FORWARDSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FORWARDSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.fsmash1.id2;
    this.main(p);
  },
  main : function(p){
    if (player[p].timer === 7){
      if (player[p].inputs.a[0] || player[p].inputs.z[0]){
        player[p].phys.charging = true;
        player[p].phys.chargeFrames++;
        if (player[p].phys.chargeFrames === 5){
          sounds.smashcharge.play();
        }
        if (player[p].phys.chargeFrames === 60){
          player[p].timer++;
          player[p].phys.charging = false;
        }
      }
      else {
        player[p].timer++;
        player[p].phys.charging = false;
      }
    }
    else {
      player[p].timer++;
      player[p].phys.charging = false;
    }
    if (!this.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer < 9){
        player[p].phys.cVel.x = 0;
      }
      else if (player[p].timer < 15){
        player[p].phys.cVel.x = 1.34*player[p].phys.face;
      }
      else if (player[p].timer < 31){
        player[p].phys.cVel.x = 1.00*player[p].phys.face;
      }
      else {
        player[p].phys.cVel.x = 0;
      }


      if (player[p].timer === 12){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        randomShout(cS[p]);
        sounds.normalswing1.play();
      }
      if (player[p].timer > 12 && player[p].timer < 23){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 17){
        player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.fsmash2.id2;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer === 23){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
