import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCONBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-4.21,3.15],[1.43,3.46],[4.36,4.59],[5.37,4.84],[5.82,4.92],[5.48,4.99],[4.26,5.07],[2.49,5.14],[-1.14,5.14],[-1.91,5.00],[2.63,4.81],[11.32,13.80],[11.93,14.24],[12.53,14.69],[11.94,14.11],[11.34,13.53],[11.95,14.22],[12.55,14.91],[11.96,14.42],[11.96,14.42]],
  init : function(p,input){
    player[p].actionState = "THROWNFALCONBACK";
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
