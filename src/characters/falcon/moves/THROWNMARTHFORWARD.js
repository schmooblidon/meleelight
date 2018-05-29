import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNMARTHFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-10.71,-1.57],[-12.51,-1.72],[-10.88,0.62],[-10.58,0.96],[-10.36,1.08],[-10.22,1.09],[-10.19,1.03],[-10.31,0.91],[-10.62,0.77],[-13.13,0.25],[-14.14,-0.52],[-12.47,-2.58],[-10.77,-5.69],[-9.18,-9.98],[-9.18,-9.98]],
  init : function(p,input){
    player[p].actionState = "THROWNMARTHFORWARD";
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
        if(timer > this.offset.length){
          timer = this.offset.length -1;
        }
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x+this.offset[timer-1][0]*player[p].phys.face,player[grabbedBy].phys.pos.y+this.offset[timer-1][1]);
      }
    }
  },
  interrupt : function(p,input){
    return false;
  }
};
