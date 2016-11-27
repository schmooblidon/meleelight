/* globals player, aS, cS, frames, drawVfx, sounds, reduceByTraction,
checkForJump, checkForTilts, checkForSpecials, checkForSmashes, checkForDash,
checkForTiltTurn, checkForSmashTurn, tiltTurnDashBuffer */

export default {
  name : "LANDING",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDING";
    player[p].timer = 0;
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[cS[p]].LANDING.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].LANDING.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 4 && player[p].timer <= 30){
      const b = checkForSpecials(p);
      const t = checkForTilts(p);
      const s = checkForSmashes(p);
      const j = checkForJump(p);
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
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[cS[p]].WALK.init(p,true);
        return true;
      }
      else if (player[p].timer === 5 && player[p].inputs.lStickAxis[0].y < -0.5){
        aS[cS[p]].SQUATWAIT.init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 30){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
