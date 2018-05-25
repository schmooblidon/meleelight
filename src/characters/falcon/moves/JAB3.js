
import WAIT from "characters/shared/moves/WAIT";
import {sounds} from "main/sfx";
import {reduceByTraction, turnOffHitboxes} from "physics/actionStateShortcuts";
import {player} from "main/main";

export default {
  name : "JAB3",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "JAB3";
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 32){
      WAIT.init(p,input);
      return true;
    }
    // iasa 23
    else {
      return false;
    }
  }
};
