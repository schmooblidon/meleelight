import {tiltTurnDashBuffer, checkForTiltTurn, checkForSmashTurn, checkForDash, checkForSquat, checkForTilts,
    checkForSpecials
    , checkForJump
    , checkForSmashes
    , reduceByTraction
    , actionStates
} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "WAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "WAIT";
    player[p].timer = 1;
    actionStates[characterSelections[p]].WAIT.main(p);
  },
  main : function(p){
    player[p].timer += 1;
    if (!actionStates[characterSelections[p]].WAIT.interrupt(p)){
      reduceByTraction(p,false);
      if (player[p].timer > framesData[characterSelections[p]].WAIT){
        actionStates[characterSelections[p]].WAIT.init(p);
      }
    }
  },
  interrupt : function(p){
    let b;
    let t;
    const s = checkForSmashes(p);
    const j = checkForJump(p);

    if (player[p].inCSS){
      b = [false,false];
      t = [false,false];
    }
    else {
      b = checkForSpecials(p);
      t = checkForTilts(p);
    }

    if (j[0] && !player[p].inCSS){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1]);
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
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p);
      return true;
    }
    else if (checkForSquat(p) && !player[p].inCSS){
      actionStates[characterSelections[p]].SQUAT.init(p);
      return true;
    }
    else if (checkForDash(p) && !player[p].inCSS){
      actionStates[characterSelections[p]].DASH.init(p);
      return true;
    }
    else if (checkForSmashTurn(p) && !player[p].inCSS){
      actionStates[characterSelections[p]].SMASHTURN.init(p);
      return true;
    }
    else if (checkForTiltTurn(p) && !player[p].inCSS){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
      actionStates[characterSelections[p]].TILTTURN.init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lsX[0]) > 0.3 && !player[p].inCSS){
      actionStates[characterSelections[p]].WALK.init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
};
