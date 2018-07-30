import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCONDOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-1.70,2.27],[6.49,1.63],[10.74,2.04],[12.76,3.41],[14.22,5.07],[14.34,7.74],[9.84,10.25],[4.80,9.54],[-2.32,6.06],[-8.30,2.55],[-9.31,-2.37],[-8.23,-6.33],[-8.15,-6.24],[-8.15,-5.85],[-8.15,-6.19],[-8.15,-6.45],[-8.15,-6.56],[-8.15,-6.56],[-8.15,-6.56],[-8.15,-6.56]],
  init : function(p,input){
    player[p].actionState = "THROWNFALCONDOWN";
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
