import {checkForSquat, checkForJump, reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
export default {
  name : "RUNBRAKE",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "RUNBRAKE";
    player[p].timer = 0;
    sounds.runbrake.play();
    actionStates[characterSelections[p]].RUNBRAKE.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].RUNBRAKE.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var j = checkForJump(p);
    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].timer > 1 && checkForSquat(p)){
      actionStates[characterSelections[p]].SQUAT.init(p);
      return true;
    }
    else if (player[p].inputs.lsX[0] * player[p].phys.face < -0.3){
      actionStates[characterSelections[p]].RUNTURN.init(p);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].RUNBRAKE){
      actionStates[characterSelections[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

