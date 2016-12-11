import {characterSelections, player} from "main/main";
import {actionStates} from "physics/actionStateShortcuts";
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

