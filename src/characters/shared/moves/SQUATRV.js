export default {
  name : "SQUATRV",
  canEdgeCancel : true,
  canBeGrabbed : true,
  crouch : true,
  disableTeeter : true,
  init : function(p){
    player[p].actionState = "SQUATRV";
    player[p].timer = 0;
    aS[cS[p]].SQUATRV.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SQUATRV.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    var j = checkForJump(p);
    if (player[p].timer > frames[cS[p]].SQUATRV){
      aS[cS[p]].WAIT.init(p);
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
    /*else if (checkForDash(p)){
      aS[cS[p]].DASH.init(p);
      return true;
    }*/
    else if (checkForSmashTurn(p)){
      aS[cS[p]].SMASHTURN.init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
      aS[cS[p]].WALK.init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
};

