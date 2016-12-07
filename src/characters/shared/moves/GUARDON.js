import {checkForJump, shieldDepletion, playSounds, shieldTilt, reduceByTraction, actionStates, shieldSize} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {characterSelections, player} from "main/main";
import {Vec2D} from "main/util";
import {framesData} from "../../../main/characters";
export default {
  name : "GUARDON",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p,input){
    player[p].actionState = "GUARDON";
    player[p].timer = 0;
    player[p].phys.shielding = true;
    player[p].phys.shieldPosition = new Vec2D(0,0);
    player[p].phys.powerShielded = false;
    shieldSize(p,true,input);
    if (Math.max(input[p].lA[0],input[p].rA[0]) == 1){
      player[p].phys.powerShieldActive = true;
      player[p].phys.powerShieldReflectActive = true;
    }
    else {
      player[p].phys.powerShieldActive = false;
      player[p].phys.powerShieldReflectActive = false;
    }
    actionStates[characterSelections[p]].GUARDON.main(p,input);
  },
  main : function(p,input){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true,input);
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
      /*if (player[p].timer == 2 && Math.max(input[p].lA[0],input[p].rA[0]) == 1){
        player[p].phys.powerShieldActive = true;
      }*/
      if (!actionStates[characterSelections[p]].GUARDON.interrupt(p,input)){
        if (player[p].timer == 1){
          sounds.shieldup.play();
        }
        if (!player[p].inCSS){
          reduceByTraction(p,false);
          shieldDepletion(p,input);
        }
        shieldTilt(p,false,input);
        shieldSize(p,null,input);
      }
    }
  },
  interrupt : function(p,input){
    if (!player[p].inCSS){
      var j = checkForJump(p,input);
      if (j[0] || input[p].csY[0] > 0.65){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
        return true;
      }
      else if (input[p].a[0] && !input[p].a[1]){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].GRAB.init(p,input);
        return true;
      }
      else if ((input[p].lsY[0] < -0.7 && input[p].lsY[4] > -0.3) || input[p].csY[0] < -0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEN.init(p,input);
        return true;
      }
      else if ((input[p].lsX[0]*player[p].phys.face > 0.7 && input[p].lsX[4]*player[p].phys.face < 0.3) || input[p].csX[0]*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEF.init(p,input);
        return true;
      }
      else if ((input[p].lsX[0]*player[p].phys.face < -0.7 && input[p].lsX[4]*player[p].phys.face > -0.3) || input[p].csX[0]*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEB.init(p,input);
        return true;
      }
      else if (player[p].timer > 1 && input[p].lsY[0] < -0.65 && input[p].lsY[6] > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].PASS.init(p,input);
        return true;
      }
      else if (player[p].timer > framesData[characterSelections[p]].GUARDON){
        actionStates[characterSelections[p]].GUARD.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].timer > 8){
        actionStates[characterSelections[p]].GUARD.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
  }
};

