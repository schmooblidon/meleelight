echo 'export default {
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
    if (player[p].inCSS){
      var b = [false,false];
      var t = [false,false];
    }
    else {
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
    }
    var s = checkForSmashes(p);
    var j = checkForJump(p);
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
' > WAIT.js;

echo 'export default {
  name : "DASH",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DASH";
    player[p].timer = 0;
    sounds.dash.play();
    aS[cS[p]].DASH.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DASH.interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.cVel.x += player[p].charAttributes.dInitV * player[p].phys.face;
        if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.dMaxV){
          player[p].phys.cVel.x = player[p].charAttributes.dMaxV * player[p].phys.face;
        }
      }
      if (player[p].timer == 4){
        drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
      }
      if (player[p].timer > 1){
        if (Math.abs(player[p].inputs.lStickAxis[0].x) < 0.3){
          reduceByTraction(p,false);
        }
        else {
          var tempMax = player[p].inputs.lStickAxis[0].x * player[p].charAttributes.dMaxV;
          //var tempAcc = (player[p].charAttributes.dAcc - (1 - Math.abs(player[p].inputs.lStickAxis[0].x))*(player[p].charAttributes.dAcc))*player[p].phys.face;
          var tempAcc = player[p].inputs.lStickAxis[0].x*player[p].charAttributes.dAccA;

          player[p].phys.cVel.x += tempAcc;
          if ((tempMax > 0 && player[p].phys.cVel.x > tempMax) || (tempMax < 0 && player[p].phys.cVel.x < tempMax)){
            reduceByTraction(p,false);
            if ((tempMax > 0 && player[p].phys.cVel.x < tempMax) || (tempMax < 0 && player[p].phys.cVel.x > tempMax)){
              player[p].phys.cVel.x = tempMax;
            }
          }
          else {
            player[p].phys.cVel.x += tempAcc;
            if ((tempMax > 0 && player[p].phys.cVel.x > tempMax) || (tempMax < 0 && player[p].phys.cVel.x < tempMax)){
              player[p].phys.cVel.x = tempMax;
            }
          }

        }
      }
    }
  },
  interrupt : function(p){
    var j = checkForJump(p);
    if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      player[p].phys.cVel.x *= 0.25;
      aS[cS[p]].GUARDON.init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      player[p].phys.cVel.x *= 0.25;
      aS[cS[p]].GUARDON.init(p);
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      if (player[p].timer < 4 && player[p].inputs.lStickAxis[0].x*player[p].phys.face >= 0.8){
        player[p].phys.cVel.x *= 0.25;
        aS[cS[p]].FORWARDSMASH.init(p);
      }
      else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
        aS[cS[p]].GRAB.init(p);
      }
      else {
        aS[cS[p]].ATTACKDASH.init(p);
      }
      return true;
    }
    else if (j[0]){
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
    else if (player[p].timer > 4 && checkForSmashTurn(p)){
      player[p].phys.cVel.x *= 0.25;
      aS[cS[p]].SMASHTURN.init(p);
      return true;
    }
    else if (player[p].timer > player[p].charAttributes.dashFrameMax && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].inputs.lStickAxis[2].x * player[p].phys.face < 0.3){
      aS[cS[p]].DASH.init(p);
      return true;
    }
    else if (player[p].timer > player[p].charAttributes.dashFrameMin && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.62){
      aS[cS[p]].RUN.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].DASH){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > DASH.js;

echo 'export default {
  name : "RUN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "RUN";
    player[p].timer = 1;
    aS[cS[p]].RUN.main(p);
  },
  main : function(p){
    if (player[p].timer > frames[cS[p]].RUN){
      player[p].timer = 1;
    }
    if (!aS[cS[p]].RUN.interrupt(p)){
      var footstep = [false,false];
      if (player[p].timer < 2){
        footstep[0] = true;
      }
      if (player[p].timer < 10){
        footstep[1] = true;
      }
      var tempMax = player[p].inputs.lStickAxis[0].x * player[p].charAttributes.dMaxV;

      //Current Run Acceleration = ((MaxRunVel * Xinput) - PreviousFrameVelocity) * (1/(MaxRunVel * 2.5)) * (DRAA + (DRAB/Math.sign(Xinput)))

      var tempAcc = ((player[p].charAttributes.dMaxV * player[p].inputs.lStickAxis[0].x) - player[p].phys.cVel.x) * (1/(player[p].charAttributes.dMaxV * 2.5)) * (player[p].charAttributes.dAccA + (player[p].charAttributes.dAccB / Math.sign(player[p].inputs.lStickAxis[0].x)));


      player[p].phys.cVel.x += tempAcc;
      if (player[p].phys.cVel.x * player[p].phys.face > tempMax * player[p].phys.face){
        player[p].phys.cVel.x = tempMax;
      }

      var time = (player[p].phys.cVel.x * player[p].phys.face) / player[p].charAttributes.dMaxV;
      if (time > 0){
        player[p].timer += time;
      }
      if (player[p].timer > frames[cS[p]].RUN){
        player[p].timer = 1;
      }
      if ((footstep[0] && player[p].timer >= 2) || (footstep[1] && player[p].timer >= 10)){
        sounds.footstep.play();
      }
    }
  },
  interrupt : function(p){
    var j = checkForJump(p);
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
        aS[cS[p]].GRAB.init(p);
      }
      else {
        aS[cS[p]].ATTACKDASH.init(p);
      }
      return true;
    }
    else if (j[0]){
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
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && player[p].inputs.lStickAxis[0].y < -0.58){
      aS[cS[p]].DOWNSPECIALGROUND.init(p);
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
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) < 0.62){
      aS[cS[p]].RUNBRAKE.init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
      aS[cS[p]].RUNTURN.init(p);
      return true;
    }
  }
};
' > RUN.js;

