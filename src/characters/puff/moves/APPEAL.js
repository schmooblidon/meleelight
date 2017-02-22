import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
export default {
  name : "APPEAL",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "APPEAL";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 100) {
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
