import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCONFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-7.45,3.04],[-6.58,3.64],[-5.92,4.02],[-5.61,4.03],[-5.37,3.92],[-5.21,3.75],[-5.11,3.60],[-5.09,3.52],[-5.95,3.98],[-6.53,4.06],[-7.06,4.21],[-7.54,4.21],[-7.85,4.31],[-8.17,4.42],[-7.59,4.23],[-7.01,4.04],[-7.28,4.13],[-7.28,4.13]],
  init : function(p,input){
    player[p].actionState = "THROWNFALCONFORWARD";
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
