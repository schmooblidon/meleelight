
import {player} from "main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "THROWNPUFFBACK",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  reverseModel : true,
  //[1.05,7.14],[3.78,7.55],[10.37,1.56],[13.72,-6.85],[13.66,-9.95],[13.67,-10.28],[13.85,-9.92],[14.04,-9.34],[14.04,-9.34]],
  offset : [[-12.08,-7.32],[-12.35,-7.51],[-12.52,-7.76],[-12.54,-7.99],[-12.37,-8.13],[-11.89,-8.13],[-11.06,-8.06],[-10.04,-7.97],[-8.99,-7.78],[-8.01,-7.27],[-7.04,-6.08],[-5.90,-4.11],[-4.57,-1.98],[-3.05,-0.51],[-1.45,0.37],[-0.35,1.72],[0.41,3.50],[3.26,3.32],[8.92,-1.38],[12.42,-9.12],[12.86,-13.53],[12.71,-14.19],[12.79,-14.24],[12.96,-13.87],[13.11,-13.38],[13.26,-13.13],[13.26,-13.13]],
  offsetVel : [-0.12755,-1.24035,-3.10533,-2.72023,-0.32654],
  //7.53
  init : function(p,input){
    player[p].actionState = "THROWNPUFFBACK";
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
