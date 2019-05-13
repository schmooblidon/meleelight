import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCOFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-9.39-0.09,-5.26],[-8.74-0.24,-4.41],[-8.65-0.29,-4.19],[-8.87-0.07,-4.20],[-8.98+0.59,-4.03],[-9.18+1.63,-3.82],[-9.57+2.78,-3.63],[-10.24+3.75,-3.52],[-11.39+4.40,-3.57],[-13.29+5.03,-3.79],[-15.98+5.65,-4.05],[-15.98+5.65,-4.05]],
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
