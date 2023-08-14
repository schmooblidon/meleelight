
import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
import {turnOffHitboxes, reduceByTraction} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";

export default {
  name : "DOWNATTACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "DOWNATTACK";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downattack1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.downattack1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.downattack1.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.downattack1.id3;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      reduceByTraction(p,true);
      if (player[p].timer === 1){
        player[p].phys.intangibleTimer = 26;
      }
      if (player[p].timer === 19){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 19 && player[p].timer < 21){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 21){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 28){
        player[p].hitboxes.id[0] = player[p].charHitboxes.downattack2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.downattack2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.downattack2.id2;
        player[p].hitboxes.id[3] = player[p].charHitboxes.downattack2.id3;
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 28 && player[p].timer < 30){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 30){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 49){
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