echo 'export default {
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
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    var j = checkForJump(p);
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
    else if (player[p].timer == 2 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79){
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
' > SMASHTURN.js;

echo 'export default {
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
    if (player[p].timer == 6){
      player[p].phys.face *= -1;
    }
    if (!aS[cS[p]].TILTTURN.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer < 6){
      var t = checkForTilts(p,-1);
    }
    else {
      var t = checkForTilts(p);
    }
    var s = checkForSmashes(p);
    var j = checkForJump(p);
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
    else if (player[p].timer == 6 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].phys.dashbuffer){
      aS[cS[p]].DASH.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > TILTTURN.js;

echo 'export default {
  name : "RUNBRAKE",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "RUNBRAKE";
    player[p].timer = 0;
    sounds.runbrake.play();
    aS[cS[p]].RUNBRAKE.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].RUNBRAKE.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var j = checkForJump(p);
    if (j[0]){
      aS[cS[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].timer > 1 && checkForSquat(p)){
      aS[cS[p]].SQUAT.init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
      aS[cS[p]].RUNTURN.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].RUNBRAKE){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > RUNBRAKE.js;

echo 'export default {
  name : "RUNTURN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "RUNTURN";
    player[p].timer = 0;
    aS[cS[p]].RUNTURN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].RUNTURN.interrupt(p)){
      if (player[p].timer == player[p].charAttributes.runTurnBreakPoint+1){
        player[p].phys.face *= -1;
      }

      if (player[p].timer <= player[p].charAttributes.runTurnBreakPoint && player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
        var tempAcc = (player[p].charAttributes.dAccA - (1 - Math.abs(player[p].inputs.lStickAxis[0].x))*(player[p].charAttributes.dAccA))*player[p].phys.face;
        player[p].phys.cVel.x -= tempAcc;
      }
      else if (player[p].timer > player[p].charAttributes.runTurnBreakPoint && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.3){
        var tempAcc = (player[p].charAttributes.dAccA - (1 - Math.abs(player[p].inputs.lStickAxis[0].x))*(player[p].charAttributes.dAccA))*player[p].phys.face;
        player[p].phys.cVel.x += tempAcc;
      }
      else {
        reduceByTraction(p,true);
      }

      /* if make more chars add this, but marth cant have it for a boost run
      if (player[p].timer > 18 && player[p].phys.cVel.x * player[p].phys.face > player[p].charAttributes.dMaxV){
        reduceByTraction(p,true);
      }*/

      if (player[p].timer == player[p].charAttributes.runTurnBreakPoint){
        if (player[p].phys.cVel.x * player[p].phys.face > 0){
          player[p].timer--;
        }
      }
    }
  },
  interrupt : function(p){
    var j = checkForJump(p);
    if (j[0]){
      aS[cS[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].RUNTURN){
      if(player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.6){
        aS[cS[p]].RUN.init(p);
      }
      else {
        aS[cS[p]].WAIT.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};
' > RUNTURN.js;

echo 'export default {
  name : "WALK",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,addInitV){
    player[p].actionState = "WALK";
    player[p].timer = 1;
    if (addInitV){
      var tempInit = player[p].charAttributes.walkInitV * player[p].phys.face;
      if ((tempInit > 0 && player[p].phys.cVel.x < tempInit) || (tempInit < 0 && player[p].phys.cVel.x > tempInit)){
        player[p].phys.cVel.x += player[p].charAttributes.walkInitV * player[p].phys.face;
      }
    }
    aS[cS[p]].WALK.main(p);
  },
  main : function(p){

    if (!aS[cS[p]].WALK.interrupt(p)){
      var footstep = [false,false];
      if (player[p].timer < 5){
        footstep[0] = true;
      }
      if (player[p].timer < 15){
        footstep[1] = true;
      }

      //Current Walk Acceleration = ((MaxWalkVel * Xinput) - PreviousFrameVelocity) * (1/(MaxWalkVel * 2)) * (InitWalkVel * WalkAcc)
      var tempMax = player[p].charAttributes.walkMaxV * player[p].inputs.lStickAxis[0].x;

      if (Math.abs(player[p].phys.cVel.x) > Math.abs(tempMax)){
        reduceByTraction(p,true);
      }
      else {

        var tempAcc = (tempMax - player[p].phys.cVel.x) * (1/(player[p].charAttributes.walkMaxV*2)) * (player[p].charAttributes.walkInitV + player[p].charAttributes.walkAcc);

        player[p].phys.cVel.x += tempAcc;
        if (player[p].phys.cVel.x * player[p].phys.face > tempMax * player[p].phys.face){
          player[p].phys.cVel.x = tempMax;
        }
      }
      var time = (player[p].phys.cVel.x * player[p].phys.face) / player[p].charAttributes.walkMaxV;
      if (time > 0){
        player[p].timer += time;
      }
      if ((footstep[0] && player[p].timer >= 5) || (footstep[1] && player[p].timer >= 15)){
        sounds.footstep.play();
      }
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    var j = checkForJump(p);
    if (player[p].timer > frames[cS[p]].WALK){
      aS[cS[p]].WALK.init(p,false);
      return true;
    }
    if (player[p].inputs.lStickAxis[0].x == 0){
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
    else {
      return false;
    }
  }
};
' > WALK.js;

echo 'export default {
  name : "KNEEBEND",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p,type){
    player[p].actionState = "KNEEBEND";
    player[p].timer = 0;
    player[p].phys.jumpType = 1;
    player[p].phys.jumpSquatType = type;
    aS[cS[p]].KNEEBEND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].KNEEBEND.interrupt(p)){
      reduceByTraction(p,true);
      // if jumpsquat initiated by stick
      if (player[p].phys.jumpSquatType){
        if (player[p].inputs.lStickAxis[0].y < 0.67){
          player[p].phys.jumpType = 0;
        }
      }
      // else if jumpsquat initiated by button
      else {
        if (!player[p].inputs.x[0] && !player[p].inputs.y[0]){
          player[p].phys.jumpType = 0;
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer == player[p].charAttributes.jumpSquat){
      // so they can be detected as above current surface instantly
      player[p].phys.pos.y += 0.001;
    }
    if (player[p].timer > player[p].charAttributes.jumpSquat){
      if (player[p].inputs.lStickAxis[2].x * player[p].phys.face >= -0.3){
        aS[cS[p]].JUMPF.init(p,player[p].phys.jumpType);
      }
      else {
        aS[cS[p]].JUMPB.init(p,player[p].phys.jumpType);
      }
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1] && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      aS[cS[p]].GRAB.init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1] && player[p].inputs.lStickAxis[0].y >= 0.8 && player[p].inputs.lStickAxis[3].y < 0.3) || (player[p].inputs.cStickAxis[0].y >= 0.8 && player[p].inputs.cStickAxis[3].y < 0.3)){
      aS[cS[p]].UPSMASH.init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && player[p].inputs.lStickAxis[0].y > 0.58){
      aS[cS[p]].UPSPECIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > KNEEBEND.js;

echo 'export default {
  name : "JUMPF",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,type){
    player[p].actionState = "JUMPF";
    player[p].timer = 0;
    if (type){
      player[p].phys.cVel.y += player[p].charAttributes.fHopInitV;
    }
    else {
      player[p].phys.cVel.y += player[p].charAttributes.sHopInitV;
    }

    player[p].phys.cVel.x = (player[p].phys.cVel.x * player[p].charAttributes.groundToAir) + (player[p].inputs.lStickAxis[0].x * player[p].charAttributes.jumpHinitV);
    if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.jumpHmaxV){
      player[p].phys.cVel.x = player[p].charAttributes.jumpHmaxV * Math.sign(player[p].phys.cVel.x);
    }

    player[p].phys.grounded = false;
    sounds.jump2.play();
    aS[cS[p]].JUMPF.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("JUMP",p);
    if (!aS[cS[p]].JUMPF.interrupt(p)){
      if (player[p].timer > 1){
        fastfall(p);
        airDrift(p);
      }
    }
  },
  interrupt : function(p){
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
    else if (player[p].timer > frames[cS[p]].JUMPF){
      aS[cS[p]].FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > JUMPF.js;

echo 'export default {
  name : "JUMPB",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,type){
    player[p].actionState = "JUMPB";
    player[p].timer = 0;
    if (type){
      player[p].phys.cVel.y += player[p].charAttributes.fHopInitV;
    }
    else {
      player[p].phys.cVel.y += player[p].charAttributes.sHopInitV;
    }

    player[p].phys.cVel.x = (player[p].phys.cVel.x * player[p].charAttributes.groundToAir) + (player[p].inputs.lStickAxis[0].x * player[p].charAttributes.jumpHinitV);
    if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.jumpHmaxV){
      player[p].phys.cVel.x = player[p].charAttributes.jumpHmaxV * Math.sign(player[p].phys.cVel.x);
    }

    player[p].phys.grounded = false;
    sounds.jump2.play();
    aS[cS[p]].JUMPB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].JUMPB.interrupt(p)){
      if (player[p].timer > 1){
        fastfall(p);
        airDrift(p);
      }
    }
  },
  interrupt : function(p){
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
    else if (player[p].timer > frames[cS[p]].JUMPB){
      aS[cS[p]].FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > JUMPB.js;

echo 'export default {
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
      else if (player[p].timer == 5 && player[p].inputs.lStickAxis[0].y < -0.5){
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
' > LANDING.js;

echo 'export default {
  name : "ESCAPEAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  vCancel : true,
  init : function(p){
    player[p].actionState = "ESCAPEAIR";
    player[p].timer = 0;
    if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0 || Math.abs(player[p].inputs.lStickAxis[0].y) > 0){
      var ang = getAngle(player[p].inputs.lStickAxis[0].x,player[p].inputs.lStickAxis[0].y);
      player[p].phys.cVel.x = 3.1 * Math.cos(ang);
      player[p].phys.cVel.y = 3.1 * Math.sin(ang);
    }
    else {
      player[p].phys.cVel.x = 0;
      player[p].phys.cVel.y = 0;
    }
    player[p].phys.fastfalled = false;
    player[p].phys.landingMultiplier = 3;
    aS[cS[p]].ESCAPEAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].ESCAPEAIR.interrupt(p)){
      if (player[p].timer < 30){
        player[p].phys.cVel.x *= 0.9;
        player[p].phys.cVel.y *= 0.9;
      }
      else {
        airDrift(p);
        fastfall(p);
      }
      executeIntangibility("ESCAPEAIR",p);
      playSounds("ESCAPEAIR",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[cS[p]].FALLSPECIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].phys.intangibleTimer = 0;
    player[p].phys.hurtBoxState = 0;
    aS[cS[p]].LANDINGFALLSPECIAL.init(p);
  }
};
' > ESCAPEAIR.js;

