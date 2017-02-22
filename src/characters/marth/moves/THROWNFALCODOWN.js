import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCODOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-4.47,-1.65],[-2.03,-2.99],[-1.69,-3.03],[-1.70,-2.64],[-1.88,-0.66],[-0.88,3.40],[0.42,4.44],[1.48,4.62],[1.64,4.08],[1.65,3.84],[1.67,4.18],[1.54,4.48],[-0.02,7.33],[-0.47,-5.16],[-0.52,-5.64],[-0.49,-4.32],[-0.43,-3.75],[-0.34,-3.36],[-0.24,-3.15],[-0.15,-3.52],[-0.15,-6.06],[-0.15,-5.67],[-0.15,-5.28],[-0.15,-4.91],[-0.15,-4.57],[-0.15,-4.26],[-0.15,-4.00],[-0.15,-3.79],[-0.15,-3.79]],
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
