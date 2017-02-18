/* eslint-disable */
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {turnOffHitboxes} from "physics/actionStateShortcuts";

export default {
  name : "DOWNSPECIALAIREND",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALAIREND";
    player[p].timer = 0;
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input) {
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].phys.cVel.x > 0){
        if (player[p].phys.cVel.x > 0.85){
          player[p].phys.cVel.x -= 0.03;
        }
        else {
          player[p].phys.cVel.x -= 0.02;
        }
        if (player[p].phys.cVel.x < 0){
          player[p].phys.cVel.x = 0;
        }
      }
      else if (player[p].phys.cVel.x < 0){
        if (player[p].phys.cVel.x < -0.85){
          player[p].phys.cVel.x += 0.03;
        }
        else {
          player[p].phys.cVel.x += 0.02;
        }
        if (player[p].phys.cVel.x > 0){
          player[p].phys.cVel.x = 0;
        }
      }

      player[p].phys.cVel.y -= 0.02667;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
  },
  interrupt : function(p,input) {
    if (player[p].timer > 18){
      FALL.init(p,input);
      return true;
    } 
    else {
      return false;
    }
  },
  land : function(p,input) {
    player[p].actionState = "DOWNSPECIALGROUNDEND";
  }
};