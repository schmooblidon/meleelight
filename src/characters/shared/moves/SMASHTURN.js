/* globals player, aS, cS, frames, reduceByTraction, checkForTilts, checkForJump, checkForSmashes */

export default {
  name : "SMASHTURN",
  canEdgeCancel : true,
  reverseModel : true,
  canBeGrabbed : true,
  disableTeeter : true,
  init : function(p){
    player[p].actionState = "SMASHTURN";
    player[p].timer = 0;
    player[p].phys.face *= -1;
    aS[cS[p]].SMASHTURN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SMASHTURN.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    const t = checkForTilts(p);
    const s = checkForSmashes(p);
    const j = checkForJump(p);
    if (j[0]){
      aS[cS[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      if (player[p].phys.grounded){
        aS[cS[p]].SIDESPECIALGROUND.init(p);
      }
      else {
        aS[cS[p]].SIDESPECIALAIR.init(p);
      }
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[cS[p]].GUARDON.init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[cS[p]].GUARDON.init(p);
      return true;
    }
    else if (s[0]){
      aS[cS[p]][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[cS[p]][t[1]].init(p);
    }
    else if (player[p].timer === 2 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79){
      aS[cS[p]].DASH.init(p);
      return true;
    }
    else if (player[p].timer > 11){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
