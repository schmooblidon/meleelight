import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCODOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-3.25,2.28],[-2.13,1.81],[-2.11,2.48],[-1.60,7.55],[0.31,9.35],[1.18,9.13],[1.23,8.76],[1.21,9.22],[-0.51,12.06],[-0.93,-0.96],[-0.92,0.46],[-0.83,1.25],[-0.68,1.69],[-0.56,0.52],[-0.57,-0.92],[-0.57,-0.36],[-0.57,0.16],[-0.57,0.62],[-0.57,0.97],[-0.57,0.97]],
  init : function(p,input){
    player[p].actionState = "THROWNFALCODOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+this.offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+this.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p,input){
    return false;
  }
};
