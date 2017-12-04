
import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFESCAPEQUICK",
  offset : [[-70.67906,-13.98],[-71.27813,-12.96],[-71.87907,-11.55],[-72.24,-9.6],[-72.24,-6.62999],[-72.24,-3.84],[-71.35111,-1.99114],[-69.60889,-0.5689],[-67.19112,0]],
  setVelocities : [0.7218,1.0418,1.11641,1.55599,1.324,0.93156,1.16625,0.78219,0.37686,0.33425,0.24889,0.27022,0.35558,0.3342,1.92,2.4414,2.54756,2.57555,2.52538,2.39703,2.19051,1.90581,1.54296,1.10192,0.73904,0.52734,0.34701,0.19804],
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
      const onLedge = player[p].phys.onLedge;
      if(onLedge === -1){
        this.canGrabLedge = false;
        return;
      }
      const l = activeStage.ledge[onLedge];
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
