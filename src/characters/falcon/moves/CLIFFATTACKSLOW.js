
import WAIT from "characters/shared/moves/WAIT";
import {player, characterSelections} from "main/main";
import {turnOffHitboxes, randomShout} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFATTACKSLOW",
  offset : [[-70.4343,-24.8293],[-70.54089,-24.38752],[-70.65158,-23.92871],[-70.75817,-23.48693],[-70.85247,-23.09623],[-70.85247,-23.09623],[-70.86314,-23.09623],[-70.85247,-23.09623],[-70.80122,-21.27161],[-70.74998,-19.44699],[-70.69873,-17.62236],[-70.64748,-15.79774],[-70.59624,-13.97312],[-70.54499,-12.14849],[-70.49374,-10.32387],[-70.4425,-8.49925],[-70.39125,-6.67462],[-70.34,-4.85],[-70.26962,-2.93533],[-70.18314,-0.97231],[-70.05383,0.62812],[-69.855,1.455],[-69.60455,1.68426],[-69.33985,1.77977],[-69.06341,1.76256],[-68.7773,1.65361],[-68.48532,1.47393],[-67.89203,0]],
  setVelocities : [0.29838,0.29761,0.29434,0.28856,0.28028,0.2695,0.2666,0.27256,0.27748,0.28139,0.28426,0.28611,0.28693,0.28672,0.28549,0.28323,0.27995,0.27563,0.27029,0.26393,0.25643,0.24811,0.23867,0.22819,0.21669,0.20416,0.19061,0.17603,0.16042,0.12121,0.06452,0.01601,-0.02433,-0.0565,-0.0805,-0.09632,-0.10397,-0.10344,-0.09475,-0.07788],
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "CLIFFATTACKSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 33;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupslow.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupslow.id1;
    sounds.falcondoublejump.play();
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
      if (player[p].timer < 29){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-29]*player[p].phys.face;
      }
      if (player[p].timer === 29){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer === 37){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
      }
      else if (player[p].timer > 37 && player[p].timer < 41){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 41){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 68){
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
