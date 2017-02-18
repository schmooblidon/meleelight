
import FALLSPECIAL from "characters/shared/moves/FALLSPECIAL";
import WAIT from "characters/shared/moves/WAIT";
import LANDING from "characters/shared/moves/LANDING";
import {player} from "main/main";

export default {
  name : "FIREFOXBOUNCE",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  setVelocities : [0.00072,0.00072,0.00072,6.04024,6.25258,2.93342,0.07311,0.03107,-0.00327,-0.02994,-0.04893,-0.06023,-0.06386,-2.09936],
  landType : 1,
  init : function(p,input){
    player[p].actionState = "FIREFOXBOUNCE";
    player[p].timer = 0;
    player[p].phys.grounded = false;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].phys.cVel.x !== 0){
        player[p].phys.cVel.x -= 0.03*player[p].phys.face;
        if (player[p].phys.cVel.x*player[p].phys.face < 0){
          player[p].phys.cVel.x = 0;
        }
      }
      player[p].phys.cVel.y = this.setVelocities[player[p].timer-1];
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 14){
      if (player[p].phys.grounded){
        WAIT.init(p,input);
      }
      else {
        FALLSPECIAL.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    LANDING.init(p,input);
  }
};
