import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCONDOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-3.83,-1.75],[3.24,-2.20],[8.47,-2.48],[10.62,-1.52],[12.15,-0.31],[13.33,1.11],[13.67,3.29],[10.51,5.72],[6.51,6.35],[1.40,4.20],[-4.81,1.50],[-9.35,-1.63],[-10.37,-5.72],[-9.45,-9.45],[-9.06,-10.44],[-9.06,-10.06],[-9.06,-9.92],[-9.06,-10.21],[-9.06,-10.44],[-9.06,-10.53],[-9.06,-10.53]],
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
