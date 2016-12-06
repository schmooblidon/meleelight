import {checkForSpecials, checkForAerials, airDrift, fastfall, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "FALLAERIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p){
    player[p].actionState = "FALLAERIAL";
    player[p].timer = 0;
    actionStates[characterSelections[p]].FALLAERIAL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].FALLAERIAL.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lsY[0] > 0.7 && player[p].inputs.lsY[1] <= 0.7)) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
      if (player[p].inputs.lsX[0]*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p);
      }
      else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p);
      }
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].FALLAERIAL){
      actionStates[characterSelections[p]].FALLAERIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

