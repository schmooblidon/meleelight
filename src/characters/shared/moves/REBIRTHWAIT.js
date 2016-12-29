import {characterSelections, player} from "main/main";
import {actionStates, checkForDoubleJump, checkForAerials, checkForSpecials} from "physics/actionStateShortcuts";
import {framesData} from 'main/characters';
export default {
  name : "REBIRTHWAIT",
  canBeGrabbed : false,
  init : function(p,input){
    player[p].actionState = "REBIRTHWAIT";
    player[p].timer = 1;
    player[p].phys.cVel.y = 0;
  },
  main : function(p,input){
    player[p].timer+= 1;
    player[p].spawnWaitTime++;
    if (!actionStates[characterSelections[p]].REBIRTHWAIT.interrupt(p,input)){
      player[p].phys.outOfCameraTimer = 0;
    }
  },
  interrupt : function(p,input){    
    const a = checkForAerials(p, input);
    const b = checkForSpecials(p, input);
    const j = checkForDoubleJump(p, input);
    if (a[0]){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      actionStates[characterSelections[p]][a[1]].init(p, input);
      return true;
    } 
    else if ((input[p][0].l && !input[p][1].l) || (input[p][0].r && !input[p][1].r)){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      actionStates[characterSelections[p]].ESCAPEAIR.init(p, input);
      return true;
    } 
    else if (j) {
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      if (input[p][0].lsX*player[p].phys.face < -0.3){
        actionStates[characterSelections[p]].JUMPAERIALB.init(p, input);
      } 
      else {
        actionStates[characterSelections[p]].JUMPAERIALF.init(p, input);
      }    
      return true;
    }
    else if (b[0]){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      actionStates[characterSelections[p]][b[1]].init(p, input);
      return true;
    }
    if (player[p].timer > framesData[characterSelections[p]].WAIT){
      actionStates[characterSelections[p]].REBIRTHWAIT.init(p,input);
      return true;
    }
    else if (player[p].spawnWaitTime > 300){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else if (Math.abs(input[p][0].lsX) > 0.3 || Math.abs(input[p][0].lsY) > 0.3 ){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      actionStates[characterSelections[p]].FALL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

