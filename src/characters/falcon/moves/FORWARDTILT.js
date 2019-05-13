
import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
import {turnOffHitboxes, reduceByTraction} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";

export default {
  name : "FORWARDTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "FORWARDTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ftilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ftilt.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ftilt.id2;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      reduceByTraction(p,true);
      if (player[p].timer === 9){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer > 9 && player[p].timer < 12){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 12){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 29){
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
