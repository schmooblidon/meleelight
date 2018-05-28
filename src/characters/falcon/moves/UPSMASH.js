
import WAIT from "characters/shared/moves/WAIT";
import {characterSelections, player} from "main/main";
import {randomShout, reduceByTraction, turnOffHitboxes} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";

export default {
  name : "UPSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "UPSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upsmash1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.upsmash1.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.upsmash1.id3;
    this.main(p,input);
  },
  main : function(p,input){
    if (player[p].timer === 8){
      if (input[p][0].a || input[p][0].z){
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
    if (!this.interrupt(p,input)){
      reduceByTraction(p,true);

      if (player[p].timer === 21){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        randomShout(characterSelections[p]);
        sounds.normalswing1.play();
      }
      if (player[p].timer > 21 && player[p].timer < 23){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 23){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 27){
        player[p].hitboxes.id[0] = player[p].charHitboxes.upsmash2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.upsmash2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.upsmash2.id2;
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.active = [true,true,true,false];
      }
      if (player[p].timer === 29){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 54){
      WAIT.init(p,input);
      return true;
    }
    // iasa 40
    else {
      return false;
    }
  }
};
