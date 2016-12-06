import {checkForJump, shieldDepletion, playSounds, shieldTilt, reduceByTraction, aS, shieldSize} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {cS, player} from "main/main";
import {Vec2D} from "main/util";
import {framesData} from "../../../main/characters";
export default {
  name : "GUARDON",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p){
    player[p].actionState = "GUARDON";
    player[p].timer = 0;
    player[p].phys.shielding = true;
    player[p].phys.shieldPosition = new Vec2D(0,0);
    player[p].phys.powerShielded = false;
    shieldSize(p,true);
    if (Math.max(player[p].inputs.lA[0],player[p].inputs.rA[0]) == 1){
      player[p].phys.powerShieldActive = true;
      player[p].phys.powerShieldReflectActive = true;
    }
    else {
      player[p].phys.powerShieldActive = false;
      player[p].phys.powerShieldReflectActive = false;
    }
    aS[cS[p]].GUARDON.main(p);
  },
  main : function(p){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true);
    }
    else {
      player[p].timer++;
      playSounds("GUARDON",p);
      if (player[p].timer == 3){
        player[p].phys.powerShieldReflectActive = false;
      }
      if (player[p].timer == 5){
        player[p].phys.powerShieldActive = false;
      }
      /*if (player[p].timer == 2 && Math.max(player[p].inputs.lA[0],player[p].inputs.rA[0]) == 1){
        player[p].phys.powerShieldActive = true;
      }*/
      if (!aS[cS[p]].GUARDON.interrupt(p)){
        if (player[p].timer == 1){
          sounds.shieldup.play();
        }
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
      if (j[0] || player[p].inputs.csY[0] > 0.65){
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
      else if (player[p].timer > 1 && player[p].inputs.lsY[0] < -0.65 && player[p].inputs.lsY[6] > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        aS[cS[p]].PASS.init(p);
        return true;
      }
      else if (player[p].timer > framesData[cS[p]].GUARDON){
        aS[cS[p]].GUARD.init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].timer > 8){
        aS[cS[p]].GUARD.init(p);
        return true;
      }
      else {
        return false;
      }
    }
  }
};

