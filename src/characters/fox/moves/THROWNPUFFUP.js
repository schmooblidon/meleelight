import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNPUFFUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-10.63,-3.65],[-9.46,-4.14],[-7.29,-4.39],[-2.98,-3.79],[2.65,-2.33],[4.95,-0.64],[4.95,-0.64],[4.95,-0.64]],
  init : function(p,input){
    player[p].actionState = "THROWNPUFFUP";
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
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer > 0){
        if(player[p].phys) {
          const grabbedBy = player[p].phys.grabbedBy;
          if(grabbedBy === -1){
            return;
          }
          if (grabbedBy !== -1) {
            if(player[p].timer > this.offset.length){
              player[p].timer = this.offset.length -1;
            }
            player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + this.offset[player[p].timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + this.offset[player[p].timer - 1][1]);
          }
        }
      }
    }
  },
  interrupt : function(p,input){
    return false;
  }
};
