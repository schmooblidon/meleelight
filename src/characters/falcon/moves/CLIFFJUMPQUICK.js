
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {airDrift, fastfall} from "physics/actionStateShortcuts";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFJUMPQUICK",
  offset : [[-70.52496,-21.46018],[-70.16484,-19.69693],[-69.78724,-17.85424],[-69.40706,-15.97989],[-69.23444,-14.12162],[-69.18485,-12.32722],[-69.25816,-10.64442],[-69.20927,-9.74988],[-68.71929,-8.59644],[-68.73582,-5.89918],[-68.6923,-2.71084]],
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "CLIFFJUMPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 11;
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
      if (player[p].timer < 12){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      if (player[p].timer === 12){
        player[p].phys.cVel = new Vec2D(1*player[p].phys.face,3.3);
      }
      if (player[p].timer > 12){
        airDrift(p,input);
        fastfall(p,input);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 42){
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
