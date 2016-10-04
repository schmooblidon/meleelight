
//MARTH
// ActionStates
aS[0]=[];
aS[0][0] = {
  name : "WAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 0;
    player[p].timer = 1;
    aS[0][0].main(p);
  },
  main : function(p){
    player[p].timer += 0.5;
    if (!aS[0][0].interrupt(p)){
      reduceByTraction(p,false);
      if (player[p].timer >= 45){
        aS[0][0].init(p);
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
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[0][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[0][21].init(p);
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[0][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[0][t[1]].init(p);
      return true;
    }
    else if (checkForSquat(p) && !player[p].inCSS){
      aS[0][16].init(p);
      return true;
    }
    else if (checkForDash(p) && !player[p].inCSS){
      aS[0][1].init(p);
      return true;
    }
    else if (checkForSmashTurn(p) && !player[p].inCSS){
      aS[0][3].init(p);
      return true;
    }
    else if (checkForTiltTurn(p) && !player[p].inCSS){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
      aS[0][4].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 && !player[p].inCSS){
      aS[0][7].init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][1] = {
  name : "DASH",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 1;
    player[p].timer = 0;
    sounds.dash.play();
    aS[0][1].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][1].interrupt(p)){
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
      aS[0][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      player[p].phys.cVel.x *= 0.25;
      aS[0][21].init(p);
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      if (player[p].timer < 4 && player[p].inputs.lStickAxis[0].x*player[p].phys.face >= 0.8){
        player[p].phys.cVel.x *= 0.25;
        aS[0][57].init(p);
      }
      else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
        aS[0][73].init(p);
      }
      else {
        aS[0][55].init(p);
      }
      return true;
    }
    else if (checkForJump(p)){
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      aS[0][56].init(p);
      return true;
    }
    else if (player[p].timer > 4 && checkForSmashTurn(p)){
      player[p].phys.cVel.x *= 0.25;
      aS[0][3].init(p);
      return true;
    }
    else if (player[p].timer > 20 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].inputs.lStickAxis[2].x * player[p].phys.face < 0.3){
      aS[0][1].init(p);
      return true;
    }
    else if (player[p].timer > player[p].charAttributes.dFrameMin && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.62){
      aS[0][2].init(p);
      return true;
    }
    else if (player[p].timer > player[p].charAttributes.dFrameMax){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][2] = {
  name : "RUN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 2;
    player[p].timer = 1;
    aS[0][2].main(p);
  },
  main : function(p){
    if (player[p].timer > 16){
      player[p].timer = 1;
    }
    if (!aS[0][2].interrupt(p)){
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
        aS[0][73].init(p);
      }
      else {
        aS[0][55].init(p);
      }
      return true;
    }
    else if (checkForJump(p)){
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      aS[0][56].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[0][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[0][21].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) < 0.62){
      aS[0][5].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
      aS[0][6].init(p);
      return true;
    }
  }
}

