/* globals player, stage, Vec2D */

import WAIT from "characters/shared/moves/WAIT";

export default {
  name : "CLIFFGETUPQUICK",
  canBeGrabbed : true,
  offset : [[-70.7039,-13.92],[-71.27977,-12.96],[-71.69937,-12.06755],[-72.07638,-11.06843],[-72.24,-9.6],[-72.24,-6.74401],[-72.24,-3.84],[-71.35111,-1.99111],[-69.60889,-0.56889],[-67.19112,0]],
  setVelocities : [0.48171,0.47829,0.50249,0.51401,0.45477,0.32475,0.12398,0,0,0,0],
  init : function(p){
    player[p].actionState = "CLIFFGETUPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 30;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      const x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 24){
        if (player[p].timer >= 14) {
          player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-14][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-14][1]);
        }
      }
      else {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-24]*player[p].phys.face;
      }
      if (player[p].timer === 24){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 33){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