echo 'export default {
  name : "LANDINGFALLSPECIAL",
  canEdgeCancel : true,
  canGrabLedge : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDINGFALLSPECIAL";
    player[p].timer = 0;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[cS[p]].LANDINGFALLSPECIAL.main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingMultiplier;
    if (!aS[cS[p]].LANDINGFALLSPECIAL.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > LANDINGFALLSPECIAL.js;

echo 'export default {
  name : "FALL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,disableInputs){
    var dInputs = disableInputs || false;
    player[p].actionState = "FALL";
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[cS[p]].FALL.main(p,dInputs);
  },
  main : function(p,disableInputs){
    player[p].timer++;
    if (disableInputs){
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      airDrift(p);
    }
    else {
      if (!aS[cS[p]].FALL.interrupt(p)){
        fastfall(p);
        airDrift(p);
      }
    }
  },
  interrupt : function(p,disableInputs){
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
    else if (player[p].timer > frames[cS[p]].FALL){
      aS[cS[p]].FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > FALL.js;

echo 'export default {
  name : "FALLAERIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p){
    player[p].actionState = "FALLAERIAL";
    player[p].timer = 0;
    aS[cS[p]].FALLAERIAL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FALLAERIAL.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
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
    else if (player[p].timer > frames[cS[p]].FALLAERIAL){
      aS[cS[p]].FALLAERIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > FALLAERIAL.js;


echo 'export default {
  name : "FALLSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  vCancel : true,
  init : function(p){
    player[p].actionState = "FALLSPECIAL";
    player[p].timer = 0;
    aS[cS[p]].FALLSPECIAL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FALLSPECIAL.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].FALLSPECIAL){
      aS[cS[p]].FALLSPECIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    aS[cS[p]].LANDINGFALLSPECIAL.init(p);
  }
};
' > FALLSPECIAL.js;

echo 'export default {
  name : "SQUAT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  crouch : true,
  disableTeeter : true,
  init : function(p){
    player[p].actionState = "SQUAT";
    player[p].timer = 0;
    aS[cS[p]].SQUAT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SQUAT.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    var j = checkForJump(p);
    if (player[p].timer == 4 && (player[p].inputs.lStickAxis[0].y < -0.65 || player[p].inputs.lStickAxis[1].y < -0.65 || player[p].inputs.lStickAxis[2].y < -0.65) && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
      aS[cS[p]].PASS.init(p);
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
    else if (player[p].timer > frames[cS[p]].SQUAT){
      aS[cS[p]].SQUATWAIT.init(p);
      return true;
    }
    else if (j[0]){
      aS[cS[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else {
      return false;
    }
  }
};
' > SQUAT.js;

echo 'export default {
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
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    var j = checkForJump(p);
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
' > SQUATWAIT.js;

echo 'export default {
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
' > SQUATRV.js;

echo 'export default {
  name : "JUMPAERIALF",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p){
    player[p].actionState = "JUMPAERIALF";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;

    player[p].phys.cVel.y = player[p].charAttributes.fHopInitV * player[p].charAttributes.djMultiplier;

    player[p].phys.cVel.x = player[p].inputs.lStickAxis[0].x * player[p].charAttributes.djMomentum;
    drawVfx("doubleJumpRings",player[p].phys.pos,player[p].phys.face);
    sounds.jump2.play();
    aS[cS[p]].JUMPAERIALF.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("JUMPAERIAL",p);
    if (!aS[cS[p]].JUMPAERIALF.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
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
    else if (b[0]){
      aS[cS[p]][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].JUMPAERIALF){
      aS[cS[p]].FALLAERIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > JUMPAERIALF.js;

echo 'export default {
  name : "JUMPAERIALB",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p){
    player[p].actionState = "JUMPAERIALB";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;

    player[p].phys.cVel.y = player[p].charAttributes.fHopInitV * player[p].charAttributes.djMultiplier;

    player[p].phys.cVel.x = player[p].inputs.lStickAxis[0].x * player[p].charAttributes.djMomentum;
    drawVfx("doubleJumpRings",player[p].phys.pos,player[p].phys.face);
    sounds.jump2.play();
    aS[cS[p]].JUMPAERIALB.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("JUMPAERIAL",p);
    if (!aS[cS[p]].JUMPAERIALB.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
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
    else if (b[0]){
      aS[cS[p]][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].JUMPAERIALB){
      aS[cS[p]].FALLAERIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > JUMPAERIALB.js;

echo 'export default {
  name : "PASS",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "PASS";
    player[p].timer = 0;
    player[p].phys.grounded = false;
    player[p].phys.passFastfall = false;
    player[p].phys.abovePlatforms[player[p].phys.onSurface[1]] = false;
    player[p].phys.cVel.y = -0.5;
    aS[cS[p]].PASS.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer > 1){
      if (!aS[cS[p]].PASS.interrupt(p)){
        if (player[p].phys.passFastfall){
          fastfall(p);
        }
        else {
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
          if (player[p].inputs.lStickAxis[0].y > -0.3){
            player[p].phys.passFastfall = true;
          }
        }
        airDrift(p);
      }
    }
  },
  interrupt : function(p){
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
    else if (player[p].timer > frames[cS[p]].PASS){
      aS[cS[p]].FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > PASS.js;

echo 'export default {
  name : "GUARDON",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p){
    player[p].actionState = "GUARDON";
    player[p].timer = 0;
    player[p].phys.shielding = true;
    player[p].phys.shieldPosition = new Vec2D(0,0);
    player[p].phys.powerShielded = false;
    shieldSize(p,true);
    if (Math.max(player[p].inputs.lAnalog[0],player[p].inputs.rAnalog[0]) == 1){
      player[p].phys.powerShieldActive = true;
      player[p].phys.powerShieldReflectActive = true;
    }
    else {
      player[p].phys.powerShieldActive = false;
      player[p].phys.powerShieldReflectActive = false;
    }
    aS[cS[p]].GUARDON.main(p);
  },
  main : function(p){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true);
    }
    else {
      player[p].timer++;
      playSounds("GUARDON",p);
      if (player[p].timer == 3){
        player[p].phys.powerShieldReflectActive = false;
      }
      if (player[p].timer == 5){
        player[p].phys.powerShieldActive = false;
      }
      /*if (player[p].timer == 2 && Math.max(player[p].inputs.lAnalog[0],player[p].inputs.rAnalog[0]) == 1){
        player[p].phys.powerShieldActive = true;
      }*/
      if (!aS[cS[p]].GUARDON.interrupt(p)){
        if (player[p].timer == 1){
          sounds.shieldup.play();
        }
        if (!player[p].inCSS){
          reduceByTraction(p,false);
          shieldDepletion(p);
        }
        shieldTilt(p,false);
        shieldSize(p);
      }
    }
  },
  interrupt : function(p){
    if (!player[p].inCSS){
      var j = checkForJump(p);
      if (j[0] || player[p].inputs.cStickAxis[0].y > 0.65){
        player[p].phys.shielding = false;
        aS[cS[p]].KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.shielding = false;
        aS[cS[p]].GRAB.init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[4].y > -0.3) || player[p].inputs.cStickAxis[0].y < -0.7){
        player[p].phys.shielding = false;
        aS[cS[p]].ESCAPEN.init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face < 0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        aS[cS[p]].ESCAPEF.init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face > -0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        aS[cS[p]].ESCAPEB.init(p);
        return true;
      }
      else if (player[p].timer > 1 && player[p].inputs.lStickAxis[0].y < -0.65 && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        aS[cS[p]].PASS.init(p);
        return true;
      }
      else if (player[p].timer > frames[cS[p]].GUARDON){
        aS[cS[p]].GUARD.init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].timer > 8){
        aS[cS[p]].GUARD.init(p);
        return true;
      }
      else {
        return false;
      }
    }
  }
};
' > GUARDON.js;

echo 'export default {
  name : "GUARD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  missfoot : true,
  init : function(p){
    player[p].actionState = "GUARD";
    player[p].timer = 0;
    player[p].phys.powerShieldActive = false;
    player[p].phys.powerShieldReflectActive = false;
    aS[cS[p]].GUARD.main(p);
  },
  main : function(p){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true);
    }
    else {
      player[p].timer++;
      if (!aS[cS[p]].GUARD.interrupt(p)){
        if (!player[p].inCSS){
          reduceByTraction(p,false);
          shieldDepletion(p);
        }
        shieldTilt(p,false);
        shieldSize(p);
      }
    }
  },
  interrupt : function(p){
    if (!player[p].inCSS){
      var j = checkForJump(p);
      if (j[0] || player[p].inputs.cStickAxis[0].y > 0.66){
        player[p].phys.shielding = false;
        aS[cS[p]].KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.shielding = false;
        aS[cS[p]].GRAB.init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[4].y > -0.3) || player[p].inputs.cStickAxis[0].y < -0.7){
        player[p].phys.shielding = false;
        aS[cS[p]].ESCAPEN.init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face < 0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        aS[cS[p]].ESCAPEF.init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face > -0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        aS[cS[p]].ESCAPEB.init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.65 && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        aS[cS[p]].PASS.init(p);
        return true;
      }
      else if (player[p].inputs.lAnalog[0] < 0.3 && player[p].inputs.rAnalog[0] < 0.3){
        player[p].phys.shielding = false;
        aS[cS[p]].GUARDOFF.init(p);
        return true;
      }
      else if (player[p].timer > 1){
        aS[cS[p]].GUARD.init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].inputs.lAnalog[0] < 0.3 && player[p].inputs.rAnalog[0] < 0.3){
        player[p].phys.shielding = false;
        aS[cS[p]].GUARDOFF.init(p);
        return true;
      }
      else if (player[p].timer > 1){
        aS[cS[p]].GUARD.init(p);
        return true;
      }
      else {
        return false;
      }
    }
  }
};
' > GUARD.js;

