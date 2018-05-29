import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFOXFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-8.23-0.08,-6.32],[-7.66-0.22,-5.58],[-7.63-0.24,-5.42],[-7.82,-5.41],[-7.93+0.68,-5.25],[-8.14+1.67,-5.05],[-8.55+2.69,-4.90],[-9.26+3.47,-4.83],[-10.52+4.04,-4.93],[-12.52+4.61,-5.17],[-12.52+4.61,-5.17]],
  init : function(p,input){
    player[p].actionState = "THROWNFOXFORWARD";
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
          player[p].timer = this.offset.length -1;
        }
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
