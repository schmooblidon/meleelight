import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCODOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-4.26,-0.39],[-2.27,-1.49],[-2.11,-1.36],[-2.17,-0.28],[-1.60,4.25],[-0.06,5.97],[1.11,6.14],[1.22,5.42],[1.23,5.58],[1.21,5.92],[-0.05,8.41],[-0.89,-3.42],[-0.94,-4.01],[-0.90,-2.52],[-0.83,-2.05],[-0.71,-1.65],[-0.60,-1.79],[-0.57,-4.56],[-0.57,-4.10],[-0.57,-3.66],[-0.57,-3.23],[-0.57,-2.85],[-0.57,-2.53],[-0.57,-2.27],[-0.57,-2.27]],
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