echo 'export default {
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
' > GUARDOFF.js;

echo 'export default {
  name : "CLIFFCATCH",
  canGrabLedge : false,
  canBeGrabbed : false,
  posOffset : [],
  landType : 0,
  init : function(p){
    player[p].actionState = "CLIFFCATCH";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.thrownHitbox = false;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = false;
    player[p].phys.jumpsUsed = 0;
    player[p].phys.intangibleTimer = 38;
    player[p].phys.ledgeHangTimer = 0;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    player[p].colourOverlayBool = false;
    player[p].phys.chargeFrames = 0;
    player[p].phys.charging = false;
    turnOffHitboxes(p);
    drawVfx("cliffcatchspark",new Vec2D(stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x,stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y),player[p].phys.face);
    aS[cS[p]].CLIFFCATCH.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("CLIFFCATCH",p);
    if (!aS[cS[p]].CLIFFCATCH.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      player[p].phys.pos = new Vec2D(x+(aS[cS[p]].CLIFFCATCH.posOffset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[cS[p]].CLIFFCATCH.posOffset[player[p].timer-1][1]);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].CLIFFCATCH){
      aS[cS[p]].CLIFFWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > CLIFFCATCH.js;

echo 'export default {
  name : "CLIFFWAIT",
  canGrabLedge : false,
  canBeGrabbed : false,
  wallJumpAble : false,
  posOffset : [],
  landType : 0,
  init : function(p){
    player[p].actionState = "CLIFFWAIT";
    player[p].timer = 0;
    aS[cS[p]].CLIFFWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CLIFFWAIT.interrupt(p)){
      player[p].phys.ledgeHangTimer++;
    }
  },
  interrupt : function(p){
    if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.2 && player[p].inputs.lStickAxis[1].x*player[p].phys.face >= -0.2) || (player[p].inputs.lStickAxis[0].y < -0.2 && player[p].inputs.lStickAxis[1].y >= -0.2) || (player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.2 && player[p].inputs.cStickAxis[1].x*player[p].phys.face >= -0.2) || (player[p].inputs.cStickAxis[0].y < -0.2 && player[p].inputs.cStickAxis[1].y >= -0.2)){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[cS[p]].FALL.init(p,true);
      return true;
    }
    else if ((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.65 && player[p].inputs.lStickAxis[1].y <= 0.65)){
      if (player[p].percent < 100){
        aS[cS[p]].CLIFFJUMPQUICK.init(p);
      }
      else {
        aS[cS[p]].CLIFFJUMPSLOW.init(p);
      }
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.2 && player[p].inputs.lStickAxis[1].x*player[p].phys.face <= 0.2) || (player[p].inputs.lStickAxis[0].y > 0.2 && player[p].inputs.lStickAxis[1].y <= 0.2)){
      if (player[p].percent < 100){
        aS[cS[p]].CLIFFGETUPQUICK.init(p);
      }
      else {
        aS[cS[p]].CLIFFGETUPSLOW.init(p);
      }
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1]) || (player[p].inputs.cStickAxis[0].y > 0.65 && player[p].inputs.cStickAxis[1].y <= 0.65)){
      if (player[p].percent < 100){
        aS[cS[p]].CLIFFATTACKQUICK.init(p);
      }
      else {
        aS[cS[p]].CLIFFATTACKSLOW.init(p);
      }
      return true;
    }
    else if ((player[p].inputs.lAnalog[0] > 0.3 && player[p].inputs.lAnalog[1] <= 0.3) || (player[p].inputs.rAnalog[0] > 0.3 && player[p].inputs.rAnalog[1] <= 0.3) || (player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.8 && player[p].inputs.cStickAxis[1].x*player[p].phys.face <= 0.8)){
      if (player[p].percent < 100){
        aS[cS[p]].CLIFFESCAPEQUICK.init(p);
      }
      else {
        aS[cS[p]].CLIFFESCAPESLOW.init(p);
      }
      return true;
    }
    else if (player[p].phys.ledgeHangTimer > 600){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[cS[p]].DAMAGEFALL.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].CLIFFWAIT){
      aS[cS[p]].CLIFFWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > CLIFFWAIT.js;

echo 'export default {
  name : "DEADLEFT",
  canBeGrabbed : false,
  ignoreCollision : true,
  dead : true,
  init : function(p){
    player[p].actionState = "DEADLEFT";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].percent = 0;
    drawVfx("blastzoneExplosion",player[p].phys.pos,90);
    if (!isFinalDeath()){
      screenShake(500);
      percentShake(500,p);
    }
    sounds.kill.play();
    aS[cS[p]].DEADLEFT.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("DEAD",p);
    if (!aS[cS[p]].DEADLEFT.interrupt(p)){
      player[p].phys.outOfCameraTimer = 0;
      player[p].phys.intangibleTimer = 2;
      if (player[p].timer == 4){
        if (isFinalDeath()){
          finishGame();
        }
        else {
          screenShake(500);
          percentShake(500,p);
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      if (player[p].stocks > 0){
        aS[cS[p]].REBIRTH.init(p);
      }
      else {
        aS[cS[p]].SLEEP.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};
' > DEADLEFT.js;

echo 'export default {
  name : "DEADRIGHT",
  canBeGrabbed : false,
  ignoreCollision : true,
  dead : true,
  init : function(p){
    player[p].actionState = "DEADRIGHT";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].percent = 0;
    drawVfx("blastzoneExplosion",player[p].phys.pos,-90);
    if (!isFinalDeath()){
      screenShake(500);
      percentShake(500,p);
    }
    sounds.kill.play();
    aS[cS[p]].DEADRIGHT.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("DEAD",p);
    if (!aS[cS[p]].DEADRIGHT.interrupt(p)){
      player[p].phys.outOfCameraTimer = 0;
      player[p].phys.intangibleTimer = 2;
      if (player[p].timer == 4){
        if (isFinalDeath()){
          finishGame();
        }
        else {
          screenShake(500);
          percentShake(500,p);
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      if (player[p].stocks > 0){
        aS[cS[p]].REBIRTH.init(p);
      }
      else {
        aS[cS[p]].SLEEP.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};
' > DEADRIGHT.js;

echo 'export default {
  name : "DEADUP",
  canBeGrabbed : false,
  ignoreCollision : true,
  dead : true,
  init : function(p){
    player[p].actionState = "DEADUP";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].percent = 0;
    drawVfx("blastzoneExplosion",player[p].phys.pos,180);
    if (!isFinalDeath()){
      screenShake(500);
      percentShake(500,p);
    }
    sounds.kill.play();
    aS[cS[p]].DEADUP.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("DEAD",p);
    if (!aS[cS[p]].DEADUP.interrupt(p)){
      player[p].phys.outOfCameraTimer = 0;
      player[p].phys.intangibleTimer = 2;
      if (player[p].timer == 4){
        if (isFinalDeath()){
          finishGame();
        }
        else {
          screenShake(500);
          percentShake(500,p);
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      if (player[p].stocks > 0){
        aS[cS[p]].REBIRTH.init(p);
      }
      else {
        aS[cS[p]].SLEEP.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};
' > DEADUP.js;

echo 'export default {
  name : "DEADDOWN",
  canBeGrabbed : false,
  ignoreCollision : true,
  dead : true,
  init : function(p){
    player[p].actionState = "DEADDOWN";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].percent = 0;
    drawVfx("blastzoneExplosion",player[p].phys.pos,0);
    if (!isFinalDeath()){
      screenShake(500);
      percentShake(500,p);
    }
    sounds.kill.play();
    aS[cS[p]].DEADDOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("DEAD",p);
    if (!aS[cS[p]].DEADDOWN.interrupt(p)){
      player[p].phys.outOfCameraTimer = 0;
      player[p].phys.intangibleTimer = 2;
      if (player[p].timer == 4){
        if (isFinalDeath()){
          finishGame();
        }
        else {
          screenShake(500);
          percentShake(500,p);
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      if (player[p].stocks > 0){
        aS[cS[p]].REBIRTH.init(p);
      }
      else {
        aS[cS[p]].SLEEP.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};
' > DEADDOWN.js;

echo 'export default {
  name : "REBIRTH",
  canBeGrabbed : false,
  ignoreCollision : true,
  init : function(p){
    player[p].actionState = "REBIRTH";
    player[p].timer = 1;
    player[p].phys.pos.x = stage.respawnPoints[p].x;
    player[p].phys.pos.y = stage.respawnPoints[p].y+135;
    //player[p].phys.grounded = true;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = -1.5;
    player[p].phys.face = stage.respawnFace[p];
    player[p].phys.doubleJumped = false;
    player[p].phys.fastfalled = false;
    player[p].phys.jumpsUsed = 0;
    player[p].phys.wallJumpCount = 0;
    player[p].phys.sideBJumpFlag = true;
    player[p].spawnWaitTime = 0;
    player[p].percent = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].hit.hitstun = 0;
    player[p].phys.shieldHP = 60;
    player[p].burning = 0;
    player[p].shocked = 0;
  },
  main : function(p){
    player[p].timer+= 1;
    if (!aS[cS[p]].REBIRTH.interrupt(p)){
      player[p].phys.outOfCameraTimer = 0;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 90){
      aS[cS[p]].REBIRTHWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > REBIRTH.js;

echo 'export default {
  name : "REBIRTHWAIT",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = "REBIRTHWAIT";
    player[p].timer = 1;
    player[p].phys.cVel.y = 0;
  },
  main : function(p){
    player[p].timer+= 1;
    player[p].spawnWaitTime++;
    if (!aS[cS[p]].REBIRTHWAIT.interrupt(p)){
      player[p].phys.outOfCameraTimer = 0;
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].WAIT){
      aS[cS[p]].REBIRTHWAIT.init(p);
      return true;
    }
    else if (player[p].spawnWaitTime > 300){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      aS[cS[p]].FALL.init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 || Math.abs(player[p].inputs.lStickAxis[0].y) > 0.3 ){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      aS[cS[p]].FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > REBIRTHWAIT.js;


echo 'export default {
  name : "DAMAGEFLYN",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 2,
  init : function(p,drawStuff){
    player[p].actionState = "DAMAGEFLYN";
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.grabbedBy = -1;
    player[p].phys.fastfalled = false;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    player[p].colourOverlayBool = false;
    if (drawStuff){
      // drawVfx("hitSparks",player[p].hit.hitPoint,player[p].phys.face);
      // drawVfx("hitFlair",player[p].hit.hitPoint,player[p].phys.face);
      // drawVfx("hitCurve",player[p].hit.hitPoint,player[p].phys.face,player[p].hit.angle);
    }
    player[p].hitboxes.id[0] = player[p].charHitboxes.thrown.id0;
    /*player[p].phys.grounded = false;
    player[p].phys.pos.y += 0.0001;*/
    turnOffHitboxes(p);
    aS[cS[p]].DAMAGEFLYN.main(p);
  },
  main : function(p){
    if (player[p].phys.thrownHitbox){
      if (player[p].timer == 1 && player[p].phys.cVel.y+player[p].phys.kVel.y > 0){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 1 && player[p].phys.cVel.y+player[p].phys.kVel.y > 0){
        //player[p].hitboxes.frame++;
      }
      if (player[p].phys.cVel.y+player[p].phys.kVel.y <= 0){
        turnOffHitboxes(p);
      }
    }
    if (player[p].timer < frames[cS[p]].DAMAGEFLYN){
      player[p].timer++;
    }
    if (player[p].hit.hitstun % 10 == 0){
      drawVfx("flyingDust",player[p].phys.pos);
    }
    if (!aS[cS[p]].DAMAGEFLYN.interrupt(p)){
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
        if (!player[p].phys.grounded){
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
        }
      }
    }
    else {
      player[p].phys.thrownHitbox = false;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 1 && player[p].hit.hitstun == 0){
      aS[cS[p]].DAMAGEFALL.init(p);
      player[p].phys.thrownHitbox = false;
      return true;
    }
    else {
      return false;
    }
  }
};
' > DAMAGEFLYN.js;

echo 'export default {
  name : "DAMAGEFALL",
  canPassThrough : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 2,
  vCancel : true,
  init : function(p){
    player[p].actionState = "DAMAGEFALL";
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[cS[p]].DAMAGEFALL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DAMAGEFALL.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
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
    else if (player[p].timer > frames[cS[p]].DAMAGEFALL){
      aS[cS[p]].DAMAGEFALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > DAMAGEFALL.js;

echo 'export default {
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
' > DAMAGEN2.js;

echo 'export default {
  name : "LANDINGATTACKAIRN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDINGATTACKAIRN";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[cS[p]].LANDINGATTACKAIRN.main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[cS[p]].LANDINGATTACKAIRN.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].LANDINGATTACKAIRN){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > LANDINGATTACKAIRN.js;

echo 'export default {
  name : "LANDINGATTACKAIRF",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDINGATTACKAIRF";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[cS[p]].LANDINGATTACKAIRF.main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[cS[p]].LANDINGATTACKAIRF.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].LANDINGATTACKAIRF){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > LANDINGATTACKAIRF.js;

echo 'export default {
  name : "LANDINGATTACKAIRB",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDINGATTACKAIRB";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[cS[p]].LANDINGATTACKAIRB.main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[cS[p]].LANDINGATTACKAIRB.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].LANDINGATTACKAIRB){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > LANDINGATTACKAIRB.js;

echo 'export default {
  name : "LANDINGATTACKAIRD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDINGATTACKAIRD";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[cS[p]].LANDINGATTACKAIRD.main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[cS[p]].LANDINGATTACKAIRD.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].LANDINGATTACKAIRD){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > LANDINGATTACKAIRD.js;

echo 'export default {
  name : "LANDINGATTACKAIRU",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDINGATTACKAIRU";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[cS[p]].LANDINGATTACKAIRU.main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[cS[p]].LANDINGATTACKAIRU.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].LANDINGATTACKAIRU){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > LANDINGATTACKAIRU.js;

echo 'export default {
  name : "ESCAPEB",
  setVelocities : [],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "ESCAPEB";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    aS[cS[p]].ESCAPEB.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("ESCAPEB",p);
    if (!aS[cS[p]].ESCAPEB.interrupt(p)){
      player[p].phys.cVel.x = aS[cS[p]].ESCAPEB.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("ESCAPEB",p);
      if (player[p].timer == 4){
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].ESCAPEB){
      player[p].phys.cVel.x = 0;
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > ESCAPEB.js;

echo 'export default {
  name : "ESCAPEF",
  setVelocities : [],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "ESCAPEF";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    aS[cS[p]].ESCAPEF.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("ESCAPEF",p);
    if (!aS[cS[p]].ESCAPEF.interrupt(p)){
      player[p].phys.cVel.x = aS[cS[p]].ESCAPEF.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("ESCAPEF",p);
      if (player[p].timer == 4){
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].ESCAPEF){
      player[p].phys.cVel.x = 0;
      player[p].phys.face *= -1;
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > ESCAPEF.js;

echo 'export default {
  name : "ESCAPEN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "ESCAPEN";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    aS[cS[p]].ESCAPEN.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("ESCAPEN",p);
    if (!aS[cS[p]].ESCAPEN.interrupt(p)){
      if (player[p].timer == 1){
        sounds.spotdodge.play();
      }
      reduceByTraction(p,true);
      executeIntangibility("ESCAPEN",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].ESCAPEN){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > ESCAPEN.js;

echo 'export default {
  name : "DOWNBOUND",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : false,
  downed : true,
  init : function(p){
    player[p].actionState = "DOWNBOUND";
    player[p].timer = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.jabReset = false;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    aS[cS[p]].DOWNBOUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNBOUND.interrupt(p)){
      if (player[p].timer == 1){
        reduceByTraction(p,true);
      }
      else {
        player[p].phys.cVel.x = 0;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].DOWNBOUND){
      aS[cS[p]].DOWNWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > DOWNBOUND.js;

echo 'export default {
  name : "DOWNWAIT",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : false,
  downed : true,
  init : function(p){
    player[p].actionState = "DOWNWAIT";
    player[p].timer = 0;
    aS[cS[p]].DOWNWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNWAIT.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].DOWNWAIT){
      aS[cS[p]].DOWNWAIT.init(p);
      return true;
    }
    else if (player[p].phys.jabReset){
      if (player[p].hit.hitstun <= 0){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7){
          aS[cS[p]].DOWNSTANDB.init(p);
          return true;
        }
        else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7){
          aS[cS[p]].DOWNSTANDF.init(p);
          return true;
        }
        else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1])){
          aS[cS[p]].DOWNATTACK.init(p);
          return true;
        }
        else {
          aS[cS[p]].DOWNSTANDN.init(p);
          return true;
        }
      }
      else {
        return false;
      }
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7){
      aS[cS[p]].DOWNSTANDB.init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7){
      aS[cS[p]].DOWNSTANDF.init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].y > 0.7){
      aS[cS[p]].DOWNSTANDN.init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1])){
      aS[cS[p]].DOWNATTACK.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > DOWNWAIT.js;

echo 'export default {
  name : "DOWNDAMAGE",
  canEdgeCancel : true,
  disableTeeter : true,
  airborneState : "DOWNDAMAGE",
  canBeGrabbed : true,
  downed : true,
  landType : 1,
  canGrabLedge : [false,false],
  init : function(p){
    player[p].actionState = "DOWNDAMAGE";
    player[p].timer = 0;
    player[p].phys.jabReset = true;
    player[p].phys.grounded = false;
    aS[cS[p]].DOWNDAMAGE.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNDAMAGE.interrupt(p)){
      if (!player[p].phys.grounded){
        player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      }
      else {
        reduceByTraction(p,true);
      }
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 13){
      if (player[p].phys.grounded){
        if (player[p].hit.hitstun <= 0){
          aS[cS[p]].DOWNSTANDN.init(p);
        }
        else {
          aS[cS[p]].DOWNWAIT.init(p);
        }
      }
      else {
        aS[cS[p]].FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){

  }
};
' > DOWNDAMAGE.js;

echo 'export default {
  name : "DOWNSTANDN",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DOWNSTANDN";
    player[p].timer = 0;
    aS[cS[p]].DOWNSTANDN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNSTANDN.interrupt(p)){
      reduceByTraction(p,true);
      executeIntangibility("DOWNSTANDN",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].DOWNSTANDN){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > DOWNSTANDN.js;

echo 'export default {
  name : "DOWNSTANDB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p){
    player[p].actionState = "DOWNSTANDB";
    player[p].timer = 0;
    aS[cS[p]].DOWNSTANDB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNSTANDB.interrupt(p)){
      player[p].phys.cVel.x = aS[cS[p]].DOWNSTANDB.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("DOWNSTANDB",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].DOWNSTANDB){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > DOWNSTANDB.js;

echo 'export default {
  name : "DOWNSTANDF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p){
    player[p].actionState = "DOWNSTANDF";
    player[p].timer = 0;
    aS[cS[p]].DOWNSTANDF.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNSTANDF.interrupt(p)){
      player[p].phys.cVel.x = aS[cS[p]].DOWNSTANDF.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("DOWNSTANDF",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].DOWNSTANDF){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > DOWNSTANDF.js;

echo 'export default {
  name : "TECHN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "TECHN";
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[cS[p]].TECHN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].TECHN.interrupt(p)){
      reduceByTraction(p,true);
      executeIntangibility("TECHN",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].TECHN){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > TECHN.js;

echo 'export default {
  name : "TECHB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p){
    player[p].actionState = "TECHB";
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[cS[p]].TECHB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].TECHB.interrupt(p)){
      executeIntangibility("TECHB",p);
      player[p].phys.cVel.x = aS[cS[p]].TECHB.setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].TECHB){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > TECHB.js;

echo 'export default {
  name : "TECHF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p){
    player[p].actionState = "TECHF";
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[cS[p]].TECHF.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].TECHF.interrupt(p)){
      executeIntangibility("TECHF",p);
      player[p].phys.cVel.x = aS[cS[p]].TECHF.setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].TECHF){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > TECHF.js;

echo 'export default {
  name : "SHIELDBREAKFALL",
  canPassThrough : false,
  canBeGrabbed : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  landType : 1,
  init : function(p){
    player[p].actionState = "SHIELDBREAKFALL";
    player[p].timer = 0;
    aS[cS[p]].SHIELDBREAKFALL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SHIELDBREAKFALL.interrupt(p)){
      player[p].phys.intangibleTimer = 1;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].SHIELDBREAKFALL){
      aS[cS[p]].SHIELDBREAKFALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    aS[cS[p]].SHIELDBREAKDOWNBOUND.init(p);
  }
};
' > SHIELDBREAKFALL.js;

echo 'export default {
  name : "SHIELDBREAKDOWNBOUND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "SHIELDBREAKDOWNBOUND";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.y = 0;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    aS[cS[p]].SHIELDBREAKDOWNBOUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SHIELDBREAKDOWNBOUND.interrupt(p)){
      player[p].phys.intangibleTimer = 1;
      if (player[p].timer == 1){
        reduceByTraction(p,true);
      }
      else {
        player[p].phys.cVel.x = 0;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].SHIELDBREAKDOWNBOUND){
      aS[cS[p]].SHIELDBREAKSTAND.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > SHIELDBREAKDOWNBOUND.js;

echo 'export default {
  name : "SHIELDBREAKSTAND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "SHIELDBREAKSTAND";
    player[p].timer = 0;
    aS[cS[p]].SHIELDBREAKSTAND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SHIELDBREAKSTAND.interrupt(p)){
      reduceByTraction(p,true);
      player[p].phys.intangibleTimer = 1;
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].SHIELDBREAKSTAND){
      aS[cS[p]].FURAFURA.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > SHIELDBREAKSTAND.js;

echo 'export default {
  name : "FURAFURA",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FURAFURA";
    player[p].timer = 0;
    player[p].phys.stuckTimer = 490;
    drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(4+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+11+Math.random()*3),player[p].phys.face);
    player[p].furaLoopID = sounds.furaloop.play();
    aS[cS[p]].FURAFURA.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FURAFURA.interrupt(p)){
      if (player[p].timer % 100 == 65){
        sounds[actionSounds[cS[p]].FURAFURA[0][1]].play();
      }
      reduceByTraction(p,true);
      if (player[p].timer % 49 == 0){
        drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(3+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+11+Math.random()*3),player[p].phys.face);
      }
      if (player[p].timer % 49 == 20){
        drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(5+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+8+Math.random()*3),player[p].phys.face);
      }
      if (player[p].phys.shieldHP > 30){
        player[p].phys.shieldHP = 30;
      }
      player[p].phys.stuckTimer--;
      if (mashOut(p)){
        player[p].phys.stuckTimer -= 3;
      }
    }
  },
  interrupt : function(p){
    if (player[p].phys.stuckTimer <= 0){
      sounds.furaloop.stop(player[p].furaLoopID);
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].FURAFURA){
      player[p].timer = 1;
      return false;
    }
    else {
      return false;
    }
  }
};
' > FURAFURA.js;

