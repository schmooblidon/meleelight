import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCONFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-7.94,-2.51],[-7.07,-1.90],[-6.40,-1.53],[-6.10,-1.52],[-5.86,-1.63],[-5.70,-1.80],[-5.60,-1.95],[-5.58,-2.03],[-6.44,-1.57],[-7.02,-1.48],[-7.55,-1.34],[-8.02,-1.33],[-8.34,-1.23],[-8.66,-1.13],[-8.08,-1.32],[-7.50,-1.51],[-7.77,-1.42],[-7.77,-1.42]],
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
