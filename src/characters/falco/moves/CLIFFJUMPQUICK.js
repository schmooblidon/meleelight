
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {airDrift, fastfall} from "physics/actionStateShortcuts";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFJUMPQUICK",
  offset : [[-71.20,-16.23],[-71.95,-16.05],[-72.74,-15.89],[-72.50,-15.66],[-74.12,-15.28],[-74.50,-14.67],[-74.55,-13.75],[-74.25,-12.49],[-73.68,-10.94],[-72.91,-9.19],[-72.01,-7.30],[-71.04,-5.37],[-70.07,-3.45],[-69.17,-1.64]],
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "CLIFFJUMPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 14;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      const l = activeStage.ledge[player[p].phys.onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 15){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      if (player[p].timer === 15){
        player[p].phys.cVel = new Vec2D(1*player[p].phys.face,3.9);
      }
      if (player[p].timer > 15){
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
