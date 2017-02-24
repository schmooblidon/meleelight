
import {player} from "main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "THROWNPUFFDOWN",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-10.26,-2.32],[-7.67,-3.61],[-4.94,-4.86],[-3.10,-5.80],[-0.94,-6.89],[-0.90,-6.87],[-1.00,-6.82],[-1.01,-6.86],[-0.94,-6.92],[-0.97,-6.90],[-1.02,-6.88],[-1.04,-6.86],[-1.00,-6.87],[-0.93,-6.88],[-0.91,-6.91],[-0.92,-6.94],[-0.91,-6.93],[-0.92,-6.90],[-0.92,-6.87],[-0.97,-6.87],[-1.00,-6.89],[-0.98,-6.92],[-0.96,-6.92],[-0.92,-6.89],[-0.89,-6.85],[-0.91,-6.84],[-0.96,-6.87],[-0.95,-6.92],[-0.93,-6.97],[-0.93,-6.95],[-0.95,-6.88],[-0.89,-6.82],[-0.84,-6.83],[-0.89,-6.89],[-0.94,-6.90],[-0.96,-6.89],[-0.96,-6.86],[-0.90,-6.84],[-0.86,-6.88],[-0.88,-6.93],[-0.88,-6.91],[-0.90,-6.88],[-0.92,-6.86],[-0.97,-6.86],[-1.00,-6.88],[-1.00,-6.92],[-0.98,-6.93],[-0.94,-6.90],[-0.91,-6.85],[-0.94,-6.83],[-0.99,-6.85],[-0.98,-6.89],[-0.98,-6.92],[-0.96,-6.91],[-0.95,-6.88],[-0.91,-6.83],[-0.90,-6.83],[-0.94,-6.89],[-0.93,-6.91],[-0.90,-6.95],[-0.93,-6.94],[-0.98,-6.92],[-0.98,-6.92]],
  init : function(p,input){
    player[p].actionState = "THROWNPUFFDOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

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
