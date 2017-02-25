/* eslint-disable */
import DOWNSPECIALAIRLOOP from "characters/falco/moves/DOWNSPECIALAIRLOOP";
import {player} from "main/main";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

export default {
  name : "DOWNSPECIALAIRTURN",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALAIRTURN";
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

      if (player[p].shineLoop === 6){
        player[p].shineLoop = 0;
      }
      player[p].shineLoop++;
      drawVfx({
        name:"shineloop",
        pos:new Vec2D(0,0),
        face:p});
    }
  },
  interrupt : function(p,input) {
    if (player[p].timer > 3){
      player[p].phys.face *= -1;
      DOWNSPECIALAIRLOOP.init(p,input);
      return true;
    } 
    else {
      return false;
    }
  },
  land : function(p,input) {
    player[p].actionState = "DOWNSPECIALGROUNDTURN";
  }
};