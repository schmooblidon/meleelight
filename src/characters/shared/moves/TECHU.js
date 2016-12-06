import {airDrift, fastfall, actionStates, turnOffHitboxes} from "physics/actionStateShortcuts";
import {characterSelections,  player} from "main/main";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "TECHU",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "TECHU";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    drawVfx("tech",player[p].phys.ECBp[2]);
    sounds.tech.play();
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].TECHU.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].TECHU.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].TECHU){
      actionStates[characterSelections[p]].FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

