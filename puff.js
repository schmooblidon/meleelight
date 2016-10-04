
// JIGGLYPUFF
// ActionStates
aS[1]=[];
aS[1][0] = {
  name : "WAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 0;
    player[p].timer = 1;
    aS[1][0].main(p);
  },
  main : function(p){
    player[p].timer += 1;
    if (!aS[1][0].interrupt(p)){
      reduceByTraction(p,false);
      if (player[p].timer > 464){
        aS[1][0].init(p);
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
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[1][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[1][21].init(p);
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[1][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[1][t[1]].init(p);
      return true;
    }
    else if (checkForSquat(p) && !player[p].inCSS){
      aS[1][16].init(p);
      return true;
    }
    else if (checkForDash(p) && !player[p].inCSS){
      aS[1][1].init(p);
      return true;
    }
    else if (checkForSmashTurn(p) && !player[p].inCSS){
      aS[1][3].init(p);
      return true;
    }
    else if (checkForTiltTurn(p) && !player[p].inCSS){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
      aS[1][4].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 && !player[p].inCSS){
      aS[1][7].init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][1] = {
  name : "DASH",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 1;
    player[p].timer = 0;
    sounds.dash.play();
    aS[1][1].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][1].interrupt(p)){
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
      aS[1][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      player[p].phys.cVel.x *= 0.25;
      aS[1][21].init(p);
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      if (player[p].timer < 4 && player[p].inputs.lStickAxis[0].x*player[p].phys.face >= 0.8){
        player[p].phys.cVel.x *= 0.25;
        aS[1][57].init(p);
      }
      else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
        aS[1][73].init(p);
      }
      else {
        aS[1][55].init(p);
      }
      return true;
    }
    else if (checkForJump(p)){
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      if (player[p].phys.grounded){
        aS[1][56].init(p);
      }
      else {
        aS[1][103].init(p);
      }
      return true;
    }
    else if (player[p].timer > 4 && checkForSmashTurn(p)){
      player[p].phys.cVel.x *= 0.25;
      aS[1][3].init(p);
      return true;
    }
    else if (player[p].timer > 20 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].inputs.lStickAxis[2].x * player[p].phys.face < 0.3){
      aS[1][1].init(p);
      return true;
    }
    else if (player[p].timer > 12 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.62){
      aS[1][2].init(p);
      return true;
    }
    else if (player[p].timer > 23){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][2] = {
  name : "RUN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 2;
    player[p].timer = 1;
    aS[1][2].main(p);
  },
  main : function(p){
    if (player[p].timer > 16){
      player[p].timer = 1;
    }
    if (!aS[1][2].interrupt(p)){
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
      if ((footstep[0] && player[p].timer >= 2) || (footstep[1] && player[p].timer >= 10)){
        sounds.footstep.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
        aS[1][73].init(p);
      }
      else {
        aS[1][55].init(p);
      }
      return true;
    }
    else if (checkForJump(p)){
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      if (player[p].phys.grounded){
        aS[1][56].init(p);
      }
      else {
        aS[1][103].init(p);
      }
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[1][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[1][21].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) < 0.62){
      aS[1][5].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
      aS[1][6].init(p);
      return true;
    }
  }
}

aS[1][3] = {
  name : "SMASHTURN",
  canEdgeCancel : true,
  reverseModel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 3;
    player[p].timer = 0;
    player[p].phys.face *= -1;
    aS[1][3].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][3].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (checkForJump(p)){
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      if (player[p].phys.grounded){
        aS[1][56].init(p);
      }
      else {
        aS[1][103].init(p);
      }
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[1][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[1][21].init(p);
      return true;
    }
    else if (s[0]){
      aS[1][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[1][t[1]].init(p);
    }
    else if (player[p].timer == 2 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79){
      aS[1][1].init(p);
      return true;
    }
    else if (player[p].timer > 11){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][4] = {
  name : "TILTTURN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 4;
    player[p].timer = 0;
    aS[1][4].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 6){
      player[p].phys.face *= -1;
    }
    if (!aS[1][4].interrupt(p)){
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
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      if (player[p].phys.grounded){
        aS[1][56].init(p);
      }
      else {
        aS[1][103].init(p);
      }
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[1][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[1][21].init(p);
      return true;
    }
    else if (s[0]){
      aS[1][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      if (player[p].timer < 6){
        player[p].phys.face *= -1;
      }
      aS[1][t[1]].init(p);
    }
    else if (player[p].timer > 11){
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].timer == 6 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].phys.dashbuffer){
      aS[1][1].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][5] = {
  name : "RUNBRAKE",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 5;
    player[p].timer = 0;
    sounds.runbrake.play();
    aS[1][5].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][5].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (checkForJump(p)){
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].timer > 1 && checkForSquat(p)){
      aS[1][16].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
      aS[1][6].init(p);
      return true;
    }
    else if (player[p].timer > 19){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][6] = {
  name : "RUNTURN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  reverseModelFrame : 16,
  init : function(p){
    player[p].actionState = 6;
    player[p].timer = 0;
    aS[1][6].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][6].interrupt(p)){
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
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].timer > 25){
      if(player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.6){
        aS[1][2].init(p);
      }
      else {
        aS[1][0].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][7] = {
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
    aS[1][7].main(p);
  },
  main : function(p){

    if (!aS[1][7].interrupt(p)){
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
    if (player[p].timer > 45){
      aS[1][7].init(p,false);
      return true;
    }
    if (player[p].inputs.lStickAxis[0].x == 0){
      aS[1][0].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[1][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[1][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[1][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[1][t[1]].init(p);
      return true;
    }
    else if (checkForSquat(p)){
      aS[1][16].init(p);
      return true;
    }
    else if (checkForDash(p)){
      aS[1][1].init(p);
      return true;
    }
    else if (checkForSmashTurn(p)){
      aS[1][3].init(p);
      return true;
    }
    else if (checkForTiltTurn(p)){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
      aS[1][4].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][8] = {
  name : "KNEEBEND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 8;
    player[p].timer = 0;
    player[p].phys.jumpType = 1;
    aS[1][8].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][8].interrupt(p)){
      reduceByTraction(p,true);
      if (!player[p].inputs.x[0] && !player[p].inputs.y[0] && player[p].inputs.lStickAxis[0].y < 0.67){
        player[p].phys.jumpType = 0;
      }
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    if (player[p].timer == 5){
      // so they can be detected as above current surface instantly
      player[p].phys.pos.y += 0.001;
    }
    if (player[p].timer > 5){
      if (player[p].inputs.lStickAxis[2].x * player[p].phys.face >= -0.3){
        aS[1][9].init(p,player[p].phys.jumpType);
      }
      else {
        aS[1][15].init(p,player[p].phys.jumpType);
      }
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1] && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      aS[1][73].init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1] && player[p].inputs.lStickAxis[0].y >= 0.8 && player[p].inputs.lStickAxis[3].y < 0.3) || (player[p].inputs.cStickAxis[0].y >= 0.8 && player[p].inputs.cStickAxis[3].y < 0.3)){
      aS[1][58].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][9] = {
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

    player[p].phys.cVel.x = (player[p].phys.cVel.x * player[p].charAttributes.groundToAir) + (player[p].inputs.lStickAxis[0].x * player[p].charAttributes.jumpHmaxV);
    if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.jumpHmaxV){
      player[p].phys.cVel.x = player[p].charAttributes.jumpHmaxV * Math.sign(player[p].phys.cVel.x);
    }

    player[p].phys.grounded = false;
    sounds.jump2.play();
    aS[1][9].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][9].interrupt(p)){
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
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
      aS[1][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 52){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][10] = {
  name : "LANDING",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 10;
    player[p].timer = 0;
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[1][10].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][10].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 4 && player[p].timer <= 30){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[1][8].init(p);
        return true;
      }
      else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
        aS[1][21].init(p);
        return true;
      }
      else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
        aS[1][21].init(p);
        return true;
      }
      else if (b[0]){
        aS[1][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[1][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[1][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[1][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[1][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[1][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[1][7].init(p,true);
        return true;
      }
      else if (player[p].timer == 5 && player[p].inputs.lStickAxis[0].y < -0.5){
        aS[1][17].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 30){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][11] = {
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
    aS[1][11].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][11].interrupt(p)){
      if (player[p].timer < 30){
        player[p].phys.cVel.x *= 0.9;
        player[p].phys.cVel.y *= 0.9;
      }
      else {
        airDrift(p);
        fastfall(p);
      }
      if (player[p].timer == 4){
        player[p].phys.intangibleTimer = 25;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[1][14].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][12] = {
  name : "LANDINGFALLSPECIAL",
  canEdgeCancel : true,
  canGrabLedge : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 12;
    player[p].timer = 0;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[1][12].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingMultiplier;
    if (!aS[1][12].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][13] = {
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
    aS[1][13].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][13].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
      aS[1][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 8){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][14] = {
  name : "FALLSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 14;
    player[p].timer = 0;
    aS[1][14].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][14].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 8){
      aS[1][14].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][15] = {
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

    player[p].phys.cVel.x = (player[p].phys.cVel.x * player[p].charAttributes.groundToAir) + (player[p].inputs.lStickAxis[0].x * player[p].charAttributes.jumpHmaxV);
    if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.jumpHmaxV){
      player[p].phys.cVel.x = player[p].charAttributes.jumpHmaxV * Math.sign(player[p].phys.cVel.x);
    }

    player[p].phys.grounded = false;
    sounds.jump2.play();
    aS[1][15].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][15].interrupt(p)){
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
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
      aS[1][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 52){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][16] = {
  name : "SQUAT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 16;
    player[p].timer = 0;
    aS[1][16].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][16].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (player[p].timer == 4 && (player[p].inputs.lStickAxis[0].y < -0.65 || player[p].inputs.lStickAxis[1].y < -0.65 || player[p].inputs.lStickAxis[2].y < -0.65) && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
      aS[1][20].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[1][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[1][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[1][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[1][t[1]].init(p);
      return true;
    }
    else if (player[p].timer > 7){
      aS[1][17].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[1][8].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][17] = {
  name : "SQUATWAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 17;
    player[p].timer = 0;
    aS[1][17].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][17].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (player[p].inputs.lStickAxis[0].y > -0.61){
      aS[1][18].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[1][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[1][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[1][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[1][t[1]].init(p);
      return true;
    }
    else if (checkForDash(p)){
      aS[1][1].init(p);
      return true;
    }
    else if (checkForSmashTurn(p)){
      aS[1][3].init(p);
      return true;
    }
    else if (player[p].timer > 40){
      aS[1][17].init(p);
    }
    else {
      return false;
    }
  }
}

aS[1][18] = {
  name : "SQUATRV",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 18;
    player[p].timer = 0;
    aS[1][18].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][18].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (player[p].timer > 10){
      aS[1][0].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[1][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[1][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[1][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[1][t[1]].init(p);
      return true;
    }
    /*else if (checkForDash(p)){
      aS[1][1].init(p);
      return true;
    }*/
    else if (checkForSmashTurn(p)){
      aS[1][3].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
      aS[1][7].init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][19] = {
  name : "JUMPAERIALF",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    puffNextJump(p);
    /*player[p].actionState = 19;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;

    player[p].phys.cVel.y = player[p].charAttributes.fHopInitV * player[p].charAttributes.djMultiplier;

    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 1);
    drawVfx("doubleJumpRings",player[p].phys.pos,player[p].phys.face);
    sounds.jump2.play();
    aS[1][19].main(p);*/

  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][19].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 50){
      aS[1][32].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][20] = {
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
    aS[1][20].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer > 1){
      if (!aS[1][20].interrupt(p)){
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
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
      aS[1][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 30){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][21] = {
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
    aS[1][21].main(p);
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
      if (!aS[1][21].interrupt(p)){
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
        aS[1][8].init(p);
        return true;
      }
      else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.shielding = false;
        aS[1][73].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[4].y > -0.3) || player[p].inputs.cStickAxis[0].y < -0.7){
        player[p].phys.shielding = false;
        aS[1][54].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face < 0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        aS[1][53].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face > -0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        aS[1][52].init(p);
        return true;
      }
      else if (player[p].timer > 1 && player[p].inputs.lStickAxis[0].y < -0.65 && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        aS[1][20].init(p);
        return true;
      }
      else if (player[p].timer > 8){
        aS[1][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].timer > 8){
        aS[1][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
  }
}

aS[1][22] = {
  name : "GUARD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 22;
    player[p].timer = 0;
    player[p].phys.powerShieldActive = false;
    aS[1][22].main(p);
  },
  main : function(p){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true);
    }
    else {
      player[p].timer++;
      if (!aS[1][22].interrupt(p)){
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
        aS[1][8].init(p);
        return true;
      }
      else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.shielding = false;
        aS[1][73].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[4].y > -0.3) || player[p].inputs.cStickAxis[0].y < -0.7){
        player[p].phys.shielding = false;
        aS[1][54].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face < 0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        aS[1][53].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face > -0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        aS[1][52].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.65 && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        aS[1][20].init(p);
        return true;
      }
      else if (player[p].inputs.lAnalog[0] < 0.3 && player[p].inputs.rAnalog[0] < 0.3){
        player[p].phys.shielding = false;
        aS[1][23].init(p);
        return true;
      }
      else if (player[p].timer > 1){
        aS[1][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].inputs.lAnalog[0] < 0.3 && player[p].inputs.rAnalog[0] < 0.3){
        player[p].phys.shielding = false;
        aS[1][23].init(p);
        return true;
      }
      else if (player[p].timer > 1){
        aS[1][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
  }
}

aS[1][23] = {
  name : "GUARDOFF",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 23;
    player[p].timer = 0;
    sounds.shieldoff.play();
    aS[1][23].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][23].interrupt(p)){
      reduceByTraction(p,false);
      //shieldDepletion(p);
      //shieldSize(p);
    }
  },
  interrupt : function(p){
    if (checkForJump(p) && !player[p].inCSS){
      aS[1][8].init(p);
      return true;
    }
    else if (player[p].timer > 14){
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].phys.powerShielded){
      if (!player[p].inCSS){
        var t = checkForTilts(p);
        var s = checkForSmashes(p);
        if (s[0]){
          aS[1][s[1]].init(p);
          return true;
        }
        else if (t[0]){
          aS[1][t[1]].init(p);
          return true;
        }
        else if (checkForSquat(p)){
          aS[1][16].init(p);
          return true;
        }
        else if (checkForDash(p)){
          aS[1][1].init(p);
          return true;
        }
        else if (checkForSmashTurn(p)){
          aS[1][3].init(p);
          return true;
        }
        else if (checkForTiltTurn(p)){
          player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
          aS[1][4].init(p);
          return true;
        }
        else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
          aS[1][7].init(p,true);
          return true;
        }
        else {
          return false;
        }
      }
      else {
        var s = checkForSmashes(p);
        if (s[0]){
          aS[1][s[1]].init(p);
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

aS[1][24] = {
  name : "CLIFFCATCH",
  canGrabLedge : false,
  canBeGrabbed : false,
  posOffset : [[-5.889,-8.13664],[-5.53011,-8.48632],[-5.14061,-8.90368],[-4.82807,-9.25336],[-4.7,-9.4],[-4.7,-9.4],[-4.7,-9.4]],
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
    drawVfx("cliffcatchspark",new Vec2D(stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x,stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y),player[p].phys.face);
    sounds.puffshout5.play();
    sounds.puffledgegrab.play();
    aS[1][24].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][24].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      player[p].phys.pos = new Vec2D(x+aS[1][24].posOffset[player[p].timer-1][0]*player[p].phys.face,y+aS[1][24].posOffset[player[p].timer-1][1]);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 7){
      aS[1][25].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][25] = {
  name : "CLIFFWAIT",
  canGrabLedge : false,
  canBeGrabbed : false,
  posOffset : [-73.1,-9.4],
  init : function(p){
    player[p].actionState = 25;
    player[p].timer = 0;
    aS[1][25].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][25].interrupt(p)){
      player[p].phys.ledgeHangTimer++;
    }
  },
  interrupt : function(p){
    if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.2 || player[p].inputs.lStickAxis[0].y < -0.2 || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.2 || player[p].inputs.cStickAxis[0].y < -0.2){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[1][13].init(p);
      return true;
    }
    else if (player[p].inputs.x[0] || player[p].inputs.y[0] || player[p].inputs.lStickAxis[0].y > 0.65 ){
      if (player[p].percent < 100){
        aS[1][101].init(p);
      }
      else {
        aS[1][102].init(p);
      }
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.2 || player[p].inputs.lStickAxis[0].y > 0.2){
      if (player[p].percent < 100){
        aS[1][95].init(p);
      }
      else {
        aS[1][96].init(p);
      }
      return true;
    }
    else if (player[p].inputs.a[0] || player[p].inputs.b[0] || player[p].inputs.cStickAxis[0].y > 0.65){
      if (player[p].percent < 100){
        aS[1][100].init(p);
      }
      else {
        aS[1][99].init(p);
      }
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0] || player[p].inputs.lAnalog[0] > 0.3 || player[p].inputs.rAnalog[0] > 0.3 || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.8){
      if (player[p].percent < 100){
        aS[1][97].init(p);
      }
      else {
        aS[1][98].init(p);
      }
      return true;
    }
    else if (player[p].phys.ledgeHangTimer > 600){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[1][40].init(p);
      return true;
    }
    else if (player[p].timer > 60){
      aS[1][25].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][26] = {
  name : "DEADLEFT",
  canBeGrabbed : false,
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
    sounds.puffdeath.play();
    aS[1][26].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][26].interrupt(p)){
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
        aS[1][30].init(p);
      }
      else {
        aS[1][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][27] = {
  name : "DEADRIGHT",
  canBeGrabbed : false,
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
    sounds.puffdeath.play();
    aS[1][27].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][27].interrupt(p)){
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
        aS[1][30].init(p);
      }
      else {
        aS[1][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][28] = {
  name : "DEADUP",
  canBeGrabbed : false,
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
    sounds.puffdeath.play();
    aS[1][28].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][28].interrupt(p)){
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
        aS[1][30].init(p);
      }
      else {
        aS[1][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][29] = {
  name : "DEADDOWN",
  canBeGrabbed : false,
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
    sounds.puffdeath.play();
    aS[1][29].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][29].interrupt(p)){
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
        aS[1][30].init(p);
      }
      else {
        aS[1][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][30] = {
  name : "REBIRTH",
  canBeGrabbed : false,
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
    if (!aS[1][30].interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].timer > 90){
      aS[1][31].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][31] = {
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
    if (!aS[1][31].interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].timer > 464){
      aS[1][31].init(p);
      return true;
    }
    else if (player[p].spawnWaitTime > 300){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      aS[1][13].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 || Math.abs(player[p].inputs.lStickAxis[0].y) > 0.3 ){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][32] = {
  name : "FALLAERIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 32;
    player[p].timer = 0;
    aS[1][32].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][32].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
      aS[1][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 8){
      aS[1][32].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][33] = {
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
    aS[1][33].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][33].interrupt(p)){
      fastfall(p);
      airDrift(p);

      if (player[p].timer == 7){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.normalswing2.play();
        //needs normalswing3
      }
      if (player[p].timer == 8){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 9){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fair2.id1;
      }
      if (player[p].timer > 9 && player[p].timer < 23){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 23){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 35){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[1][13].init(p);
      return true;
    }
    else if (player[p].timer > 34){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
        aS[1][19].init(p);
        return true;
      }
      else if (a[0]){
        aS[1][a[1]].init(p);
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

aS[1][34] = {
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
    player[p].hitboxes.id[0] = player[p].charHitboxes.bair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.bair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.bair.id2;
    aS[1][34].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][34].interrupt(p)){
      fastfall(p);
      airDrift(p);

      if (player[p].timer == 8){
        player[p].phys.autocancel = false;
      }
      if (player[p].timer == 9){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing1.play();
      }
      if (player[p].timer > 9 && player[p].timer < 13){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 13){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 26){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[1][13].init(p);
      return true;
    }
    else if (player[p].timer > 30){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
        aS[1][19].init(p);
        return true;
      }
      else if (a[0]){
        aS[1][a[1]].init(p);
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

aS[1][35] = {
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
    player[p].hitboxes.id[0] = player[p].charHitboxes.upair.id0;
    aS[1][35].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][35].interrupt(p)){
      fastfall(p);
      airDrift(p);

      if (player[p].timer == 9){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.normalswing2.play();
        // needs normalswing3
      }
      if (player[p].timer > 9 && player[p].timer < 13){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 13){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 38){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[1][13].init(p);
      return true;
    }
    else if (player[p].timer > 37){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
        aS[1][19].init(p);
        return true;
      }
      else if (a[0]){
        aS[1][a[1]].init(p);
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

aS[1][36] = {
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
    player[p].hitboxes.id[2] = player[p].charHitboxes.dair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dair.id3;
    aS[1][36].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][36].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer == 4){
        player[p].phys.autoCancel = false;
      }

      if (player[p].timer > 4 && player[p].timer < 29){
        switch (player[p].timer % 3){
          case 2:
            player[p].hitboxes.active = [true,true,true,true];
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

      if (player[p].timer == 40){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][37] = {
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
    aS[1][37].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][37].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer == 5){
        player[p].phys.autoCancel = false;
      }

      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.normalswing2.play();
        // needs normalswing3
      }
      if (player[p].timer == 7){
        player[p].hitboxes.frames++;
      }
      if (player[p].timer == 8){
        player[p].hitboxes.id[0] = player[p].charHitboxes.nair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.nair2.id1;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 8 && player[p].timer < 29){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 29){
        turnOffHitboxes(p);
      }

      if (player[p].timer == 30){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][38] = {
  name : "UPSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,true],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 38;
    player[p].timer = 0;
    if (player[p].phys.grounded){
      if (player[p].phys.cVel.x > 0){
        player[p].phys.cVel.x -= 0.1;
      }
      if (player[p].phys.cVel.x < 0){
        player[p].phys.cVel.x += 0.1;
      }
    }
    else {
      player[p].phys.fastfalled = false;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upb1.id0;
    aS[1][38].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][38].interrupt(p)){
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
        player[p].phys.cVel.y -= player[p].charAttributes.gravity;
        if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
          player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
        }
      }
      if (player[p].timer == 18){
        sounds.sing1.play();
      }
      if (player[p].timer == 69){
        sounds.sing2.play();
      }
      if (player[p].timer == 28){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 28 && player[p].timer < 36){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 36){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 69){
        player[p].hitboxes.id[0] = player[p].charHitboxes.upb2.id0;
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 69 && player[p].timer < 77){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 77){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 113){
        player[p].hitboxes.id[0] = player[p].charHitboxes.upb3.id0;
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 113 && player[p].timer < 126){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 126){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 179){
      if (player[p].phys.grounded){
        aS[1][0].init(p);
      }
      else {
        aS[1][14].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][39] = {
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
    if (drawStuff){
      // drawVfx("hitSparks",player[p].hit.hitPoint,player[p].phys.face);
      // drawVfx("hitFlair",player[p].hit.hitPoint,player[p].phys.face);
      // drawVfx("hitCurve",player[p].hit.hitPoint,player[p].phys.face,player[p].hit.angle);
    }
    player[p].hitboxes.id[0] = player[p].charHitboxes.thrown.id0;
    /*player[p].phys.grounded = false;
    player[p].phys.pos.y += 0.0001;*/
    turnOffHitboxes(p);
    aS[1][39].main(p);
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
    if (player[p].timer < 60){
      player[p].timer++;
    }
    if (player[p].hit.hitstun % 10 == 0){
      drawVfx("flyingDust",player[p].phys.pos);
    }
    if (!aS[1][39].interrupt(p)){
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
      aS[1][40].init(p);
      player[p].phys.thrownHitbox = false;
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][40] = {
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
    aS[1][40].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][40].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
      aS[1][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x > 0.7 && player[p].inputs.lStickAxis[1].x < 0.7) || (player[p].inputs.lStickAxis[0].x < -0.7 && player[p].inputs.lStickAxis[1].x > -0.7) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) || (player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y > -0.7)){
      aS[1][13].init(p);
      return true;
    }
    else if (player[p].timer > 30){
      aS[1][40].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][41] = {
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
    turnOffHitboxes(p);
    // drawVfx("hitSparks",player[p].hit.hitPoint,player[p].phys.face);
    // drawVfx("hitFlair",player[p].hit.hitPoint,player[p].phys.face);
    // drawVfx("hitCurve",player[p].hit.hitPoint,player[p].phys.face,player[p].hit.angle);
    aS[1][41].main(p);
  },
  main : function(p){
    if (player[p].inCSS){
      player[p].timer+= 0.7;
    }
    else {
      player[p].timer++;
    }
    if (!aS[1][41].interrupt(p)){
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
    if (player[p].timer > 11){
      if (player[p].phys.grounded || player[p].inCSS){
        aS[1][0].init(p);
      }
      else {
        aS[1][13].init(p);
      }
      return true;
    }
    else if (player[p].hit.hitstun <= 0 && !player[p].inCSS){
      if (player[p].phys.grounded){
        var b = checkForSpecials(p);
        var t = checkForTilts(p);
        var s = checkForSmashes(p);
        if (checkForJump(p)){
          aS[1][8].init(p);
          return true;
        }
        else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
          aS[1][21].init(p);
          return true;
        }
        else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
          aS[1][21].init(p);
          return true;
        }
        else if (b[0]){
          aS[1][b[1]].init(p);
          return true;
        }
        else if (s[0]){
          aS[1][s[1]].init(p);
          return true;
        }
        else if (t[0]){
          aS[1][t[1]].init(p);
          return true;
        }
        else if (checkForSquat(p)){
          aS[1][16].init(p);
          return true;
        }
        else if (checkForDash(p)){
          aS[1][1].init(p);
          return true;
        }
        else if (checkForSmashTurn(p)){
          aS[1][3].init(p);
          return true;
        }
        else if (checkForTiltTurn(p)){
          player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
          aS[1][4].init(p);
          return true;
        }
        else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
          aS[1][7].init(p,true);
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
          aS[1][a[1]].init(p);
          return true;
        }
        else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
          aS[1][11].init(p);
          return true;
        }
        else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
          aS[1][19].init(p);
          return true;
        }
        else if (b[0]){
          aS[1][b[1]].init(p);
          return true;
        }
        else if ((player[p].inputs.lStickAxis[0].x > 0.7 && player[p].inputs.lStickAxis[1].x < 0.7) || (player[p].inputs.lStickAxis[0].x < -0.7 && player[p].inputs.lStickAxis[1].x > -0.7) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) || (player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y > -0.7)){
          aS[1][13].init(p);
          return true;
        }
        else if (player[p].timer > 30){
          aS[1][40].init(p);
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

aS[1][42] = {
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
    aS[1][42].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[1][42].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 20){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][43] = {
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
    aS[1][43].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[1][43].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 20){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][44] = {
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
    aS[1][44].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[1][44].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 20){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][45] = {
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
    aS[1][45].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[1][45].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][46] = {
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
    aS[1][46].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[1][46].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 20){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][47] = {
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
    aS[1][47].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][47].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 10){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer > 10 && player[p].timer < 13){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 13){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[1][17].init(p);
      return true;
    }
    else if (player[p].timer > 29){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[1][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[1][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[1][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[1][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[1][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[1][3].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[1][4].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        aS[1][7].init(p,true);
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

aS[1][48] = {
  name : "UPTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 48;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt1.id1;
    aS[1][48].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][48].interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer == 8){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer == 9){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 10){
        player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt2.id1;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 10 && player[p].timer < 15){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 15){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 23){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][49] = {
  name : "FTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 49;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ftilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ftilt.id1;
    aS[1][49].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][49].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer > 6 && player[p].timer < 10){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 10){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 27){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][50] = {
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
    player[p].hitboxes.id[2] = player[p].charHitboxes.jab1.id2;
    aS[1][50].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][50].interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer > 2 && player[p].timer < 26 && player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.jabCombo = true;
      }
      if (player[p].timer == 5){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer > 5 && player[p].timer < 7){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 7){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 7 && player[p].phys.jabCombo){
      aS[1][51].init(p);
      return true;
    }
    else if (player[p].timer > 17){
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].timer > 15){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[1][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[1][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[1][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[1][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[1][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[1][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[1][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[1][7].init(p,true);
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

aS[1][51] = {
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
    player[p].hitboxes.id[2] = player[p].charHitboxes.jab2.id2;
    aS[1][51].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][51].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer > 6 && player[p].timer < 8){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 8){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 20){
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].timer > 16){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[1][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[1][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[1][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[1][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[1][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[1][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[1][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[1][7].init(p,true);
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

aS[1][52] = {
  name : "ESCAPEB",
  setVelocities : [0,0,0,0,-0.18636,-0.53714,-0.85504,-1.14006,-1.39219,-1.61143,-1.79778,-1.90176,-1.87565,-1.74509,-1.51009,-1.17065,-0.72676,-0.60977,-0.87285,-1.11128,-1.32504,-1.51414,-1.67857,-1.81834,-1.79778,-1.61143,-1.39219,-1.14006,-0.85504,-0.53714,-0.18636,0.00168,0.0028,0.00056],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 52;
    player[p].timer = 0;
    player[p].phys.shielding = false;
    aS[1][52].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][52].interrupt(p)){
      player[p].phys.cVel.x = aS[1][52].setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer == 4){
        player[p].phys.intangibleTimer = 16;
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 34){
      player[p].phys.cVel.x = 0;
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][53] = {
  name : "ESCAPEF",
  setVelocities : [0,0,0,0,0,0.48128,1.26336,1.77472,2.01536,1.98528,1.81834,1.67857,1.51414,1.32504,1.11128,0.87286,0.60977,0.60977,0.87285,1.11128,1.32504,1.51414,1.67857,1.81834,1.79778,1.61143,1.39219,1.14006,0.85504,0.53714,0.18636,0.00092,0.00154,0.00031],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 53;
    player[p].timer = 0;
    player[p].phys.shielding = false;
    aS[1][53].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][53].interrupt(p)){
      player[p].phys.cVel.x = aS[1][53].setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer == 2){
        player[p].phys.intangibleTimer = 17;
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 34){
      player[p].phys.cVel.x = 0;
      player[p].phys.face *= -1;
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][54] = {
  name : "ESCAPEN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 54;
    player[p].timer = 0;
    player[p].phys.shielding = false;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    aS[1][54].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][54].interrupt(p)){
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
    if (player[p].timer > 27){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][55] = {
  name : "ATTACKDASH",
  canEdgeCancel : false,
  setVelocities : [0.99874,1.82126,2.22815,2.43704,1.91481,1.39379,1.36213,1.33162,1.30228,1.27408,1.24704,1.22115,1.19642,1.17284,1.15042,1.12915,1.10902,1.09006,1.06475,1.01691,0.94598,0.85192,0.73477,0.59452,0.43115,0.32167,0.28310,0.24695,0.21323,0.18194,0.15309,0.12666,0.10266,0.08109,0.06194,0.04524,0.03096,0.0191,0.00968],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 55;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack1.id0;
    aS[1][55].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][55].interrupt(p)){
      player[p].phys.cVel.x = aS[1][55].setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer == 4){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing1.play();
      }
      if (player[p].timer > 4 && player[p].timer < 15){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 9){
        player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack2.id0;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 15){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].timer < 5 && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      if (player[p].phys.cVel.x*player[p].phys.face > player[p].charAttributes.dMaxV){
        player[p].phys.cVel.x = player[p].charAttributes.dMaxV*player[p].phys.face;
      }
      aS[1][73].init(p);
      return true;
    }
    else if (player[p].timer > 38){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[1][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[1][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[1][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[1][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[1][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[1][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[1][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[1][7].init(p,true);
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

aS[1][56] = {
  name : "SIDESPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  groundVelocities : [1.88,1.50792,1.31208,1.14561,0.73439,0.34986,0.34461,0.33943,0.33430,0.32924,0.32424,0.31930,0.31443,0.30961,0.30486,0.30017,0.29554,0.29097,0.28647,0.28202,0.27764,0.27332,0.26906,0.26487,0.26074,0.25666,0.25265,0.23230,0.19657,0.16230,0.12950,0.09816,0.06830,0.03990],
  airVelocities : [2.024,1.86208,1.71311,1.57606,1.44998,1.33398,1.22726,1.12908,1.03876,0.95565,0.87920,0.80887,0.74416,0.68462,0.62985,0.57947,0.53311,0.49046,0.45122,0.41513,0.38192,0.35136,0.32325,0.29739,0.27360,0.25171,0.23158,0.21305],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 56;
    player[p].timer = 0;
    if (player[p].phys.grounded){
      player[p].phys.cVel.x = 0;
    }
    else {
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.sidespecial.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.sidespecial.id1;
    aS[1][56].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][56].interrupt(p)){

      if (player[p].phys.grounded){
        if (player[p].timer > 11){
          player[p].phys.cVel.x = aS[1][56].groundVelocities[player[p].timer-12]*player[p].phys.face;
        }
      }
      else {
        if (player[p].timer == 12){
          player[p].phys.fastfalled = false;
          player[p].phys.upbAngleMultiplier = player[p].inputs.lStickAxis[0].y * Math.PI*(20/180);
           //decide angle
           //max 20 degrees
          player[p].phys.cVel.y = 0;
        }
        if (player[p].timer < 12){
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
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
        }
        else if (player[p].timer > 11 && player[p].timer < 40){
          player[p].phys.cVel.x = aS[1][56].airVelocities[player[p].timer-12]*player[p].phys.face*Math.cos(player[p].phys.upbAngleMultiplier);
          player[p].phys.cVel.y = aS[1][56].airVelocities[player[p].timer-12]*Math.sin(player[p].phys.upbAngleMultiplier);
        }
        else {
          airDrift(p);
          fastfall(p);
        }
      }

      if (player[p].timer == 12){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.puffshout1.play();
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
    if (player[p].timer > 45){
      if (player[p].phys.grounded){
        aS[1][0].init(p);
      }
      else {
        aS[1][13].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][57] = {
  name : "FSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [0,0,0,0,0,0.33572,0.87287,1.20857,1.34283,1.91688,2.27501,1.44811,0.63219,0.61772,0.60393,0.59084,0.57844,0.56672,0.55570,0.54536,0.53572,0.52676,0.51849,0.51092,0.50402,0.49783,0.49232,0.48749,0.48336,0.47992,0.47717,0.47510,0.47373,0.47304,0.47304,0.47374,0.47512,0.47719,0.47995,0.48340,0.48754,0.49237,0.44503,0.30789],
  init : function(p){
    player[p].actionState = 57;
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash1.id1;
    aS[1][57].main(p);
  },
  main : function(p){
    if (player[p].timer == 4){
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
    if (!aS[1][57].interrupt(p)){
      reduceByTraction(p,true);

      player[p].phys.cVel.x = aS[1][57].setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer == 6){
        randomShout(cS[p]);
      }

      if (player[p].timer == 12){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing1.play();
      }
      if (player[p].timer > 12 && player[p].timer < 21){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 16){
        player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash2.id1;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 21){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 44){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][58] = {
  name : "UPSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 58;
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upsmash.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upsmash.id1;
    randomShout(cS[p]);
    aS[1][58].main(p);
  },
  main : function(p){
    if (player[p].timer == 5){
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
    if (!aS[1][58].interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer == 7){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing1.play();

      }
      if (player[p].timer > 7 && player[p].timer < 11){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 11){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 54){
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].timer > 44 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[1][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[1][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[1][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[1][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[1][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[1][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[1][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[1][7].init(p,true);
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

aS[1][59] = {
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
    randomShout(cS[p]);
    aS[1][59].main(p);
  },
  main : function(p){
    if (player[p].timer == 5){
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
    if (!aS[1][59].interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer == 9){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.normalswing1.play();
      }
      if (player[p].timer > 9 && player[p].timer < 11){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 11){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 54){
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].timer > 47 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[1][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[1][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[1][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[1][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[1][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[1][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[1][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[1][7].init(p,true);
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

aS[1][60] = {
  name : "DOWNBOUND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 60;
    player[p].timer = 0;
    player[p].phys.kVel.y = 0;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    aS[1][60].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][60].interrupt(p)){
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
      aS[1][61].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][61] = {
  name : "DOWNWAIT",
  canEdgeCancel : true,
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 61;
    player[p].timer = 0;
    aS[1][61].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][61].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 59){
      aS[1][61].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7){
      aS[1][63].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7){
      aS[1][64].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].y > 0.7){
      aS[1][62].init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1])){
      aS[1][65].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][62] = {
  name : "DOWNSTANDN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 62;
    player[p].timer = 0;
    aS[1][62].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][62].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 23;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][63] = {
  name : "DOWNSTANDB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  //setVelocities : [-0.016,-0.109,-0.208,-0.314,-0.427,-0.547,-0.673,-0.806,-0.946,-1.093,-1.246,-1.407,-1.574,-1.747,-1.928,-2.084,-2.178,-2.224,-2.221,-2.170,-2.070,-1.921,-1.724,-1.479,-1.184,-0.889,-0.649,-0.443,-0.272,-0.135,-0.033,0.034,0.074,0,0],
  setVelocities : [-0.06932,-0.07344,-0.07718,-0.08053,-0.08348,-0.08605,-0.17622,-0.34650,-0.50517,-0.65224,-0.78769,-0.91154,-1.02377,-1.1244,-1.21342,-1.29083,-1.35662,-1.41081,-1.4534,-1.48436,-1.50373,-1.51148,-1.50762,-1.49216,-1.46508,-1.42639,-1.37611,-1.31420,-1.24069,-1.15557,0,0,0,0,0],
  init : function(p){
    player[p].actionState = 63;
    player[p].timer = 0;
    aS[1][63].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][63].interrupt(p)){
      player[p].phys.cVel.x = aS[1][63].setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 20;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 35){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][64] = {
  name : "DOWNSTANDF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  //setVelocities : [0.236,1.175,1.956,1.952,1.940,1.920,1.892,1.857,1.814,1.763,1.704,1.638,1.564,1.482,1.392,1.295,1.190,1.077,0.956,0.827,0.744,0.713,0.686,0.661,0.640,0.622,0.607,0.596,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001],
  setVelocities : [0.01598,0.00249,-0.00243,0.00123,0.01347,0.0343,0.0637,0.10167,0.2669,0.53622,0.7794,0.99642,1.1873,1.35203,1.49061,1.60305,1.68934,1.74948,1.78347,1.79132,1.77302,1.72857,1.65796,1.56122,1.43833,1.28929,1.11411,0.91276,0.68529,0.43165,0.15188,0.00338,0.00283,0.00114,-0.00169],
  init : function(p){
    player[p].actionState = 64;
    player[p].timer = 0;
    aS[1][64].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][64].interrupt(p)){
      player[p].phys.cVel.x = aS[1][64].setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 18;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 35){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][65] = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.downattack1.id3;
    aS[1][65].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][65].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 15
      }
      if (player[p].timer == 20){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 20 && player[p].timer < 24){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 24){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 30){
        player[p].hitboxes.id[0] = player[p].charHitboxes.downattack2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.downattack2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.downattack2.id2;
        player[p].hitboxes.id[3] = player[p].charHitboxes.downattack2.id3;
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 30 && player[p].timer < 32){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 32){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][66] = {
  name : "TECHN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 66;
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[1][66].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][66].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 20
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 26){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][67] = {
  name : "TECHB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [0,0.51119,1.12463,1.12463,0.51119,-1.15217,-2.11948,-2.01629,-2.15974,-2.27333,-2.35708,-2.41098,-2.43502,-2.42922,-2.39356,-2.32805,-2.2327,-2.10749,-1.95244,-1.76753,-1.55278,-1.30817,-1.03371,-0.72941,-0.51981,-0.42778,-0.34013,-0.25689,-0.17805,-0.1036,-0.03356,0.63449,1.17833,0.63449,0,0,0,0,0,0],
  init : function(p){
    player[p].actionState = 67;
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[1][67].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][67].interrupt(p)){
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 20
      }
      player[p].phys.cVel.x = aS[1][67].setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][68] = {
  name : "TECHF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [0,-0.39214,-0.86272,-0.86272,-0.39214,0.75185,1.75788,2.16647,2.43012,2.62609,2.75436,2.81494,2.80783,2.73303,2.59053,2.38034,2.10247,1.7569,1.34363,0.86268,0.31404,0.01548,0.01231,0.00939,0.00673,0.00433,0.00219,0.0003,-0.00133,-0.00270,-0.00382,-0.00467,-0.00527,-0.00562,-0.00570,-0.00553,-0.00510,-0.00442,-0.00347,-0.00277],
  init : function(p){
    player[p].actionState = 68;
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[1][68].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][68].interrupt(p)){
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 20
      }
      player[p].phys.cVel.x = aS[1][68].setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][69] = {
  name : "SHIELDBREAKFALL",
  canPassThrough : false,
  canBeGrabbed : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  init : function(p){
    player[p].actionState = 69;
    player[p].timer = 0;
    player[p].phys.cVel.y = 10;
    aS[1][69].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][69].interrupt(p)){
      player[p].phys.intangibleTimer = 1;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 27){
      aS[1][69].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][70] = {
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
    aS[1][70].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][70].interrupt(p)){
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
      aS[1][71].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][71] = {
  name : "SHIELDBREAKSTAND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 71;
    player[p].timer = 0;
    aS[1][71].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][71].interrupt(p)){
      reduceByTraction(p,true);
      player[p].phys.intangibleTimer = 1;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][72] = {
  name : "FURAFURA",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 72;
    player[p].timer = 0;
    player[p].phys.stuckTimer = 490;
    drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(4+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+11+Math.random()*3),player[p].phys.face);
    player[p].furaLoopID = sounds.furaloop.play();
    aS[1][72].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][72].interrupt(p)){
      if (player[p].timer % 100 == 65){
        sounds.furacry.play();
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
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][73] = {
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
    aS[1][73].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][73].interrupt(p)){
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
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][74] = {
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
    aS[1][74].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][74].interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-16.41205*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 2){
      aS[1][75].init(p);
      aS[1][76].init(player[p].phys.grabbedBy);
      drawVfx("tech",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+10));
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][75] = {
  name : "CAPTUREWAIT",
  canEdgeCancel : false,
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 75;
    player[p].timer = 0;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
    aS[1][75].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][75].interrupt(p)){
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
      aS[1][78].init(player[p].phys.grabbedBy);
      aS[1][77].init(p);
      return true;
    }
    else if (player[p].timer > 130){
      aS[1][75].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][76] = {
  name : "CATCHWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 76;
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[1][76].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][76].interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      aS[1][79].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) || player[p].inputs.cStickAxis[0].y > 0.7){
      aS[1][81].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y > -0.7) || player[p].inputs.cStickAxis[0].y < -0.7){
      aS[1][83].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[1].x*player[p].phys.face > -0.7) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
      aS[1][85].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[1].x*player[p].phys.face < 0.7) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
      aS[1][87].init(p);
      return true;
    }
    else if (player[p].timer > 30){
      aS[1][76].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][77] = {
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
    aS[1][77].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][77].interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.grabTech = false;
      }
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][78] = {
  name : "CATCHCUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 78;
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.cVel.x = -1*player[p].phys.face;
    aS[1][78].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][78].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 29){
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][79] = {
  name : "CATCHATTACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 79;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.pummel.id0;
    aS[1][79].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][79].interrupt(p)){
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
    if (player[p].timer > 30){
      aS[1][76].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][80] = {
  name : "CAPTUREDAMAGE",
  canEdgeCancel : false,
  canBeGrabbed : false,
  setPositions : [9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.306,8.920,8.516,8.290,8.293,8.410,8.593,8.792,8.959,9.043,9.068],
  init : function(p){
    player[p].actionState = 80;
    player[p].timer = 0;
    aS[1][80].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][80].interrupt(p)){
      player[p].phys.pos.x = player[player[p].phys.grabbedBy].phys.pos.x+(-aS[1][80].setPositions[player[p].timer-1]*player[p].phys.face);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 20){
      aS[1][75].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[1][81] = {
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
    aS[1][81].main(p);
  },
  main : function(p){
    player[p].timer+=7/player[p].phys.releaseFrame;
    if (!aS[1][81].interrupt(p)){
      if (Math.floor(player[p].timer) == player[p].phys.releaseFrame){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 41){
      player[p].phys.grabbing = -1;
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      console.log("test");
      aS[1][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][82] = {
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
    aS[1][82].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][82].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[1][82].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[1][82].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[1][83] = {
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
    aS[1][83].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][83].interrupt(p)){
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
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      console.log("test");
      aS[1][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][84] = {
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
    aS[1][84].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][84].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[1][84].offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+aS[1][84].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[1][85] = {
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
    aS[1][85].main(p);
  },
  main : function(p){
    player[p].timer+=(48/43)*(22/player[p].phys.releaseFrame);
    if (!aS[1][85].interrupt(p)){
      if (Math.floor(player[p].timer) > 13 && Math.floor(player[p].timer < 37)){
        player[p].phys.cVel.x = aS[1][85].setVelocities[Math.floor(player[p].timer)-14]*player[p].phys.face;
      }
      if (Math.floor(player[p].timer) == 22){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 43){
      player[p].phys.grabbing = -1;
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      aS[1][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][86] = {
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
    aS[1][86].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][86].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[1][86].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[1][86].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[1][87] = {
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
    aS[1][87].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][87].interrupt(p)){

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
    if (player[p].timer > 35){
      player[p].phys.grabbing = -1;
      aS[1][0].init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      aS[1][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][88] = {
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
    aS[1][88].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][88].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[1][88].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[1][88].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[1][89] = {
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
    aS[1][89].main(p);
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
    if (!aS[1][89].interrupt(p)){
      player[p].hit.hitstun--;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 31){
      aS[1][40].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][90] = {
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
    aS[1][90].main(p);
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
    if (!aS[1][90].interrupt(p)){
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
        aS[1][a[1]].init(p);
        return true;
      }
      else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
        aS[1][11].init(p);
        return true;
      }
      else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
        aS[1][19].init(p);
        return true;
      }
      else if (b[0]){
        aS[1][b[1]].init(p);
        return true;
      }
      else if (player[p].timer > 31){
        aS[1][13].init(p);
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

aS[1][91] = {
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
    player[p].phys.cVel.x = player[p].phys.face * 1.3;
    player[p].phys.cVel.y = 2.4*(Math.pow(0.97,player[p].phys.wallJumpCount));
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
    aS[1][91].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 2){
      sounds.walljump.play();
    }
    if (!aS[1][91].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 1){
      var a = checkForAerials(p);
      var b = checkForSpecials(p);
      if (a[0]){
        aS[1][a[1]].init(p);
        return true;
      }
      else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
        aS[1][11].init(p);
        return true;
      }
      else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
        aS[1][19].init(p);
        return true;
      }
      else if (b[0]){
        aS[1][b[1]].init(p);
        return true;
      }
      else if (player[p].timer > 40){
        aS[1][13].init(p);
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

aS[1][92] = {
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
    aS[1][92].main(p);
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
    if (!aS[1][90].interrupt(p)){
      if (player[p].timer > 0.89 && player[p].timer < 0.91){
        player[p].phys.cVel.x = player[p].phys.face * 1.3;
        player[p].phys.cVel.y = 2.4;
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
        aS[1][a[1]].init(p);
        return true;
      }
      else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
        aS[1][11].init(p);
        return true;
      }
      else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
        aS[1][19].init(p);
        return true;
      }
      else if (b[0]){
        aS[1][b[1]].init(p);
        return true;
      }
      else if (player[p].timer > 45){
        aS[1][13].init(p);
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

aS[1][93] = {
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
    aS[1][93].main(p);
  },
  main : function(p){
  },
  interrupt : function(p){
    return false;
  }
}

aS[1][94] = {
  name : "ENTRANCE",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 94;
    player[p].timer = 0;
    player[p].phys.grounded = false;
    aS[1][94].main(p);
  },
  main : function(p){
    player[p].timer++;
    aS[1][94].interrupt(p);
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      aS[1][13].init(p);
    }
  }
}

aS[1][95] = {
  name : "CLIFFGETUPQUICK",
  canBeGrabbed : true,
  offset : [[-73.32063,-8.97483],[-73.806,-7.875],[-74.29,-6.36],[-74.51,-4.7],[-74.39,-2.91],[-74.06,-1.07],[-73.57,0.48],[-72.954,1.81],[-72.24,3.06],[-71.46,3.99],[-70.68,4.36],[-69.75,3.23],[-68.82,1.13],[-67.98,0],[-67.93,0],[-67.77,0],[-67.54,0],[-67.25,0],[-66.92,0],[-66.57,0],[-66.22,0],[-65.89,0],[-65.6,0],[-65.37,0],[-65.22,0],[-65.16,0],[-65.16,0],[-65.16,0],[-65.16,0],[-65.16,0],[-65.16,0],[-65.16,0],[-65.16,0]],
  init : function(p){
    player[p].actionState = 95;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 30;
    aS[1][95].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][95].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 16){
        player[p].phys.pos = new Vec2D(x+(aS[1][95].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[1][95].offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.pos.x = x+(68.4+aS[1][95].offset[player[p].timer-1][0])*player[p].phys.face;
      }
      if (player[p].timer == 16){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 32){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][96] = {
  name : "CLIFFGETUPSLOW",
  offset : [[-73.10,-9.44],[-73.10,-9.56],[-73.09,-9.71],[-73.09,-9.87],[-73.09,-10.01],[-73.09,-10.12],[-73.09,-10.19],[-73.09,-10.23],[-73.09,-10.24],[-73.09,-10.21],[-73.09,-10.14],[-73.09,-10.04],[-73.09,-9.94],[-73.09,-9.89],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.63],[-73.09,-9.04],[-73.09,-8.28],[-73.09,-7.52],[-73.09,-6.76],[-73.09,-5.93],[-73.09,-5.07],[-73.09,-4.23],[-72.76,-3.35],[-71.98,-2.44],[-71.05,-1.60],[-70.28,-0.94],[-69.68,-0.50],[-69.11,-0.21],[-68.66,-0.05],[-68.14,0]],
  setVelocities : [0.12,0.10,0.08,0.07,0.06,0.05,0.05,0.06,0.07,0.08,0.09,0.12,0.16,0.20,0.23,0.25,0.25,0.24,0.21,0.17,0.12,0.05,0.004],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 96;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 55;
    aS[1][96].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][96].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 34){
        player[p].phys.pos = new Vec2D(x+(aS[1][96].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[1][96].offset[player[p].timer-1][1]);
      }
      else if (player[p].timer < 57){
        player[p].phys.cVel.x = aS[1][96].setVelocities[player[p].timer-34]*player[p].phys.face;
      }
      if (player[p].timer == 34){
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
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][97] = {
  name : "CLIFFESCAPEQUICK",
  offset : [[-74.04,-8.78],[-74.48,-7.21],[-74.42,-5.16],[-74.24,-3.09],[-73.97,-1.28],[-73.59,0.24],[-73.14,1.46],[-72.61,2.35],[-72.01,2.87],[-71.36,3.00],[-70.66,2.72],[-69.93,1.80],[-69.17,0.60],[-67.63,0]],
  setVelocities : [0.64,0.40,0.21,0.08,-0.003,-0.03,0.002,0.09,0.23,0.42,0.67,0.97,1.27,1.52,1.76,1.99,2.21,2.42,2.62,2.81,2.99,3.16,3.32,3.48,0.12,0.33,0.49,0.59,0.65,0.65,0.60,0.49,0.34,0.13,0.002],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 97;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 28;
    aS[1][97].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][97].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 15){
        player[p].phys.pos = new Vec2D(x+(aS[1][97].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[1][97].offset[player[p].timer-1][1]);
      }
      else if (player[p].timer < 50){
        player[p].phys.cVel.x = aS[1][97].setVelocities[player[p].timer-15]*player[p].phys.face;
      }
      if (player[p].timer == 15){
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
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }

}

aS[1][98] = {
  name : "CLIFFESCAPESLOW",
  offset : [[-73.10,-9.44],[-73.09,-9.56],[-73.09,-9.71],[-73.09,-9.87],[-73.09,-10.01],[-73.09,-10.12],[-73.09,-10.19],[-73.09,-10.23],[-73.09,-10.24],[-73.09,-10.21],[-73.09,-10.14],[-73.09,-10.04],[-73.09,-9.94],[-73.09,-9.89],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.63],[-73.09,-9.04],[-73.09,-8.28],[-73.09,-7.52],[-73.09,-6.76],[-73.09,-5.93],[-73.09,-5.07],[-73.09,-4.23],[-72.78,-3.37],[-72.02,-2.48],[-71.10,-1.64],[-70.28,-0.94],[-69.52,-0.43],[-68.80,-0.11],[-68,0]],
  setVelocities : [0.63,1.31,1.52,1.24,0.96,1.01,1.05,1.08,1.11,1.14,1.16,1.18,1.20,1.21,1.22,1.22,1.22,1.21,1.20,1.19,1.17,1.15,1.12,1.09,1.06,1.02,0.98,0.93,0.88,0.82,0.77,0.70,0.63,0.56,0.49,0.41,0.32,0.24,0.15,0.05,0],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 98;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 53;
    aS[1][98].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][98].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 33){
        player[p].phys.pos = new Vec2D(x+(aS[1][98].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[1][98].offset[player[p].timer-1][1]);
      }
      else if (player[p].timer < 74){
        player[p].phys.cVel.x = aS[1][98].setVelocities[player[p].timer-33]*player[p].phys.face;
      }
      if (player[p].timer == 32){
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
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][99] = {
  name : "CLIFFATTACKSLOW",
  offset : [[-73.10,-9.44],[-73.10,-9.56],[-73.10,-9.71],[-73.09,-9.87],[-73.09,-10.01],[-73.09,-10.12],[-73.09,-10.19],[-73.09,-10.23],[-73.09,-10.24],[-73.09,-10.21],[-73.09,-10.14],[-73.09,-10.04],[-73.09,-9.94],[-73.09,-9.89],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.63],[-73.09,-9.04],[-73.09,-8.28],[-73.09,-7.52],[-73.09,-6.76],[-73.09,-5.93],[-73.09,-5.07],[-73.09,-4.23],[-72.76,-3.35],[-71.98,-2.44],[-71.05,-1.60],[-70.28,-0.94],[-69.72,-0.50],[-69.22,-0.21],[-68.78,-0.05],[-68.02,0]],
  setVelocities : [0.34,0.34,0.35,0.38,0.43,0.50,0.59,0.69,1.86,2.03,1.09,1.02,0.85,0.58,0.22,-0.07,-0.20,-0.31,-0.40,-0.47,-0.53,-0.57,-0.59,-0.59,-0.58,-0.55,-0.50,-0.43,-0.35,-0.25,-0.16,-0.09,-0.03,0.002,0.02,0.03],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 99;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 39;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupslow.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupslow.id1;
    aS[1][99].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][99].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 34){
        player[p].phys.pos = new Vec2D(x+(aS[1][99].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[1][99].offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = aS[1][99].setVelocities[player[p].timer-34]*player[p].phys.face;
      }
      if (player[p].timer == 33){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer == 43){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      else if (player[p].timer > 43 && player[p].timer < 60){
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
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][100] = {
  name : "CLIFFATTACKQUICK",
  offset : [[-73.32,-8.97],[-73.81,-7.87],[-74.29,-6.36],[-74.51,-4.70],[-74.44,-2.88],[-74.22,-0.88],[-73.87,1.08],[-73.40,2.76],[-72.81,3.94],[-72.11,4.39],[-71.31,3.70],[-70.42,2.19],[-69.45,0.69],[-67.35,0]],
  setVelocities : [1.16,1.27,1.29,1.24,1.1,0.89,0.59,0.21,-0.18,-0.34,-0.18,0],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 100;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 15;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupquick.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupquick.id1;
    aS[1][100].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][100].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 15){
        player[p].phys.pos = new Vec2D(x+(aS[1][100].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[1][100].offset[player[p].timer-1][1]);
      }
      else if (player[p].timer < 27){
        player[p].phys.cVel.x = aS[1][100].setVelocities[player[p].timer-15]*player[p].phys.face;
      }
      if (player[p].timer == 15){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
      if (player[p].timer == 19){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      else if (player[p].timer > 19 && player[p].timer < 24){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 24){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 55){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      aS[1][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }

}

aS[1][101] = {
  name : "CLIFFJUMPQUICK",
  offset : [[-73.32,-8.97],[-73.81,-7.87],[-74.29,-6.36],[-74.51,-4.70],[-74.43,-2.80],[-74.13,-0.84],[-73.57,0.48],[-72.72,1.10],[-71.70,1.48],[-70.62,1.63],[-69.61,1.60],[-68.82,1.43],[-68.42,0.95],[-68.36,0.32]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 101;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 14;
    aS[1][101].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][101].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 15){
        player[p].phys.pos = new Vec2D(x+(aS[1][101].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[1][101].offset[player[p].timer-1][1]);
      }
      if (player[p].timer == 15){
        player[p].phys.cVel = new Vec2D(1.1*player[p].phys.face,1.8);
      }
      if (player[p].timer > 15){
        airDrift(p);
        fastfall(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 38){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][102] = {
  name : "CLIFFJUMPSLOW",
  offset : [[-73.10,-9.01],[-73.10,-8.03],[-73.09,-6.73],[-73.09,-5.37],[-73.09,-4.23],[-72.76,-3.29],[-71.98,-2.38],[-71.05,-1.58],[-70.28,-0.94],[-69.66,-0.50],[-69.05,-0.21],[-68.59,-0.05],[-68.4,0],[-68.4,0],[-68.4,0],[-68.4,0],[-68.4,0]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 102;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 17;
    aS[1][102].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][102].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 18){
        player[p].phys.pos = new Vec2D(x+(aS[1][102].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[1][102].offset[player[p].timer-1][1]);
      }
      if (player[p].timer == 18){
        player[p].phys.cVel = new Vec2D(1.1*player[p].phys.face,1.8);
      }
      if (player[p].timer > 18){
        airDrift(p);
        fastfall(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 38){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][103] = {
  name : "SIDESPECIALAIR",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  groundVelocities : [1.88,1.50792,1.31208,1.14561,0.73439,0.34986,0.34461,0.33943,0.33430,0.32924,0.32424,0.31930,0.31443,0.30961,0.30486,0.30017,0.29554,0.29097,0.28647,0.28202,0.27764,0.27332,0.26906,0.26487,0.26074,0.25666,0.25265,0.23230,0.19657,0.16230,0.12950,0.09816,0.06830,0.03990],
  airVelocities : [2.024,1.86208,1.71311,1.57606,1.44998,1.33398,1.22726,1.12908,1.03876,0.95565,0.87920,0.80887,0.74416,0.68462,0.62985,0.57947,0.53311,0.49046,0.45122,0.41513,0.38192,0.35136,0.32325,0.29739,0.27360,0.25171,0.23158,0.21305],
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
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.sidespecial.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.sidespecial.id1;
    aS[1][103].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][103].interrupt(p)){

      if (player[p].phys.grounded){
        if (player[p].timer > 11){
          player[p].phys.cVel.x = aS[1][103].groundVelocities[player[p].timer-12]*player[p].phys.face;
        }
      }
      else {
        if (player[p].timer == 12){
          player[p].phys.fastfalled = false;
          player[p].phys.upbAngleMultiplier = player[p].inputs.lStickAxis[0].y * Math.PI*(20/180);
           //decide angle
           //max 20 degrees
          player[p].phys.cVel.y = 0;
        }
        if (player[p].timer < 12){
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
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
        }
        else if (player[p].timer > 11 && player[p].timer < 40){
          player[p].phys.cVel.x = aS[1][103].airVelocities[player[p].timer-12]*player[p].phys.face*Math.cos(player[p].phys.upbAngleMultiplier);
          player[p].phys.cVel.y = aS[1][103].airVelocities[player[p].timer-12]*Math.sin(player[p].phys.upbAngleMultiplier);
        }
        else {
          airDrift(p);
          fastfall(p);
        }
      }

      if (player[p].timer == 12){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.puffshout1.play();
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
    if (player[p].timer > 45){
      if (player[p].phys.grounded){
        aS[1][0].init(p);
      }
      else {
        aS[1][13].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][104] = {
  name : "DOWNSPECIAL",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 104;
    player[p].timer = 0;
    if (player[p].phys.grounded){
      if (player[p].phys.cVel.x > 0){
        player[p].phys.cVel.x -= 0.1;
      }
      if (player[p].phys.cVel.x < 0){
        player[p].phys.cVel.x += 0.1;
      }
    }
    else {
      player[p].phys.fastfalled = false;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecial.id0;
    aS[1][104].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][104].interrupt(p)){
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
        player[p].phys.cVel.y -= player[p].charAttributes.gravity;
        if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
          player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
        }
      }

      if (player[p].timer == 1){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
        player[p].phys.intangibleTimer = 26;
      }
      if (player[p].timer == 2){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 10){
        sounds.rest1.play();
        sounds.restbubbles.play();
      }
      if (player[p].timer == 210){
        sounds.rest2.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 249){
      if (player[p].phys.grounded){
        aS[1][0].init(p);
      }
      else {
        aS[1][13].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][105] = {
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
    aS[1][105].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][105].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[1][105].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[1][105].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[1][106] = {
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

    aS[1][106].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][106].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[1][106].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[1][106].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[1][107] = {
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
    aS[1][107].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][107].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[1][107].offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+aS[1][107].offset[player[p].timer-1][1]);
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

aS[1][108] = {
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
    aS[1][108].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][108].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[1][108].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[1][108].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}


function puffMultiJumpDrift(p){
  if (Math.abs(player[p].inputs.lStickAxis[0].x) < 0.3){
    var tempMax = 0
  }
  else {
    var tempMax = 1.08 * player[p].inputs.lStickAxis[0].x;
  }

  if ((tempMax < 0 && player[p].phys.cVel.x < tempMax) || (tempMax > 0 && player[p].phys.cVel.x > tempMax)){
    if (player[p].phys.cVel.x > 0){
      player[p].phys.cVel.x -= player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x < 0){
        player[p].phys.cVel.x = 0;
      }
    }
    else {
      player[p].phys.cVel.x += player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x > 0){
        player[p].phys.cVel.x = 0;
      }
    }
  }
  else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 && ((tempMax < 0 && player[p].phys.cVel.x > tempMax) || (tempMax > 0 && player[p].phys.cVel.x < tempMax))){
    player[p].phys.cVel.x += (0.072 * player[p].inputs.lStickAxis[0].x);
  }


  if (Math.abs(player[p].inputs.lStickAxis[0].x) < 0.3){
    if (player[p].phys.cVel.x > 0){
      player[p].phys.cVel.x -= player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x < 0){
        player[p].phys.cVel.x = 0;
      }
    }
    else {
      player[p].phys.cVel.x += player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x > 0){
        player[p].phys.cVel.x = 0;
      }
    }
  }
}

function puffNextJump(p){
  if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 && Math.sign(player[p].inputs.lStickAxis[0].x) != player[p].phys.face){
    aS[1][125+player[p].phys.jumpsUsed].init(p);
  }
  else {
    aS[1][120+player[p].phys.jumpsUsed].init(p);
  }
}

aS[1][120] = {
  name : "JUMPAERIAL1",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 120;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.cVel.y = 1.65;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    aS[1][120].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][120].interrupt(p)){
      fastfall(p);
      puffMultiJumpDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 28 && (player[p].inputs.x[0] || player[p].inputs.y[0] || player[p].inputs.lStickAxis[0].y > 0.7)){
      puffNextJump(p);
      return true;
    }
    else if (player[p].timer > 50){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[1][121] = {
  name : "JUMPAERIAL2",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 121;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.59;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    aS[1][121].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][121].interrupt(p)){
      fastfall(p);
      puffMultiJumpDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 28 && (player[p].inputs.x[0] || player[p].inputs.y[0] || player[p].inputs.lStickAxis[0].y > 0.7)){
      puffNextJump(p);
      return true;
    }
    else if (player[p].timer > 50){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[1][122] = {
  name : "JUMPAERIAL3",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 122;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.47;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    aS[1][122].main(p);

  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][122].interrupt(p)){
      fastfall(p);
      puffMultiJumpDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 28 && (player[p].inputs.x[0] || player[p].inputs.y[0] || player[p].inputs.lStickAxis[0].y > 0.7)){
      puffNextJump(p);
      return true;
    }
    else if (player[p].timer > 50){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[1][123] = {
  name : "JUMPAERIAL4",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 123;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.36;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    aS[1][123].main(p);

  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][123].interrupt(p)){
      fastfall(p);
      puffMultiJumpDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 28 && (player[p].inputs.x[0] || player[p].inputs.y[0] || player[p].inputs.lStickAxis[0].y > 0.7)){
      puffNextJump(p);
      return true;
    }
    else if (player[p].timer > 50){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[1][124] = {
  name : "JUMPAERIAL5",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 124;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.25;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    aS[1][124].main(p);

  },
  main : function(p){
    player[p].timer++;
    if (!aS[1][124].interrupt(p)){
      fastfall(p);
      puffMultiJumpDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 50){
      aS[1][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[1][125] = {
  name : "AERIALTURN1",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 125;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.cVel.y = 1.65;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    aS[1][125].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 13){
      player[p].timer--;
      player[p].actionState = 120;
      aS[1][120].main(p);
    }
    else {
      if (!aS[1][125].interrupt(p)){
        fastfall(p);
        puffMultiJumpDrift(p);
        if (player[p].timer == 6){
          player[p].phys.face *= -1;
        }
      }
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[1][126] = {
  name : "AERIALTURN2",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 126;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.59;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    aS[1][126].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 13){
      player[p].timer--;
      player[p].actionState = 121;
      aS[1][121].main(p);
    }
    else {
      if (!aS[1][126].interrupt(p)){
        fastfall(p);
        puffMultiJumpDrift(p);
        if (player[p].timer == 6){
          player[p].phys.face *= -1;
        }
      }
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[1][127] = {
  name : "AERIALTURN3",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 127;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.47;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    aS[1][127].main(p);

  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 13){
      player[p].timer--;
      player[p].actionState = 122;
      aS[1][122].main(p);
    }
    else {
      if (!aS[1][127].interrupt(p)){
        fastfall(p);
        puffMultiJumpDrift(p);
        if (player[p].timer == 6){
          player[p].phys.face *= -1;
        }
      }
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[1][128] = {
  name : "AERIALTURN4",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 128;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.36;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    aS[1][128].main(p);

  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 13){
      player[p].timer--;
      player[p].actionState = 123;
      aS[1][123].main(p);
    }
    else {
      if (!aS[1][128].interrupt(p)){
        fastfall(p);
        puffMultiJumpDrift(p);
        if (player[p].timer == 6){
          player[p].phys.face *= -1;
        }
      }
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[1][129] = {
  name : "AERIALTURN5",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 129;
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.25;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    aS[1][129].main(p);

  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 13){
      player[p].timer--;
      player[p].actionState = 124;
      aS[1][124].main(p);
    }
    else {
      if (!aS[1][129].interrupt(p)){
        fastfall(p);
        puffMultiJumpDrift(p);
        if (player[p].timer == 6){
          player[p].phys.face *= -1;
        }
      }
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[1][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[1][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[1][b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
