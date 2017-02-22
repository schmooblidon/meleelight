import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCOBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-8.96,-2.13],[-8.10,-2.28],[-5.65,-2.92],[-2.00,-4.11],[0.47,-5.18],[5.14,-4.92],[9.34,3.13],[9.34,3.13]],
  init : function(p,input){
    player[p].actionState = "THROWNFALCOBACK";
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
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+this.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+this.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p,input){
    return false;
  }
};
