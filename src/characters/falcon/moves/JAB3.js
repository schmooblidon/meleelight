
import WAIT from "characters/shared/moves/WAIT";
import {sounds} from "main/sfx";
import {reduceByTraction, turnOffHitboxes} from "physics/actionStateShortcuts";
import {player} from "main/main";

export default {
  name : "JAB3",
  setVelocities : [0,0.00024,0.00024,-0.00047,3.76443,3.40589,0.00972,0.00748,0.00538,0.00342,0.0016,-0.0007,-0.0016,-0.00299,-0.00423,-0.00533,-0.00629,-0.0071,0.00051,0.00051,0.0005,0.0005,0.00051,0.00051,0.0005,0.0005,0.0005,0.00051,0.0005,0.0005,0.0005,0.00051],
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
      player[p].phys.cVel.x = this.setVelocities[player[p].timer-1] * player[p].phys.face;
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
