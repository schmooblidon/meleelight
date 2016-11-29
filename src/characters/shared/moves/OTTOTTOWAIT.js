import {tiltTurnDashBuffer, checkForTiltTurn, checkForSmashTurn, checkForDash, checkForSquat, checkForJump,
    checkForSmashes
    , checkForTilts
    , checkForSpecials
    , aS
} from "physics/actionStateShortcuts";
import {actionSounds} from "main/characters";
import {sounds} from "main/sfx";
import {cS, player} from "main/main";
export default {
  name : "OTTOTTOWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "OTTOTTOWAIT";
    player[p].timer = 1;
    if (cS[p] != 1){
      sounds[actionSounds[cS[p]].OTTOTTOWAIT[0][1]].play();
    }
    player[p].phys.cVel.x = 0;
    aS[cS[p]].OTTOTTOWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer > frames[cS[p]].OTTOTTOWAIT){
      player[p].timer = 0
    }
    if (!aS[cS[p]].OTTOTTOWAIT.interrupt(p)){

    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    var j = checkForJump(p);
    if (j[0]){
      aS[cS[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[cS[p]].GUARDON.init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[cS[p]].GUARDON.init(p);
    }
    else if (b[0]){
      aS[cS[p]][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[cS[p]][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[cS[p]][t[1]].init(p);
      return true;
    }
    else if (checkForSquat(p)){
      aS[cS[p]].SQUAT.init(p);
      return true;
    }
    else if (checkForDash(p)){
      aS[cS[p]].DASH.init(p);
      return true;
    }
    else if (checkForSmashTurn(p)){
      aS[cS[p]].SMASHTURN.init(p);
      return true;
    }
    else if (checkForTiltTurn(p)){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
      aS[cS[p]].TILTTURN.init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      aS[cS[p]].WALK.init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
};

