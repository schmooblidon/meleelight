import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCONFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-7.02,1.49],[-6.15,2.09],[-5.49,2.47],[-5.18,2.48],[-4.95,2.37],[-4.78,2.20],[-4.69,2.05],[-4.66,1.97],[-5.52,2.43],[-6.11,2.52],[-6.64,2.66],[-7.11,2.66],[-7.42,2.77],[-7.74,2.87],[-7.16,2.68],[-6.59,2.49],[-6.85,2.58],[-6.85,2.58]],
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
