/* globals player, aS, cS, frames, reduceByTraction, checkForSpecials,
checkForTilts, checkForSmashes, checkForJump, checkForDash, checkForSmashTurn */

export default {
  name : "SQUATWAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  crouch : true,
  disableTeeter : true,
  init : function(p){
    player[p].actionState = "SQUATWAIT";
    player[p].timer = 0;
    aS[cS[p]].SQUATWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SQUATWAIT.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    const b = checkForSpecials(p);
    const t = checkForTilts(p);
    const s = checkForSmashes(p);
    const j = checkForJump(p);
    if (player[p].inputs.lStickAxis[0].y > -0.61){
      aS[cS[p]].SQUATRV.init(p);
      return true;
    }
    else if (j[0]){
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
    else if (player[p].timer > frames[cS[p]].SQUATWAIT){
      aS[cS[p]].SQUATWAIT.init(p);
    }
    else {
      return false;
    }
  }
};
