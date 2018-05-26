
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {airDrift, fastfall} from "physics/actionStateShortcuts";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFJUMPSLOW",
  offset : [[-70.66608,-21.52236],[-70.45539,-19.85754],[-70.2335,-18.12355],[-70.01323,-16.34217],[-69.80743,-14.53517],[-69.62891,-12.72434],[-69.49054,-10.93145],[-69.39681,-9.05661],[-69.33996,-7.05793],[-69.31442,-5.04416],[-69.31463,-3.12407],[-69.33501,-1.40643],[-69.37,0],[-69.51372,0.50389],[-69.73824,0.19807],[-69.855,0],[-69.8101,0.32332],[-69.65741,0.75444]],
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "CLIFFJUMPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 18;
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
      if (player[p].timer < 19){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      if (player[p].timer === 19){
        player[p].phys.cVel = new Vec2D(1*player[p].phys.face,3.3);
      }
      if (player[p].timer > 19){
        airDrift(p,input);
        fastfall(p,input);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 53){
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
