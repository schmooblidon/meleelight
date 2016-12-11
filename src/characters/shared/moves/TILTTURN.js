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
    const t = player[p].timer < 6 ? checkForTilts(p,input, -1) : checkForTilts(p,input);
    const s = checkForSmashes(p,input);
    const j = checkForJump(p,input);

    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].b && !input[p][1].b && Math.abs(input[p][0].lsX) > 0.6){
      player[p].phys.face = Math.sign(input[p][0].lsX);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p,input);
      }
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
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
    else if (player[p].timer === 6 && input[p][0].lsX * player[p].phys.face > 0.79 && player[p].phys.dashbuffer){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
