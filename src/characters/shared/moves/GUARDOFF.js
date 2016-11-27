export default {
  name : "GUARDOFF",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p){
    player[p].actionState = "GUARDOFF";
    player[p].timer = 0;
    sounds.shieldoff.play();
    aS[cS[p]].GUARDOFF.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("GUARDOFF",p);
    if (!aS[cS[p]].GUARDOFF.interrupt(p)){
      reduceByTraction(p,false);
      //shieldDepletion(p);
      //shieldSize(p);
    }
  },
  interrupt : function(p){
    var j = checkForJump(p);
    if (j[0] && !player[p].inCSS){
      aS[cS[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].GUARDOFF){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else if (player[p].phys.powerShielded){
      if (!player[p].inCSS){
        var t = checkForTilts(p);
        var s = checkForSmashes(p);
        if (s[0]){
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
        else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
          aS[cS[p]].WALK.init(p,true);
          return true;
        }
        else {
          return false;
        }
      }
      else {
        var s = checkForSmashes(p);
        if (s[0]){
          aS[cS[p]][s[1]].init(p);
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

