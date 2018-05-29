import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCONBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-4.21,6.45],[1.43,6.76],[4.36,7.89],[5.37,8.14],[5.82,8.22],[5.48,8.29],[4.26,8.37],[2.49,8.44],[-1.14,8.44],[-1.91,8.30],[2.63,8.11],[11.32,17.10],[11.93,17.54],[12.53,17.99],[11.94,17.41],[11.34,16.83],[11.95,17.52],[12.55,18.21],[11.96,17.72],[11.96,17.72]],
  init : function(p,input){
    player[p].actionState = "THROWNFALCONBACK";
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