echo 'export default {
  name : "CAPTUREPULLED",
  canEdgeCancel : false,
  canBeGrabbed : false,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CAPTUREPULLED";
    player[p].timer = 0;
    player[p].phys.grounded = true;
    player[p].phys.face = -1*player[player[p].phys.grabbedBy].phys.face;
    player[p].phys.onSurface = [player[player[p].phys.grabbedBy].phys.onSurface[0],player[player[p].phys.grabbedBy].phys.onSurface[1]];
    player[p].phys.stuckTimer = 100+(2*player[p].percent);
    sounds.grabbed.play();
    aS[cS[p]].CAPTUREPULLED.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CAPTUREPULLED.interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-16.41205*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 2){
      aS[cS[p]].CAPTUREWAIT.init(p);
      aS[cS[p]].CATCHWAIT.init(player[p].phys.grabbedBy);
      drawVfx("tech",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+10));
      return true;
    }
    else {
      return false;
    }
  }
};
' > CAPTUREPULLED.js;

echo 'export default {
  name : "CAPTUREWAIT",
  canEdgeCancel : false,
  canBeGrabbed : false,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CAPTUREWAIT";
    player[p].timer = 0;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
    aS[cS[p]].CAPTUREWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CAPTUREWAIT.interrupt(p)){
      player[p].phys.stuckTimer--;
      if (mashOut(p)){
        player[p].phys.stuckTimer -= 3;
        player[p].phys.pos.x += 0.5*Math.sign(Math.random()-0.5);
      }
      else {
        player[p].phys.pos.x = player[player[p].phys.grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face);
      }
    }
  },
  interrupt : function(p){
    if (player[p].phys.stuckTimer < 0){
      aS[cS[p]].CATCHCUT.init(player[p].phys.grabbedBy);
      aS[cS[p]].CAPTURECUT.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].CAPTUREWAIT){
      aS[cS[p]].CAPTUREWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > CAPTUREWAIT.js;

echo 'export default {
  name : "CATCHWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CATCHWAIT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[cS[p]].CATCHWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CATCHWAIT.interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      aS[cS[p]].CATCHATTACK.init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7) || (player[p].inputs.cStickAxis[0].y > 0.7 && player[p].inputs.cStickAxis[1].y <= 0.7)){
      aS[cS[p]].THROWUP.init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y >= -0.7) || player[p].inputs.cStickAxis[0].y < -0.7){
      aS[cS[p]].THROWDOWN.init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[1].x*player[p].phys.face >= -0.7) || (player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.cStickAxis[1].x*player[p].phys.face >= -0.7)){
      aS[cS[p]].THROWBACK.init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[1].x*player[p].phys.face <= 0.7) || (player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.cStickAxis[1].x*player[p].phys.face <= 0.7)){
      aS[cS[p]].THROWFORWARD.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].CATCHWAIT){
      aS[cS[p]].CATCHWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > CATCHWAIT.js;

echo 'export default {
  name : "CAPTURECUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  canBeGrabbed : true,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CAPTURECUT";
    player[p].timer = 0;
    player[p].phys.grabbedBy = -1
    player[p].phys.cVel.x = -1*player[p].phys.face;
    aS[cS[p]].CAPTURECUT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CAPTURECUT.interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.grabTech = false;
      }
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].CAPTURECUT){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > CAPTURECUT.js;

echo 'export default {
  name : "CATCHCUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  canBeGrabbed : true,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CATCHCUT";
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.cVel.x = -1*player[p].phys.face;
    aS[cS[p]].CATCHCUT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CATCHCUT.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].CATCHCUT){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > CATCHCUT.js;

echo 'export default {
  name : "CAPTUREDAMAGE",
  canEdgeCancel : false,
  canBeGrabbed : false,
  setPositions : [9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.306,8.920,8.516,8.290,8.293,8.410,8.593,8.792,8.959,9.043,9.068],
  inGrab : true,
  init : function(p){
    player[p].actionState = "CAPTUREDAMAGE";
    player[p].timer = 0;
    aS[cS[p]].CAPTUREDAMAGE.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CAPTUREDAMAGE.interrupt(p)){
      player[p].phys.pos.x = player[player[p].phys.grabbedBy].phys.pos.x+(-aS[cS[p]].CAPTUREDAMAGE.setPositions[player[p].timer-1]*player[p].phys.face);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].CAPTUREDAMAGE){
      aS[cS[p]].CAPTUREWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > CAPTUREDAMAGE.js;


echo 'export default {
  name : "WALLDAMAGE",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  canBeGrabbed : true,
  headBonk : true,
  landType : 2,
  init : function(p){
    player[p].actionState = "WALLDAMAGE";
    player[p].timer = 0;
    sounds.bounce.play();
    aS[cS[p]].WALLDAMAGE.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].hit.hitstun % 10 == 0){
      drawVfx("flyingDust",player[p].phys.pos);
    }
    if (player[p].timer == 2){
      player[p].phys.kVel.y *= 0.8;
      player[p].phys.kVel.x *= -0.8;
      player[p].phys.kDec.x *= -1;
    }
    if (!aS[cS[p]].WALLDAMAGE.interrupt(p)){
      player[p].hit.hitstun--;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].WALLDAMAGE){
      aS[cS[p]].DAMAGEFALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > WALLDAMAGE.js;

echo 'export default {
  name : "WALLTECH",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "WALLTECH";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    if (player[p].phys.face == 1){
      drawVfx("tech",player[p].phys.ECBp[3]);
    }
    else {
      drawVfx("tech",player[p].phys.ECBp[1]);
    }
    // draw tech rotated
    aS[cS[p]].WALLTECH.main(p);
  },
  main : function(p){
    if (player[p].timer < 1){
      player[p].timer+= 0.15;
      if (player[p].timer > 1){
        player[p].timer = 1;
      }
    }
    else {
      player[p].timer++;
    }
    if (!aS[cS[p]].WALLTECH.interrupt(p)){
      if (player[p].timer == 2){
        sounds.walljump.play();
      }
      if (player[p].timer > 0.89 && player[p].timer < 0.91){
        player[p].phys.cVel.x = player[p].phys.face * 0.5;
      }
      if (player[p].timer >= 1){
        fastfall(p);
        airDrift(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 1){
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
      else if (player[p].timer > frames[cS[p]].WALLTECH){
        aS[cS[p]].FALL.init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
};
' > WALLTECH.js;

echo 'export default {
  name : "WALLJUMP",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "WALLJUMP";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    player[p].phys.cVel.x = player[p].phys.face * player[p].charAttributes.wallJumpVelX;
    player[p].phys.cVel.y = player[p].charAttributes.wallJumpVelY*(Math.pow(0.97,player[p].phys.wallJumpCount));
    player[p].phys.wallJumpCount++;
    player[p].hit.hitlag = 5;
    player[p].hit.knockback = 0;
    if (player[p].phys.face == 1){
      drawVfx("tech",player[p].phys.ECBp[3]);
    }
    else {
      drawVfx("tech",player[p].phys.ECBp[1]);
    }
    // draw tech rotated
    aS[cS[p]].WALLJUMP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 2){
      sounds.walljump.play();
    }
    if (!aS[cS[p]].WALLJUMP.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 1){
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
      else if (player[p].timer > frames[cS[p]].WALLJUMP){
        aS[cS[p]].FALL.init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
};
' > WALLJUMP.js;

echo 'export default {
  name : "WALLTECHJUMP",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "WALLTECHJUMP";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    if (player[p].phys.face == 1){
      drawVfx("tech",player[p].phys.ECBp[3]);
    }
    else {
      drawVfx("tech",player[p].phys.ECBp[1]);
    }
    // draw tech rotated
    aS[cS[p]].WALLTECHJUMP.main(p);
  },
  main : function(p){
    if (player[p].timer < 1){
      player[p].timer+= 0.15;
      if (player[p].timer > 1){
        player[p].timer = 1;
      }
    }
    else {
      player[p].timer++;
    }
    if (player[p].timer == 2){
      sounds.walljump.play();
    }
    if (!aS[cS[p]].WALLTECH.interrupt(p)){
      if (player[p].timer > 0.89 && player[p].timer < 0.91){
        player[p].phys.cVel.x = player[p].phys.face * player[p].charAttributes.wallJumpVelX;
        player[p].phys.cVel.y = player[p].charAttributes.wallJumpVelY;
      }
      if (player[p].timer >= 1){
        fastfall(p);
        airDrift(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 1){
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
      else if (player[p].timer > frames[cS[p]].WALLJUMP){
        aS[cS[p]].FALL.init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
};
' > WALLTECHJUMP.js;

echo 'export default {
  name : "OTTOTTO",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "OTTOTTO";
    player[p].timer = 1;
    player[p].phys.cVel.x = 0;
    aS[cS[p]].OTTOTTO.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].OTTOTTO.interrupt(p)){

    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    var j = checkForJump(p);
    if (player[p].timer > frames[cS[p]].OTTOTTO){
      aS[cS[p]].OTTOTTOWAIT.init(p);
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
' > OTTOTTO.js;

echo 'export default {
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
' > OTTOTTOWAIT.js;

echo 'export default {
  name : "MISSFOOT",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "MISSFOOT";
    player[p].timer = 0;
    player[p].hit.hitstun = 0;
    turnOffHitboxes(p);
    aS[cS[p]].MISSFOOT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].MISSFOOT.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 26){
      aS[cS[p]].DAMAGEFALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > MISSFOOT.js;

echo 'export default {
  name : "FURASLEEPSTART",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FURASLEEPSTART";
    player[p].timer = 0;
    player[p].phys.stuckTimer = 95+2*Math.floor(player[p].percent);
    sounds.fireweakhit.play();
    aS[cS[p]].FURASLEEPSTART.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FURASLEEPSTART.interrupt(p)){
      player[p].phys.stuckTimer--;
      reduceByTraction(p,true);
      var originalColour = palettes[pPal[p]][0];
      originalColour = originalColour.substr(4,originalColour.length-5);
      var colourArray = originalColour.split(",");
      //rgb(207, 45, 190)
      var part = player[p].timer%30;
      if (part < 25){
        player[p].colourOverlayBool = true;
        if (part < 13){
          var newCol = blendColours(colourArray,[207,45,190],Math.min(1,part/12));
        }
        else {
          var newCol = blendColours(colourArray,[207,45,190],Math.max(0,1-(part-12/12)));
        }
        player[p].colourOverlay = "rgb("+newCol[0]+","+newCol[1]+","+newCol[2]+")";
      }
      else {
        player[p].colourOverlayBool = false;
      }
    }
  },
  interrupt : function(p){
    if (player[p].phys.stuckTimer <= 0){
      player[p].colourOverlayBool = false;
      aS[cS[p]].FURASLEEPEND.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].FURASLEEPSTART){
      player[p].colourOverlayBool = false;
      aS[cS[p]].FURASLEEPLOOP.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > FURASLEEPSTART.js;

echo 'export default {
  name : "FURASLEEPLOOP",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FURASLEEPLOOP";
    player[p].timer = 0;
    aS[cS[p]].FURASLEEPLOOP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FURASLEEPLOOP.interrupt(p)){
      player[p].phys.stuckTimer--;
      var originalColour = palettes[pPal[p]][0];
      originalColour = originalColour.substr(4,originalColour.length-5);
      var colourArray = originalColour.split(",");
      //rgb(207, 45, 190)
      var part = player[p].timer%30;
      if (part < 25){
        player[p].colourOverlayBool = true;
        if (part < 13){
          var newCol = blendColours(colourArray,[207,45,190],Math.min(1,part/12));
        }
        else {
          var newCol = blendColours(colourArray,[207,45,190],Math.max(0,1-(part-12/12)));
        }
        player[p].colourOverlay = "rgb("+newCol[0]+","+newCol[1]+","+newCol[2]+")";
      }
      else {
        player[p].colourOverlayBool = false;
      }
    }
  },
  interrupt : function(p){
    if (player[p].phys.stuckTimer <= 0){
      player[p].colourOverlayBool = false;
      aS[cS[p]].FURASLEEPEND.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].FURASLEEPLOOP){
      player[p].timer = 1;
      player[p].colourOverlayBool = false;
      return false;
    }
    else {
      return false;
    }
  }
};
' > FURASLEEPLOOP.js;

echo 'export default {
  name : "FURASLEEPEND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FURASLEEPEND";
    player[p].timer = 0;
    aS[cS[p]].FURASLEEPEND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FURASLEEPEND.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].FURASLEEPEND){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > FURASLEEPEND.js;

echo 'export default {
  name : "STOPCEIL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "STOPCEIL";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    turnOffHitboxes(p);
    aS[cS[p]].STOPCEIL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].STOPCEIL.interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.kVel.y *= -0.8;
        player[p].phys.kVel.x *= 0.8;
        player[p].phys.kDec.y *= -1
      }
      if (player[p].hit.hitstun > 0){
        if (player[p].hit.hitstun % 10 == 0){
          drawVfx("flyingDust",player[p].phys.pos);
        }
        player[p].hit.hitstun--;
        player[p].phys.cVel.y -= player[p].charAttributes.gravity;
        if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
          player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
        }
      }
      else {
        airDrift(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 5 && player[p].hit.hitstun <= 0){
      aS[cS[p]].FALL.init(p);
    }
    else if (player[p].timer > frames[cS[p]].STOPCEIL){
      if (player[p].hit.hitstun <= 0){
        aS[cS[p]].DAMAGEFALL.init(p);
        return true;
      }
      else {
        player[p].timer = frames[cS[p]].STOPCEIL;
        return false;
      }
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].hit.hitstun > 0){
      if (player[p].phys.techTimer > 0){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.5){
          aS[cS[p]].TECHF.init(p);
        }
        else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.5){
          aS[cS[p]].TECHB.init(p);
        }
        else {
          aS[cS[p]].TECHN.init(p);
        }
      }
      else {
        aS[cS[p]].DOWNBOUND.init(p);
      }
    }
    else {
      aS[cS[p]].LANDING.init(p);
    }
  }
};
' > STOPCEIL.js;

echo 'export default {
  name : "TECHU",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "TECHU";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    drawVfx("tech",player[p].phys.ECBp[2]);
    sounds.tech.play();
    turnOffHitboxes(p);
    aS[cS[p]].TECHU.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].TECHU.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].TECHU){
      aS[cS[p]].FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
' > TECHU.js;

echo 'export default {
  name : "SLEEP",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = "SLEEP";
    player[p].timer = 0;
    player[p].hit.hitstun = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.pos.x = 300;
    aS[cS[p]].SLEEP.main(p);
  },
  main : function(p){
    player[p].phys.outOfCameraTimer = 0;
  },
  interrupt : function(p){
    return false;
  }
};
' > SLEEP.js;

echo 'export default {
  name : "ENTRANCE",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = "ENTRANCE";
    player[p].timer = 0;
    player[p].phys.grounded = false;
    aS[cS[p]].ENTRANCE.main(p);
  },
  main : function(p){
    player[p].timer++;
    aS[cS[p]].ENTRANCE.interrupt(p);
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      aS[cS[p]].FALL.init(p);
    }
  }
};
' > ENTRANCE.js;
