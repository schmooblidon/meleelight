import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCODOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-6.04,-5.52],[-3.24,-6.90],[-2.69,-7.05],[-2.60,-6.95],[-2.61,-6.51],[-2.80,-4.59],[-2.00,-1.07],[-0.90,0.29],[0.14,0.55],[0.66,0.47],[0.73,-0.07],[0.74,-0.14],[0.76,0.15],[0.71,0.42],[-0.11,1.68],[-1.25,-1.01],[-1.41,-9.57],[-1.43,-9.58],[-1.41,-8.46],[-1.37,-7.84],[-1.30,-7.53],[-1.21,-7.23],[-1.13,-7.17],[-1.06,-7.62],[-1.06,-10.10],[-1.06,-9.77],[-1.06,-9.44],[-1.06,-9.12],[-1.06,-8.82],[-1.06,-8.53],[-1.06,-8.28],[-1.06,-8.05],[-1.06,-7.86],[-1.06,-7.71],[-1.06,-7.71]],
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
