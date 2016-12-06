import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "DOWNWAIT",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : false,
  downed : true,
  init : function(p){
    player[p].actionState = "DOWNWAIT";
    player[p].timer = 0;
    actionStates[characterSelections[p]].DOWNWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNWAIT.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].DOWNWAIT){
      actionStates[characterSelections[p]].DOWNWAIT.init(p);
      return true;
    }
    else if (player[p].phys.jabReset){
      if (player[p].hit.hitstun <= 0){
        if (player[p].inputs.lsX[0]*player[p].phys.face < -0.7){
          actionStates[characterSelections[p]].DOWNSTANDB.init(p);
          return true;
        }
        else if (player[p].inputs.lsX[0]*player[p].phys.face > 0.7){
          actionStates[characterSelections[p]].DOWNSTANDF.init(p);
          return true;
        }
        else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1])){
          actionStates[characterSelections[p]].DOWNATTACK.init(p);
          return true;
        }
        else {
          actionStates[characterSelections[p]].DOWNSTANDN.init(p);
          return true;
        }
      }
      else {
        return false;
      }
    }
    else if (player[p].inputs.lsX[0]*player[p].phys.face < -0.7){
      actionStates[characterSelections[p]].DOWNSTANDB.init(p);
      return true;
    }
    else if (player[p].inputs.lsX[0]*player[p].phys.face > 0.7){
      actionStates[characterSelections[p]].DOWNSTANDF.init(p);
      return true;
    }
    else if (player[p].inputs.lsY[0] > 0.7){
      actionStates[characterSelections[p]].DOWNSTANDN.init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1])){
      actionStates[characterSelections[p]].DOWNATTACK.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

