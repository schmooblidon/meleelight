
// FOX
// ActionStates
aS[2]=[];
aS[2][0] = {
  name : "WAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 0;
    player[p].timer = 1;
    aS[2][0].main(p);
  },
  main : function(p){
    player[p].timer += 1;
    if (!aS[2][0].interrupt(p)){
      reduceByTraction(p,false);
      if (player[p].timer > 120){
        aS[2][0].init(p);
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
    if (checkForJump(p) && !player[p].inCSS){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[2][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[2][21].init(p);
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[2][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[2][t[1]].init(p);
      return true;
    }
    else if (checkForSquat(p) && !player[p].inCSS){
      aS[2][16].init(p);
      return true;
    }
    else if (checkForDash(p) && !player[p].inCSS){
      aS[2][1].init(p);
      return true;
    }
    else if (checkForSmashTurn(p) && !player[p].inCSS){
      aS[2][3].init(p);
      return true;
    }
    else if (checkForTiltTurn(p) && !player[p].inCSS){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
      aS[2][4].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 && !player[p].inCSS){
      aS[2][7].init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][1] = {
  name : "DASH",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 1;
    player[p].timer = 0;
    sounds.dash.play();
    aS[2][1].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][1].interrupt(p)){
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
    if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      player[p].phys.cVel.x *= 0.25;
      aS[2][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      player[p].phys.cVel.x *= 0.25;
      aS[2][21].init(p);
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      if (player[p].timer < 4 && player[p].inputs.lStickAxis[0].x*player[p].phys.face >= 0.8){
        player[p].phys.cVel.x *= 0.25;
        aS[2][57].init(p);
      }
      else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
        aS[2][73].init(p);
      }
      else {
        aS[2][55].init(p);
      }
      return true;
    }
    else if (checkForJump(p)){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      if (player[p].phys.grounded){
        aS[2][56].init(p);
      }
      else {
        aS[2][103].init(p);
      }
      return true;
    }
    else if (player[p].timer > 4 && checkForSmashTurn(p)){
      player[p].phys.cVel.x *= 0.25;
      aS[2][3].init(p);
      return true;
    }
    else if (player[p].timer > 20 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].inputs.lStickAxis[2].x * player[p].phys.face < 0.3){
      aS[2][1].init(p);
      return true;
    }
    else if (player[p].timer > 11 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.62){
      aS[2][2].init(p);
      return true;
    }
    else if (player[p].timer > 21){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][2] = {
  name : "RUN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 2;
    player[p].timer = 1;
    aS[2][2].main(p);
  },
  main : function(p){
    if (player[p].timer > 25){
      player[p].timer = 1;
    }
    if (!aS[2][2].interrupt(p)){
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
      if (player[p].timer > 25){
        player[p].timer = 1;
      }
      if ((footstep[0] && player[p].timer >= 2) || (footstep[1] && player[p].timer >= 10)){
        sounds.footstep.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
        aS[2][73].init(p);
      }
      else {
        aS[2][55].init(p);
      }
      return true;
    }
    else if (checkForJump(p)){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      if (player[p].phys.grounded){
        aS[2][56].init(p);
      }
      else {
        aS[2][103].init(p);
      }
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[2][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[2][21].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) < 0.62){
      aS[2][5].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
      aS[2][6].init(p);
      return true;
    }
  }
}

aS[2][3] = {
  name : "SMASHTURN",
  canEdgeCancel : true,
  reverseModel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 3;
    player[p].timer = 0;
    player[p].phys.face *= -1;
    aS[2][3].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][3].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (checkForJump(p)){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      if (player[p].phys.grounded){
        aS[2][56].init(p);
      }
      else {
        aS[2][103].init(p);
      }
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[2][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[2][21].init(p);
      return true;
    }
    else if (s[0]){
      aS[2][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[2][t[1]].init(p);
    }
    else if (player[p].timer == 2 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79){
      aS[2][1].init(p);
      return true;
    }
    else if (player[p].timer > 11){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][4] = {
  name : "TILTTURN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 4;
    player[p].timer = 0;
    aS[2][4].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 6){
      player[p].phys.face *= -1;
    }
    if (!aS[2][4].interrupt(p)){
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
    if (checkForJump(p)){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      if (player[p].phys.grounded){
        aS[2][56].init(p);
      }
      else {
        aS[2][103].init(p);
      }
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[2][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[2][21].init(p);
      return true;
    }
    else if (s[0]){
      aS[2][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      if (player[p].timer < 6){
        player[p].phys.face *= -1;
      }
      aS[2][t[1]].init(p);
    }
    else if (player[p].timer > 11){
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer == 6 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].phys.dashbuffer){
      aS[2][1].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][5] = {
  name : "RUNBRAKE",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 5;
    player[p].timer = 0;
    sounds.runbrake.play();
    aS[2][5].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][5].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (checkForJump(p)){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].timer > 1 && checkForSquat(p)){
      aS[2][16].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
      aS[2][6].init(p);
      return true;
    }
    else if (player[p].timer > 18){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][6] = {
  name : "RUNTURN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  reverseModelFrame : 16,
  init : function(p){
    player[p].actionState = 6;
    player[p].timer = 0;
    aS[2][6].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][6].interrupt(p)){
      if (player[p].timer == 17){
        player[p].phys.face *= -1;
      }

      if (player[p].timer < 17 && player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
        var tempAcc = (player[p].charAttributes.dAccA - (1 - Math.abs(player[p].inputs.lStickAxis[0].x))*(player[p].charAttributes.dAccA))*player[p].phys.face;
        player[p].phys.cVel.x -= tempAcc;
      }
      else if (player[p].timer > 16 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.3){
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

      if (player[p].timer == 16){
        if (player[p].phys.cVel.x * player[p].phys.face > 0){
          player[p].timer--;
        }
      }
    }
  },
  interrupt : function(p){
    if (checkForJump(p)){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].timer > 20){
      if(player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.6){
        aS[2][2].init(p);
      }
      else {
        aS[2][0].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][7] = {
  name : "WALK",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,addInitV){
    player[p].actionState = 7;
    player[p].timer = 1;
    if (addInitV){
      var tempInit = player[p].charAttributes.walkInitV * player[p].phys.face;
      if ((tempInit > 0 && player[p].phys.cVel.x < tempInit) || (tempInit < 0 && player[p].phys.cVel.x > tempInit)){
        player[p].phys.cVel.x += player[p].charAttributes.walkInitV * player[p].phys.face;
      }
    }
    aS[2][7].main(p);
  },
  main : function(p){

    if (!aS[2][7].interrupt(p)){
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
    if (player[p].timer > 26){
      aS[2][7].init(p,false);
      return true;
    }
    if (player[p].inputs.lStickAxis[0].x == 0){
      aS[2][0].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[2][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[2][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[2][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[2][t[1]].init(p);
      return true;
    }
    else if (checkForSquat(p)){
      aS[2][16].init(p);
      return true;
    }
    else if (checkForDash(p)){
      aS[2][1].init(p);
      return true;
    }
    else if (checkForSmashTurn(p)){
      aS[2][3].init(p);
      return true;
    }
    else if (checkForTiltTurn(p)){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
      aS[2][4].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][8] = {
  name : "KNEEBEND",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 8;
    player[p].timer = 0;
    player[p].phys.jumpType = 1;
    aS[2][8].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][8].interrupt(p)){
      reduceByTraction(p,true);
      if (!player[p].inputs.x[0] && !player[p].inputs.y[0] && player[p].inputs.lStickAxis[0].y < 0.67){
        player[p].phys.jumpType = 0;
      }
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    if (player[p].timer == 3){
      // so they can be detected as above current surface instantly
      player[p].phys.pos.y += 0.001;
    }
    if (player[p].timer > 3){
      if (player[p].inputs.lStickAxis[2].x * player[p].phys.face >= -0.3){
        aS[2][9].init(p,player[p].phys.jumpType);
      }
      else {
        aS[2][15].init(p,player[p].phys.jumpType);
      }
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1] && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      aS[2][73].init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1] && player[p].inputs.lStickAxis[0].y >= 0.8 && player[p].inputs.lStickAxis[3].y < 0.3) || (player[p].inputs.cStickAxis[0].y >= 0.8 && player[p].inputs.cStickAxis[3].y < 0.3)){
      aS[2][58].init(p);
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][9] = {
  name : "JUMPF",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p,type){
    player[p].actionState = 9;
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
    aS[2][9].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][9].interrupt(p)){
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
      aS[2][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[2][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
        aS[2][110].init(p);
      }
      else {
        aS[2][19].init(p);
      }
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 40){
      aS[2][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][10] = {
  name : "LANDING",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 10;
    player[p].timer = 0;
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[2][10].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][10].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 4 && player[p].timer <= 30){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[2][8].init(p);
        return true;
      }
      else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
        aS[2][21].init(p);
        return true;
      }
      else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
        aS[2][21].init(p);
        return true;
      }
      else if (b[0]){
        aS[2][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[2][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[2][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[2][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[2][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[2][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[2][7].init(p,true);
        return true;
      }
      else if (player[p].timer == 5 && player[p].inputs.lStickAxis[0].y < -0.5){
        aS[2][17].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 30){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][11] = {
  name : "ESCAPEAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 11;
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
    aS[2][11].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][11].interrupt(p)){
      if (player[p].timer < 30){
        player[p].phys.cVel.x *= 0.9;
        player[p].phys.cVel.y *= 0.9;
      }
      else {
        airDrift(p);
        fastfall(p);
      }
      if (player[p].timer == 4){
        sounds.foxairdodge.play();
        player[p].phys.intangibleTimer = 25;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[2][14].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][12] = {
  name : "LANDINGFALLSPECIAL",
  canEdgeCancel : true,
  canGrabLedge : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 12;
    player[p].timer = 0;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[2][12].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingMultiplier;
    if (!aS[2][12].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][13] = {
  name : "FALL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 13;
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[2][13].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][13].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[2][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[2][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
        aS[2][110].init(p);
      }
      else {
        aS[2][19].init(p);
      }
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 8){
      aS[2][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][14] = {
  name : "FALLSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 14;
    player[p].timer = 0;
    aS[2][14].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][14].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 8){
      aS[2][14].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][15] = {
  name : "JUMPB",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p,type){
    player[p].actionState = 15;
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
    aS[2][15].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][15].interrupt(p)){
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
      aS[2][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[2][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
        aS[2][110].init(p);
      }
      else {
        aS[2][19].init(p);
      }
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 40){
      aS[2][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][16] = {
  name : "SQUAT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 16;
    player[p].timer = 0;
    aS[2][16].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][16].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (player[p].timer == 4 && (player[p].inputs.lStickAxis[0].y < -0.65 || player[p].inputs.lStickAxis[1].y < -0.65 || player[p].inputs.lStickAxis[2].y < -0.65) && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
      aS[2][20].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[2][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[2][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[2][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[2][t[1]].init(p);
      return true;
    }
    else if (player[p].timer > 7){
      aS[2][17].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[2][8].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][17] = {
  name : "SQUATWAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 17;
    player[p].timer = 0;
    aS[2][17].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][17].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (player[p].inputs.lStickAxis[0].y > -0.61){
      aS[2][18].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[2][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[2][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[2][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[2][t[1]].init(p);
      return true;
    }
    else if (checkForDash(p)){
      aS[2][1].init(p);
      return true;
    }
    else if (checkForSmashTurn(p)){
      aS[2][3].init(p);
      return true;
    }
    else if (player[p].timer > 100){
      aS[2][17].init(p);
    }
    else {
      return false;
    }
  }
}

aS[2][18] = {
  name : "SQUATRV",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 18;
    player[p].timer = 0;
    aS[2][18].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][18].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (player[p].timer > 10){
      aS[2][0].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[2][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[2][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[2][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[2][t[1]].init(p);
      return true;
    }
    /*else if (checkForDash(p)){
      aS[2][1].init(p);
      return true;
    }*/
    else if (checkForSmashTurn(p)){
      aS[2][3].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
      aS[2][7].init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][19] = {
  name : "JUMPAERIALF",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 19;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;

    player[p].phys.cVel.y = player[p].charAttributes.fHopInitV * player[p].charAttributes.djMultiplier;

    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 1);
    drawVfx("doubleJumpRings",player[p].phys.pos,player[p].phys.face);
    sounds.foxjump.play();
    sounds.jump2.play();
    aS[2][19].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][19].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[2][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[2][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 50){
      aS[2][32].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][20] = {
  name : "PASS",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 20;
    player[p].timer = 0;
    player[p].phys.grounded = false;
    player[p].phys.passFastfall = false;
    player[p].phys.abovePlatforms[player[p].phys.onSurface[1]] = false;
    player[p].phys.cVel.y = -0.5;
    aS[2][20].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer > 1){
      if (!aS[2][20].interrupt(p)){
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
      aS[2][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[2][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
        aS[2][110].init(p);
      }
      else {
        aS[2][19].init(p);
      }
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 29){
      aS[2][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][21] = {
  name : "GUARDON",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 21;
    player[p].timer = 0;
    player[p].phys.shielding = true;
    player[p].phys.shieldPosition = new Vec2D(0,0);
    player[p].phys.powerShielded = false;
    shieldSize(p,true);
    if (Math.max(player[p].inputs.lAnalog[0],player[p].inputs.rAnalog[0]) == 1){
      player[p].phys.powerShieldActive = true;
    }
    else {
      player[p].phys.powerShieldActive = false;
    }
    aS[2][21].main(p);
  },
  main : function(p){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true);
    }
    else {
      player[p].timer++;
      if (player[p].timer == 2 && Math.max(player[p].inputs.lAnalog[0],player[p].inputs.rAnalog[0]) == 1){
        player[p].phys.powerShieldActive = true;
      }
      if (!aS[2][21].interrupt(p)){
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
      if (checkForJump(p) || player[p].inputs.cStickAxis[0].y > 0.65){
        player[p].phys.shielding = false;
        aS[2][8].init(p);
        return true;
      }
      else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.shielding = false;
        aS[2][73].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[4].y > -0.3) || player[p].inputs.cStickAxis[0].y < -0.7){
        player[p].phys.shielding = false;
        aS[2][54].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face < 0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        aS[2][53].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face > -0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        aS[2][52].init(p);
        return true;
      }
      else if (player[p].timer > 1 && player[p].inputs.lStickAxis[0].y < -0.65 && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        aS[2][20].init(p);
        return true;
      }
      else if (player[p].timer > 8){
        aS[2][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].timer > 8){
        aS[2][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
  }
}

aS[2][22] = {
  name : "GUARD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 22;
    player[p].timer = 0;
    player[p].phys.powerShieldActive = false;
    aS[2][22].main(p);
  },
  main : function(p){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true);
    }
    else {
      player[p].timer++;
      if (!aS[2][22].interrupt(p)){
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
      if (checkForJump(p) || player[p].inputs.cStickAxis[0].y > 0.66){
        player[p].phys.shielding = false;
        aS[2][8].init(p);
        return true;
      }
      else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.shielding = false;
        aS[2][73].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[4].y > -0.3) || player[p].inputs.cStickAxis[0].y < -0.7){
        player[p].phys.shielding = false;
        aS[2][54].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face < 0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        aS[2][53].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face > -0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        aS[2][52].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.65 && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        aS[2][20].init(p);
        return true;
      }
      else if (player[p].inputs.lAnalog[0] < 0.3 && player[p].inputs.rAnalog[0] < 0.3){
        player[p].phys.shielding = false;
        aS[2][23].init(p);
        return true;
      }
      else if (player[p].timer > 1){
        aS[2][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].inputs.lAnalog[0] < 0.3 && player[p].inputs.rAnalog[0] < 0.3){
        player[p].phys.shielding = false;
        aS[2][23].init(p);
        return true;
      }
      else if (player[p].timer > 1){
        aS[2][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
  }
}

aS[2][23] = {
  name : "GUARDOFF",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 23;
    player[p].timer = 0;
    sounds.shieldoff.play();
    aS[2][23].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][23].interrupt(p)){
      reduceByTraction(p,false);
      //shieldDepletion(p);
      //shieldSize(p);
    }
  },
  interrupt : function(p){
    if (checkForJump(p) && !player[p].inCSS){
      aS[2][8].init(p);
      return true;
    }
    else if (player[p].timer > 15){
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].phys.powerShielded){
      if (!player[p].inCSS){
        var t = checkForTilts(p);
        var s = checkForSmashes(p);
        if (s[0]){
          aS[2][s[1]].init(p);
          return true;
        }
        else if (t[0]){
          aS[2][t[1]].init(p);
          return true;
        }
        else if (checkForSquat(p)){
          aS[2][16].init(p);
          return true;
        }
        else if (checkForDash(p)){
          aS[2][1].init(p);
          return true;
        }
        else if (checkForSmashTurn(p)){
          aS[2][3].init(p);
          return true;
        }
        else if (checkForTiltTurn(p)){
          player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
          aS[2][4].init(p);
          return true;
        }
        else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
          aS[2][7].init(p,true);
          return true;
        }
        else {
          return false;
        }
      }
      else {
        var s = checkForSmashes(p);
        if (s[0]){
          aS[2][s[1]].init(p);
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
}

aS[2][24] = {
  name : "CLIFFCATCH",
  canGrabLedge : false,
  canBeGrabbed : false,
  posOffset : [[-73.09594,-13.47469],[-72.8175,-13.5675],[-72.41531,-13.70156],[-71.94,-13.86],[-71.44219,-14.02594],[-70.9725,-14.1825],[-70.58157,-14.31281]],
  init : function(p){
    player[p].actionState = 24;
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
    turnOffHitboxes(p);
    drawVfx("cliffcatchspark",new Vec2D(stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x,stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y),player[p].phys.face);
    sounds.foxcliffcatch.play();
    sounds.puffledgegrab.play();
    aS[2][24].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][24].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      player[p].phys.pos = new Vec2D(x+(aS[2][24].posOffset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[2][24].posOffset[player[p].timer-1][1]);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 7){
      aS[2][25].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][25] = {
  name : "CLIFFWAIT",
  canGrabLedge : false,
  canBeGrabbed : false,
  posOffset : [-70.32,-14.4],
  init : function(p){
    player[p].actionState = 25;
    player[p].timer = 0;
    aS[2][25].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][25].interrupt(p)){
      player[p].phys.ledgeHangTimer++;
    }
  },
  interrupt : function(p){
    if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.2 || player[p].inputs.lStickAxis[0].y < -0.2 || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.2 || player[p].inputs.cStickAxis[0].y < -0.2){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[2][13].init(p);
      return true;
    }
    else if (player[p].inputs.x[0] || player[p].inputs.y[0] || player[p].inputs.lStickAxis[0].y > 0.65 ){
      if (player[p].percent < 100){
        aS[2][101].init(p);
      }
      else {
        aS[2][102].init(p);
      }
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.2 || player[p].inputs.lStickAxis[0].y > 0.2){
      if (player[p].percent < 100){
        aS[2][95].init(p);
      }
      else {
        aS[2][96].init(p);
      }
      return true;
    }
    else if (player[p].inputs.a[0] || player[p].inputs.b[0] || player[p].inputs.cStickAxis[0].y > 0.65){
      if (player[p].percent < 100){
        aS[2][100].init(p);
      }
      else {
        aS[2][99].init(p);
      }
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0] || player[p].inputs.lAnalog[0] > 0.3 || player[p].inputs.rAnalog[0] > 0.3 || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.8){
      if (player[p].percent < 100){
        aS[2][97].init(p);
      }
      else {
        aS[2][98].init(p);
      }
      return true;
    }
    else if (player[p].phys.ledgeHangTimer > 600){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[2][40].init(p);
      return true;
    }
    else if (player[p].timer > 50){
      aS[2][25].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][26] = {
  name : "DEADLEFT",
  canBeGrabbed : false,
  ignoreCollision : true,
  init : function(p){
    player[p].actionState = 26;
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
    sounds.foxdeath.play();
    aS[2][26].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][26].interrupt(p)){
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
        aS[2][30].init(p);
      }
      else {
        aS[2][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][27] = {
  name : "DEADRIGHT",
  canBeGrabbed : false,
  ignoreCollision : true,
  init : function(p){
    player[p].actionState = 27;
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
    sounds.foxdeath.play();
    aS[2][27].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][27].interrupt(p)){
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
        aS[2][30].init(p);
      }
      else {
        aS[2][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][28] = {
  name : "DEADUP",
  canBeGrabbed : false,
  ignoreCollision : true,
  init : function(p){
    player[p].actionState = 28;
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
    sounds.foxdeath.play();
    aS[2][28].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][28].interrupt(p)){
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
        aS[2][30].init(p);
      }
      else {
        aS[2][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][29] = {
  name : "DEADDOWN",
  canBeGrabbed : false,
  ignoreCollision : true,
  init : function(p){
    player[p].actionState = 29;
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
    sounds.foxdeath.play();
    aS[2][29].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][29].interrupt(p)){
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
        aS[2][30].init(p);
      }
      else {
        aS[2][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][30] = {
  name : "REBIRTH",
  canBeGrabbed : false,
  ignoreCollision : true,
  init : function(p){
    player[p].actionState = 30;
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
  },
  main : function(p){
    player[p].timer+= 1;
    if (!aS[2][30].interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].timer > 90){
      aS[2][31].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][31] = {
  name : "REBIRTHWAIT",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 31;
    player[p].timer = 1;
    player[p].phys.cVel.y = 0;
  },
  main : function(p){
    player[p].timer+= 1;
    player[p].spawnWaitTime++;
    if (!aS[2][31].interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].timer > 120){
      aS[2][31].init(p);
      return true;
    }
    else if (player[p].spawnWaitTime > 300){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      aS[2][13].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 || Math.abs(player[p].inputs.lStickAxis[0].y) > 0.3 ){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      aS[2][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][32] = {
  name : "FALLAERIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 32;
    player[p].timer = 0;
    aS[2][32].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][32].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[2][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[2][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
        aS[2][110].init(p);
      }
      else {
        aS[2][19].init(p);
      }
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 8){
      aS[2][32].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][33] = {
  name : "ATTACKAIRF",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 33;
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    player[p].hitboxes.id[0] = player[p].charHitboxes.fair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fair1.id1;
    turnOffHitboxes(p);
    aS[2][33].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][33].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer == 5){
        player[p].phys.autoCancel = false;
      }
      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        //needs normalswing3
      }
      if (player[p].timer == 7 || player[p].timer == 8){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 9){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 16){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fair2.id1;
        player[p].hitboxes.active = [true,true,false,false];
        sounds.normalswing2.play();
      }
      if (player[p].timer > 16 && player[p].timer < 19){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 19){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 24){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fair3.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fair3.id1;
        player[p].hitboxes.active = [true,true,false,false];
        sounds.normalswing2.play();
      }
      if (player[p].timer > 24 && player[p].timer < 27){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 27){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 33){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fair4.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fair4.id1;
        player[p].hitboxes.active = [true,true,false,false];
        sounds.normalswing2.play();
      }
      if (player[p].timer > 33 && player[p].timer < 36){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 36){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 43){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fair5.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fair5.id1;
        player[p].hitboxes.active = [true,true,false,false];
        sounds.normalswing2.play();
      }
      if (player[p].timer > 43 && player[p].timer < 46){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 46){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 50){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 59){
      aS[2][13].init(p);
      return true;
    }
    else if (player[p].timer > 52){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          aS[2][110].init(p);
        }
        else {
          aS[2][19].init(p);
        }
        return true;
      }
      else if (a[0]){
        aS[2][a[1]].init(p);
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
}

aS[2][34] = {
  name : "ATTACKAIRB",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 34;
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.bair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.bair1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.bair1.id2;
    aS[2][34].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][34].interrupt(p)){
      fastfall(p);
      airDrift(p);

      if (player[p].timer == 3){
        player[p].phys.autoCancel = false;
      }
      if (player[p].timer == 4){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs swing3
      }
      if (player[p].timer > 4 && player[p].timer < 20){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 8){
        player[p].hitboxes.id[0] = player[p].charHitboxes.bair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.bair2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.bair2.id2;
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 20){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 25){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[2][13].init(p);
      return true;
    }
    else if (player[p].timer > 37){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          aS[2][110].init(p);
        }
        else {
          aS[2][19].init(p);
        }
        return true;
      }
      else if (a[0]){
        aS[2][a[1]].init(p);
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
}

aS[2][35] = {
  name : "ATTACKAIRU",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 35;
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upair1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.upair1.id2;
    aS[2][35].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][35].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer == 7){
        player[p].phys.autoCancel = false;
      }
      else if (player[p].timer == 8){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      else if (player[p].timer == 9){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 10){
        turnOffHitboxes(p);
      }
      else if (player[p].timer == 11){
        player[p].hitboxes.id[0] = player[p].charHitboxes.upair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.upair2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.upair2.id2;
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs normalswing3
      }
      else if (player[p].timer > 11 && player[p].timer < 15){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 15){
        turnOffHitboxes(p);
      }
      else if (player[p].timer == 27){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[2][13].init(p);
      return true;
    }
    else if (player[p].timer > 35){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          aS[2][110].init(p);
        }
        else {
          aS[2][19].init(p);
        }
        return true;
      }
      else if (a[0]){
        aS[2][a[1]].init(p);
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
}

aS[2][36] = {
  name : "ATTACKAIRD",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 36;
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dair.id1;
    aS[2][36].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][36].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer == 4){
        player[p].phys.autoCancel = false;
      }

      if (player[p].timer > 4 && player[p].timer < 26){
        switch (player[p].timer % 3){
          case 2:
            player[p].hitboxes.active = [true,true,false,false];
            player[p].hitboxes.frame = 0;
            sounds.normalswing2.play();
            break;
          case 0:
            player[p].hitboxes.frame++;
            break;
          case 1:
            turnOffHitboxes(p);
            break;

        }
      }

      if (player[p].timer == 32){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[2][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][37] = {
  name : "ATTACKAIRN",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 37;
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.nair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.nair1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.nair1.id2;
    aS[2][37].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][37].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer == 3){
        player[p].phys.autoCancel = false;
      }

      if (player[p].timer == 4){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.normalswing2.play();
        // needs normalswing3
      }
      if (player[p].timer > 4 && player[p].timer < 8){
        player[p].hitboxes.frames++;
      }
      if (player[p].timer == 8){
        player[p].hitboxes.id[0] = player[p].charHitboxes.nair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.nair2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.nair2.id2;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 8 && player[p].timer < 32){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 32){
        turnOffHitboxes(p);
      }

      if (player[p].timer == 38){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[2][13].init(p);
      return true;
    }
    else if (player[p].timer > 41){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          aS[2][110].init(p);
        }
        else {
          aS[2][19].init(p);
        }
        return true;
      }
      else if (a[0]){
        aS[2][a[1]].init(p);
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
}

aS[2][38] = {
  name : "UPSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,true],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 38;
    player[p].timer = 0;
    player[p].phys.cVel.x *= 0.8;
    player[p].phys.cVel.y = 0;
    player[p].phys.fastfalled = false;
    sounds.foxupbburn.play();
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upb1.id0;
    aS[2][38].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][38].interrupt(p)){

      if (player[p].timer < 43){
        var frame = (player[p].timer-1) % 10;
        drawVfx("firefoxcharge",player[p].phys.pos,player[p].phys.face,frame);
      }
      else if (player[p].timer < 73){
        if (player[p].timer%2){
          drawVfx("firefoxtail",player[p].phys.posPrev,player[p].phys.face);
        }
        drawVfx("firefoxlaunch",player[p].phys.pos,player[p].phys.face,p);
      }
      if (player[p].phys.grounded){
        reduceByTraction(p);
      }
      else {
        if (player[p].phys.cVel.x > 0){
          player[p].phys.cVel.x -= player[p].charAttributes.airFriction;
          if (player[p].phys.cVel.x < 0){
            player[p].phys.cVel.x = 0;
          }
        }
        else if (player[p].phys.cVel.x < 0){
          player[p].phys.cVel.x += player[p].charAttributes.airFriction;
          if (player[p].phys.cVel.x > 0){
            player[p].phys.cVel.x = 0;
          }
        }
      }
        if (player[p].timer >= 73){
          if (player[p].phys.grounded){
            reduceByTraction(p);
          }
          else {
            fastfall(p);
            airDrift(p);
          }
        }
        else if (player[p].timer >= 48){
          player[p].phys.cVel.y -= 0.1*Math.sin(player[p].phys.upbAngleMultiplier);
          player[p].phys.cVel.x -= 0.1*Math.cos(player[p].phys.upbAngleMultiplier);
        }
        else if (player[p].timer >= 43){
          player[p].phys.grounded = false;
          player[p].phys.cVel.y = 3.8*Math.sin(player[p].phys.upbAngleMultiplier);
          player[p].phys.cVel.x = 3.8*Math.cos(player[p].phys.upbAngleMultiplier);
        }
        else if (player[p].timer == 42){
          var ang = Math.PI/2;
          if (player[p].inputs.lStickAxis[0].x == 0 && player[p].inputs.lStickAxis[0].y == 0){
            if (player[p].phys.grounded){
              if (player[p].phys.face == 1){
                ang = 0;
              }
              else {
                ang = Math.PI;
              }
            }
          }
          else {
            ang = Math.atan(player[p].inputs.lStickAxis[0].y/player[p].inputs.lStickAxis[0].x);
          }

          if (player[p].inputs.lStickAxis[0].x < 0){
            if (player[p].inputs.lStickAxis[0].y < 0){
              ang += Math.PI;
            }
            else {
              ang += Math.PI;
            }
          }
          player[p].phys.upbAngleMultiplier = ang;
        }
        else if (player[p].timer >= 16 && !player[p].phys.grounded){
          player[p].phys.cVel.y -= 0.015;
        }

      if (player[p].timer > 19 && player[p].timer < 34){
        switch (player[p].timer % 2){
          case 0:
            player[p].hitboxes.active = [true,false,false,false];
            player[p].hitboxes.frame = 0;
            break;
          case 1:
            turnOffHitboxes(p);
            break;
        }
      }
      if (player[p].timer == 43){
        sounds.foxupbshout.play();
        sounds.foxupblaunch.play();
        player[p].hitboxes.id[0] = player[p].charHitboxes.upb2.id0;
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
        player[p].rotation = (player[p].phys.upbAngleMultiplier-Math.PI/2)*-1;
        //console.log(player[p].rotation*180/Math.PI);
        if (player[p].rotation < 0){
          player[p].phys.face = -1;
        }
        else if (player[p].rotation > 0 && !(player[p].rotation == Math.PI)){
          player[p].phys.face = 1;
        }
        player[p].rotationPoint = new Vec2D(0,40);
      }
      else if (player[p].timer > 43 && player[p].timer < 73){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 73){
        turnOffHitboxes(p);
        player[p].rotation = 0;
        player[p].rotationPoint = new Vec2D(0,0);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 92){
      if (player[p].phys.grounded){
        aS[2][0].init(p);
      }
      else {
        aS[2][14].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].timer > 42){
      if (player[p].timer < 73){
        // BOUNCE
        drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
        aS[2][130].init(p);
      }
      else {
        drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
      }
    }
  }
}

aS[2][39] = {
  name : "DAMAGEFLYN",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p,drawStuff){
    player[p].actionState = 39;
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.grabbedBy = -1;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    if (drawStuff){
      // drawVfx("hitSparks",player[p].hit.hitPoint,player[p].phys.face);
      // drawVfx("hitFlair",player[p].hit.hitPoint,player[p].phys.face);
      // drawVfx("hitCurve",player[p].hit.hitPoint,player[p].phys.face,player[p].hit.angle);
    }
    player[p].hitboxes.id[0] = player[p].charHitboxes.thrown.id0;
    /*player[p].phys.grounded = false;
    player[p].phys.pos.y += 0.0001;*/
    turnOffHitboxes(p);
    aS[2][39].main(p);
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
    if (player[p].timer < 29){
      player[p].timer++;
    }
    if (player[p].hit.hitstun % 10 == 0){
      drawVfx("flyingDust",player[p].phys.pos);
    }
    if (!aS[2][39].interrupt(p)){
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
      aS[2][40].init(p);
      player[p].phys.thrownHitbox = false;
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][40] = {
  name : "DAMAGEFALL",
  canPassThrough : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 40;
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[2][40].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][40].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[2][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[2][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
        aS[2][110].init(p);
      }
      else {
        aS[2][19].init(p);
      }
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x > 0.7 && player[p].inputs.lStickAxis[1].x < 0.7) || (player[p].inputs.lStickAxis[0].x < -0.7 && player[p].inputs.lStickAxis[1].x > -0.7) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) || (player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y > -0.7)){
      aS[2][13].init(p);
      return true;
    }
    else if (player[p].timer > 30){
      aS[2][40].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][41] = {
  name : "DAMAGEN2",
  canEdgeCancel : true,
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 41;
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.grabbedBy = -1;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    turnOffHitboxes(p);
    // drawVfx("hitSparks",player[p].hit.hitPoint,player[p].phys.face);
    // drawVfx("hitFlair",player[p].hit.hitPoint,player[p].phys.face);
    // drawVfx("hitCurve",player[p].hit.hitPoint,player[p].phys.face,player[p].hit.angle);
    aS[2][41].main(p);
  },
  main : function(p){
    if (player[p].inCSS){
      player[p].timer+= 0.7;
    }
    else {
      player[p].timer++;
    }
    if (!aS[2][41].interrupt(p)){
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
    if (player[p].timer > 23){
      if (player[p].phys.grounded || player[p].inCSS){
        aS[2][0].init(p);
      }
      else {
        aS[2][13].init(p);
      }
      return true;
    }
    else if (player[p].hit.hitstun <= 0 && !player[p].inCSS){
      if (player[p].phys.grounded){
        var b = checkForSpecials(p);
        var t = checkForTilts(p);
        var s = checkForSmashes(p);
        if (checkForJump(p)){
          aS[2][8].init(p);
          return true;
        }
        else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
          aS[2][21].init(p);
          return true;
        }
        else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
          aS[2][21].init(p);
          return true;
        }
        else if (b[0]){
          aS[2][b[1]].init(p);
          return true;
        }
        else if (s[0]){
          aS[2][s[1]].init(p);
          return true;
        }
        else if (t[0]){
          aS[2][t[1]].init(p);
          return true;
        }
        else if (checkForSquat(p)){
          aS[2][16].init(p);
          return true;
        }
        else if (checkForDash(p)){
          aS[2][1].init(p);
          return true;
        }
        else if (checkForSmashTurn(p)){
          aS[2][3].init(p);
          return true;
        }
        else if (checkForTiltTurn(p)){
          player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
          aS[2][4].init(p);
          return true;
        }
        else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
          aS[2][7].init(p,true);
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
          aS[2][a[1]].init(p);
          return true;
        }
        else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
          aS[2][11].init(p);
          return true;
        }
        else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
          if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
            aS[2][110].init(p);
          }
          else {
            aS[2][19].init(p);
          }
          return true;
        }
        else if (b[0]){
          aS[2][b[1]].init(p);
          return true;
        }
        else if ((player[p].inputs.lStickAxis[0].x > 0.7 && player[p].inputs.lStickAxis[1].x < 0.7) || (player[p].inputs.lStickAxis[0].x < -0.7 && player[p].inputs.lStickAxis[1].x > -0.7) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) || (player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y > -0.7)){
          aS[2][13].init(p);
          return true;
        }
        else if (player[p].timer > 30){
          aS[2][40].init(p);
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
}

aS[2][42] = {
  name : "LANDINGATTACKAIRN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 42;
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[2][42].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[2][42].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 15){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][43] = {
  name : "LANDINGATTACKAIRF",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 43;
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[2][43].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[2][43].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 22){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][44] = {
  name : "LANDINGATTACKAIRB",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 44;
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[2][44].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[2][44].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 20){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][45] = {
  name : "LANDINGATTACKAIRD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 45;
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[2][45].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[2][45].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 18){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][46] = {
  name : "LANDINGATTACKAIRU",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 46;
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[2][46].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[2][46].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 18){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][47] = {
  name : "DOWNTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 47;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dtilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dtilt.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dtilt.id2;
    aS[2][47].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][47].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 7){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
      }
      if (player[p].timer > 7 && player[p].timer < 10){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 10){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 29){
      aS[2][17].init(p);
      return true;
    }
    else if (player[p].timer > 27){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[2][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[2][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[2][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[2][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[2][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[2][3].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[2][4].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        aS[2][7].init(p,true);
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
}

aS[2][48] = {
  name : "UPTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 48;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.uptilt.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.uptilt.id3;
    aS[2][48].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][48].interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer == 5){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
      }
      if (player[p].timer > 5 && player[p].timer < 12){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 12){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 23){
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer > 22){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[2][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[2][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[2][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[2][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[2][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[2][3].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[2][4].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        aS[2][7].init(p,true);
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
}

aS[2][49] = {
  name : "FTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 49;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ftilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ftilt.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ftilt.id2;
    aS[2][49].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][49].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 5){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
      }
      if (player[p].timer > 5 && player[p].timer < 9){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 9){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 26){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][50] = {
  name : "JAB1",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 50;
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.jab1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.jab1.id1;
    aS[2][50].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][50].interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer > 2 && player[p].timer < 32 && player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.jabCombo = true;
      }
      if (player[p].timer == 2){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer > 2 && player[p].timer < 4){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 4){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 5 && player[p].phys.jabCombo){
      aS[2][51].init(p);
      return true;
    }
    else if (player[p].timer > 17){
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer > 15){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[2][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[2][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[2][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[2][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[2][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[2][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[2][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[2][7].init(p,true);
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
}

aS[2][51] = {
  name : "JAB2",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 51;
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.jab2.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.jab2.id1;
    aS[2][51].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][51].interrupt(p)){
      if (player[p].timer == 1){
        player[p].phys.cVel.x = 0
      }
      else if (player[p].timer == 2){
        player[p].phys.cVel.x = 3.36*player[p].phys.face;
      }
      else if (player[p].timer == 4){
        player[p].phys.cVel.x = 0;
      }
      if (player[p].timer > 0 && player[p].timer < 21 && player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.jabCombo = true;
      }
      if (player[p].timer == 3){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer > 3 && player[p].timer < 5){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 5){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 5 && player[p].phys.jabCombo){
      aS[2][113].init(p);
      return true;
    }
    else if (player[p].timer > 20){
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer > 16){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[2][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[2][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[2][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[2][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[2][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[2][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[2][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[2][7].init(p,true);
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
}

aS[2][52] = {
  name : "ESCAPEB",
  setVelocities : [0,0,0,0,0,0,-0.46222,-1.31556,-2.06222,-5.76,-2.36391,-1.47609,-1.19896,-0.97833,-1.10208,-1.37792,-1.50167,-1.51354,-1.47984,-1.53891,-1.75248,-1.86955,-1.70572,-1.261,-0.73878,-0.42036,-0.24296,-0.20661,-0.31128,-0.58266,-0.37734],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 52;
    player[p].timer = 0;
    player[p].phys.shielding = false;
    aS[2][52].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][52].interrupt(p)){
      player[p].phys.cVel.x = aS[2][52].setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer == 4){
        player[p].phys.intangibleTimer = 16;
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 31){
      player[p].phys.cVel.x = 0;
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][53] = {
  name : "ESCAPEF",
  setVelocities : [0,0,0,0,0,0,2.4,4.32,4.8,1.0299,0.89,1.08094,1.74377,1.86418,1.80236,1.70153,1.68123,1.658,1.63183,1.60272,1.44005,1.16476,0.9179,0.69951,0.50956,0.34806,0.21502,0.11042,0.03427,-0.01343,-0.03268],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 53;
    player[p].timer = 0;
    player[p].phys.shielding = false;
    aS[2][53].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][53].interrupt(p)){
      player[p].phys.cVel.x = aS[2][53].setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer == 4){
        player[p].phys.intangibleTimer = 16;
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 31){
      player[p].phys.cVel.x = 0;
      player[p].phys.face *= -1;
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][54] = {
  name : "ESCAPEN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 54;
    player[p].timer = 0;
    player[p].phys.shielding = false;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    aS[2][54].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][54].interrupt(p)){
      if (player[p].timer == 1){
        sounds.spotdodge.play();
      }
      reduceByTraction(p,true);
      if (player[p].timer == 2){
        player[p].phys.intangibleTimer = 14;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 22){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][55] = {
  name : "ATTACKDASH",
  canEdgeCancel : false,
  setVelocities : [0.99874,1.82126,2.22815,2.43704,1.91481,1.39379,1.36213,1.33162,1.30228,1.27408,1.24704,1.22115,1.19642,1.17284,1.15042,1.12915,1.10902,1.09006,1.06475,1.01691,0.94598,0.85192,0.73477,0.59452,0.43115,0.32167,0.28310,0.24695,0.21323,0.18194,0.15309,0.12666,0.10266,0.08109,0.06194,0.04524,0.03096,0.0191,0.00968],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 55;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dashattack1.id1;
    aS[2][55].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][55].interrupt(p)){
      player[p].phys.cVel.x = aS[2][55].setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer == 4){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
      }
      if (player[p].timer > 4 && player[p].timer < 18){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 8){
        player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.dashattack2.id1;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 18){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer < 5 && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      if (player[p].phys.cVel.x*player[p].phys.face > player[p].charAttributes.dMaxV){
        player[p].phys.cVel.x = player[p].charAttributes.dMaxV*player[p].phys.face;
      }
      aS[2][73].init(p);
      return true;
    }
    else if (player[p].timer > 35){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[2][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[2][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[2][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[2][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[2][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[2][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[2][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[2][7].init(p,true);
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
}

aS[2][56] = {
  name : "SIDESPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 56;
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
    turnOffHitboxes(p);
    sounds.star.play();
    player[p].hitboxes.id[0] = player[p].charHitboxes.sidespecial.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.sidespecial.id1;
    aS[2][56].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][56].interrupt(p)){
      if (player[p].phys.grounded){
        if (player[p].timer == 21){
          player[p].phys.cVel.x = 18.72*player[p].phys.face
          if ((player[p].inputs.b[0] || player[p].inputs.b[1]) && !player[p].inputs.b[2]){
            player[p].timer = 24;
          }
        }
        else if (player[p].timer == 22 || player[p].timer == 23){
          if (player[p].inputs.b[0] && !player[p].inputs.b[1]){
            player[p].timer = 24;
          }
        }
        if (player[p].timer == 24){
          player[p].phys.cVel.x = 2.1*player[p].phys.face
        }
        if (player[p].timer > 24){
          player[p].phys.cVel.x -= 0.1*player[p].phys.face;
          if (player[p].phys.cVel.x*player[p].phys.face < 0){
            player[p].phys.cVel.x = 0;
          }
        }

        if (player[p].timer == 20){
          sounds.foxillusion1.play();
          sounds.foxillusion2.play();
        }
      }
      else {
        player[p].actionState = 103;
        player[p].timer--;
        aS[2][103].main(p);
      }

      if (player[p].timer == 12){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 12 && player[p].timer < 28){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 28){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 63){
      if (player[p].phys.grounded){
        aS[2][0].init(p);
      }
      else {
        aS[2][14].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][57] = {
  name : "FSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 57;
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.fsmash1.id2;
    aS[2][57].main(p);
  },
  main : function(p){
    if (player[p].timer == 7){
      if (player[p].inputs.a[0] || player[p].inputs.z[0]){
        player[p].phys.charging = true;
        player[p].phys.chargeFrames++;
        if (player[p].phys.chargeFrames == 5){
          sounds.smashcharge.play();
        }
        if (player[p].phys.chargeFrames == 60){
          player[p].timer++;
          player[p].phys.charging = false;
        }
      }
      else {
        player[p].timer++;
        player[p].phys.charging = false;
      }
    }
    else {
      player[p].timer++;
      player[p].phys.charging = false;
    }
    if (!aS[2][57].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer < 9){
        player[p].phys.cVel.x = 0;
      }
      else if (player[p].timer < 15){
        player[p].phys.cVel.x = 1.34*player[p].phys.face;
      }
      else if (player[p].timer < 31){
        player[p].phys.cVel.x = 1.00*player[p].phys.face;
      }
      else {
        player[p].phys.cVel.x = 0;
      }


      if (player[p].timer == 12){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        randomShout(cS[p]);
        sounds.normalswing1.play();
      }
      if (player[p].timer > 12 && player[p].timer < 23){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 17){
        player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.fsmash2.id2;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 23){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][58] = {
  name : "UPSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 58;
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upsmash1.id1;
    aS[2][58].main(p);
  },
  main : function(p){
    if (player[p].timer == 2){
      if (player[p].inputs.a[0] || player[p].inputs.z[0]){
        player[p].phys.charging = true;
        player[p].phys.chargeFrames++;
        if (player[p].phys.chargeFrames == 5){
          sounds.smashcharge.play();
        }
        if (player[p].phys.chargeFrames == 60){
          player[p].timer++;
          player[p].phys.charging = false;
        }
      }
      else {
        player[p].timer++;
        player[p].phys.charging = false;
      }
    }
    else {
      player[p].timer++;
      player[p].phys.charging = false;
    }
    if (!aS[2][58].interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer == 7){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        randomShout(cS[p]);
        sounds.normalswing1.play();
      }
      if (player[p].timer > 7 && player[p].timer < 18){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 10){
        player[p].hitboxes.id[0] = player[p].charHitboxes.upsmash2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.upsmash2.id1;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 18){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 41){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][59] = {
  name : "DSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 59;
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dsmash.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dsmash.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dsmash.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dsmash.id3;
    aS[2][59].main(p);
  },
  main : function(p){
    if (player[p].timer == 2){
      if (player[p].inputs.a[0] || player[p].inputs.z[0]){
        player[p].phys.charging = true;
        player[p].phys.chargeFrames++;
        if (player[p].phys.chargeFrames == 5){
          sounds.smashcharge.play();
        }
        if (player[p].phys.chargeFrames == 60){
          player[p].timer++;
          player[p].phys.charging = false;
        }
      }
      else {
        player[p].timer++;
        player[p].phys.charging = false;
      }
    }
    else {
      player[p].timer++;
      player[p].phys.charging = false;
    }
    if (!aS[2][59].interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        randomShout(cS[p]);
        sounds.normalswing1.play();
      }
      if (player[p].timer > 6 && player[p].timer < 11){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 11){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer > 45 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[2][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[2][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[2][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[2][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[2][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[2][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[2][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[2][7].init(p,true);
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
}

aS[2][60] = {
  name : "DOWNBOUND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 60;
    player[p].timer = 0;
    player[p].phys.kVel.y = 0;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    aS[2][60].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][60].interrupt(p)){
      if (player[p].timer == 1){
        reduceByTraction(p,true);
      }
      else {
        player[p].phys.cVel.x = 0;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 26){
      aS[2][61].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][61] = {
  name : "DOWNWAIT",
  canEdgeCancel : true,
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 61;
    player[p].timer = 0;
    aS[2][61].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][61].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 70){
      aS[2][61].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7){
      aS[2][63].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7){
      aS[2][64].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].y > 0.7){
      aS[2][62].init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1])){
      aS[2][65].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][62] = {
  name : "DOWNSTANDN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 62;
    player[p].timer = 0;
    aS[2][62].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][62].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 23;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][63] = {
  name : "DOWNSTANDB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [-0.10375,-0.1061,-0.110,-0.11575,-0.12306,-0.23723,-0.44395,-0.63087,-0.79798,-0.9453,-1.07281,-1.18053,-1.26844,-1.33655,-1.38486,-1.41336,-1.35442,-1.24543,-1.17278,-1.13645,-1.13645,-1.17278,-1.24543,-1.33619,-1.40092,-1.43573,-1.44064,-1.41564,-1.36074,-1.27593,-1.16121,-1.01659,-0.84207,-0.63763,-0.40329],
  init : function(p){
    player[p].actionState = 63;
    player[p].timer = 0;
    aS[2][63].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][63].interrupt(p)){
      player[p].phys.cVel.x = aS[2][63].setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer == 12){
        player[p].phys.intangibleTimer = 18;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 35){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][64] = {
  name : "DOWNSTANDF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [0.1659,0.21687,0.53598,1.35686,1.56439,3.82358,3.48149,3.15542,2.84537,2.55133,2.27332,2.01131,1.76532,1.53536,1.3214,1.12347,0.94155,0.77564,0.62576,0.49189,0.37403,0.2722,0.18638,0.11658,0.06279,0.02502,0.00327,-0.00247,-0.00023,-0.00056,-0.00069,-0.00063,-0.00036,0.0001,0.00076],
  init : function(p){
    player[p].actionState = 64;
    player[p].timer = 0;
    aS[2][64].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][64].interrupt(p)){
      player[p].phys.cVel.x = aS[2][64].setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 19;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 35){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][65] = {
  name : "DOWNATTACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 65;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downattack1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.downattack1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.downattack1.id2;
    aS[2][65].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][65].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 26;
      }
      if (player[p].timer == 17){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 17 && player[p].timer < 20){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 20){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 24){
        player[p].hitboxes.id[0] = player[p].charHitboxes.downattack2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.downattack2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.downattack2.id2;
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 24 && player[p].timer < 27){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 27){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][66] = {
  name : "TECHN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 66;
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[2][66].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][66].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 20
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 26){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][67] = {
  name : "TECHB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [0,-1.90448,-1.87286,-1.84,-1.81,-1.77,-1.73,-1.70,-1.66,-1.62,-1.58,-1.53,-1.49,-1.44,-1.40,-1.35,-1.30,-1.25,-1.20,-1.15,-1.09,-1.04,-0.98,-0.93,-0.87,-0.81,-0.75,-0.68,-0.62,-0.56,-0.49,0,0,0,0,0,0,-0.002,-0.002,-0.002],
  init : function(p){
    player[p].actionState = 67;
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[2][67].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][67].interrupt(p)){
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 20
      }
      player[p].phys.cVel.x = aS[2][67].setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][68] = {
  name : "TECHF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [0,0,0,0,0,0,0,2.56,2.49,2.43,2.36,2.29,2.22,2.14,2.07,1.99,1.90,1.82,1.73,1.64,1.54,1.45,1.35,1.24,1.14,1.03,0.92,0.81,0.70,0.58,0,0,0,0,0,0,0,0,0,0],
  init : function(p){
    player[p].actionState = 68;
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[2][68].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][68].interrupt(p)){
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 20
      }
      player[p].phys.cVel.x = aS[2][68].setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][69] = {
  name : "SHIELDBREAKFALL",
  canPassThrough : false,
  canBeGrabbed : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  init : function(p){
    player[p].actionState = 69;
    player[p].timer = 0;
    aS[2][69].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][69].interrupt(p)){
      player[p].phys.intangibleTimer = 1;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[2][69].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][70] = {
  name : "SHIELDBREAKDOWNBOUND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 70;
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.y = 0;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    aS[2][70].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][70].interrupt(p)){
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
    if (player[p].timer > 26){
      aS[2][71].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][71] = {
  name : "SHIELDBREAKSTAND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 71;
    player[p].timer = 0;
    aS[2][71].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][71].interrupt(p)){
      reduceByTraction(p,true);
      player[p].phys.intangibleTimer = 1;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[2][72].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][72] = {
  name : "FURAFURA",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 72;
    player[p].timer = 0;
    player[p].phys.stuckTimer = 490;
    drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(4+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+11+Math.random()*3),player[p].phys.face);
    player[p].furaLoopID = sounds.furaloop.play();
    aS[2][72].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][72].interrupt(p)){
      if (player[p].timer % 100 == 65){
        sounds.foxfura.play();
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
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer > 110){
      player[p].timer = 1;
      return false;
    }
    else {
      return false;
    }
  }
}

aS[2][73] = {
  name : "GRAB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 73;
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.grab.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.grab.id1;
    aS[2][73].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][73].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 7){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.grab.play();
      }
      if (player[p].timer > 7 && player[p].timer < 9){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 9){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][74] = {
  name : "CAPTUREPULLED",
  canEdgeCancel : false,
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 74;
    player[p].timer = 0;
    player[p].phys.grounded = true;
    player[p].phys.face = -1*player[player[p].phys.grabbedBy].phys.face;
    player[p].phys.onSurface = [player[player[p].phys.grabbedBy].phys.onSurface[0],player[player[p].phys.grabbedBy].phys.onSurface[1]];
    player[p].phys.stuckTimer = 100+(2*player[p].percent);
    sounds.grabbed.play();
    aS[2][74].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][74].interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-16.41205*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 2){
      aS[2][75].init(p);
      aS[2][76].init(player[p].phys.grabbedBy);
      drawVfx("tech",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+10));
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][75] = {
  name : "CAPTUREWAIT",
  canEdgeCancel : false,
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 75;
    player[p].timer = 0;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
    aS[2][75].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][75].interrupt(p)){
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
      aS[2][78].init(player[p].phys.grabbedBy);
      aS[2][77].init(p);
      return true;
    }
    else if (player[p].timer > 80){
      aS[2][75].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][76] = {
  name : "CATCHWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 76;
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[2][76].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][76].interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      aS[2][79].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) || player[p].inputs.cStickAxis[0].y > 0.7){
      aS[2][81].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y > -0.7) || player[p].inputs.cStickAxis[0].y < -0.7){
      aS[2][83].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[1].x*player[p].phys.face > -0.7) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
      aS[2][85].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[1].x*player[p].phys.face < 0.7) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
      aS[2][87].init(p);
      return true;
    }
    else if (player[p].timer > 30){
      aS[2][76].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][77] = {
  name : "CAPTURECUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 77;
    player[p].timer = 0;
    player[p].phys.grabbedBy = -1
    player[p].phys.cVel.x = -1*player[p].phys.face;
    aS[2][77].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][77].interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.grabTech = false;
      }
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][78] = {
  name : "CATCHCUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 78;
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.cVel.x = -1*player[p].phys.face;
    aS[2][78].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][78].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][79] = {
  name : "CATCHATTACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 79;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.pummel.id0;
    aS[2][79].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][79].interrupt(p)){
      if (player[p].timer == 10){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 11){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 24){
      aS[2][76].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][80] = {
  name : "CAPTUREDAMAGE",
  canEdgeCancel : false,
  canBeGrabbed : false,
  setPositions : [9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.306,8.920,8.516,8.290,8.293,8.410,8.593,8.792,8.959,9.043,9.068],
  init : function(p){
    player[p].actionState = 80;
    player[p].timer = 0;
    aS[2][80].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][80].interrupt(p)){
      player[p].phys.pos.x = player[player[p].phys.grabbedBy].phys.pos.x+(-aS[2][80].setPositions[player[p].timer-1]*player[p].phys.face);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 20){
      aS[2][75].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[2][81] = {
  name : "THROWUP",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 81;
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]][108].init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    var frame = 0;
    switch (cS[player[p].phys.grabbing]){
      case 0:
        frame = 7;
        break;
      case 1:
        frame = 5;
        break;
      case 2:
        frame = 9;
        break;
      default:
        break;
    }
    player[p].phys.releaseFrame = frame;
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
    aS[2][81].main(p);
  },
  main : function(p){
    player[p].timer+=7/player[p].phys.releaseFrame;
    if (!aS[2][81].interrupt(p)){
      if (Math.floor(player[p].timer) == player[p].phys.releaseFrame){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 33){
      player[p].phys.grabbing = -1;
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      console.log("test");
      aS[2][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][82] = {
  name : "THROWNMARTHUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.38,7.51],[-11.19,6.91],[-11.33,6.67],[-10.92,6.78],[-10.55,6.91],[-10.51,6.93],[-7.57,17.47],[-7.57,17.47]],
  init : function(p){
    player[p].actionState = 82;
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    aS[2][82].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][82].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[2][82].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[2][82].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[2][83] = {
  name : "THROWDOWN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 83;
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]][106].init(player[p].phys.grabbing);
    var frame = 0;
    switch (cS[player[p].phys.grabbing]){
      case 0:
        frame = 61;
        break;
      case 1:
        frame = 61;
        break;
      case 2:
        frame = 9;
        break;
      default:
        break;
    }
    player[p].phys.releaseFrame = frame;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwdownextra.id0;
    randomShout(cS[p]);
    aS[2][83].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][83].interrupt(p)){
      //10,23,36,49
      if (player[p].timer < 51){
        if (player[p].timer%13 == 10){
          player[p].hitboxes.active = [true,false,false,false];
          player[p].hitboxes.frame = 0;
        }
        if (player[p].timer%13 == 11){
          turnOffHitboxes(p);
        }
      }
      if (player[p].timer == player[p].phys.releaseFrame){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 84){
      player[p].phys.grabbing = -1;
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      console.log("test");
      aS[2][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][84] = {
  name : "THROWNMARTHDOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.42,8.24],[-12.78,9.07],[-13.1,9.18],[-13.1,9.18],[-13.46,8.44],[-13.71,6.36],[-12.79,3.86],[-10.42,0.27],[-10.42,0.27]],
  init : function(p){
    player[p].actionState = 84;
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    aS[2][84].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][84].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[2][84].offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+aS[2][84].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[2][85] = {
  name : "THROWBACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [-0.12755,-1.24035,-3.10533,-2.72023,-0.32654,0,0,0,0.00357,0.09035,0.22531,0.37797,0.54831,1.35048,1.60332,1.04371,0.81257,0.60621,0.42461,0.26777,0.1357,0.03,0],
  init : function(p){
    player[p].actionState = 85;
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]][107].init(player[p].phys.grabbing);
    var frame = 0;
    switch (cS[player[p].phys.grabbing]){
      case 0:
        frame = 22;
        break;
      case 1:
        frame = 15;
        break;
      case 2:
        frame = 9;
        break;
      default:
        break;
    }
    player[p].phys.releaseFrame = frame;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
    randomShout(cS[p]);
    aS[2][85].main(p);
  },
  main : function(p){
    player[p].timer+=(48/43)*(22/player[p].phys.releaseFrame);
    if (!aS[2][85].interrupt(p)){
      if (Math.floor(player[p].timer) > 13 && Math.floor(player[p].timer < 37)){
        player[p].phys.cVel.x = aS[2][85].setVelocities[Math.floor(player[p].timer)-14]*player[p].phys.face;
      }
      if (Math.floor(player[p].timer) == 22){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 32){
      player[p].phys.grabbing = -1;
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      aS[2][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][86] = {
  name : "THROWNMARTHBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-6.22,7.33],[-1.72,7.12],[-0.02,4.56],[0.80,2.86],[0.80,2.86]],
  init : function(p){
    player[p].actionState = 86;
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    aS[2][86].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][86].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[2][86].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[2][86].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[2][87] = {
  name : "THROWFORWARD",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 87;
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]][105].init(player[p].phys.grabbing);
    var frame = 0;
    switch (cS[player[p].phys.grabbing]){
      case 0:
        frame = 10;
        break;
      case 1:
        frame = 10;
        break;
      case 2:
        frame = 9;
        break;
      default:
        break;
    }
    player[p].phys.releaseFrame = frame;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwforward.id0;
    randomShout(cS[p]);
    aS[2][87].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][87].interrupt(p)){

      if (player[p].timer == player[p].phys.releaseFrame){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }
      if (player[p].timer == 11){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwforwardextra.id0;
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 12){
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 33){
      player[p].phys.grabbing = -1;
      aS[2][0].init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      aS[2][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][88] = {
  name : "THROWNMARTHFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-11.71,7.06],[-10.22,9.68],[-9.84,9.94],[-9.70,9.88],[-10.01,9.67],[-14.00,8.67],[-11.76,5.89],[-8.89,-0.35],[-8.89,-0.35]],
  init : function(p){
    player[p].actionState = 88;
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    aS[2][88].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][88].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[2][88].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[2][88].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[2][89] = {
  name : "WALLDAMAGE",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  canBeGrabbed : true,
  headBonk : true,
  init : function(p){
    player[p].actionState = 89;
    player[p].timer = 0;
    sounds.bounce.play();
    aS[2][89].main(p);
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
    if (!aS[2][89].interrupt(p)){
      player[p].hit.hitstun--;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 41){
      aS[2][40].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][90] = {
  name : "WALLTECH",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 90;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    if (player[p].phys.face == 1){
      drawVfx("tech",player[p].phys.ECBp[3]);
    }
    else {
      drawVfx("tech",player[p].phys.ECBp[1]);
    }
    // draw tech rotated
    aS[2][90].main(p);
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
    if (!aS[2][90].interrupt(p)){
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
        aS[2][a[1]].init(p);
        return true;
      }
      else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
        aS[2][11].init(p);
        return true;
      }
      else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          aS[2][110].init(p);
        }
        else {
          aS[2][19].init(p);
        }
        return true;
      }
      else if (b[0]){
        aS[2][b[1]].init(p);
        return true;
      }
      else if (player[p].timer > 26){
        aS[2][13].init(p);
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
}

aS[2][91] = {
  name : "WALLJUMP",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 91;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].hit.hitstun = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,14);
    player[p].phys.cVel.x = player[p].phys.face * 1.4;
    player[p].phys.cVel.y = 3.3*(Math.pow(0.97,player[p].phys.wallJumpCount));
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
    aS[2][91].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 2){
      sounds.walljump.play();
    }
    if (!aS[2][91].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 1){
      var a = checkForAerials(p);
      var b = checkForSpecials(p);
      if (a[0]){
        aS[2][a[1]].init(p);
        return true;
      }
      else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
        aS[2][11].init(p);
        return true;
      }
      else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          aS[2][110].init(p);
        }
        else {
          aS[2][19].init(p);
        }
        return true;
      }
      else if (b[0]){
        aS[2][b[1]].init(p);
        return true;
      }
      else if (player[p].timer > 40){
        aS[2][13].init(p);
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
}

aS[2][92] = {
  name : "WALLTECHJUMP",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 92;
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
    aS[2][92].main(p);
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
    if (!aS[2][90].interrupt(p)){
      if (player[p].timer > 0.89 && player[p].timer < 0.91){
        player[p].phys.cVel.x = player[p].phys.face * 1.4;
        player[p].phys.cVel.y = 3.3;
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
        aS[2][a[1]].init(p);
        return true;
      }
      else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
        aS[2][11].init(p);
        return true;
      }
      else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          aS[2][110].init(p);
        }
        else {
          aS[2][19].init(p);
        }
        return true;
      }
      else if (b[0]){
        aS[2][b[1]].init(p);
        return true;
      }
      else if (player[p].timer > 40){
        aS[2][13].init(p);
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
}

aS[2][93] = {
  name : "SLEEP",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 93;
    player[p].timer = 0;
    player[p].hit.hitstun = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.pos.x = 300;
    aS[2][93].main(p);
  },
  main : function(p){
  },
  interrupt : function(p){
    return false;
  }
}

aS[2][94] = {
  name : "ENTRANCE",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 94;
    player[p].timer = 0;
    player[p].phys.grounded = false;
    aS[2][94].main(p);
  },
  main : function(p){
    player[p].timer++;
    aS[2][94].interrupt(p);
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      aS[2][13].init(p);
    }
  }
}

aS[2][95] = {
  name : "CLIFFGETUPQUICK",
  canBeGrabbed : true,
  offset : [[-70.7039,-13.92],[-71.27977,-12.96],[-71.69937,-12.06755],[-72.07638,-11.06843],[-72.24,-9.6],[-72.24,-6.74401],[-72.24,-3.84],[-71.35111,-1.99111],[-69.60889,-0.56889],[-67.19112,0]],
  setVelocities : [0.48171,0.47829,0.50249,0.51401,0.45477,0.32475,0.12398,0,0,0,0],
  init : function(p){
    player[p].actionState = 95;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 30;
    aS[2][95].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][95].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 24){
        if (player[p].timer >= 14)
        player[p].phys.pos = new Vec2D(x+(aS[2][95].offset[player[p].timer-14][0]+68.4)*player[p].phys.face,y+aS[2][95].offset[player[p].timer-14][1]);
      }
      else {
        player[p].phys.cVel.x = aS[2][95].setVelocities[player[p].timer-24]*player[p].phys.face;
      }
      if (player[p].timer == 24){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 33){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][96] = {
  name : "CLIFFGETUPSLOW",
  offset : [[-70.32,-14.23684],[-70.32,-14.04406],[-70.32,-13.83467],[-70.32,-13.62174],[-70.32,-13.41828],[-70.32,-13.23734],[-70.32,-13.09195],[-70.32,-12.99516],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.94646],[-70.32,-12.90716],[-70.32,-12.84404],[-70.32,-12.75909],[-70.32,-12.65426],[-70.32,-12.53151],[-70.32,-12.3928],[-70.32,-12.24],[-70.32,-12.07538],[-70.32,-11.90058],[-70.32,-11.71768],[-70.32,-11.52864],[-70.32,-11.33542],[-70.32,-11.13999],[-70.32,-10.94429],[-70.32,-10.75031],[-70.32,-10.56],[-70.32,-10.33863],[-70.32,-10.05937],[-70.32,-9.73605],[-70.32,-9.3825],[-70.32,-9.01255],[-70.32,-8.64],[-70.32,-8.29058],[-70.32,-7.96354],[-70.32,-7.63306],[-70.32,-7.27329],[-70.32,-6.85842],[-70.32,-6.3626],[-70.32,-5.76],[-70.22906,-4.87181],[-69.98633,-3.67591],[-69.63692,-2.38155],[-69.22598,-1.19796],[-68.79863,-0.33436],[-68.00137,0]],
  setVelocities : [0.38672,0.41407,0.42994,0.43436,0.42731,0.40879],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 96;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 55;
    aS[2][96].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][96].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 54){
        player[p].phys.pos = new Vec2D(x+(aS[2][96].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[2][96].offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = aS[2][96].setVelocities[player[p].timer-54]*player[p].phys.face;
      }
      if (player[p].timer == 54){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 59){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][97] = {
  name : "CLIFFESCAPEQUICK",
  offset : [[-70.67906,-13.98],[-71.27813,-12.96],[-71.87907,-11.55],[-72.24,-9.6],[-72.24,-6.62999],[-72.24,-3.84],[-71.35111,-1.99114],[-69.60889,-0.5689],[-67.19112,0]],
  setVelocities : [0.7218,1.0418,1.11641,1.55599,1.324,0.93156,1.16625,0.78219,0.37686,0.33425,0.24889,0.27022,0.35558,0.3342,1.92,2.4414,2.54756,2.57555,2.52538,2.39703,2.19051,1.90581,1.54296,1.10192,0.73904,0.52734,0.34701,0.19804],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 97;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 34;
    aS[2][97].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][97].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 22){
        if (player[p].timer >= 13){
          player[p].phys.pos = new Vec2D(x+(aS[2][97].offset[player[p].timer-13][0]+68.4)*player[p].phys.face,y+aS[2][97].offset[player[p].timer-13][1]);
        }
      }
      else if (player[p].timer < 50){
        player[p].phys.cVel.x = aS[2][97].setVelocities[player[p].timer-22]*player[p].phys.face;
      }
      if (player[p].timer == 22){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }

}

aS[2][98] = {
  name : "CLIFFESCAPESLOW",
  offset : [[-70.32,-14.23684],[-70.32,-14.04406],[-70.32,-13.83467],[-70.32,-13.62174],[-70.32,-13.41828],[-70.32,-13.23734],[-70.32,-13.09195],[-70.32,-12.99516],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.94646],[-70.32,-12.90716],[-70.32,-12.84404],[-70.32,-12.75909],[-70.32,-12.65426],[-70.32,-12.53151],[-70.32,-12.3928],[-70.32,-12.24],[-70.32,-12.07538],[-70.32,-11.90058],[-70.32,-11.71768],[-70.32,-11.52864],[-70.32,-11.33542],[-70.32,-11.13999],[-70.32,-10.94429],[-70.32,-10.75031],[-70.32,-10.56],[-70.32,-10.33863],[-70.32,-10.05937],[-70.32,-9.73605],[-70.32,-9.3825],[-70.32,-9.01255],[-70.32,-8.64],[-70.32,-8.29058],[-70.32,-7.96354],[-70.32,-7.63306],[-70.32,-7.27329],[-70.32,-6.85842],[-70.32,-6.3626],[-70.32,-5.76],[-70.17775,-4.87171],[-69.82212,-3.67591],[-69.35983,-2.38155],[-68.89757,-1.19796],[-68.54206,-0.33436],[-68.25794,0]],
  setVelocities : [0.48879,1.49473,2.5425,3.63211,2.55094,2.41367,2.27723,2.14161,2.00682,1.87285,1.7397,1.60738,1.47588,1.34521,1.21536,1.08633,0.95814,0.83076,0.67258,0.49966,0.35163,0.22852,0.13032,0.05701,0.00862,-0.01488],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 98;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 62;
    aS[2][98].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][98].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 54){
        player[p].phys.pos = new Vec2D(x+(aS[2][98].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[2][98].offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = aS[2][98].setVelocities[player[p].timer-54]*player[p].phys.face;
      }
      if (player[p].timer == 54){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 79){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][99] = {
  name : "CLIFFATTACKSLOW",
  offset : [[-70.32,-14.23684],[-70.32,-14.04406],[-70.32,-13.83467],[-70.32,-13.62174],[-70.32,-13.41828],[-70.32,-13.23734],[-70.32,-13.09195],[-70.32,-12.99516],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.94935],[-70.32,-12.91799],[-70.32,-12.86679],[-70.32,-12.79665],[-70.32,-12.70842],[-70.32,-12.603],[-70.32,-12.48127],[-70.32,-12.3441],[-70.32,-12.19237],[-70.32,-12.02697],[-70.32,-11.84876],[-70.32,-11.65864],[-70.32,-11.45747],[-70.32,-11.24615],[-70.32,-11.02554],[-70.32,-10.79653],[-70.32,-10.56],[-70.32,-10.31413],[-70.32,-10.05515],[-70.32,-9.78105],[-70.32,-9.48977],[-70.32,-9.17929],[-70.32,-8.84757],[-70.32,-8.49258],[-70.32,-8.11228],[-70.32,-7.70465],[-70.32,-7.26763],[-70.32,-6.79921],[-70.32,-6.29734],[-70.32,-5.76],[-70.17651,-4.94739],[-69.81816,-3.77266],[-69.35315,-2.46318],[-68.88966,-1.24633],[-68.53587,-0.34948],[-68.26413,0]],
  setVelocities : [0.34921,0.88711,1.15682,1.15835,0.89168,0.35682,0,0,0,0,0,-0.16,-0.32,-0.350399,-0.385,-0.37701],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 99;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 53;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupslow.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupslow.id1;
    aS[2][99].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][99].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 54){
        player[p].phys.pos = new Vec2D(x+(aS[2][99].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[2][99].offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = aS[2][99].setVelocities[player[p].timer-54]*player[p].phys.face;
      }
      if (player[p].timer == 54){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer == 57){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        randomShout(cS[p]);
      }
      else if (player[p].timer > 57 && player[p].timer < 60){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 60){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 69){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][100] = {
  name : "CLIFFATTACKQUICK",
  offset : [[-70.70355,-13.91997],[-71.27906,-12.96],[-71.69882,-12.06759],[-72.07618,-11.06843],[-72.24,-9.6],[-72.24,-6.74399],[-72.24,-3.84],[-71.01049,-1.99348],[-68.39889,-0.57355],[-63.64237,0]],
  setVelocities : [0.1943,0.03352,1.59986,1.91979,2.12469,2.21458,2.18944,2.04928,1.79411,1.42391,0.93869,0.33846,0,0,0,-0.34,-0.61998,-0.75406,-1.08875,-1.3431,-1.5171,-1.61075,-1.62405,-1.557,-1.4096,-1.18185,-0.87376,-0.69279,-0.65007,-0.54367,-0.3736],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 100;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 15;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupquick.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupquick.id1;
    aS[2][100].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][100].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 24){
        if (player[p].timer >= 14){
          player[p].phys.pos = new Vec2D(x+(aS[2][100].offset[player[p].timer-14][0]+68.4)*player[p].phys.face,y+aS[2][100].offset[player[p].timer-14][1]);
        }
      }
      else {
        player[p].phys.cVel.x = aS[2][100].setVelocities[player[p].timer-24]*player[p].phys.face;
      }
      if (player[p].timer == 24){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer == 25){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
        randomShout(cS[p]);
      }
      else if (player[p].timer > 25 && player[p].timer < 35){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 35){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 54){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }

}

aS[2][101] = {
  name : "CLIFFJUMPQUICK",
  offset : [[-70.8428,-14.38776],[-71.49446,-14.32052],[-72.19153,-14.1652],[-72.85054,-13.88868],[-73.38803,-13.45787],[-73.72054,-12.83965],[-73.76461,-12.00094],[-73.50131,-10.89611],[-73.00593,-9.5458],[-72.33633,-8.01628],[-71.55035,-6.37383],[-70.70587,-4.6847],[-69.86075,-3.01518],[-69.07284,-1.43152]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 101;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 14;
    aS[2][101].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][101].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 15){
        player[p].phys.pos = new Vec2D(x+(aS[2][101].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[2][101].offset[player[p].timer-1][1]);
      }
      if (player[p].timer == 15){
        player[p].phys.cVel = new Vec2D(1.1*player[p].phys.face,4);
      }
      if (player[p].timer > 15){
        airDrift(p);
        fastfall(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 51){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      aS[2][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][102] = {
  name : "CLIFFJUMPSLOW",
  offset : [[-70.24197,-14.37161],[-70.01204,-14.25485],[-69.68486,-14.01434],[-69.31504,-13.61466],[-68.9572,-13.0204],[-68.66598,-12.19617],[-68.49598,-11.10656],[-68.49598,-8.58951],[-69.17776,-4.88456],[-68.95471,-2.05875],[-68.61933,-0.74366],[-68.49973,-0.30766],[-68.72181,-0.92297],[-69.22082,-2.17673],[-69.18517,-2.92594],[-69.0908,-3.15013],[-69.0474,-3.24815],[-69.17303,-2.92594],[-69.01739,-1.4797]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 102;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 19;
    aS[2][102].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][102].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 20){
        player[p].phys.pos = new Vec2D(x+(aS[2][102].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[2][102].offset[player[p].timer-1][1]);
      }
      if (player[p].timer == 20){
        player[p].phys.cVel = new Vec2D(1.1*player[p].phys.face,4);
      }
      if (player[p].timer > 20){
        airDrift(p);
        fastfall(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 51){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      aS[2][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][103] = {
  name : "SIDESPECIALAIR",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 103;
    player[p].timer = 0;
    if (player[p].phys.grounded){
      player[p].phys.cVel.x = 0;
    }
    else {
      player[p].phys.cVel.x *= 0.667;
      player[p].phys.cVel.y = 0;
    }
    drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
    turnOffHitboxes(p);
    sounds.star.play();
    player[p].hitboxes.id[0] = player[p].charHitboxes.sidespecial.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.sidespecial.id1;
    aS[2][103].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][103].interrupt(p)){
      if (!player[p].phys.grounded){
        if (player[p].timer >= 16 && player[p].timer < 21){
          player[p].phys.cVel.y -= 0.01667;
        }
        if (player[p].timer <= 21){
          if (player[p].phys.cVel.x != 0){
            var dir = Math.sign(player[p].phys.cVel.x);
            player[p].phys.cVel.x -= dir*0.05;
            if (player[p].phys.cVel.x*dir < 0){
              player[p].phys.cVel.x = 0;
            }
          }
        }
        if (player[p].timer >= 29){
          player[p].phys.cVel.y -= 0.08;
        }
        if (player[p].timer == 21){
          player[p].phys.cVel.x = 18.72*player[p].phys.face;
          player[p].phys.cVel.y = 0;
          if ((player[p].inputs.b[0] || player[p].inputs.b[1]) && !player[p].inputs.b[2]){
            player[p].timer = 24;
          }
        }
        else if (player[p].timer == 22 || player[p].timer == 23){
          if (player[p].inputs.b[0] && !player[p].inputs.b[1]){
            player[p].timer = 24;
          }
        }
        if (player[p].timer == 24){
          player[p].phys.cVel.x = 2*player[p].phys.face;
        }
        if (player[p].timer > 24){
          player[p].phys.cVel.x -= 0.07*player[p].phys.face;
          if (player[p].phys.cVel.x*player[p].phys.face < 0){
            player[p].phys.cVel.x = 0;
          }
        }

        if (player[p].timer == 20){
          sounds.foxillusion1.play();
          sounds.foxillusion2.play();
        }
      }
      else {
        player[p].actionState = 103;
        player[p].timer--;
        aS[2][103].main(p);
      }

      if (player[p].timer == 12){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 12 && player[p].timer < 28){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 28){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 63){
      if (player[p].phys.grounded){
        aS[2][0].init(p);
      }
      else {
        aS[2][14].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][104] = {
  name : "DOWNSPECIALAIR",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 104;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.cVel.y = 0;
    player[p].phys.cVel.x *= 0.5;
    player[p].shineLoop = 6;
    player[p].phys.inShine = 0;
    sounds.foxshine.play();
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("shine",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+6));
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecial.id0;
    aS[2][104].main(p);
  },
  main : function(p){
    player[p].timer++;
    player[p].phys.inShine++;
    if (!aS[2][104].interrupt(p)){
      if (player[p].phys.grounded){
        player[p].actionState = 109;
        player[p].timer--;
        aS[2][109].main(p);
      }
      else {
        if (player[p].phys.cVel.x > 0){
          if (player[p].phys.cVel.x > 0.85){
            player[p].phys.cVel.x -= 0.03;
          }
          else {
            player[p].phys.cVel.x -= 0.02;
          }
          if (player[p].phys.cVel.x < 0){
            player[p].phys.cVel.x = 0;
          }
        }
        else if (player[p].phys.cVel.x < 0){
          if (player[p].phys.cVel.x < -0.85){
            player[p].phys.cVel.x += 0.03;
          }
          else {
            player[p].phys.cVel.x += 0.02;
          }
          if (player[p].phys.cVel.x > 0){
            player[p].phys.cVel.x = 0;
          }
        }
        if (player[p].timer >= 5){
          player[p].phys.cVel.y -= 0.02667;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
        }

        if (player[p].timer >= 4 && player[p].timer <= 32){
          if (player[p].shineLoop == 6){
            player[p].shineLoop = 0;
          }
          player[p].shineLoop++;
          var part = Math.round(player[p].shineLoop/2);
          drawVfx("shineloop",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+6),part);
        }

        if (player[p].timer == 35){
          player[p].phys.face *= -1;
          player[p].timer = 4;
        }
        if (player[p].timer >= 4 && player[p].timer <= 32){
          if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < 0){
            player[p].timer = 32;
          }
          else if (player[p].phys.inShine >= 22){
            if (!player[p].inputs.b[0]){
              player[p].timer = 36;
            }
            else if (player[p].timer == 32){
              player[p].timer = 4;
            }
          }
        }


        if (player[p].timer == 1){
          player[p].hitboxes.active = [true,false,false,false];
          player[p].hitboxes.frame = 0;
          Math.max(player[p].phys.intangibleTimer,1);
        }
        if (player[p].timer == 2){
          turnOffHitboxes(p);
        }
      }


    }
  },
  interrupt : function(p){
    if (player[p].timer >= 4 && player[p].timer <= 32){
      if (!player[p].phys.doubleJumped){
        if ((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y >= 0.7 && player[p].inputs.lStickAxis[1].y < 0.7)){
          if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
            aS[2][110].init(p);
          }
          else {
            aS[2][19].init(p);
          }
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
    else if (player[p].timer > 49){
      if (player[p].phys.grounded){
        aS[2][0].init(p);
      }
      else {
        aS[2][13].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][105] = {
  name : "THROWNPUFFFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.52,-3.27],[-9.84,-3.27],[-9.13,-3.27],[-8.70,-3.27],[-8.60,-3.27],[-8.61,-3.27],[-8.67,-3.27],[-8.70,-3.27],[-9.78,-3.27],[-9.78,0.01]],
  init : function(p){
    player[p].actionState = 105;
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    aS[2][105].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][105].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[2][105].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[2][105].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[2][106] = {
  name : "THROWNPUFFDOWN",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.26,0.98],[-7.67,-0.31],[-4.94,-1.56],[-3.10,-2.50],[-0.94,-3.59],[-0.90,-3.57],[-1.00,-3.52],[-1.01,-3.56],[-0.94,-3.62],[-0.97,-3.60],[-1.02,-3.58],[-1.04,-3.56],[-1.00,-3.57],[-0.93,-3.58],[-0.91,-3.61],[-0.92,-3.64],[-0.91,-3.63],[-0.92,-3.60],[-0.92,-3.57],[-0.97,-3.57],[-1.00,-3.59],[-0.98,-3.62],[-0.96,-3.62],[-0.92,-3.59],[-0.89,-3.55],[-0.91,-3.54],[-0.96,-3.57],[-0.95,-3.62],[-0.93,-3.67],[-0.93,-3.65],[-0.95,-3.58],[-0.89,-3.52],[-0.84,-3.53],[-0.89,-3.59],[-0.94,-3.60],[-0.96,-3.59],[-0.96,-3.56],[-0.90,-3.54],[-0.86,-3.58],[-0.88,-3.63],[-0.88,-3.61],[-0.90,-3.58],[-0.92,-3.56],[-0.97,-3.56],[-1.00,-3.58],[-1.00,-3.62],[-0.98,-3.63],[-0.94,-3.60],[-0.91,-3.55],[-0.94,-3.53],[-0.99,-3.55],[-0.98,-3.59],[-0.98,-3.62],[-0.96,-3.61],[-0.95,-3.58],[-0.91,-3.53],[-0.90,-3.53],[-0.94,-3.59],[-0.93,-3.61],[-0.90,-3.65],[-0.93,-3.64],[-0.98,-3.62],[-0.98,-3.62]],
  init : function(p){
    player[p].actionState = 106;
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

    aS[2][106].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][106].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[2][106].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[2][106].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[2][107] = {
  name : "THROWNPUFFBACK",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  reverseModel : true,
  //[1.05,7.14],[3.78,7.55],[10.37,1.56],[13.72,-6.85],[13.66,-9.95],[13.67,-10.28],[13.85,-9.92],[14.04,-9.34],[14.04,-9.34]],
  offset : [[-11.22,-3.35],[-11.51,-3.60],[-11.64,-3.90],[-11.51,-4.11],[-10.99,-4.13],[-9.98,-4.05],[-8.74,-3.92],[-7.52,-3.55],[-6.37,-2.46],[-5.04,-0.22],[-3.44,2.32],[-1.58,3.79],[0.31,4.86],[0.92,7.14],[2.41,7.55],[5.89,1.56],[6.52,-6.85],[6.13,-9.95],[6.14,-10.28],[6.32,-9.92],[6.51,-9.34],[6.51,-9.34]],
  offsetVel : [-0.12755,-1.24035,-3.10533,-2.72023,-0.32654],
  //7.53
  init : function(p){
    player[p].actionState = 107;
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    aS[2][107].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][107].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[2][107].offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+aS[2][107].offset[player[p].timer-1][1]);
        /*if (player[p].timer > 13 && player[p].timer < 19){
          player[p].phys.pos.x += aS[0][107].offsetVel[player[p].timer-14]*player[p].phys.face;
        }*/
      }

    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[2][108] = {
  name : "THROWNPUFFUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.63,-3.65],[-9.46,-4.14],[-7.29,-4.39],[-2.98,-3.79],[2.65,-2.33],[4.95,-0.64],[4.95,-0.64]],
  init : function(p){
    player[p].actionState = 108;
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    aS[2][108].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][108].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[2][108].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[2][108].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[2][109] = {
  name : "DOWNSPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 109;
    player[p].timer = 0;
    player[p].phys.inShine = 0;
    sounds.foxshine.play();
    player[p].shineLoop = 6;
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("shine",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+6));
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecial.id0;
    aS[2][109].main(p);
  },
  main : function(p){
    player[p].timer++;
    player[p].phys.inShine++;
    if (!aS[2][109].interrupt(p)){
      if (player[p].phys.onSurface[0] == 1 && player[p].timer > 1){
        if (player[p].inputs.lStickAxis[0].y < -0.66 && player[p].inputs.lStickAxis[6].y >= 0){
          player[p].phys.grounded = false;
          player[p].phys.abovePlatforms[player[p].phys.onSurface[1]] = false;
          player[p].phys.cVel.y = -0.5;
        }
      }
      if (player[p].phys.grounded){
        reduceByTraction(p);
        if (player[p].timer >= 3){
          //shine turn
          // takes 3 frames, act on 4th
        }
        if (player[p].timer >= 4 && player[p].timer <= 35){
          if (player[p].shineLoop == 6){
            player[p].shineLoop = 0;
          }
          player[p].shineLoop++;
          var part = Math.round(player[p].shineLoop/2);
          drawVfx("shineloop",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+6),part);
        }
        if (player[p].timer == 35){
          player[p].phys.face *= -1;
          player[p].timer = 4;
        }
        if (player[p].timer >= 4 && player[p].timer <= 32){
          if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < 0){
            player[p].timer = 32;
          }
          else if (player[p].phys.inShine >= 22){
            if (!player[p].inputs.b[0]){
              player[p].timer = 36;
            }
            else if (player[p].timer == 32){
              player[p].timer = 4;
            }
          }
        }

        if (player[p].timer == 1){
          player[p].hitboxes.active = [true,false,false,false];
          player[p].hitboxes.frame = 0;
          Math.max(player[p].phys.intangibleTimer,1);
        }
        if (player[p].timer == 2){
          turnOffHitboxes(p);
        }
      }
      else {
        player[p].actionState = 104;
        player[p].timer--;
        aS[2][104].main(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer >= 4 && player[p].timer <= 32){
      if ((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y >= 0.7 && player[p].inputs.lStickAxis[1].y < 0.7)){
        aS[2][8].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 49){
      if (player[p].phys.grounded){
        aS[2][0].init(p);
      }
      else {
        aS[2][13].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][110] = {
  name : "JUMPAERIALB",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 110;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;

    player[p].phys.cVel.y = player[p].charAttributes.fHopInitV * player[p].charAttributes.djMultiplier;

    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 1);
    drawVfx("doubleJumpRings",player[p].phys.pos,player[p].phys.face);
    sounds.foxjump.play();
    sounds.jump2.play();
    aS[2][110].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][110].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[2][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[2][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[2][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 50){
      aS[2][32].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][111] = {
  name : "NEUTRALSPECIALAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 111;
    player[p].timer = 0;
    player[p].phys.laserCombo = false;
    aS[2][111].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][111].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer >= 4 && player[p].timer <= 14){
        if (player[p].inputs.b[0] && !player[p].inputs.b[1]){
          player[p].phys.laserCombo = true;
        }
      }
      if (player[p].timer == 15){
        if (player[p].phys.laserCombo){
          player[p].timer = 5;
          player[p].phys.laserCombo = false;
        }
      }
      if (player[p].timer == 7){
        sounds.foxlasercock.play();
      }
      if (player[p].timer == 10){
        sounds.foxlaserfire.play();
        // laser instance
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+9),player[p].phys.face);
        articles[0].init(p,2);
      }
      if (player[p].timer == 30){
        sounds.foxlaserholster.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 36){
      aS[2][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][112] = {
  name : "NEUTRALSPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 112;
    player[p].timer = 0;
    player[p].phys.laserCombo = false;
    aS[2][112].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][112].interrupt(p)){
      reduceByTraction(p);
      if (player[p].timer >= 4 && player[p].timer <= 16){
        if (player[p].inputs.b[0] && !player[p].inputs.b[1]){
          player[p].phys.laserCombo = true;
        }
      }
      if (player[p].timer == 17){
        if (player[p].phys.laserCombo){
          player[p].timer = 7;
          player[p].phys.laserCombo = false;
        }
      }
      if (player[p].timer == 9){
        sounds.foxlasercock.play();
      }
      if (player[p].timer == 12){
        sounds.foxlaserfire.play();
        // laser instance
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+7),player[p].phys.face);
        articles[0].init(p,0);
      }
      if (player[p].timer == 37){
        sounds.foxlaserholster.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][113] = {
  name : "JAB3",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 113;
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    turnOffHitboxes(p);
    aS[2][113].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][113].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 6 && player[p].timer < 43 && player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.jabCombo = true;
      }

      if (player[p].timer == 9){
        player[p].hitboxes.id[0] = player[p].charHitboxes.jab3_1.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.jab3_1.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.jab3_1.id2;
      }
      else if (player[p].timer == 16){
        player[p].hitboxes.id[0] = player[p].charHitboxes.jab3_2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.jab3_2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.jab3_2.id2;
      }
      else if (player[p].timer == 23){
        player[p].hitboxes.id[0] = player[p].charHitboxes.jab3_3.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.jab3_3.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.jab3_3.id2;
      }
      else if (player[p].timer == 30){
        player[p].hitboxes.id[0] = player[p].charHitboxes.jab3_4.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.jab3_4.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.jab3_4.id2;
      }
      else if (player[p].timer == 37){
        player[p].hitboxes.id[0] = player[p].charHitboxes.jab3_5.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.jab3_5.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.jab3_5.id2;
      }

      if (player[p].timer > 8 && player[p].timer < 40){
        switch (player[p].timer % 7){
          case 2:
            player[p].hitboxes.active = [true,true,true,false];
            player[p].hitboxes.frame = 0;
            sounds.normalswing2.play();
            break;
          case 3:
            player[p].hitboxes.frame++;
            break;
          case 4:
            turnOffHitboxes(p);
            break;

        }
      }
      if (player[p].timer == 43 && player[p].phys.jabCombo){
        player[p].phys.jabCombo = false;
        player[p].timer = 7;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 51){
      aS[2][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[2][130] = {
  name : "FIREFOXBOUNCE",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  setVelocities : [0.00062,0.00062,0.00062,5.27148,5.4568,2.56,0.0638,0.02712,-0.00286,-0.02613,-0.0427,-0.05257,-0.05573,-1.83217],
  init : function(p){
    player[p].actionState = 130;
    player[p].timer = 0;
    player[p].phys.grounded = false;
    aS[2][130].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[2][130].interrupt(p)){
      if (player[p].phys.cVel.x != 0){
        player[p].phys.cVel.x -= 0.03*player[p].phys.face;
        if (player[p].phys.cVel.x*player[p].phys.face < 0){
          player[p].phys.cVel.x = 0;
        }
      }
      player[p].phys.cVel.y = aS[2][130].setVelocities[player[p].timer-1];
    }
  },
  interrupt : function(p){
    if (player[p].timer > 14){
      if (player[p].phys.grounded){
      }
      else {
        aS[2][14].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}
