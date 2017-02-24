
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {airDrift, fastfall} from "physics/actionStateShortcuts";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFJUMPSLOW",
  offset : [[-70.47,-16.12],[-70.32,-15.85],[-70.15,-15.59],[-69.99,-15.25],[-69.86,-14.72],[-69.77,-13.92],[-69.75,-12.73],[-70.06,-9.84],[-70.58,-5.60],[-70.75,-2.36],[-70.36,-0.85],[-69.83,-0.35],[-69.45,-1.06],[-69.48,-2.49],[-69.73,-3.35],[-69.88,-3.61],[-69.87,-3.72],[-69.73,-3.35],[-69.02,-1.70]],
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "CLIFFJUMPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 19;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      const l = activeStage.ledge[player[p].phys.onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 20){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      if (player[p].timer === 20){
        player[p].phys.cVel = new Vec2D(1*player[p].phys.face,3.9);
      }
      if (player[p].timer > 20){
        airDrift(p,input);
        fastfall(p,input);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 51){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
