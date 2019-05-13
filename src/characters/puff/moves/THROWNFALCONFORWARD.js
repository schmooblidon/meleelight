import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCONFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-7.45,6.34],[-6.58,6.94],[-5.92,7.32],[-5.61,7.33],[-5.37,7.22],[-5.21,7.05],[-5.11,6.90],[-5.09,6.82],[-5.95,7.28],[-6.53,7.36],[-7.06,7.51],[-7.54,7.51],[-7.85,7.61],[-8.17,7.72],[-7.59,7.53],[-7.01,7.34],[-7.28,7.43],[-7.28,7.43]],
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
