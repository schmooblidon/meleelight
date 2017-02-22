import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCOFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-8.39-0.20,4.26],[-8.27-0.23,4.64],[-8.53+0.78,4.86],[-9.04+2.70,5.20],[-10.44+4.19,5.32],[-13.78+5.28,4.95],[-13.78+5.28,4.95]],
  init : function(p,input){
    player[p].actionState = "THROWNFALCOFORWARD";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+this.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+this.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p,input){
    return false;
  }
};
