import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNFOXDOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-5.22,-6.59],[-2.81,-7.81],[-2.39,-7.92],[-2.33,-7.79],[-2.33,-7.32],[-2.47,-5.14],[-1.53,-2.11],[-0.54,-1.39],[0.33,-1.23],[0.54,-1.52],[0.58,-1.98],[0.59,-1.73],[0.58,-1.54],[0.36,-1.41],[-0.93,1.04],[-1.27,-9.58],[-1.31,-10.30],[-1.30,-9.43],[-1.26,-8.65],[-1.21,-9.00],[-1.13,-9.73],[-1.06,-9.84],[-0.99,-8.33],[-0.99,-10.59],[-0.99,-10.30],[-0.99,-9.99],[-0.99,-9.70],[-0.99,-9.43],[-0.99,-9.17],[-0.99,-8.95],[-0.99,-8.75],[-0.99,-8.58],[-0.99,-8.58]],
  init : function(p,input){
    player[p].actionState = "THROWNFOXDOWN";
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
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x+this.offset[timer-1][0]*player[p].phys.face*-1,player[grabbedBy].phys.pos.y+this.offset[timer-1][1]);
      }
    }
  },
  interrupt : function(p,input){
    return false;
  }
};
