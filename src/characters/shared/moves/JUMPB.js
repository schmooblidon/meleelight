import {checkForSpecials, checkForAerials, airDrift, fastfall, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
export default {
  name : "JUMPB",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,type,input){
    player[p].actionState = "JUMPB";
    player[p].timer = 0;
    if (type){
      player[p].phys.cVel.y += player[p].charAttributes.fHopInitV;
    }
    else {
      player[p].phys.cVel.y += player[p].charAttributes.sHopInitV;
    }

    player[p].phys.cVel.x = (player[p].phys.cVel.x * player[p].charAttributes.groundToAir) + (input[p][0].lsX * player[p].charAttributes.jumpHinitV);
    if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.jumpHmaxV){
      player[p].phys.cVel.x = player[p].charAttributes.jumpHmaxV * Math.sign(player[p].phys.cVel.x);
    }

    player[p].phys.grounded = false;
    sounds.jump2.play();
    actionStates[characterSelections[p]].JUMPB.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].JUMPB.interrupt(p,input)){
      if (player[p].timer > 1){
        fastfall(pminput,input);
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
    else if (player[p].timer > framesData[characterSelections[p]].JUMPB){
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

