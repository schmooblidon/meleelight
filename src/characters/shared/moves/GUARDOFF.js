import {tiltTurnDashBuffer, checkForTiltTurn, checkForSmashTurn, checkForDash, checkForSquat, checkForSmashes,
    checkForTilts
    , checkForJump
    , reduceByTraction
    , playSounds
    , actionStates
} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
export default {
  name : "GUARDOFF",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p,input){
    player[p].actionState = "GUARDOFF";
    player[p].timer = 0;
    sounds.shieldoff.play();
    actionStates[characterSelections[p]].GUARDOFF.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("GUARDOFF",p);
    if (!actionStates[characterSelections[p]].GUARDOFF.interrupt(p,input)){
      reduceByTraction(p,false);
      //shieldDepletion(p,input);
      //shieldSize(p,null,input);
    }
  },
  interrupt : function(p,input){
    var j = checkForJump(p,input);
    if (j[0] && !player[p].inCSS){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].GUARDOFF){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else if (player[p].phys.powerShielded){
      if (!player[p].inCSS){
        var t = checkForTilts(p,input);
        var s = checkForSmashes(p,input);
        if (s[0]){
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
        else if (Math.abs(input[p][0].lsX) > 0.3){
          actionStates[characterSelections[p]].WALK.init(p,true,input);
          return true;
        }
        else {
          return false;
        }
      }
      else {
        var s = checkForSmashes(p,input);
        if (s[0]){
          actionStates[characterSelections[p]][s[1]].init(p,input);
          return true;
        }
        else {
          return false;
        }
      }
    }
    else {
      return false;
    }
  }
};

