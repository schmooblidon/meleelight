import {checkForJump, checkForSmashes, checkForTilts, reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
export default {
  name : "TILTTURN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  disableTeeter : true,
  init : function(p){
    player[p].actionState = "TILTTURN";
    player[p].timer = 0;
    actionStates[characterSelections[p]].TILTTURN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer === 6){
      player[p].phys.face *= -1;
    }
    if (!actionStates[characterSelections[p]].TILTTURN.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    const t = player[p].timer < 6 ? checkForTilts(p, -1) : checkForTilts(p);
    const s = checkForSmashes(p);
    const j = checkForJump(p);

    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lsX[0]) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lsX[0]);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p);
      }
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      actionStates[characterSelections[p]].GUARDON.init(p);
      return true;
    }
    else if (player[p].inputs.lA[0] > 0 || player[p].inputs.rA[0] > 0){
      actionStates[characterSelections[p]].GUARDON.init(p);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      if (player[p].timer < 6){
        player[p].phys.face *= -1;
      }
      actionStates[characterSelections[p]][t[1]].init(p);
    }
    else if (player[p].timer > 11){
      actionStates[characterSelections[p]].WAIT.init(p);
      return true;
    }
    else if (player[p].timer === 6 && player[p].inputs.lsX[0] * player[p].phys.face > 0.79 && player[p].phys.dashbuffer){
      actionStates[characterSelections[p]].DASH.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
