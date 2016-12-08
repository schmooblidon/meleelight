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
  init : function(p,input){
    player[p].actionState = "WAIT";
    player[p].timer = 1;
    actionStates[characterSelections[p]].WAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer += 1;
    if (!actionStates[characterSelections[p]].WAIT.interrupt(p,input)){
      reduceByTraction(p,false);
      if (player[p].timer > framesData[characterSelections[p]].WAIT){
        actionStates[characterSelections[p]].WAIT.init(p,input);
      }
    }
  },
  interrupt : function(p,input){
    let b;
    let t;
    const s = checkForSmashes(p,input);
    const j = checkForJump(p,input);

    if (player[p].inCSS){
      b = [false,false];
      t = [false,false];
    }
    else {
      b = checkForSpecials(p,input);
      t = checkForTilts(p,input);
    }

    if (j[0] && !player[p].inCSS){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
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
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p,input);
      return true;
    }
    else if (checkForSquat(p,input) && !player[p].inCSS){
      actionStates[characterSelections[p]].SQUAT.init(p,input);
      return true;
    }
    else if (checkForDash(p,input) && !player[p].inCSS){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else if (checkForSmashTurn(p,input) && !player[p].inCSS){
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
      return true;
    }
    else if (checkForTiltTurn(p,input) && !player[p].inCSS){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
      actionStates[characterSelections[p]].TILTTURN.init(p,input);
      return true;
    }
    else if (Math.abs(input[p][0].lsX) > 0.3 && !player[p].inCSS){
      actionStates[characterSelections[p]].WALK.init(p,true,input);
      return true;
    }
    else {
      return false;
    }
  }
};
