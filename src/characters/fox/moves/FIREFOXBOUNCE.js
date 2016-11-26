/* globals player */

import FALLSPECIAL from "characters/shared/moves/FALLSPECIAL";

export default {
  name : "FIREFOXBOUNCE",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  setVelocities : [0.00062,0.00062,0.00062,5.27148,5.4568,2.56,0.0638,0.02712,-0.00286,-0.02613,-0.0427,-0.05257,-0.05573,-1.83217],
  landType : 1,
  init : function(p){
    player[p].actionState = "FIREFOXBOUNCE";
    player[p].timer = 0;
    player[p].phys.grounded = false;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      if (player[p].phys.cVel.x !== 0){
        player[p].phys.cVel.x -= 0.03*player[p].phys.face;
        if (player[p].phys.cVel.x*player[p].phys.face < 0){
          player[p].phys.cVel.x = 0;
        }
      }
      player[p].phys.cVel.y = this.setVelocities[player[p].timer-1];
    }
  },
  interrupt : function(p){
    if (player[p].timer > 14){
      if (player[p].phys.grounded){
      }
      else {
        FALLSPECIAL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};
