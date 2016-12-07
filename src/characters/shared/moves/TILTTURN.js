import {checkForJump, checkForSmashes, checkForTilts, reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
export default {
  name : "TILTTURN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  disableTeeter : true,
  init : function(p,input){
    player[p].actionState = "TILTTURN";
    player[p].timer = 0;
    actionStates[characterSelections[p]].TILTTURN.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (player[p].timer === 6){
      player[p].phys.face *= -1;
    }
    if (!actionStates[characterSelections[p]].TILTTURN.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    const t = player[p].timer < 6 ? checkForTilts(p, -1) : checkForTilts(p,input);
    const s = checkForSmashes(p,input);
    const j = checkForJump(p,input);

    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p].b[0] && !input[p].b[1] && Math.abs(input[p].lsX[0]) > 0.6){
      player[p].phys.face = Math.sign(input[p].lsX[0]);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p,input);
      }
      return true;
    }
    else if (input[p].l[0] || input[p].r[0]){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p].lA[0] > 0 || input[p].rA[0] > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      if (player[p].timer < 6){
        player[p].phys.face *= -1;
      }
      actionStates[characterSelections[p]][t[1]].init(p,input);
    }
    else if (player[p].timer > 11){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else if (player[p].timer === 6 && input[p].lsX[0] * player[p].phys.face > 0.79 && player[p].phys.dashbuffer){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
