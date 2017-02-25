import {characterSelections, player} from "main/main";
import {actionStates} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
import {getHorizontalDecay, getVerticalDecay} from "physics/hitDetection";
import {reflect, dotProd} from "main/linAlg";
import {Vec2D} from "main/util/Vec2D";

export default {
  name : "WALLDAMAGE",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  canBeGrabbed : true,
  headBonk : true,
  landType : 2,
  init : function(p,input,normal){
    player[p].actionState = "WALLDAMAGE";
    player[p].timer = 0;
    sounds.bounce.play();
    player[p].phys.hurtBoxState = 1;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,15);
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    const tangent = new Vec2D(-normal.y, normal.x);
    const totalVel = new Vec2D(player[p].phys.kVel.x+player[p].phys.cVel.x, player[p].phys.kVel.y+player[p].phys.cVel.y);
    const reflectedDec = dotProd(totalVel,normal) < 0 ? reflect(player[p].phys.kDec, tangent) : player[p].phys.kDec;
    const reflectedVel = dotProd(totalVel,normal) < 0 ? reflect(totalVel, tangent) : player[p].phys.kVel;
    player[p].phys.kVel.x = reflectedVel.x * 0.8;
    player[p].phys.kVel.y = reflectedVel.y * 0.8;
    player[p].phys.kDec.x = reflectedDec.x;
    player[p].phys.kDec.y = reflectedDec.y;

    actionStates[characterSelections[p]].WALLDAMAGE.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (player[p].hit.hitstun % 10 === 0){
      drawVfx({
        name: "flyingDust",
        pos: player[p].phys.pos
      });
    }
    if (!actionStates[characterSelections[p]].WALLDAMAGE.interrupt(p,input)){
      player[p].hit.hitstun--;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].WALLDAMAGE){
      actionStates[characterSelections[p]].DAMAGEFALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

