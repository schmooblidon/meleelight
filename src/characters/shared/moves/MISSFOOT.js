import {airDrift, fastfall, actionStates, turnOffHitboxes} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
export default {
  name : "MISSFOOT",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "MISSFOOT";
    player[p].timer = 0;
    player[p].hit.hitstun = 0;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].MISSFOOT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].MISSFOOT.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 26){
      actionStates[characterSelections[p]].DAMAGEFALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

