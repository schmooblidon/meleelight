import {characterSelections, player} from "main/main";
import {actionStates} from "physics/actionStateShortcuts";
import {framesData} from 'main/characters';
export default {
  name : "SHIELDBREAKFALL",
  canPassThrough : false,
  canBeGrabbed : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  landType : 1,
  init : function(p){
    player[p].actionState = "SHIELDBREAKFALL";
    player[p].timer = 0;
    actionStates[characterSelections[p]].SHIELDBREAKFALL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SHIELDBREAKFALL.interrupt(p)){
      player[p].phys.intangibleTimer = 1;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].SHIELDBREAKFALL){
      actionStates[characterSelections[p]].SHIELDBREAKFALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    actionStates[characterSelections[p]].SHIELDBREAKDOWNBOUND.init(p);
  }
};

