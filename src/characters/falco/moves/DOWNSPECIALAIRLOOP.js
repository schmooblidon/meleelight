/* eslint-disable */
import DOWNSPECIALAIREND from "characters/falco/moves/DOWNSPECIALAIREND";
import DOWNSPECIALAIRTURN from "characters/falco/moves/DOWNSPECIALAIRTURN";
import JUMPAERIALB from "characters/shared/moves/JUMPAERIALB";
import JUMPAERIALF from "characters/shared/moves/JUMPAERIALF";
import {player} from "main/main";
import {turnOffHitboxes, checkForDoubleJump} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

export default {
  name : "DOWNSPECIALAIRLOOP",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALAIRLOOP";
    player[p].timer = 0;
    player[p].hitboxes.id[0] = player[p].charHitboxes.reflector.id0;
    turnOffHitboxes(p);
    player[p].hitboxes.active = [true,false,false,false];
    player[p].hitboxes.frame = 0;
    this.main(p,input);
  },
  main : function(p,input) {
    player[p].timer++;
    player[p].phys.inShine++;
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

      if (player[p].timer >= 1){
        player[p].phys.cVel.y -= 0.02667;
        if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
          player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
        }
      }

      if (player[p].shineLoop === 6){
        player[p].shineLoop = 0;
      }
      player[p].shineLoop++;
      drawVfx({
        name:"shineloop",
        pos: new Vec2D(0,0),
        face:p
      });
    }
  },
  interrupt : function(p,input) {
    if (input[p][0].lsX*player[p].phys.face < 0){
      DOWNSPECIALAIRTURN.init(p,input);
      return true;
    }
    else if (player[p].phys.inShine >= 22 && !input[p][0].b){
      DOWNSPECIALAIREND.init(p,input);
      return true;
    }
    else if (checkForDoubleJump (p,input) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
      turnOffHitboxes(p);
      if (input[p][0].lsX*player[p].phys.face < -0.3){
        JUMPAERIALB.init(p,input);
      }
      else {
        JUMPAERIALF.init(p,input);
      }
      return true;
    }
    else if (player[p].timer > 28) {
      this.init(p,input);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input) {
    player[p].actionState = "DOWNSPECIALGROUNDLOOP";
  }
};