import {checkForSpecials, checkForAerials, airDrift, fastfall, actionStates, turnOffHitboxes} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";

import {framesData} from 'main/characters';
export default {
  name : "DAMAGEFALL",
  canPassThrough : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 2,
  vCancel : true,
  init : function(p,input){
    player[p].actionState = "DAMAGEFALL";
    player[p].timer = 0;
    turnOffHitboxes(p);
    actionStates[characterSelections[p]].DAMAGEFALL.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DAMAGEFALL.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
    }
  },
  interrupt : function(p,input){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    }
    else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    }
    else if (((input[p][0].x && !input[p][1].x) || (input[p][0].y && !input[p][1].y) || (input[p][0].lsY > 0.7 && input[p][1].lsY <= 0.7)) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
      if (input[p][0].lsX*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p,input);
      }
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if ((input[p][0].lsX > 0.7 && input[p][1].lsX < 0.7) || (input[p][0].lsX < -0.7 && input[p][1].lsX > -0.7) || (input[p][0].lsY > 0.7 && input[p][1].lsY < 0.7) || (input[p][0].lsY < -0.7 && input[p][1].lsY > -0.7)){
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].DAMAGEFALL){
      actionStates[characterSelections[p]].DAMAGEFALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

