/* eslint-disable */
//import DOWNSPECIALAIREND from "characters/falco/moves/DOWNSPECIALAIREND";
//import DOWNSPECIALAIRTURN from "characters/falco/moves/DOWNSPECIALAIRTURN";
import {player} from "main/main";
import {sounds} from "main/sfx";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
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
    player[p].actionState = "DOWNSPECIALAIRSTART";
    player[p].timer = 0;
    player[p].inShine = 0;
    sounds.foxshine.play();
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("shine",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+6));
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecial.id0;
    this.main(p,input);
  },
  main : function(p,input) {
    player[p].timer++;
    player[p].inShine++;
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

      if (player[p].timer >= 2){
        player[p].phys.cVel.y -= 0.02667;
        if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
          player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
        }
      }

      if (player[p].timer >= 0 && player[p].timer <= 28){
        if (player[p].shineLoop === 6){
          player[p].shineLoop = 0;
        }
        player[p].shineLoop++;
        drawVfx("shineloop",new Vec2D(0,0),p);
      }

      if (player[p].timer >= 4 && player[p].timer <= 32){
        if (player[p].phys.inShine >= 22){
          if (!input[p][0].b){
            player[p].timer = 36;
          }
          else if (player[p].timer === 32){
            player[p].timer = 4;
          }
        }
      }
    }
  },
  interrupt : function(p,input) {
    if (input[p][0].lsX*player[p].phys.face < 0){
      //DOWNSPECIALAIRTURN.init(p,input);
      return true;
    }
    else if (player.timer > 28) {
      //DOWNSPECIALAIRLOOP.init(p,input);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input) {
    player[p].actionState = "DOWNSPECIALGROUNDSTART";
  }
};