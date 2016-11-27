export default {
  name : "DAMAGEN2",
  canEdgeCancel : true,
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  missfoot : true,
  init : function(p){
    player[p].actionState = "DAMAGEN2";
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.grabbedBy = -1;
    player[p].phys.fastfalled = false;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    player[p].colourOverlayBool = false;
    turnOffHitboxes(p);
    aS[cS[p]].DAMAGEN2.main(p);
  },
  main : function(p){
    if (player[p].inCSS){
      player[p].timer+= 0.7;
    }
    else {
      player[p].timer++;
    }
    if (!aS[cS[p]].DAMAGEN2.interrupt(p)){
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
        if (!player[p].phys.grounded){
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
        }
        else {
          reduceByTraction(p,false);
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].DAMAGEN2){
      if (player[p].hit.hitstun > 0){
        player[p].timer--;
        return false;
      }
      else {
        if (player[p].phys.grounded || player[p].inCSS){
          aS[cS[p]].WAIT.init(p);
        }
        else {
          aS[cS[p]].FALL.init(p);
        }
        return true;
      }
    }
    else if (player[p].hit.hitstun <= 0 && !player[p].inCSS){
      if (player[p].phys.grounded){
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
        var a = checkForAerials(p);
        var b = checkForSpecials(p);
        if (a[0]){
          aS[cS[p]][a[1]].init(p);
          return true;
        }
        else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
          aS[cS[p]].ESCAPEAIR.init(p);
          return true;
        }
        else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
          if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
            aS[cS[p]].JUMPAERIALB.init(p);
          }
          else {
            aS[cS[p]].JUMPAERIALF.init(p);
          }
          return true;
        }
        else if (b[0]){
          aS[cS[p]][b[1]].init(p);
          return true;
        }
        else if ((player[p].inputs.lStickAxis[0].x > 0.7 && player[p].inputs.lStickAxis[1].x < 0.7) || (player[p].inputs.lStickAxis[0].x < -0.7 && player[p].inputs.lStickAxis[1].x > -0.7) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) || (player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y > -0.7)){
          aS[cS[p]].FALL.init(p);
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
  },
  land : function(p){
    if (player[p].hit.hitstun <= 0){
      aS[cS[p]].LANDING.init(p);
    }
  }
};

