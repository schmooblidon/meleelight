import {checkForJump, checkForSmashes, checkForTilts, checkForSpecials, reduceByTraction, aS} from "physics/actionStateShortcuts";
import {cS, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "SQUAT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  crouch : true,
  disableTeeter : true,
  init : function(p){
    player[p].actionState = "SQUAT";
    player[p].timer = 0;
    aS[cS[p]].SQUAT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SQUAT.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    var j = checkForJump(p);
    if (player[p].timer == 4 && (player[p].inputs.lsY[0] < -0.65 || player[p].inputs.lsY[1] < -0.65 || player[p].inputs.lsY[2] < -0.65) && player[p].inputs.lsY[6] > -0.3 && player[p].phys.onSurface[0] == 1){
      aS[cS[p]].PASS.init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[cS[p]].GUARDON.init(p);
      return true;
    }
    else if (player[p].inputs.lA[0] > 0 || player[p].inputs.rA[0] > 0){
      aS[cS[p]].GUARDON.init(p);
      return true;
    }
    else if (b[0]){
      aS[cS[p]][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[cS[p]][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[cS[p]][t[1]].init(p);
      return true;
    }
    else if (player[p].timer > framesData[cS[p]].SQUAT){
      aS[cS[p]].SQUATWAIT.init(p);
      return true;
    }
    else if (j[0]){
      aS[cS[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else {
      return false;
    }
  }
};

