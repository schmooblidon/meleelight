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
  init : function(p,input){
    player[p].actionState = "SHIELDBREAKFALL";
    player[p].timer = 0;
    actionStates[characterSelections[p]].SHIELDBREAKFALL.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SHIELDBREAKFALL.interrupt(p,input)){
      player[p].phys.intangibleTimer = 1;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].SHIELDBREAKFALL){
      actionStates[characterSelections[p]].SHIELDBREAKFALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    actionStates[characterSelections[p]].SHIELDBREAKDOWNBOUND.init(p,input);
  }
};

