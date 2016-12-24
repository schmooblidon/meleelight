import {checkForSpecials, checkForAerials, checkForDoubleJump, airDrift, fastfall, actionStates} from "physics/actionStateShortcuts";
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
          fastfall(p,input);
        }
        else {
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
          if (input[p][0].lsY > -0.3){
            player[p].phys.passFastfall = true;
          }
        }
        airDrift(p,input);
      }
    }
  },
  interrupt : function(p,input){
    const a = checkForAerials(p, input);
    const b = checkForSpecials(p, input);
    if (a[0]){
      actionStates[characterSelections[p]][a[1]].init(p,input);
      return true;
    }
    else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      actionStates[characterSelections[p]].ESCAPEAIR.init(p,input);
      return true;
    }
    else if (checkForDoubleJump (p,input) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
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
    else if (player[p].timer > framesData[characterSelections[p]].PASS){
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

