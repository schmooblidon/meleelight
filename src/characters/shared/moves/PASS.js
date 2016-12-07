import {checkForSpecials, checkForAerials, airDrift, fastfall, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "PASS",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p,input){
    player[p].actionState = "PASS";
    player[p].timer = 0;
    player[p].phys.grounded = false;
    player[p].phys.passFastfall = false;
    player[p].phys.abovePlatforms[player[p].phys.onSurface[1]] = false;
    player[p].phys.cVel.y = -0.5;
    actionStates[characterSelections[p]].PASS.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (player[p].timer > 1){
      if (!actionStates[characterSelections[p]].PASS.interrupt(p,input)){
        if (player[p].phys.passFastfall){
          fastfall(pminput,input);
        }
        else {
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
          if (input[p].lsY[0] > -0.3){
            player[p].phys.passFastfall = true;
          }
        }
        airDrift(p,input);
      }
    }
  },
  interrupt : function(p,input){
    var a = checkForAerials(p,input);
    var b = checkForSpecials(p,input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    }
    else if ((input[p].l[0] && !input[p].l[1]) || (input[p].r[0] && !input[p].r[1])){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    }
    else if (((input[p].x[0] && !input[p].x[1]) || (input[p].y[0] && !input[p].y[1]) || (input[p].lsY[0] > 0.7 && input[p].lsY[1] <= 0.7)) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
      if (input[p].lsX[0]*player[p].phys.face < -0.3){
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
    else if (player[p].timer > framesData[characterSelections[p]].PASS){
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