aS[0][3] = {
  name : "SMASHTURN",
  canEdgeCancel : true,
  reverseModel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 3;
    player[p].timer = 0;
    player[p].phys.face *= -1;
    aS[0][3].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][3].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (checkForJump(p)){
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      aS[0][56].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[0][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[0][21].init(p);
      return true;
    }
    else if (s[0]){
      aS[0][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[0][t[1]].init(p);
    }
    else if (player[p].timer == 2 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79){
      aS[0][1].init(p);
      return true;
    }
    else if (player[p].timer > 11){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][4] = {
  name : "TILTTURN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 4;
    player[p].timer = 0;
    aS[0][4].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 6){
      player[p].phys.face *= -1;
    }
    if (!aS[0][4].interrupt(p)){
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
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lStickAxis[0].x) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      aS[0][56].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[0][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[0][21].init(p);
      return true;
    }
    else if (s[0]){
      aS[0][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      if (player[p].timer < 6){
        player[p].phys.face *= -1;
      }
      aS[0][t[1]].init(p);
    }
    else if (player[p].timer > 11){
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer == 6 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].phys.dashbuffer){
      aS[0][1].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][5] = {
  name : "RUNBRAKE",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 5;
    player[p].timer = 0;
    sounds.runbrake.play();
    aS[0][5].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][5].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (checkForJump(p)){
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].timer > 1 && checkForSquat(p)){
      aS[0][16].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
      aS[0][6].init(p);
      return true;
    }
    else if (player[p].timer > 25){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][6] = {
  name : "RUNTURN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  reverseModelFrame : 18,
  init : function(p){
    player[p].actionState = 6;
    player[p].timer = 0;
    aS[0][6].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][6].interrupt(p)){
      if (player[p].timer == 19){
        player[p].phys.face *= -1;
      }

      if (player[p].timer < 19 && player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
        var tempAcc = (player[p].charAttributes.dAccA - (1 - Math.abs(player[p].inputs.lStickAxis[0].x))*(player[p].charAttributes.dAccA))*player[p].phys.face;
        player[p].phys.cVel.x -= tempAcc;
      }
      else if (player[p].timer > 18 && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.3){
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

      if (player[p].timer == 18){
        if (player[p].phys.cVel.x * player[p].phys.face > 0){
          player[p].timer--;
        }
      }
    }
  },
  interrupt : function(p){
    if (checkForJump(p)){
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].timer > 30){
      if(player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.6){
        aS[0][2].init(p);
      }
      else {
        aS[0][0].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][7] = {
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
    aS[0][7].main(p);
  },
  main : function(p){

    if (!aS[0][7].interrupt(p)){
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
    if (player[p].timer > 18){
      aS[0][7].init(p,false);
      return true;
    }
    if (player[p].inputs.lStickAxis[0].x == 0){
      aS[0][0].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[0][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[0][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[0][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[0][t[1]].init(p);
      return true;
    }
    else if (checkForSquat(p)){
      aS[0][16].init(p);
      return true;
    }
    else if (checkForDash(p)){
      aS[0][1].init(p);
      return true;
    }
    else if (checkForSmashTurn(p)){
      aS[0][3].init(p);
      return true;
    }
    else if (checkForTiltTurn(p)){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
      aS[0][4].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][8] = {
  name : "KNEEBEND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 8;
    player[p].timer = 0;
    player[p].phys.jumpType = 1;
    aS[0][8].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][8].interrupt(p)){
      reduceByTraction(p,true);
      if (!player[p].inputs.x[0] && !player[p].inputs.y[0] && player[p].inputs.lStickAxis[0].y < 0.67){
        player[p].phys.jumpType = 0;
      }
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    if (player[p].timer == player[p].charAttributes.jumpSquat){
      // so they can be detected as above current surface instantly
      player[p].phys.pos.y += 0.001;
    }
    if (player[p].timer > player[p].charAttributes.jumpSquat){
      if (player[p].inputs.lStickAxis[2].x * player[p].phys.face >= -0.3){
        aS[0][9].init(p,player[p].phys.jumpType);
      }
      else {
        aS[0][15].init(p,player[p].phys.jumpType);
      }
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1] && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      aS[0][73].init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1] && player[p].inputs.lStickAxis[0].y >= 0.8 && player[p].inputs.lStickAxis[3].y < 0.3) || (player[p].inputs.cStickAxis[0].y >= 0.8 && player[p].inputs.cStickAxis[3].y < 0.3)){
      aS[0][58].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][9] = {
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
    sounds.jump.play();
    sounds.jump2.play();
    aS[0][9].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][9].interrupt(p)){
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
      aS[0][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[0][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      aS[0][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 45){
      aS[0][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][10] = {
  name : "LANDING",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 10;
    player[p].timer = 0;
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[0][10].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][10].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 4 && player[p].timer <= 30){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[0][8].init(p);
        return true;
      }
      else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
        aS[0][21].init(p);
        return true;
      }
      else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
        aS[0][21].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[0][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[0][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[0][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[0][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[0][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[0][7].init(p,true);
        return true;
      }
      else if (player[p].timer == 5 && player[p].inputs.lStickAxis[0].y < -0.5){
        aS[0][17].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 30){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][11] = {
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
    aS[0][11].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][11].interrupt(p)){
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
        sounds.airdodge.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[0][14].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][12] = {
  name : "LANDINGFALLSPECIAL",
  canEdgeCancel : true,
  canGrabLedge : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 12;
    player[p].timer = 0;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[0][12].main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingMultiplier;
    if (!aS[0][12].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][13] = {
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
    aS[0][13].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][13].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[0][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[0][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      aS[0][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 10){
      aS[0][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][14] = {
  name : "FALLSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 14;
    player[p].timer = 0;
    aS[0][14].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][14].interrupt(p)){
      fastfall(p);
      airDrift(p);
      // if just upb-ed
      if (player[p].phys.landingMultiplier == 30/34){
        if (Math.abs(player[p].phys.cVel.x) > 0.36){
          player[p].phys.cVel.x = 0.36*Math.sign(player[p].phys.cVel.x);
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 10){
      aS[0][14].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][15] = {
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
    sounds.jump.play();
    sounds.jump2.play();
    aS[0][15].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][15].interrupt(p)){
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
      aS[0][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[0][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      aS[0][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 55){
      aS[0][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][16] = {
  name : "SQUAT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 16;
    player[p].timer = 0;
    aS[0][16].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][16].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (player[p].timer == 4 && (player[p].inputs.lStickAxis[0].y < -0.65 || player[p].inputs.lStickAxis[1].y < -0.65 || player[p].inputs.lStickAxis[2].y < -0.65) && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
      aS[0][20].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[0][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[0][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[0][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[0][t[1]].init(p);
      return true;
    }
    else if (player[p].timer > 7){
      aS[0][17].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[0][8].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][17] = {
  name : "SQUATWAIT",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 17;
    player[p].timer = 0;
    aS[0][17].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][17].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (player[p].inputs.lStickAxis[0].y > -0.61){
      aS[0][18].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[0][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[0][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[0][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[0][t[1]].init(p);
      return true;
    }
    else if (checkForDash(p)){
      aS[0][1].init(p);
      return true;
    }
    else if (checkForSmashTurn(p)){
      aS[0][3].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][18] = {
  name : "SQUATRV",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 18;
    player[p].timer = 0;
    aS[0][18].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][18].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var b = checkForSpecials(p);
    var t = checkForTilts(p);
    var s = checkForSmashes(p);
    if (player[p].timer > 8){
      aS[0][0].init(p);
      return true;
    }
    else if (checkForJump(p)){
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      aS[0][21].init(p);
      return true;
    }
    else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      aS[0][21].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (s[0]){
      aS[0][s[1]].init(p);
      return true;
    }
    else if (t[0]){
      aS[0][t[1]].init(p);
      return true;
    }
    /*else if (checkForDash(p)){
      aS[0][1].init(p);
      return true;
    }*/
    else if (checkForSmashTurn(p)){
      aS[0][3].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
      aS[0][7].init(p,true);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][19] = {
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
    sounds.jump2.play();
    aS[0][19].main(p);

  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][19].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[0][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[0][11].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 50){
      aS[0][32].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][20] = {
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
    aS[0][20].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer > 1){
      if (!aS[0][20].interrupt(p)){
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
      aS[0][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[0][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      aS[0][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 30){
      aS[0][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][21] = {
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
    aS[0][21].main(p);
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
      if (!aS[0][21].interrupt(p)){
        if (player[p].timer == 1){
          sounds.shieldup.play();
          sounds.swordsheath.play();
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
        aS[0][8].init(p);
        return true;
      }
      else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.shielding = false;
        aS[0][73].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[4].y > -0.3) || player[p].inputs.cStickAxis[0].y < -0.7){
        player[p].phys.shielding = false;
        aS[0][54].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face < 0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        aS[0][53].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face > -0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        aS[0][52].init(p);
        return true;
      }
      else if (player[p].timer > 1 && player[p].inputs.lStickAxis[0].y < -0.65 && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        aS[0][20].init(p);
        return true;
      }
      else if (player[p].timer > 8){
        aS[0][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].timer > 8){
        aS[0][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
  }
}

aS[0][22] = {
  name : "GUARD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 22;
    player[p].timer = 0;
    player[p].phys.powerShieldActive = false;
    aS[0][22].main(p);
  },
  main : function(p){
    if (player[p].hit.shieldstun > 0){
      reduceByTraction(p,false);
      shieldTilt(p,true);
    }
    else {
      player[p].timer++;
      if (!aS[0][22].interrupt(p)){
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
        aS[0][8].init(p);
        return true;
      }
      else if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.shielding = false;
        aS[0][73].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[4].y > -0.3) || player[p].inputs.cStickAxis[0].y < -0.7){
        player[p].phys.shielding = false;
        aS[0][54].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face < 0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
        player[p].phys.shielding = false;
        aS[0][53].init(p);
        return true;
      }
      else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[4].x*player[p].phys.face > -0.3) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
        player[p].phys.shielding = false;
        aS[0][52].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.65 && player[p].inputs.lStickAxis[6].y > -0.3 && player[p].phys.onSurface[0] == 1){
        player[p].phys.shielding = false;
        aS[0][20].init(p);
        return true;
      }
      else if (player[p].inputs.lAnalog[0] < 0.3 && player[p].inputs.rAnalog[0] < 0.3){
        player[p].phys.shielding = false;
        aS[0][23].init(p);
        return true;
      }
      else if (player[p].timer > 1){
        aS[0][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (player[p].inputs.lAnalog[0] < 0.3 && player[p].inputs.rAnalog[0] < 0.3){
        player[p].phys.shielding = false;
        aS[0][23].init(p);
        return true;
      }
      else if (player[p].timer > 1){
        aS[0][22].init(p);
        return true;
      }
      else {
        return false;
      }
    }
  }
}

aS[0][23] = {
  name : "GUARDOFF",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 23;
    player[p].timer = 0;
    sounds.shieldoff.play();
    aS[0][23].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][23].interrupt(p)){
      if (player[p].timer == 6){
        sounds.sworddraw.play();
      }
      reduceByTraction(p,false);
      //shieldDepletion(p);
      //shieldSize(p);
    }
  },
  interrupt : function(p){
    if (checkForJump(p) && !player[p].inCSS){
      aS[0][8].init(p);
      return true;
    }
    else if (player[p].timer > 16){
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].phys.powerShielded){
      if (!player[p].inCSS){
        var t = checkForTilts(p);
        var s = checkForSmashes(p);
        if (s[0]){
          aS[0][s[1]].init(p);
          return true;
        }
        else if (t[0]){
          aS[0][t[1]].init(p);
          return true;
        }
        else if (checkForSquat(p)){
          aS[0][16].init(p);
          return true;
        }
        else if (checkForDash(p)){
          aS[0][1].init(p);
          return true;
        }
        else if (checkForSmashTurn(p)){
          aS[0][3].init(p);
          return true;
        }
        else if (checkForTiltTurn(p)){
          player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
          aS[0][4].init(p);
          return true;
        }
        else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
          aS[0][7].init(p,true);
          return true;
        }
        else {
          return false;
        }
      }
      else {
        var s = checkForSmashes(p);
        if (s[0]){
          aS[0][s[1]].init(p);
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

aS[0][24] = {
  name : "CLIFFCATCH",
  canGrabLedge : false,
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 24;
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.chargeFrames = 0;
    player[p].phys.charging = 0;
    player[p].phys.thrownHitbox = false;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = false;
    player[p].phys.intangibleTimer = 38;
    player[p].phys.ledgeHangTimer = 0;
    drawVfx("cliffcatchspark",new Vec2D(stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x,stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y),player[p].phys.face);
    sounds.ledgegrab.play();
    aS[0][24].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][24].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      player[p].phys.pos = new Vec2D(x+cliffcatchOffset[player[p].timer-1][0]*player[p].phys.face,y+cliffcatchOffset[player[p].timer-1][1]);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 7){
      aS[0][25].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][25] = {
  name : "CLIFFWAIT",
  canGrabLedge : false,
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 25;
    player[p].timer = 0;
    aS[0][25].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][25].interrupt(p)){
      player[p].phys.ledgeHangTimer++;
    }
  },
  interrupt : function(p){
    if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.5 || player[p].inputs.lStickAxis[0].y < -0.5){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[0][13].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.5 || player[p].inputs.lStickAxis[0].y > 0.5){
      aS[0][95].init(p);
      return true;
    }
    else if (player[p].phys.ledgeHangTimer > 600){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[0][40].init(p);
      return true;
    }
    else if (player[p].timer > 60){
      aS[0][25].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][26] = {
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
    sounds.deathShout.play();
    aS[0][26].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][26].interrupt(p)){
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
        aS[0][30].init(p);
      }
      else {
        aS[0][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][27] = {
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
    sounds.deathShout.play();
    aS[0][27].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][27].interrupt(p)){
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
        aS[0][30].init(p);
      }
      else {
        aS[0][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][28] = {
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
    sounds.deathShout.play();
    aS[0][28].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][28].interrupt(p)){
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
        aS[0][30].init(p);
      }
      else {
        aS[0][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][29] = {
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
    sounds.deathShout.play();
    aS[0][29].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][29].interrupt(p)){
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
        aS[0][30].init(p);
      }
      else {
        aS[0][93].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][30] = {
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
    player[p].phys.wallJumpCount = 0;
    player[p].phys.sideBJumpFlag = true;
    player[p].spawnWaitTime = 0;
    player[p].percent = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
  },
  main : function(p){
    player[p].timer+= 0.5;
    if (!aS[0][30].interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].timer >= 45){
      aS[0][31].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][31] = {
  name : "REBIRTHWAIT",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 31;
    player[p].timer = 1;
    player[p].phys.cVel.y = 0;
  },
  main : function(p){
    player[p].timer+= 0.5;
    player[p].spawnWaitTime++;
    if (!aS[0][31].interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].timer >= 45){
      aS[0][31].init(p);
      return true;
    }
    else if (player[p].spawnWaitTime > 300){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      aS[0][13].init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 || Math.abs(player[p].inputs.lStickAxis[0].y) > 0.3 ){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      aS[0][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][32] = {
  name : "FALLAERIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 32;
    player[p].timer = 0;
    aS[0][32].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][32].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[0][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[0][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      aS[0][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 10){
      aS[0][32].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][33] = {
  name : "ATTACKAIRF",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 33;
    player[p].timer = 0;
    player[p].phys.autoCancel = false;
    player[p].inAerial = true;
    player[p].hitboxes.id[0] = player[p].charHitboxes.fair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.fair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.fair.id3;
    turnOffHitboxes(p);
    aS[0][33].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][33].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer > 2 && player[p].timer < 11){
        drawVfx("swingFair",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-3);
      }
      if (player[p].timer == 4){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword3.play();
      }
      if (player[p].timer > 4 && player[p].timer < 8){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 8){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 27){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 33){
      aS[0][13].init(p);
      return true;
    }
    else if (player[p].timer > 29){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        aS[0][19].init(p);
        return true;
      }
      else if (a[0]){
        aS[0][a[1]].init(p);
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

aS[0][34] = {
  name : "ATTACKAIRB",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 34;
    player[p].timer = 0;
    player[p].phys.autoCancel = false;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.bair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.bair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.bair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.bair.id3;
    aS[0][34].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][34].interrupt(p)){
      if (player[p].timer == 30){
        player[p].phys.face *= -1;
      }
      fastfall(p);
      airDrift(p);
      if (player[p].timer > 2 && player[p].timer < 12){
        drawVfx("swingBair",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-3);
      }
      if (player[p].timer == 7){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword3.play();
      }
      if (player[p].timer > 7 && player[p].timer < 12){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 12){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 32){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[0][13].init(p);
      return true;
    }
    else if (player[p].timer > 34){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        aS[0][19].init(p);
        return true;
      }
      else if (a[0]){
        aS[0][a[1]].init(p);
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

aS[0][35] = {
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
    player[p].hitboxes.id[1] = player[p].charHitboxes.upair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.upair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.upair.id3;
    aS[0][35].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][35].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer > 4 && player[p].timer < 15){
        drawVfx("swingUpair",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-5);
      }
      if (player[p].timer == 5){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.sword3.play();
      }
      if (player[p].timer > 5 && player[p].timer < 9){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 9){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 27){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 45){
      aS[0][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][36] = {
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
    aS[0][36].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][36].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer > 4 && player[p].timer < 12){
        drawVfx("swingDair",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-5);
      }
      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.sword3.play();
      }
      if (player[p].timer > 6 && player[p].timer < 10){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 10){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 48){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 59){
      aS[0][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][37] = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.nair1.id3;
    aS[0][37].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][37].interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer > 4 && player[p].timer < 9){
        drawVfx("swingNair1",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-5);
      }
      if (player[p].timer > 13 && player[p].timer < 18){
        drawVfx("swingNair2",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-14);
      }
      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.sword1.play();
      }
      if (player[p].timer == 7){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 8){
        turnOffHitboxes(p);
      }

      if (player[p].timer == 15){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.id[0] = player[p].charHitboxes.nair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.nair2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.nair2.id2;
        player[p].hitboxes.id[3] = player[p].charHitboxes.nair2.id3;
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 15 && player[p].timer < 22){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 22){
        turnOffHitboxes(p);
      }
      if (player[p].timer == 25){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[0][13].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][38] = {
  name : "UPSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  setVelocities : [[0.75685,14.41555],
  [0.71450,15.51062],
  [0.67334,8.65633],
  [0.63338,2.42162],
  [0.59462,2.11897],
  [0.55706,1.83569],
  [0.52069,1.57181],
  [0.48552,1.32731],
  [0.45155,1.10218],
  [0.41878,0.89645],
  [0.38720,0.71010],
  [0.35682,0.54314],
  [0.32765,0.39556],
  [0.29966,0.26735],
  [0.27288,0.15855],
  [0.24729,0.06912],
  [0.22290,-0.00093]],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 38;
    player[p].timer = 0;
    player[p].phys.cVel = new Vec2D(0,0);
    player[p].phys.fastfalled = false;
    player[p].phys.upbAngleMultiplier = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upb1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upb1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.upb1.id2;
    player[p].phys.landingMultiplier = 30/34;
    sounds.dolphinSlash.play();
    sounds.dolphinSlash2.play();
    aS[0][38].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][38].interrupt(p)){
      if (player[p].phys.cVel.y <= 0){
        player[p].phys.canWallJump = true;
      }
      if (player[p].timer < 6){
        if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.7){
          player[p].phys.upbAngleMultiplier = -player[p].inputs.lStickAxis[0].x * Math.PI/16;
        }
      }
      if (player[p].timer == 6){
        player[p].phys.grounded = false;
        if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.7){
          player[p].phys.face *= -1;
        }
      }
      if (player[p].timer > 5 && player[p].timer < 23){
        player[p].phys.cVel = new Vec2D(aS[0][38].setVelocities[player[p].timer-6][0]*player[p].phys.face*Math.cos(player[p].phys.upbAngleMultiplier)-aS[0][38].setVelocities[player[p].timer-6][1]*Math.sin(player[p].phys.upbAngleMultiplier),aS[0][38].setVelocities[player[p].timer-6][0]*player[p].phys.face*Math.sin(player[p].phys.upbAngleMultiplier)+aS[0][38].setVelocities[player[p].timer-6][1]*Math.cos(player[p].phys.upbAngleMultiplier));
      }
      else if (player[p].timer > 22){
        fastfall(p);
        airDrift(p);
        if (Math.abs(player[p].phys.cVel.x) > 0.36){
          player[p].phys.cVel.x = 0.36*Math.sign(player[p].phys.cVel.x);
        }
      }

      if (player[p].timer == 5){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 6){
        player[p].hitboxes.id[0] = player[p].charHitboxes.upb2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.upb2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.upb2.id2;
      }
      if (player[p].timer > 6 && player[p].timer < 11){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 11){
        turnOffHitboxes(p);
      }
      if (player[p].timer > 2 && player[p].timer < 12){
        drawVfx("swingUpb",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-3);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[0][14].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][39] = {
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
    aS[0][39].main(p);
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
    if (!aS[0][39].interrupt(p)){
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
      player[p].phys.thrownHitbox = false;
      aS[0][40].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][40] = {
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
    aS[0][40].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][40].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[0][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[0][11].init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
      aS[0][19].init(p);
      return true;
    }
    else if (b[0]){
      aS[0][b[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x > 0.7 && player[p].inputs.lStickAxis[1].x < 0.7) || (player[p].inputs.lStickAxis[0].x < -0.7 && player[p].inputs.lStickAxis[1].x > -0.7) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) || (player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y > -0.7)){
      aS[0][13].init(p);
      return true;
    }
    else if (player[p].timer > 30){
      aS[0][40].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][41] = {
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
    aS[0][41].main(p);
  },
  main : function(p){
    if (player[p].inCSS){
      player[p].timer+= 0.7;
    }
    else {
      player[p].timer++;
    }
    if (!aS[0][41].interrupt(p)){
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
        aS[0][0].init(p);
      }
      else {
        aS[0][13].init(p);
      }
      return true;
    }
    else if (player[p].hit.hitstun <= 0 && !player[p].inCSS){
      if (player[p].phys.grounded){
        var b = checkForSpecials(p);
        var t = checkForTilts(p);
        var s = checkForSmashes(p);
        if (checkForJump(p)){
          aS[0][8].init(p);
          return true;
        }
        else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
          aS[0][21].init(p);
          return true;
        }
        else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
          aS[0][21].init(p);
          return true;
        }
        else if (b[0]){
          aS[0][b[1]].init(p);
          return true;
        }
        else if (s[0]){
          aS[0][s[1]].init(p);
          return true;
        }
        else if (t[0]){
          aS[0][t[1]].init(p);
          return true;
        }
        else if (checkForSquat(p)){
          aS[0][16].init(p);
          return true;
        }
        else if (checkForDash(p)){
          aS[0][1].init(p);
          return true;
        }
        else if (checkForSmashTurn(p)){
          aS[0][3].init(p);
          return true;
        }
        else if (checkForTiltTurn(p)){
          player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
          aS[0][4].init(p);
          return true;
        }
        else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
          aS[0][7].init(p,true);
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
          aS[0][a[1]].init(p);
          return true;
        }
        else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
          aS[0][11].init(p);
          return true;
        }
        else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
          aS[0][19].init(p);
          return true;
        }
        else if (b[0]){
          aS[0][b[1]].init(p);
          return true;
        }
        else if ((player[p].inputs.lStickAxis[0].x > 0.7 && player[p].inputs.lStickAxis[1].x < 0.7) || (player[p].inputs.lStickAxis[0].x < -0.7 && player[p].inputs.lStickAxis[1].x > -0.7) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) || (player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y > -0.7)){
          aS[0][13].init(p);
          return true;
        }
        else if (player[p].timer > 30){
          aS[0][40].init(p);
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

aS[0][42] = {
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
    aS[0][42].main(p);
  },
  main : function(p){
    player[p].timer += 2*player[p].phys.landingLagScaling;
    if (!aS[0][42].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][43] = {
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
    aS[0][43].main(p);
  },
  main : function(p){
    player[p].timer += 2*player[p].phys.landingLagScaling;
    if (!aS[0][43].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][44] = {
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
    aS[0][44].main(p);
  },
  main : function(p){
    player[p].timer += 1.25*player[p].phys.landingLagScaling;
    if (!aS[0][44].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][45] = {
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
    aS[0][45].main(p);
  },
  main : function(p){
    player[p].timer += 0.9375*player[p].phys.landingLagScaling;
    if (!aS[0][45].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][46] = {
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
    aS[0][46].main(p);
  },
  main : function(p){
    player[p].timer += 2*player[p].phys.landingLagScaling;
    if (!aS[0][46].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][47] = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.dtilt.id3;
    aS[0][47].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][47].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 5 && player[p].timer < 10){
        drawVfx("swingDtilt",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-6);
      }
      if (player[p].timer == 7){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
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
    if (player[p].timer > 49){
      aS[0][17].init(p);
      return true;
    }
    else if (player[p].timer > 19){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[0][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[0][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[0][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[0][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[0][3].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[0][4].init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        aS[0][7].init(p,true);
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

aS[0][48] = {
  name : "UPTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 48;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.uptilt1.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.uptilt1.id3;
    aS[0][48].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][48].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 4 && player[p].timer < 15){
        drawVfx("swingUptilt",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-5);
      }
      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 6 && player[p].timer < 13){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 9){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.uptilt2.id2;
        player[p].hitboxes.id[3] = player[p].charHitboxes.uptilt2.id3;
      }
      if (player[p].timer == 13){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer > 31){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[0][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[0][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[0][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[0][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[0][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[0][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[0][7].init(p,true);
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

aS[0][49] = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.ftilt.id3;
    aS[0][49].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][49].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 5 && player[p].timer < 14){
        drawVfx("swingFtilt",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-6);
      }
      if (player[p].timer == 7){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
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
    if (player[p].timer > 35){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][50] = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.jab1.id3;
    aS[0][50].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][50].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 3 && player[p].timer < 14){
        drawVfx("swingJab1",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-4);
      }
      if (player[p].timer > 2 && player[p].timer < 26 && player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.jabCombo = true;
      }
      if (player[p].timer == 4){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword1.play();
      }
      if (player[p].timer > 4 && player[p].timer < 8){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 8){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 19 && player[p].phys.jabCombo){
      aS[0][51].init(p);
      return true;
    }
    else if (player[p].timer > 27){
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer > 26){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[0][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[0][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[0][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[0][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[0][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[0][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[0][7].init(p,true);
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

aS[0][51] = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.jab2.id3;
    aS[0][51].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][51].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 4 && player[p].timer < 14){
        drawVfx("swingJab2",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-5);
      }
      if (player[p].timer > 1 && player[p].timer < 26 && player[p].inputs.a[0] && !player[p].inputs.a[1]){
        player[p].phys.jabCombo = true;
      }
      if (player[p].timer == 5){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword1.play();
      }
      if (player[p].timer > 5 && player[p].timer < 10){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 10){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 19 && player[p].phys.jabCombo){
      aS[0][50].init(p);
      return true;
    }
    else if (player[p].timer > 28){
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer > 27){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[0][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[0][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[0][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[0][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[0][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[0][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[0][7].init(p,true);
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

aS[0][52] = {
  name : "ESCAPEB",
  setVelocities : [-2.267,-2.536,-2.706,-2.780,-2.758,-2.640,-2.426,-2.116,-1.711,-1.209,-0.888,-0.819,-0.758,-0.707,-0.664,-0.631,-0.606,-0.591,-0.585,-0.587,-0.599,-0.620,-0.809,-1.072,-1.205,-1.207,-1.078,-0.819,-0.617,-0.556,-0.487,-0.413,-0.332,-0.245,-0.152],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 52;
    player[p].timer = 0;
    player[p].phys.shielding = false;
    aS[0][52].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][52].interrupt(p)){
      if (player[p].timer == 33){
        sounds.sworddraw.play();
      }
      player[p].phys.cVel.x = aS[0][52].setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer == 4){
        player[p].phys.intangibleTimer = 20;
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 35){
      player[p].phys.cVel.x = 0;
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][53] = {
  name : "ESCAPEF",
  setVelocities : [2.267,2.536,2.706,2.780,2.758,2.640,2.426,2.116,1.711,1.209,0.888,0.819,0.758,0.707,0.664,0.631,0.606,0.591,0.585,0.587,0.599,0.620,0.809,1.072,1.205,1.207,1.078,0.819,0.617,0.556,0.487,0.413,0.332,0.245,0.152],
  canEdgeCancel : false,
  reverseModel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 53;
    player[p].timer = 0;
    player[p].phys.shielding = false;
    aS[0][53].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][53].interrupt(p)){
      if (player[p].timer == 33){
        sounds.sworddraw.play();
      }
      player[p].phys.cVel.x = aS[0][53].setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer == 4){
        player[p].phys.intangibleTimer = 20;
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 35){
      player[p].phys.cVel.x = 0;
      player[p].phys.face *= -1;
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][54] = {
  name : "ESCAPEN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 54;
    player[p].timer = 0;
    player[p].phys.shielding = false;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    aS[0][54].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][54].interrupt(p)){
      if (player[p].timer == 1){
        sounds.spotdodge.play();
      }
      if (player[p].timer == 2){
        sounds.airdodge.play();
      }
      if (player[p].timer == 18){
        sounds.sworddraw.play();
      }
      reduceByTraction(p,true);
      if (player[p].timer == 2){
        player[p].phys.intangibleTimer = 16;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 27){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][55] = {
  name : "ATTACKDASH",
  canEdgeCancel : false,
  setVelocities : [0.755,1.962,2.714,3.010,2.849,2.232,1.184,0.542,0.704,1.325,1.487,1.079,0.666,0.631,0.597,0.565,0.536,0.508,0.482,0.458,0.436,0.416,0.398,0.370,0.332,0.299,0.270,0.244,0.222,0.205,0.191,0.181,0.176,0.165,0.148,0.130,0.112,0.093,0.073,0.053,0.032,0.011,-0.783,-0.783,0,0,0.001,0.001,0],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 55;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dashattack.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dashattack.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dashattack.id3;
    aS[0][55].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][55].interrupt(p)){
      player[p].phys.cVel.x = aS[0][55].setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer > 12 && player[p].timer < 21){
        drawVfx("swingDashAttack",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-13);
      }
      if (player[p].timer == 12){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword1.play();
      }
      if (player[p].timer > 12 && player[p].timer < 16){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 16){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer < 5 && player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
      if (player[p].phys.cVel.x*player[p].phys.face > player[p].charAttributes.dMaxV){
        player[p].phys.cVel.x = player[p].charAttributes.dMaxV*player[p].phys.face;
      }
      aS[0][73].init(p);
      return true;
    }
    else if (player[p].timer > 39){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[0][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[0][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[0][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[0][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[0][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[0][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[0][7].init(p,true);
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

aS[0][56] = {
  name : "SIDESPECIAL",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 56;
    player[p].timer = 0;
    if (!player[p].phys.grounded){
      if (player[p].phys.sideBJumpFlag){
        player[p].phys.cVel.y = 1;
        player[p].phys.sideBJumpFlag = false;
      }
      else {
        player[p].phys.cVel.y = 0;
      }
      player[p].phys.fastfalled = false;
      player[p].phys.cVel.x *= 0.8;
    }
    else {
      player[p].phys.cVel.x *= 0.2;
    }
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.sidespecial.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.sidespecial.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.sidespecial.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.sidespecial.id3;
    sounds.shout6.play();
    aS[0][56].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][56].interrupt(p)){
      if (player[p].timer == 6){
        sounds.dancingBlade.play();
      }
      if (!player[p].phys.grounded){
        player[p].phys.cVel.y -= 0.06;
        if (player[p].phys.cVel.x > 0){
          player[p].phys.cVel.x -= 0.0025;
          if (player[p].phys.cVel.x < 0){
            player[p].phys.cVel.x = 0;
          }
        }
        else {
          player[p].phys.cVel.x += 0.0025;
          if (player[p].phys.cVel.x > 0){
            player[p].phys.cVel.x = 0
          }
        }
      }
      else {
        reduceByTraction(p,true);
      }

      if (player[p].timer > 4 && player[p].timer < 12){
        drawVfx("swingSideB",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-5);
      }
      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 6 && player[p].timer < 9){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 9){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 29){
      if (player[p].phys.grounded){
        aS[0][0].init(p);
      }
      else {
        aS[0][13].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][57] = {
  name : "FSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 57;
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.fsmash.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.fsmash.id3;
    aS[0][57].main(p);
  },
  main : function(p){
    if (player[p].timer == 3){
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
    if (!aS[0][57].interrupt(p)){
      reduceByTraction(p,true);


      if (player[p].timer == 5){
        sounds.sword3.play();
      }

      if (player[p].timer > 6 && player[p].timer < 14){
        drawVfx("swingFsmash",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-7);
      }
      if (player[p].timer == 10){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        randomShout(cS[p]);
      }
      if (player[p].timer > 10 && player[p].timer < 14){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 14){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer > 47 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[0][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[0][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[0][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[0][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[0][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[0][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[0][7].init(p,true);
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

aS[0][58] = {
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
    player[p].hitboxes.id[2] = player[p].charHitboxes.upsmash.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.upsmash.id3;
    aS[0][58].main(p);
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
    if (!aS[0][58].interrupt(p)){
      reduceByTraction(p,true);




      if (player[p].timer > 10 && player[p].timer < 15){
        drawVfx("swingUpsmash",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-11);
      }
      if (player[p].timer == 13){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword3.play();
        randomShout(cS[p]);
      }
      if (player[p].timer > 13 && player[p].timer < 17){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 17){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 54){
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer > 45 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[0][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[0][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[0][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[0][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[0][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[0][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[0][7].init(p,true);
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

aS[0][59] = {
  name : "DSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 59;
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dsmash1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dsmash1.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dsmash1.id3;
    aS[0][59].main(p);
  },
  main : function(p){
    if (player[p].timer == 3){
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
    if (!aS[0][59].interrupt(p)){
      reduceByTraction(p,true);




      if (player[p].timer > 3 && player[p].timer < 10){
        drawVfx("swingDsmash1",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-4);
      }
      if (player[p].timer > 16 && player[p].timer < 26){
        drawVfx("swingDsmash2",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-17);
      }
      if (player[p].timer == 5){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword3.play();
        randomShout(cS[p]);
      }
      if (player[p].timer > 5 && player[p].timer < 8){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 8){
        turnOffHitboxes(p);
      }

      if (player[p].timer == 20){
        player[p].hitboxes.id[0] = player[p].charHitboxes.dsmash2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.dsmash2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.dsmash2.id2;
        player[p].hitboxes.id[3] = player[p].charHitboxes.dsmash2.id3;
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword3.play();
      }
      if (player[p].timer > 20 && player[p].timer < 23){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 23){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 64){
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer > 61 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      if (checkForJump(p)){
        aS[0][8].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        aS[0][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        aS[0][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        aS[0][1].init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        aS[0][3].init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        aS[0][4].init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        aS[0][7].init(p,true);
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

aS[0][60] = {
  name : "DOWNBOUND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 60;
    player[p].timer = 0;
    player[p].phys.kVel.y = 0;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    aS[0][60].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][60].interrupt(p)){
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
      aS[0][61].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][61] = {
  name : "DOWNWAIT",
  canEdgeCancel : true,
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 61;
    player[p].timer = 0;
    aS[0][61].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][61].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      aS[0][61].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7){
      aS[0][63].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7){
      aS[0][64].init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].y > 0.7){
      aS[0][62].init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1])){
      aS[0][65].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][62] = {
  name : "DOWNSTANDN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 62;
    player[p].timer = 0;
    aS[0][62].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][62].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 22;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][63] = {
  name : "DOWNSTANDB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  //setVelocities : [-0.016,-0.109,-0.208,-0.314,-0.427,-0.547,-0.673,-0.806,-0.946,-1.093,-1.246,-1.407,-1.574,-1.747,-1.928,-2.084,-2.178,-2.224,-2.221,-2.170,-2.070,-1.921,-1.724,-1.479,-1.184,-0.889,-0.649,-0.443,-0.272,-0.135,-0.033,0.034,0.074,0,0],
  setVelocities : [-0.185,-0.370,-0.573,-1.540,-1.614,-1.586,-1.566,-1.614,-1.647,-1.666,-1.669,-1.657,-1.630,-1.588,-1.531,-1.397,-1.224,-1.094,-1.006,-0.962,-0.960,-0.926,-0.816,-0.684,-0.529,-0.352,-0.226,-0.171,-0.124,-0.084,-0.051,-0.025,-0.007,0.004,0.008],
  init : function(p){
    player[p].actionState = 63;
    player[p].timer = 0;
    aS[0][63].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][63].interrupt(p)){
      player[p].phys.cVel.x = aS[0][63].setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 19;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 35){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][64] = {
  name : "DOWNSTANDF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  //setVelocities : [0.236,1.175,1.956,1.952,1.940,1.920,1.892,1.857,1.814,1.763,1.704,1.638,1.564,1.482,1.392,1.295,1.190,1.077,0.956,0.827,0.744,0.713,0.686,0.661,0.640,0.622,0.607,0.596,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001],
  setVelocities : [0.467,1.360,1.733,2.135,2.355,2.581,2.055,2.281,2.184,1.902,1.703,1.521,1.357,1.211,1.082,0.971,0.878,0.802,0.743,0.703,0.680,0.674,0.686,0.716,0.763,0.775,0.727,0.661,0.577,0.474,0.352,0.241,0.163,0.101,0.055],
  init : function(p){
    player[p].actionState = 64;
    player[p].timer = 0;
    aS[0][64].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][64].interrupt(p)){
      player[p].phys.cVel.x = aS[0][64].setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer == 6){
        player[p].phys.intangibleTimer = 14;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 35){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][65] = {
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
    aS[0][65].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][65].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 31
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
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][66] = {
  name : "TECHN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 66;
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[0][66].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][66].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 20
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 26){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][67] = {
  name : "TECHB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [0,0,0,0,0,0,0,-2.832,-2.726,-2.622,-2.521,-2.422,-2.326,-2.233,-2.142,-2.054,-1.968,-1.885,-1.811,-1.748,-1.691,-1.639,-1.593,-1.553,-1.519,-1.490,-1.467,-1.450,-1.439,-1.433,-1.433,-0.002,-0.003,-0.004,-0.005,-0.006,-0.006,-0.007,-0.007,-0.006],
  init : function(p){
    player[p].actionState = 67;
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[0][67].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][67].interrupt(p)){
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 20
      }
      player[p].phys.cVel.x = aS[0][67].setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][68] = {
  name : "TECHF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [0,0,0,0,0,0,0,4.036,3.526,2.726,2.317,1.862,1.656,1.625,1.768,1.989,2.094,2.083,1.956,1.846,1.814,1.757,1.676,1.570,1.440,1.286,1.107,0.949,0.834,0.727,0.629,0.540,0.459,0.387,0.323,0.268,0.222,0.184,0.155,0.135],
  init : function(p){
    player[p].actionState = 68;
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[0][68].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][68].interrupt(p)){
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 20
      }
      player[p].phys.cVel.x = aS[0][68].setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][69] = {
  name : "SHIELDBREAKFALL",
  canPassThrough : false,
  canBeGrabbed : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  init : function(p){
    player[p].actionState = 69;
    player[p].timer = 0;
    aS[0][69].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][69].interrupt(p)){
      player[p].phys.intangibleTimer = 1;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[0][69].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][70] = {
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
    aS[0][70].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][70].interrupt(p)){
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
      aS[0][71].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][71] = {
  name : "SHIELDBREAKSTAND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 71;
    player[p].timer = 0;
    aS[0][71].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][71].interrupt(p)){
      reduceByTraction(p,true);
      player[p].phys.intangibleTimer = 1;
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[0][72].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][72] = {
  name : "FURAFURA",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 72;
    player[p].timer = 0;
    player[p].phys.stuckTimer = 490;
    drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(4+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+11+Math.random()*3),player[p].phys.face);
    player[p].furaLoopID = sounds.furaloop.play();
    aS[0][72].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][72].interrupt(p)){
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
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][73] = {
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
    player[p].hitboxes.id[2] = player[p].charHitboxes.grab.id2;
    aS[0][73].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][73].interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 7){
        player[p].hitboxes.active = [true,true,true,false];
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
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][74] = {
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
    aS[0][74].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][74].interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-16.41205*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 2){
      aS[0][75].init(p);
      aS[0][76].init(player[p].phys.grabbedBy);
      drawVfx("tech",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+10));
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][75] = {
  name : "CAPTUREWAIT",
  canEdgeCancel : false,
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = 75;
    player[p].timer = 0;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
    aS[0][75].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][75].interrupt(p)){
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
      aS[0][78].init(player[p].phys.grabbedBy);
      aS[0][77].init(p);
      return true;
    }
    else if (player[p].timer > 1){
      aS[0][75].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][76] = {
  name : "CATCHWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 76;
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[0][76].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][76].interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      aS[0][79].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y < 0.7) || player[p].inputs.cStickAxis[0].y > 0.7){
      aS[0][81].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y > -0.7) || player[p].inputs.cStickAxis[0].y < -0.7){
      aS[0][83].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[1].x*player[p].phys.face > -0.7) || player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7){
      aS[0][85].init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[1].x*player[p].phys.face < 0.7) || player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7){
      aS[0][87].init(p);
      return true;
    }
    else if (player[p].timer > 1){
      aS[0][76].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][77] = {
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
    aS[0][77].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][77].interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.grabTech = false;
      }
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][78] = {
  name : "CATCHCUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 78;
    player[p].timer = 0;
    player[p].phys.grabbing = -1;
    player[p].phys.cVel.x = -1*player[p].phys.face;
    aS[0][78].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][78].interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 29){
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][79] = {
  name : "CATCHATTACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 79;
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.pummel.id0;
    aS[0][79].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][79].interrupt(p)){
      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 7){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 24){
      aS[0][76].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][80] = {
  name : "CAPTUREDAMAGE",
  canEdgeCancel : false,
  canBeGrabbed : false,
  setPositions : [9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.478,9.306,8.920,8.516,8.290,8.293,8.410,8.593,8.792,8.959,9.043,9.068],
  init : function(p){
    player[p].actionState = 80;
    player[p].timer = 0;
    aS[0][80].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][80].interrupt(p)){
      player[p].phys.pos.x = player[player[p].phys.grabbedBy].phys.pos.x+(-aS[0][80].setPositions[player[p].timer-1]*player[p].phys.face);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 20){
      aS[0][75].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
aS[0][81] = {
  name : "THROWUP",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 81;
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]][82].init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
    var frame = 0;
    switch (cS[player[p].phys.grabbing]){
      case 0:
        frame = 11;
        break;
      case 1:
        frame = 8;
        break;
      case 2:
        frame = 9;
        break;
      default:
        break;
    }
    player[p].phys.releaseFrame = frame;
    randomShout(cS[p]);
    aS[0][81].main(p);
  },
  main : function(p){
    player[p].timer+=11/player[p].phys.releaseFrame;
    if (!aS[0][81].interrupt(p)){
      if (Math.floor(player[p].timer) == 11){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      player[p].phys.grabbing = -1;
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer < 11 && player[player[p].phys.grabbing].phys.grabbedBy != p){
      console.log("test");
      aS[0][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][82] = {
  name : "THROWNMARTHUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
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
    aS[0][82].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][82].interrupt(p)){

    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[0][83] = {
  name : "THROWDOWN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 83;
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]][84].init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
    randomShout(cS[p]);
    var frame = 0;
    switch (cS[player[p].phys.grabbing]){
      case 0:
        frame = 13;
        break;
      case 1:
        frame = 9;
        break;
      case 2:
        frame = 9;
        break;
      default:
        break;
    }
    player[p].phys.releaseFrame = frame;
    aS[0][83].main(p);
  },
  main : function(p){
    player[p].timer+=13/player[p].phys.releaseFrame;
    if (!aS[0][83].interrupt(p)){
      if (Math.floor(player[p].timer) == 13){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 37){
      player[p].phys.grabbing = -1;
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer < 13 && player[player[p].phys.grabbing].phys.grabbedBy != p){
      console.log("test");
      aS[0][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][84] = {
  name : "THROWNMARTHDOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
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
    aS[0][84].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][84].interrupt(p)){

    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[0][85] = {
  name : "THROWBACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 85;
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]][86].init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
    randomShout(cS[p]);
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
    aS[0][85].main(p);
  },
  main : function(p){
    player[p].timer+=7/player[p].phys.releaseFrame;
    if (!aS[0][85].interrupt(p)){
      if (Math.floor(player[p].timer) == 7){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      player[p].phys.grabbing = -1;
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer < 7 && player[player[p].phys.grabbing].phys.grabbedBy != p){
      aS[0][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][86] = {
  name : "THROWNMARTHBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
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
    aS[0][86].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][86].interrupt(p)){

    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[0][87] = {
  name : "THROWFORWARD",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 87;
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]][88].init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwforward.id0;
    randomShout(cS[p]);
    var frame = 0;
    switch (cS[player[p].phys.grabbing]){
      case 0:
        frame = 13;
        break;
      case 1:
        frame = 9;
        break;
      case 2:
        frame = 9;
        break;
      default:
        break;
    }
    player[p].phys.releaseFrame = frame;
    aS[0][87].main(p);
  },
  main : function(p){
    player[p].timer+=13/player[p].phys.releaseFrame;
    if (!aS[0][87].interrupt(p)){
      if (Math.floor(player[p].timer) == 13){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 27){
      player[p].phys.grabbing = -1;
      aS[0][0].init(p);
      return true;
    }
    else if (player[p].timer < 13 && player[player[p].phys.grabbing].phys.grabbedBy != p){
      aS[0][78].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][88] = {
  name : "THROWNMARTHFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
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
    aS[0][88].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][88].interrupt(p)){

    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[0][89] = {
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
    aS[0][89].main(p);
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
    if (!aS[0][89].interrupt(p)){
      player[p].hit.hitstun--;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 50){
      aS[0][40].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][90] = {
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
    aS[0][90].main(p);
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
    if (!aS[0][90].interrupt(p)){
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
        aS[0][a[1]].init(p);
        return true;
      }
      else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
        aS[0][11].init(p);
        return true;
      }
      else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        aS[0][19].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (player[p].timer > 26){
        aS[0][13].init(p);
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

aS[0][91] = {
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
    aS[0][91].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 2){
      sounds.walljump.play();
    }
    if (!aS[0][91].interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 1){
      var a = checkForAerials(p);
      var b = checkForSpecials(p);
      if (a[0]){
        aS[0][a[1]].init(p);
        return true;
      }
      else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
        aS[0][11].init(p);
        return true;
      }
      else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        aS[0][19].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (player[p].timer > 40){
        aS[0][13].init(p);
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

aS[0][92] = {
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
    aS[0][92].main(p);
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
    if (!aS[0][90].interrupt(p)){
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
        aS[0][a[1]].init(p);
        return true;
      }
      else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
        aS[0][11].init(p);
        return true;
      }
      else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        aS[0][19].init(p);
        return true;
      }
      else if (b[0]){
        aS[0][b[1]].init(p);
        return true;
      }
      else if (player[p].timer > 40){
        aS[0][13].init(p);
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

aS[0][93] = {
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
    aS[0][93].main(p);
  },
  main : function(p){
  },
  interrupt : function(p){
    return false;
  }
}

aS[0][94] = {
  name : "ENTRANCE",
  canBeGrabbed : false,
  //ignoreCollision : true,
  init : function(p){
    player[p].actionState = 94;
    player[p].timer = 0;
    player[p].phys.grounded = false;
    aS[0][94].main(p);
  },
  main : function(p){
    player[p].timer++;
    aS[0][94].interrupt(p);
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      aS[0][13].init(p);
    }
  }
}

aS[0][95] = {
  name : "CLIFFGETUPQUICK",
  canBeGrabbed : true,
  offset : [[-71.33,-23.71],[-71.38,-23.71],[-71.42,-23.71],[-71.45,-23.71],[-71.46,-23.71],[-71.44,-23.71],[-71.38,-23.71],[-71.26,-23.71],[-71.07,-22.69],[-70.80,-19.99],[-70.47,-16.19],[-70.11,-11.83],[-69.71,-7.48],[-69.28,-3.68],[-68.83,-1.01],[-67.88,0],[-67.38,0],[-66.87,0],[-66.35,0],[-65.81,0],[-65.27,0],[-64.73,0],[-64.19,0],[-63.65,0],[-63.12,0],[-62.59,0],[-62.08,0],[-61.60,0],[-61.17,0],[-60.80,0],[-60.50,0],[-60.28,0]],
  init : function(p){
    player[p].actionState = 95;
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 30;
    aS[0][95].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][95].interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 16){
        player[p].phys.pos = new Vec2D(x+(aS[0][95].offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+aS[0][95].offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.pos.x = x+(68.4+aS[0][95].offset[player[p].timer-1][0])*player[p].phys.face;
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
      aS[0][0].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][96] = {
  name : "CLIFFGETUPSLOW"
}

aS[0][97] = {
  name : "CLIFFESCAPEQUICK"
}

aS[0][98] = {
  name : "CLIFFESCAPESLOW"
}

aS[0][99] = {
  name : "CLIFFATTACKSLOW"
}

aS[0][100] = {
  name : "CLIFFATTACKQUICK"
}

aS[0][101] = {
  name : "CLIFFJUMPQUICK"
}

aS[0][102] = {
  name : "CLIFFJUMPSLOW"
}

aS[0][103] = {
  name : "SIDESPECIAL",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = 56;
    player[p].timer = 0;
    if (!player[p].phys.grounded){
      if (player[p].phys.sideBJumpFlag){
        player[p].phys.cVel.y = 1;
        player[p].phys.sideBJumpFlag = false;
      }
      else {
        player[p].phys.cVel.y = 0;
      }
      player[p].phys.fastfalled = false;
      player[p].phys.cVel.x *= 0.8;
    }
    else {
      player[p].phys.cVel.x *= 0.2;
    }
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.sidespecial.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.sidespecial.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.sidespecial.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.sidespecial.id3;
    sounds.shout6.play();
    aS[0][56].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][56].interrupt(p)){
      if (player[p].timer == 6){
        sounds.dancingBlade.play();
      }
      if (!player[p].phys.grounded){
        player[p].phys.cVel.y -= 0.06;
        if (player[p].phys.cVel.x > 0){
          player[p].phys.cVel.x -= 0.0025;
          if (player[p].phys.cVel.x < 0){
            player[p].phys.cVel.x = 0;
          }
        }
        else {
          player[p].phys.cVel.x += 0.0025;
          if (player[p].phys.cVel.x > 0){
            player[p].phys.cVel.x = 0
          }
        }
      }
      else {
        reduceByTraction(p,true);
      }

      if (player[p].timer > 4 && player[p].timer < 12){
        drawVfx("swingSideB",new Vec2D(player[p].phys.pos.x+player[p].phys.cVel.x,player[p].phys.pos.y+player[p].phys.cVel.y),player[p].phys.face,player[p].timer-5);
      }
      if (player[p].timer == 6){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 6 && player[p].timer < 9){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 9){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 29){
      if (player[p].phys.grounded){
        aS[0][0].init(p);
      }
      else {
        aS[0][13].init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}

aS[0][105] = {
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
    aS[0][105].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][105].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[0][105].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[0][105].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[0][106] = {
  name : "THROWNPUFFDOWN",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-9.84,-3.86],[-7.24,-5.16],[-4.52,-6.41],[-2.68,-7.35],[-0.51,-8.44],[-0.48,-8.42],[-0.58,-8.37],[-0.59,-8.41],[-0.51,-8.47],[-0.54,-8.45],[-0.59,-8.42],[-0.61,-8.41],[-0.57,-8.42],[-0.50,-8.43],[-0.48,-8.46],[-0.49,-8.49],[-0.49,-8.48],[-0.49,-8.44],[-0.50,-8.42],[-0.54,-8.41],[-0.57,-8.44],[-0.56,-8.47],[-0.54,-8.47],[-0.50,-8.44],[-0.46,-8.40],[-0.49,-8.39],[-0.54,-8.42],[-0.52,-8.47],[-0.51,-8.52],[-0.50,-8.50],[-0.52,-8.43],[-0.46,-8.37],[-0.41,-8.38],[-0.47,-8.44],[-0.51,-8.45],[-0.53,-8.43],[-0.54,-8.41],[-0.47,-8.39],[-0.44,-8.43],[-0.45,-8.48],[-0.46,-8.46],[-0.48,-8.43],[-0.49,-8.41],[-0.55,-8.41],[-0.57,-8.43],[-0.57,-8.46],[-0.55,-8.47],[-0.51,-8.45],[-0.48,-8.40],[-0.51,-8.38],[-0.57,-8.39],[-0.55,-8.44],[-0.55,-8.47],[-0.54,-8.46],[-0.53,-8.43],[-0.48,-8.38],[-0.48,-8.38],[-0.52,-8.44],[-0.50,-8.46],[-0.48,-8.50],[-0.51,-8.49],[-0.55,-8.47],[-0.55,-8.47]],
  init : function(p){
    player[p].actionState = 106;
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

    aS[0][106].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][106].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[0][106].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[0][106].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

aS[0][107] = {
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
    player[p].phys.face*= -1;
    aS[0][107].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][107].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[0][107].offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+aS[0][107].offset[player[p].timer-1][1]);
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

aS[0][108] = {
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
    aS[0][108].main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[0][108].interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+aS[0][108].offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+aS[0][108].offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}
