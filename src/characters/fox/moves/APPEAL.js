import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
export default {
  name : "APPEAL",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities1 : [-0.38101,-0.4175,-0.44566,-0.4655,-0.47702,-0.48022,-0.4751,-0.46166,-0.4399,-0.40981,-0.37141,-0.32469,-0.26964,-0.20628,-0.13459,0],
  setVelocities2 : [0.12714,0.14992,0.17104,0.19052,0.20834,0.22450,0.23902,0.25188,0.26309,0.27265,0.28055,0.2868,0.2914,0.29434,0.29563,0.29527,0.29326,0.28959,0.28427,0.27729,0.26867,0.25839],
  init : function(p,input){
    player[p].actionState = "APPEAL";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer > 1 && player[p].timer < 18) {
        player[p].phys.cVel.x = this.setVelocities1[player[p].timer-2] * player[p].phys.face;
      }
      else if (player[p].timer > 88) {
        player[p].phys.cVel.x = this.setVelocities2[player[p].timer-89] * player[p].phys.face;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 110) {
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
