
import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFESCAPEQUICK",
  offset : [[-71.01,-16.02],[-71.70,-14.85],[-72.39,-13.23],[-72.8,-11],[-72.8,-7.60],[-72.8,-4.4],[-71.78,-2.28],[-69.79,-0.65],[-67.01,0]],
  setVelocities : [0.83,1.19,1.28,1.78,1.52,1.07,1.34,0.90,0.43,0.38,0.29,0.31,0.41,0.38,2.2,2.80,2.92,2.95,2.89,2.75,2.51,2.18,1.77,1.26,0.85,0.60,0.40,0.23],
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "CLIFFESCAPEQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 34;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      const l = activeStage.ledge[player[p].phys.onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 22){
        if (player[p].timer >= 13){
          player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-13][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-13][1]);
        }
      }
      else if (player[p].timer < 50){
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-22]*player[p].phys.face;
      }
      if (player[p].timer === 22){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 49){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }

};
