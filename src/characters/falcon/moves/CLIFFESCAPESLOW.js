
import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFESCAPESLOW",
  offset : [[-70.85152,-23.09623],[-70.85152,-23.09623],[-70.85152,-23.09623],[-70.85152,-23.09623],[-70.85152,-23.09623],[-70.85152,-23.09623],[-70.86218,-23.09623],[-70.85152,-23.09623],[-70.80037,-21.27142],[-70.4922,-19.44661],[-70.69807,-17.62179],[-70.64692,-15.79698],[-70.59576,-13.97217],[-70.54461,-12.14736],[-70.49346,-10.32254],[-70.44231,-8.49773],[-70.39115,-6.67292],[-70.34,-4.84811],[-70.34,-3.02566],[-70.34,-1.22221],[-70.34,0.22281],[-70.34,0.97],[-70.34,0.89538],[-70.34,0.82077],[-70.34,0.74615],[-70.34,0.67154],[-70.34,0.59692],[-70.34,0.52231],[-70.34,0.44769],[-70.34,0.37308],[-70.34,0.29846],[-70.34,0.22385],[-70.34,0.14923],[-70.34,0.07462],[-70.34,0],[-69.01297,0.00023],[-64.42897,0]],
  setVelocities : [2.98649,3.41049,3.564,3.75927,3.76332,3.14741,2.41238,2.0345,1.75106,1.56206,1.45702,1.37699,1.30299,1.23505,1.17316,1.11729,1.06749,1.00609,0.92840,0.84964,0.76983,0.68898,0.60706,0.52241,0.43808,0.35727,0.27999,0.20623,0.13601,0.08681,0.05876,0.03442,0.01377,-0.00316,-0.01640,-0.02592,-0.03175,-0.03388,-0.03229,-0.02701,-0.01802],
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "CLIFFESCAPESLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 54;
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
      if (player[p].timer < 38){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-38]*player[p].phys.face;
      }
      if (player[p].timer === 38){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 78){
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
