
import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFGETUPQUICK",
  canBeGrabbed : true,
  offset : [[-70.40894,-24.65279],[-70.49549,-24.19316],[-70.59016,-23.76442],[-70.68344,-23.28989],[-70.76582,-22.69287],[-70.82779,-21.89668],[-70.85985,-20.82461],[-70.85247,-19.4],[-70.82135,-17.47271],[-70.78225,-15.05862],[-70.72578,-12.33002],[-70.64259,-9.45922],[-70.52329,-6.61851],[-70.35851,-3.98021],[-70.13887,-1.71661],[-69.855,0],[-69.44187,0.27703],[-68.88137,0.35459],[-67.58757,0]],
  setVelocities : [0.67232,0.63676,0.54022,0.50953,0.56807,0.60068,0.60737,0.58812,0.54294,0.47183,0.37479,0.25182,0.10292],
  init : function(p,input){
    player[p].actionState = "CLIFFGETUPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 22;
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
      const l = activeStage.ledge[player[p].phys.onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 20){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-20]*player[p].phys.face;
      }
      if (player[p].timer === 20){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 32){
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
