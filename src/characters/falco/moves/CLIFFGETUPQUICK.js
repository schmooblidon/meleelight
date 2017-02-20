
import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFGETUPQUICK",
  canBeGrabbed : true,
  offset : [[-71.04,-15.95],[-71.70,-14.85],[-72.18,-13.83],[-72.61,-12.68],[-72.8,-11],[-72.8,-7.73],[-72.8,-4.4],[-71.78,-2.28],[-69.79,-0.65],[-67.01,0]],
  setVelocities : [0.55,0.55,0.58,0.59,0.52,0.37,0.14,0,0,0,0],
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
