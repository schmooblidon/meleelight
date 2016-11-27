/* globals player, aS, cS, frames, reduceByTraction, checkForSmashes, checkForJump, checkForTilts */

export default {
  name : "TILTTURN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  disableTeeter : true,
  init : function(p){
    player[p].actionState = "TILTTURN";
    player[p].timer = 0;
    aS[cS[p]].TILTTURN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer === 6){
      player[p].phys.face *= -1;
    }
    if (!aS[cS[p]].TILTTURN.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    const t = player[p].timer < 6 ? checkForTilts(p, -1) : checkForTilts(p);
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
      if (player[p].timer < 6){
        player[p].phys.face *= -1;
      }
      aS[cS[p]][t[1]].init(p);
    }
    else if (player[p].timer > 11){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else if (player[p].timer === 6 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].phys.dashbuffer){
      aS[cS[p]].DASH.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
