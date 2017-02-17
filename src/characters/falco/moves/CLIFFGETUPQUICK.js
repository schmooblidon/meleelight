
import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFGETUPQUICK",
  canBeGrabbed : true,
  offset : [[-70.7039,-13.92],[-71.27977,-12.96],[-71.69937,-12.06755],[-72.07638,-11.06843],[-72.24,-9.6],[-72.24,-6.74401],[-72.24,-3.84],[-71.35111,-1.99111],[-69.60889,-0.56889],[-67.19112,0]],
  setVelocities : [0.48171,0.47829,0.50249,0.51401,0.45477,0.32475,0.12398,0,0,0,0],
  init : function(p,input){
    player[p].actionState = "CLIFFGETUPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 30;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      const l = activeStage.ledge[player[p].phys.onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
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
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 33){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
