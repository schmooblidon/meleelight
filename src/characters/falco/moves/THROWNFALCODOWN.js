import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCODOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-4.55,-0.25],[-2.34,-1.47],[-2.11,-1.42],[-2.11,-0.82],[-2.09,2.57],[-0.63,5.71],[-0.72,6.11],[-1.18,5.83],[1.23,5.31],[1.24,5.70],[1.13,6.03],[-0.51,8.76],[-0.91,-3.89],[-0.94,-3.84],[-0.90,-2.46],[-0.83,-2.05],[-0.72,-1.66],[-0.61,-1.72],[-0.57,-4.24],[-0.57,-4.22],[-0.57,-3.79],[-0.57,-3.39],[-0.57,-3.01],[-0.57,-2.68],[-0.57,-2.40],[-0.57,-2.19],[-0.57,-2.19],
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
