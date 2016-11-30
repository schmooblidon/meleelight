import {executeIntangibility, reduceByTraction, aS} from "physics/actionStateShortcuts";
import {cS, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "DOWNSTANDN",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DOWNSTANDN";
    player[p].timer = 0;
    aS[cS[p]].DOWNSTANDN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNSTANDN.interrupt(p)){
      reduceByTraction(p,true);
      executeIntangibility("DOWNSTANDN",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[cS[p]].DOWNSTANDN){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

