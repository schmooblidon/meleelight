import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFOXBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-8.79,-7.11],[-8.24,-7.16],[-7.10,-7.45],[-4.65,-8.14],[-2.11,-9.02],[-0.40,-9.79],[3.10,-9.87],[5.54,-4.40],[7.02,-2.32],[7.02,-2.32]],
  init : function(p,input){
    player[p].actionState = "THROWNFOXBACK";
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
    player[p].phys.face *= -1;
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
          timer = this.offset.length -1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x+this.offset[timer-1][0]*player[p].phys.face,player[grabbedBy].phys.pos.y+this.offset[timer-1][1]);
      }
    }
  },
  interrupt : function(p,input){
    return false;
  }
};
