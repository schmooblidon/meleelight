import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFALCONBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-3.78,1.60],[1.86,1.91],[4.79,3.04],[5.79,3.29],[6.25,3.37],[5.91,3.44],[4.69,3.52],[2.92,3.59],[-0.72,3.59],[-1.49,3.45],[3.06,3.26],[11.75,12.25],[12.35,12.70],[12.96,13.14],[12.36,12.56],[11.77,11.98],[12.37,12.67],[12.98,13.37],[12.38,12.87],[12.38,12.87]],
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
