import {Vec2D} from "main/util/Vec2D";
import {player} from "main/main";
export default {
  name : "THROWNPUFFUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  offset : [[-11.67,-7.58],[-10.82,-7.98],[-9.46,-8.40],[-7.03,-8.35],[-2.82,-7.60],[1.82,-6.29],[3.94,-4.87],[3.85,-3.69],[3.85,-3.69]],
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
