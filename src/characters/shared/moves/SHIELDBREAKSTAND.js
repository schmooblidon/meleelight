import {reduceByTraction, aS} from "physics/actionStateShortcuts";
import {cS, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "SHIELDBREAKSTAND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "SHIELDBREAKSTAND";
    player[p].timer = 0;
    aS[cS[p]].SHIELDBREAKSTAND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SHIELDBREAKSTAND.interrupt(p)){
      reduceByTraction(p,true);
      player[p].phys.intangibleTimer = 1;
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[cS[p]].SHIELDBREAKSTAND){
      aS[cS[p]].FURAFURA.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

