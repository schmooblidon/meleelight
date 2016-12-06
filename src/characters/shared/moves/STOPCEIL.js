import {airDrift, actionStates, turnOffHitboxes} from "physics/actionStateShortcuts";
import { characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "STOPCEIL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "STOPCEIL";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].STOPCEIL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].STOPCEIL.interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.kVel.y *= -0.8;
        player[p].phys.kVel.x *= 0.8;
        player[p].phys.kDec.y *= -1
      }
      if (player[p].hit.hitstun > 0){
        if (player[p].hit.hitstun % 10 == 0){
          drawVfx("flyingDust",player[p].phys.pos);
        }
        player[p].hit.hitstun--;
        player[p].phys.cVel.y -= player[p].charAttributes.gravity;
        if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
          player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
        }
      }
      else {
        airDrift(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 5 && player[p].hit.hitstun <= 0){
      actionStates[characterSelections[p]].FALL.init(p);
    }
    else if (player[p].timer > framesData[characterSelections[p]].STOPCEIL){
      if (player[p].hit.hitstun <= 0){
        actionStates[characterSelections[p]].DAMAGEFALL.init(p);
        return true;
      }
      else {
        player[p].timer = framesData[characterSelections[p]].STOPCEIL;
        return false;
      }
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].hit.hitstun > 0){
      if (player[p].phys.techTimer > 0){
        if (player[p].inputs.lsX[0]*player[p].phys.face > 0.5){
          actionStates[characterSelections[p]].TECHF.init(p);
        }
        else if (player[p].inputs.lsX[0]*player[p].phys.face < -0.5){
          actionStates[characterSelections[p]].TECHB.init(p);
        }
        else {
          actionStates[characterSelections[p]].TECHN.init(p);
        }
      }
      else {
        actionStates[characterSelections[p]].DOWNBOUND.init(p);
      }
    }
    else {
      actionStates[characterSelections[p]].LANDING.init(p);
    }
  }
};

