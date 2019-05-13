
import {player} from "main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "THROWNMARTHUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-10.09,-1.25],[-10.99,-1.37],[-11.38,-1.70],[-11.90,-2.13],[-11.85,-2.18],[-11.65,-2.14],[-11.39,-2.06],[-11.15,-1.98],[-11.01,-1.92],[-11.00,-1.92],[-13.13,-0.07],[-9.37,7.44],[-9.37,7.44]],
  init : function(p,input){
    player[p].actionState = "THROWNMARTHUP";

    const grabbedBy = player[p].phys.grabbedBy;
    if(grabbedBy === -1){
      return;
    }
    if (grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x,player[grabbedBy].phys.pos.y);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      let timer = player[p].timer;
      if (timer > 0){
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > this.offset.length){
          timer = this.offset.length - 1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x+this.offset[timer-1][0]*player[p].phys.face,player[grabbedBy].phys.pos.y+this.offset[timer-1][1]);
      }
    }
  },
  interrupt : function(p,input){
    return false;
  }
};
