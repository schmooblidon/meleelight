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
  init : function(p,input){
    player[p].actionState = "OTTOTTOWAIT";
    player[p].timer = 1;
    if (characterSelections[p] != 1){
      sounds[actionSounds[characterSelections[p]].OTTOTTOWAIT[0][1]].play();
    }
    player[p].phys.cVel.x = 0;
    actionStates[characterSelections[p]].OTTOTTOWAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (player[p].timer > framesData[characterSelections[p]].OTTOTTOWAIT){
      player[p].timer = 0
    }
    if (!actionStates[characterSelections[p]].OTTOTTOWAIT.interrupt(p,input)){

    }
  },
  interrupt : function(p,input){
    var b = checkForSpecials(p,input);
    var t = checkForTilts(p,input);
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p].l[0] || input[p].r[0]){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p].lA[0] > 0 || input[p].rA[0] > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
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
    else if (checkForSquat(p,input)){
      actionStates[characterSelections[p]].SQUAT.init(p,input);
      return true;
    }
    else if (checkForDash(p,input)){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else if (checkForSmashTurn(p,input)){
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
      return true;
    }
    else if (checkForTiltTurn(p,input)){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
      actionStates[characterSelections[p]].TILTTURN.init(p,input);
      return true;
    }
    else if (Math.abs(input[p].lsX[0]) > 0.6){
      actionStates[characterSelections[p]].WALK.init(p,true,input);
      return true;
    }
    else {
      return false;
    }
  }
};

