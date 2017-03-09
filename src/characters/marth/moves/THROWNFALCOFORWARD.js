import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCOFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-8.33-0.12,-1.07],[-7.71-0.28,-0.26],[-7.87-0.20,-0.21],[-8.04+0.40,-0.08],[-8.26+1.61,0.17],[-8.74+2.97,0.39],[-9.67+4.00,0.49],[-11.45+4.75,0.32],[-14.34+5.50,0.01],[-14.34+5.50,0.01]],
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
