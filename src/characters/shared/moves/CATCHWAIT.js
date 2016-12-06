import {cS, player} from "main/main";
import {aS, turnOffHitboxes} from "physics/actionStateShortcuts";

import {framesData} from 'main/characters';
export default {
  name : "CATCHWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CATCHWAIT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[cS[p]].CATCHWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CATCHWAIT.interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      aS[cS[p]].CATCHATTACK.init(p);
      return true;
    }
    else if ((player[p].inputs.lsY[0] > 0.7 && player[p].inputs.lsY[1] <= 0.7) || (player[p].inputs.csY[0] > 0.7 && player[p].inputs.csY[1] <= 0.7)){
      aS[cS[p]].THROWUP.init(p);
      return true;
    }
    else if ((player[p].inputs.lsY[0] < -0.7 && player[p].inputs.lsY[1] >= -0.7) || player[p].inputs.csY[0] < -0.7){
      aS[cS[p]].THROWDOWN.init(p);
      return true;
    }
    else if ((player[p].inputs.lsX[0]*player[p].phys.face < -0.7 && player[p].inputs.lsX[1]*player[p].phys.face >= -0.7) || (player[p].inputs.csX[0]*player[p].phys.face < -0.7 && player[p].inputs.csX[1]*player[p].phys.face >= -0.7)){
      aS[cS[p]].THROWBACK.init(p);
      return true;
    }
    else if ((player[p].inputs.lsX[0]*player[p].phys.face > 0.7 && player[p].inputs.lsX[1]*player[p].phys.face <= 0.7) || (player[p].inputs.csX[0]*player[p].phys.face > 0.7 && player[p].inputs.csX[1]*player[p].phys.face <= 0.7)){
      aS[cS[p]].THROWFORWARD.init(p);
      return true;
    }
    else if (player[p].timer > framesData[cS[p]].CATCHWAIT){
      aS[cS[p]].CATCHWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
