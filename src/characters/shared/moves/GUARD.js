import {checkForJump, shieldSize, shieldDepletion, shieldTilt, reduceByTraction, aS} from "physics/actionStateShortcuts";
import {cS, player} from "main/main";
export default {
  name : "GUARD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p){
    player[p].actionState = "GUARD";
    player[p].timer = 0;
    player[p].phys.powerShieldActive = false;
    player[p].phys.powerShieldReflectActive = false;
    aS[cS[p]].GUARD.main(p);
  },
  main : function(p){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true);
    }
    else {
      player[p].timer++;
      if (!aS[cS[p]].GUARD.interrupt(p)){
        if (!player[p].inCSS){
          reduceByTraction(p,false);
          shieldDepletion(p);
        }
        shieldTilt(p,false);
        shieldSize(p);
      }
    }
  },
  interrupt : function(p){
    if (!player[p].inCSS){
      var j = checkForJump(p);
      if (j[0] || player[p].inputs.csY[0] > 0.66){
        player[p].phys.shielding = false;
        aS[cS[p]].KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.shielding = false;
        aS[cS[p]].GRAB.init(p);
        return true;
      }
      else if ((player[p].inputs.lsY[0] < -0.7 && player[p].inputs.lsY[4] > -0.3) || player[p].inputs.csY[0] < -0.7){
        player[p].phys.shielding = false;
        aS[cS[p]].ESCAPEN.init(p);
        return true;
      }
      else if ((player[p].inputs.lsX[0]*player[p].phys.face > 0.7 && player[p].inputs.lsX[4]*player[p].phys.face < 0.3) || player[p].inputs.csX[0]*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        aS[cS[p]].ESCAPEF.init(p);
        return true;
      }
      else if ((player[p].inputs.lsX[0]*player[p].phys.face < -0.7 && player[p].inputs.lsX[4]*player[p].phys.face > -0.3) || player[p].inputs.csX[0]*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        aS[cS[p]].ESCAPEB.init(p);
        return true;
      }
      else if (player[p].inputs.lsY[0] < -0.65 && player[p].inputs.lsY[6] > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        aS[cS[p]].PASS.init(p);
        return true;
      }
      else if (player[p].inputs.lA[0] < 0.3 && player[p].inputs.rA[0] < 0.3){
        player[p].phys.shielding = false;
        aS[cS[p]].GUARDOFF.init(p);
        return true;
      }
      else if (player[p].timer > 1){
        aS[cS[p]].GUARD.init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].inputs.lA[0] < 0.3 && player[p].inputs.rA[0] < 0.3){
        player[p].phys.shielding = false;
        aS[cS[p]].GUARDOFF.init(p);
        return true;
      }
      else if (player[p].timer > 1){
        aS[cS[p]].GUARD.init(p);
        return true;
      }
      else {
        return false;
      }
    }
  }
};

