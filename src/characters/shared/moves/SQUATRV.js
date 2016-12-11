import {checkForSmashTurn, checkForJump, checkForSmashes, checkForTilts, checkForSpecials, reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "SQUATRV",
  canEdgeCancel : true,
  canBeGrabbed : true,
  crouch : true,
  disableTeeter : true,
  init : function(p,input){
    player[p].actionState = "SQUATRV";
    player[p].timer = 0;
    actionStates[characterSelections[p]].SQUATRV.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SQUATRV.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    var b = checkForSpecials(p,input);
    var t = checkForTilts(p,input);
    var s = checkForSmashes(p,input);
    var j = checkForJump(p,input);
    if (player[p].timer > framesData[characterSelections[p]].SQUATRV){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else if (j[0]){
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
    /*else if (checkForDash(p,input)){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }*/
    else if (checkForSmashTurn(p,input)){
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
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
};

