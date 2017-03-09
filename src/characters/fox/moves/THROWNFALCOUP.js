import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCOUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-7.47,-0.26],[-6.71,0.40],[-6.15,0.40],[-5.38,4.16],[-3.01,20.14],[-3.01,20.14]],
  init : function(p,input){
    player[p].actionState = "THROWNFALCOUP";
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
