import {checkForJump, shieldSize, shieldDepletion, shieldTilt, reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
export default {
  name : "GUARD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p,input){
    player[p].actionState = "GUARD";
    player[p].timer = 0;
    player[p].phys.powerShieldActive = false;
    player[p].phys.powerShieldReflectActive = false;
    actionStates[characterSelections[p]].GUARD.main(p,input);
  },
  main : function(p,input){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true,input);
    }
    else {
      player[p].timer++;
      if (!actionStates[characterSelections[p]].GUARD.interrupt(p,input)){
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
      if (j[0] || input[p][0].csY > 0.66){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
        return true;
      }
      else if (input[p][0].a && !input[p][1].a){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].GRAB.init(p,input);
        return true;
      }
      else if ((input[p][0].lsY < -0.7 && input[p][4].lsY > -0.3) || input[p][0].csY < -0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEN.init(p,input);
        return true;
      }
      else if ((input[p][0].lsX*player[p].phys.face > 0.7 && input[p][4].lsX*player[p].phys.face < 0.3) || input[p][0].csX*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEF.init(p,input);
        return true;
      }
      else if ((input[p][0].lsX*player[p].phys.face < -0.7 && input[p][4].lsX*player[p].phys.face > -0.3) || input[p][0].csX*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].ESCAPEB.init(p,input);
        return true;
      }
      else if (input[p][0].lsY < -0.65 && input[p][6].lsY > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].PASS.init(p,input);
        return true;
      }
      else if (input[p][0].lA < 0.3 && input[p][0].rA < 0.3){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].GUARDOFF.init(p,input);
        return true;
      }
      else if (player[p].timer > 1){
        actionStates[characterSelections[p]].GUARD.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (input[p][0].lA < 0.3 && input[p][0].rA < 0.3){
        player[p].phys.shielding = false;
        actionStates[characterSelections[p]].GUARDOFF.init(p,input);
        return true;
      }
      else if (player[p].timer > 1){
        actionStates[characterSelections[p]].GUARD.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
  }
};

