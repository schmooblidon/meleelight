import {tiltTurnDashBuffer, checkForTiltTurn, checkForSmashTurn, checkForDash, checkForSquat, checkForJump,
    checkForSmashes
    , checkForTilts
    , checkForSpecials
    , actionStates
} from "physics/actionStateShortcuts";
import {actionSounds,framesData} from "main/characters";
import {sounds} from "main/sfx";
import {characterSelections, player} from "main/main";
export default {
  name : "OTTOTTOWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "OTTOTTOWAIT";
    player[p].timer = 1;
    if (characterSelections[p] != 1){
      sounds[actionSounds[characterSelections[p]].OTTOTTOWAIT[0][1]].play();
    }
    player[p].phys.cVel.x = 0;
    actionStates[characterSelections[p]].OTTOTTOWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer > framesData[characterSelections[p]].OTTOTTOWAIT){
      player[p].timer = 0
    }
    if (!actionStates[characterSelections[p]].OTTOTTOWAIT.interrupt(p)){

    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    var j = checkForJump(p);
    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      actionStates[characterSelections[p]].GUARDON.init(p);
      return true;
    }
    else if (player[p].inputs.lA[0] > 0 || player[p].inputs.rA[0] > 0){
      actionStates[characterSelections[p]].GUARDON.init(p);
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
    else if (checkForSquat(p)){
      actionStates[characterSelections[p]].SQUAT.init(p);
      return true;
    }
    else if (checkForDash(p)){
      actionStates[characterSelections[p]].DASH.init(p);
      return true;
    }
    else if (checkForSmashTurn(p)){
      actionStates[characterSelections[p]].SMASHTURN.init(p);
      return true;
    }
    else if (checkForTiltTurn(p)){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
      actionStates[characterSelections[p]].TILTTURN.init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lsX[0]) > 0.6){
      actionStates[characterSelections[p]].WALK.init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
};

