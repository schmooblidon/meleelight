import {checkForSquat, checkForJump, reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
export default {
  name : "RUNBRAKE",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "RUNBRAKE";
    player[p].timer = 0;
    sounds.runbrake.play();
    actionStates[characterSelections[p]].RUNBRAKE.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].RUNBRAKE.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    var j = checkForJump(p,input);
    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (player[p].timer > 1 && checkForSquat(p,input)){
      actionStates[characterSelections[p]].SQUAT.init(p,input);
      return true;
    }
    else if (input[p][0].lsX * player[p].phys.face < -0.3){
      actionStates[characterSelections[p]].RUNTURN.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].RUNBRAKE){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

