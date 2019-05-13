import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCONBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-4.70,-2.40],[0.94,-2.09],[3.88,-0.96],[4.88,-0.71],[5.34,-0.63],[4.99,-0.56],[3.77,-0.48],[2.00,-0.41],[-1.63,-0.41],[-2.40,-0.55],[2.15,-0.74],[10.83,-8.25],[11.44,8.70],[12.05,9.14],[11.45,8.56],[10.85,7.98],[11.46,8.67],[12.07,9.37],[11.47,8.87],[11.47,8.87]],
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
