/* globals player, aS, cS, frames, reduceByTraction, checkForSpecials,
checkForTilts, checkForSmashes, checkForJump, checkForSquat, checkForDash,
checkForSmashTurn, checkForTilts, checkForTiltTurn, tiltTurnDashBuffer */

export default {
  name : "WAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "WAIT";
    player[p].timer = 1;
    aS[cS[p]].WAIT.main(p);
  },
  main : function(p){
    player[p].timer += 1;
    if (!aS[cS[p]].WAIT.interrupt(p)){
      reduceByTraction(p,false);
      if (player[p].timer > frames[cS[p]].WAIT){
        aS[cS[p]].WAIT.init(p);
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
      aS[cS[p]].KNEEBEND.init(p,j[1]);
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
    else if (checkForSquat(p) && !player[p].inCSS){
      aS[cS[p]].SQUAT.init(p);
      return true;
    }
    else if (checkForDash(p) && !player[p].inCSS){
      aS[cS[p]].DASH.init(p);
      return true;
    }
    else if (checkForSmashTurn(p) && !player[p].inCSS){
      aS[cS[p]].SMASHTURN.init(p);
      return true;
    }
    else if (checkForTiltTurn(p) && !player[p].inCSS){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
      aS[cS[p]].TILTTURN.init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 && !player[p].inCSS){
      aS[cS[p]].WALK.init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
};
