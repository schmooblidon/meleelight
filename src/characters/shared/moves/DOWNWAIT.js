import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "DOWNWAIT",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : false,
  downed : true,
  init : function(p,input){
    player[p].actionState = "DOWNWAIT";
    player[p].timer = 0;
    actionStates[characterSelections[p]].DOWNWAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNWAIT.interrupt(p,input)){
      reduceByTraction(p,true);
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].DOWNWAIT){
      actionStates[characterSelections[p]].DOWNWAIT.init(p,input);
      return true;
    }
    else if (player[p].phys.jabReset){
      if (player[p].hit.hitstun <= 0){
        if (input[p][0].lsX*player[p].phys.face < -0.7){
          actionStates[characterSelections[p]].DOWNSTANDB.init(p,input);
          return true;
        }
        else if (input[p][0].lsX*player[p].phys.face > 0.7){
          actionStates[characterSelections[p]].DOWNSTANDF.init(p,input);
          return true;
        }
        else if ((input[p][0].a && !input[p][1].a) || (input[p][0].b && !input[p][1].b)){
          actionStates[characterSelections[p]].DOWNATTACK.init(p,input);
          return true;
        }
        else {
          actionStates[characterSelections[p]].DOWNSTANDN.init(p,input);
          return true;
        }
      }
      else {
        return false;
      }
    }
    else if (input[p][0].lsX*player[p].phys.face < -0.7){
      actionStates[characterSelections[p]].DOWNSTANDB.init(p,input);
      return true;
    }
    else if (input[p][0].lsX*player[p].phys.face > 0.7){
      actionStates[characterSelections[p]].DOWNSTANDF.init(p,input);
      return true;
    }
    else if (input[p][0].lsY > 0.7){
      actionStates[characterSelections[p]].DOWNSTANDN.init(p,input);
      return true;
    }
    else if ((input[p][0].a && !input[p][1].a) || (input[p][0].b && !input[p][1].b)){
      actionStates[characterSelections[p]].DOWNATTACK.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

