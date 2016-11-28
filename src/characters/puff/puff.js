/* eslint-disable */

// action state object creation
aS[1]={};
// base action states added
var keys = Object.keys(baseActionStates);
for (var i=0;i<keys.length;i++){
  aS[1][keys[i]] = {};
  $.extend(true,aS[1][keys[i]],baseActionStates[keys[i]]);
}
// set pointer for readibility
var puff = aS[1];

// OVERWRITES START
// BITES PLZ
puff.FURAFURA = {
  name : "FURAFURA",
  init : function(p){
    puff.WAIT.init(p);
    //*cough*BITES*cough*
  }
}

puff.JUMPAERIALF = {
  name : "JUMPAERIALF",
  init : function(p){
    puffNextJump(p);
  }
}
puff.JUMPAERIALB = {
  name : "JUMPAERIALB",
  init : function(p){
    puffNextJump(p);
  }
}

// OVERWRITES END

// UNIQUE ACTION STATES START

//--------------- NORMALS -----------------------
// TILTS
puff.JAB1 = {
  name : "JAB1",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "JAB1";
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.jab1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.jab1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.jab1.id2;
    puff.JAB1.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.JAB1.interrupt(p)){
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
      puff.JAB2.init(p);
      return true;
    }
    else if (player[p].timer > 17){
      puff.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 15){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        puff.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        puff[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        puff[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        puff[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        puff.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        puff.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        puff.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        puff.WALK.init(p,true);
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

puff.JAB2 = {
  name : "JAB2",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "JAB2";
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.jab2.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.jab2.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.jab2.id2;
    puff.JAB2.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.JAB2.interrupt(p)){
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
      puff.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 16){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        puff.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        puff[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        puff[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        puff[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        puff.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        puff.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        puff.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        puff.WALK.init(p,true);
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

puff.DOWNTILT = {
  name : "DOWNTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DOWNTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dtilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dtilt.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dtilt.id2;
    puff.DOWNTILT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.DOWNTILT.interrupt(p)){
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
      puff.SQUATWAIT.init(p);
      return true;
    }
    else if (player[p].timer > 29){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        puff.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        puff[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        puff[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        puff[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        puff.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        puff.SMASHTURN.init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        puff.TILTTURN.init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        puff.WALK.init(p,true);
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

puff.UPTILT = {
  name : "UPTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "UPTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt1.id1;
    puff.UPTILT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.UPTILT.interrupt(p)){
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

puff.FORWARDTILT = {
  name : "FORWARDTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FORWARDTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ftilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ftilt.id1;
    puff.FORWARDTILT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.FORWARDTILT.interrupt(p)){
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

// AERIALS
puff.ATTACKAIRF = {
  name : "ATTACKAIRF",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "ATTACKAIRF";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    player[p].hitboxes.id[0] = player[p].charHitboxes.fair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fair1.id1;
    turnOffHitboxes(p);
    puff.ATTACKAIRF.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.ATTACKAIRF.interrupt(p)){
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
      puff.FALL.init(p);
      return true;
    }
    else if (player[p].timer > 34){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
        puff.JUMPAERIALF.init(p);
        return true;
      }
      else if (a[0]){
        puff[a[1]].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      puff.LANDING.init(p);
    }
    else {
      puff.LANDINGATTACKAIRF.init(p);
    }
  }
}

puff.ATTACKAIRB = {
  name : "ATTACKAIRB",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "ATTACKAIRB";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.bair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.bair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.bair.id2;
    puff.ATTACKAIRB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.ATTACKAIRB.interrupt(p)){
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
      puff.FALL.init(p);
      return true;
    }
    else if (player[p].timer > 30){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
        puff.JUMPAERIALF.init(p);
        return true;
      }
      else if (a[0]){
        puff[a[1]].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      puff.LANDING.init(p);
    }
    else {
      puff.LANDINGATTACKAIRB.init(p);
    }
  }
}

puff.ATTACKAIRU = {
  name : "ATTACKAIRU",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "ATTACKAIRU";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upair.id0;
    puff.ATTACKAIRU.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.ATTACKAIRU.interrupt(p)){
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
      puff.FALL.init(p);
      return true;
    }
    else if (player[p].timer > 37){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && player[p].phys.jumpsUsed < 5){
        puff.JUMPAERIALF.init(p);
        return true;
      }
      else if (a[0]){
        puff[a[1]].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      puff.LANDING.init(p);
    }
    else {
      puff.LANDINGATTACKAIRU.init(p);
    }
  }
}

puff.ATTACKAIRD = {
  name : "ATTACKAIRD",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "ATTACKAIRD";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dair.id3;
    puff.ATTACKAIRD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.ATTACKAIRD.interrupt(p)){
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
      puff.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      puff.LANDING.init(p);
    }
    else {
      puff.LANDINGATTACKAIRD.init(p);
    }
  }
}

puff.ATTACKAIRN = {
  name : "ATTACKAIRN",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "ATTACKAIRN";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.nair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.nair1.id1;
    puff.ATTACKAIRN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.ATTACKAIRN.interrupt(p)){
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
      puff.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      puff.LANDING.init(p);
    }
    else {
      puff.LANDINGATTACKAIRN.init(p);
    }
  }
}
// SMASH ATTACKS

puff.FORWARDSMASH = {
  name : "FORWARDSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [0,0,0,0,0,0.33572,0.87287,1.20857,1.34283,1.91688,2.27501,1.44811,0.63219,0.61772,0.60393,0.59084,0.57844,0.56672,0.55570,0.54536,0.53572,0.52676,0.51849,0.51092,0.50402,0.49783,0.49232,0.48749,0.48336,0.47992,0.47717,0.47510,0.47373,0.47304,0.47304,0.47374,0.47512,0.47719,0.47995,0.48340,0.48754,0.49237,0.44503,0.30789],
  init : function(p){
    player[p].actionState = "FORWARDSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash1.id1;
    puff.FORWARDSMASH.main(p);
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
    if (!puff.FORWARDSMASH.interrupt(p)){
      reduceByTraction(p,true);

      player[p].phys.cVel.x = puff.FORWARDSMASH.setVelocities[player[p].timer-1]*player[p].phys.face;
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

puff.UPSMASH = {
  name : "UPSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "UPSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upsmash.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upsmash.id1;
    randomShout(cS[p]);
    puff.UPSMASH.main(p);
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
    if (!puff.UPSMASH.interrupt(p)){
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
      puff.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 44 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        puff.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        puff[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        puff[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        puff[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        puff.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        puff.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        puff.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        puff.WALK.init(p,true);
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

puff.DOWNSMASH = {
  name : "DOWNSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DOWNSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dsmash.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dsmash.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dsmash.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dsmash.id3;
    randomShout(cS[p]);
    puff.DOWNSMASH.main(p);
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
    if (!puff.DOWNSMASH.interrupt(p)){
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
      puff.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 47 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        puff.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        puff[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        puff[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        puff[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        puff.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        puff.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        puff.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        puff.WALK.init(p,true);
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

// OTHER
puff.ATTACKDASH = {
  name : "ATTACKDASH",
  canEdgeCancel : false,
  setVelocities : [0.99874,1.82126,2.22815,2.43704,1.91481,1.39379,1.36213,1.33162,1.30228,1.27408,1.24704,1.22115,1.19642,1.17284,1.15042,1.12915,1.10902,1.09006,1.06475,1.01691,0.94598,0.85192,0.73477,0.59452,0.43115,0.32167,0.28310,0.24695,0.21323,0.18194,0.15309,0.12666,0.10266,0.08109,0.06194,0.04524,0.03096,0.0191,0.00968],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "ATTACKDASH";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack1.id0;
    puff.ATTACKDASH.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.ATTACKDASH.interrupt(p)){
      player[p].phys.cVel.x = puff.ATTACKDASH.setVelocities[player[p].timer-1]*player[p].phys.face;

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
      puff.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < 5 && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      if (player[p].phys.cVel.x*player[p].phys.face > player[p].charAttributes.dMaxV){
        player[p].phys.cVel.x = player[p].charAttributes.dMaxV*player[p].phys.face;
      }
      puff.GRAB.init(p);
      return true;
    }
    else if (player[p].timer > 38){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        puff.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        puff[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        puff[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        puff[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        puff.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        puff.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        puff.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        puff.WALK.init(p,true);
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

// ----------------SPECIALS-------------
puff.NEUTRALSPECIALAIR = {
  name : "NEUTRALSPECIALAIR",
  canPassThrough : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  specialWallCollide : true,
  specialOnHit : true,
  init : function(p){
    player[p].actionState = "NEUTRALSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.rollOutCharging = false;
    player[p].phys.rollOutCharge = 0;
    player[p].phys.rollOutDistance = 0;
    player[p].phys.rollOutChargeAttempt = true;
    player[p].phys.rollOutVel = 0.5;
    player[p].phys.rollOutPlayerHit = false;
    player[p].phys.rollOutWallHit = false;
    player[p].phys.rollOutPlayerHitTimer = 0;
    player[p].colourOverlay = "rgba(255, 248, 88, 0.83)";
    player[p].phys.cVel.y = Math.max(-1.3,player[p].phys.cVel.y);
    sounds.rolloutshout.play();
    turnOffHitboxes(p);
    puff.NEUTRALSPECIALAIR.main(p);
  },
  main : function(p){
    if (player[p].timer == 15){
      drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
    }
    if (player[p].timer >= 16 && player[p].timer <= 45 && player[p].phys.rollOutChargeAttempt){
      if (player[p].inputs.b[0]){
        player[p].phys.rollOutCharging = true;
        player[p].phys.rollOutCharge++;
        if (player[p].phys.rollOutCharge > 44){
          player[p].phys.rollOutCharge = 44;
        }
        if (player[p].phys.rollOutCharge >= 21){
          if (player[p].timer == 16){
            drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
          }
        }
      }
      else {
        player[p].timer++;
        player[p].phys.rollOutCharging = false;
        player[p].phys.rollOutChargeAttempt = false;
        player[p].phys.rollOutVel = Math.max(0.5,Math.min(4.1,(0.2+(0.09*player[p].phys.rollOutCharge))));
        player[p].phys.cVel.x = player[p].phys.rollOutVel*player[p].phys.face;
        sounds.rolloutlaunch.play();
        sounds.rollouttickair.play();
        if (player[p].phys.rollOutCharge >= 21){
          player[p].hitboxes.frame = 0;
          player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialair.id0;
          player[p].hitboxes.active = [true,false,false,false];
        }
      }
    }
    if (player[p].phys.rollOutCharging || player[p].phys.rollOutDistance < 100 || player[p].phys.rollOutPlayerHit){
      player[p].colourOverlayBool = false;
      if (player[p].timer >= 24 && player[p].timer <= 28 && player[p].phys.rollOutCharge >= 21 && !player[p].phys.rollOutPlayerHit){
        player[p].colourOverlayBool = true;
      }
      player[p].timer += 1+(2*(player[p].phys.rollOutCharge/44));
      if (player[p].timer > 39){
        player[p].timer = 16;
        sounds.rollouttickair.play();
      }
    }
    else {
      player[p].timer++;
    }
    if (!puff.NEUTRALSPECIALAIR.interrupt(p)){
      player[p].phys.cVel.y -= 0.07;
      if (player[p].phys.cVel.y < -1.3){
        player[p].phys.cVel.y = -1.3;
      }
      if (player[p].timer > 15 && player[p].timer < 39 && !player[p].phys.rollOutCharging && !player[p].phys.rollOutChargeAttempt){
        player[p].phys.rollOutDistance++;
        if (!player[p].phys.rollOutPlayerHit){
          var newDmg = 12+Math.round((player[p].phys.rollOutCharge-19)/4);
          player[p].hitboxes.id[0].dmg = newDmg;
          player[p].hitboxes.id[1].dmg = newDmg;
          player[p].hitboxes.id[2].dmg = newDmg;
          if (player[p].phys.rollOutCharge >= 21){
            if (player[p].phys.rollOutDistance % 10 == 0){
              drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
            }
          }
        }
        if (player[p].phys.rollOutDistance > 100 && !player[p].phys.rollOutPlayerHit){
          player[p].timer = 39;
          player[p].phys.cVel.x *= 0.6;
          player[p].colourOverlayBool = false;
          turnOffHitboxes(p);
        }
      }
      if (player[p].phys.rollOutPlayerHit){
        player[p].phys.rollOutPlayerHitTimer++;
        if (player[p].phys.rollOutPlayerHitTimer > 42){
          airDrift(p);
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 70){
      puff.FALLSPECIAL.init(p);
      return false;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.rollOutPlayerHit){
      puff.LANDINGFALLSPECIAL.init(p);
    }
    else {
      player[p].actionState = "NEUTRALSPECIALGROUND";
      if (player[p].phys.rollOutCharge >= 21){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialair.id0;
        player[p].hitboxes.active = [true,false,false,false];
      }
    }
  },
  onWallCollide : function(p,wallFace,wallNum){
    if (!player[p].phys.rollOutCharging && !player[p].phys.rollOutChargeAttempt && !player[p].phys.rollOutPlayerHit){
      player[p].phys.cVel.x *= -0.75;
      player[p].phys.rollOutVel *= 0.75;
      player[p].timer = 16;
      player[p].phys.face *= -1;
      sounds.rollouthit.play();
      if (wallFace == "R"){
        drawVfx("wallBounce",new Vec2D(stage.wallR[wallNum][1].x,player[p].phys.ECBp[3].y),1,1);
      }
      else {
        drawVfx("wallBounce",new Vec2D(stage.wallL[wallNum][1].x,player[p].phys.ECBp[1].y),-1,0);
      }
    }
  },
  onPlayerHit : function(p){
    player[p].phys.rollOutPlayerHit = true;
    player[p].phys.rollOutPlayerHitTimer = 0;
    player[p].phys.cVel.x *= -0.13;
    player[p].phys.cVel.y = 1.6
    player[p].phys.grounded = false;
    sounds.rollouthit.play();
    player[p].colourOverlayBool = false;
    turnOffHitboxes(p);
  }
}

puff.NEUTRALSPECIALGROUND = {
  name : "NEUTRALSPECIALGROUND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  disableTeeter : true,
  airborneState : "NEUTRALSPECIALAIR",
  specialOnHit : true,
  init : function(p){
    player[p].actionState = "NEUTRALSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.rollOutCharging = false;
    player[p].phys.rollOutCharge = 0;
    player[p].phys.rollOutDistance = 0;
    player[p].phys.rollOutChargeAttempt = true;
    player[p].phys.rollOutVel = 0.3;
    player[p].phys.rollOutPlayerHit = false;
    player[p].phys.rollOutWallHit = false;
    player[p].phys.rollOutPlayerHitTimer = 0;
    player[p].colourOverlay = "rgba(255, 248, 88, 0.83)";
    player[p].phys.cVel.x = 0.0001*player[p].phys.face;
    sounds.rolloutshout.play();
    turnOffHitboxes(p);
    puff.NEUTRALSPECIALGROUND.main(p);
  },
  main : function(p){
    if (player[p].timer == 15){
      drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
    }
    if (player[p].timer >= 16 && player[p].timer <= 45 && player[p].phys.rollOutChargeAttempt){
      if (player[p].inputs.b[0]){
        player[p].phys.rollOutCharging = true;
        player[p].phys.rollOutCharge++;
        if (player[p].phys.rollOutCharge > 44){
          player[p].phys.rollOutCharge = 44;
        }
        if (player[p].phys.rollOutCharge >= 19){
          if (player[p].timer == 16){
            drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
          }
        }
        player[p].phys.cVel.x = 0.0001*player[p].phys.face;
      }
      else {
        player[p].timer++;
        player[p].phys.rollOutCharging = false;
        player[p].phys.rollOutChargeAttempt = false;
        player[p].phys.rollOutVel = Math.min(4.2,(0.3+(0.09*player[p].phys.rollOutCharge)));
        sounds.stronghit.play();
        sounds.rolloutlaunch.play();
        sounds.rollouttickground.play();
        if (player[p].phys.rollOutCharge >= 19){
          player[p].hitboxes.frame = 0;
          player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialground.id0;
          player[p].hitboxes.id[1] = player[p].charHitboxes.neutralspecialground.id1;
          player[p].hitboxes.id[2] = player[p].charHitboxes.neutralspecialground.id2;
          player[p].hitboxes.active = [true,true,true,false];
        }
      }
    }
    if (player[p].phys.rollOutCharging || player[p].phys.rollOutDistance < 100){
      player[p].timer += 1+(2*(player[p].phys.rollOutCharge/44));
      player[p].colourOverlayBool = false;
      if (player[p].timer >= 28 && player[p].timer <= 34 && player[p].phys.rollOutCharge >= 19 && !player[p].phys.rollOutPlayerHit){
        player[p].colourOverlayBool = true;
      }
      if (player[p].timer > 45){
        player[p].timer = 16;
        sounds.rollouttickground.play();
      }
    }
    else {
      player[p].timer++;
    }
    if (!puff.NEUTRALSPECIALGROUND.interrupt(p)){

      if (player[p].timer > 15 && player[p].timer < 46 && !player[p].phys.rollOutCharging && !player[p].phys.rollOutChargeAttempt){
        player[p].phys.rollOutDistance++;
        if (!player[p].phys.rollOutPlayerHit){
          var newDmg = 12+Math.round((player[p].phys.rollOutCharge-19)/4);
          player[p].hitboxes.id[0].dmg = newDmg;
          player[p].hitboxes.id[1].dmg = newDmg;
          player[p].hitboxes.id[2].dmg = newDmg;
          if (player[p].phys.rollOutCharge >= 19){
            if (player[p].phys.rollOutDistance % 10 == 0){
              drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
            }
          }
        }
        if (player[p].phys.rollOutDistance > 100){
          turnOffHitboxes(p);
          player[p].timer = 46;
          player[p].phys.cVel.x *= 0.6;
          player[p].colourOverlayBool = false;
        }
        else {
          player[p].phys.cVel.x = player[p].phys.rollOutVel*player[p].phys.face;
          if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.49){
            puff.NEUTRALSPECIALGROUNDTURN.init(p);
            player[p].colourOverlayBool = false;
          }
        }
      }
      if (player[p].timer >= 46){
        var sign = Math.sign(player[p].phys.cVel.x);
        player[p].phys.cVel.x -= 0.09*sign;
        if (player[p].phys.cVel.x*sign < 0){
          player[p].phys.cVel.x=0;
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 77){
      puff.WAIT.init(p);
      return false;
    }
    else {
      return false;
    }
  },
  onPlayerHit : function(p){
    player[p].actionState = "NEUTRALSPECIALAIR";
    puff.NEUTRALSPECIALAIR.onPlayerHit(p);
  }
}

puff.NEUTRALSPECIALGROUNDTURN = {
  name : "NEUTRALSPECIALGROUNDTURN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  specialOnHit : true,
  init : function(p){
    player[p].actionState = "NEUTRALSPECIALGROUNDTURN",
    player[p].timer = 0;
    player[p].phys.rollOutTurnTimer = 0;
    player[p].phys.face *= -1;
    sounds.rolloutlaunch.play();
    turnOffHitboxes(p);
    puff.NEUTRALSPECIALGROUNDTURN.main(p);
  },
  main : function(p){
    player[p].timer+=3;
    if (player[p].timer > 30){
      player[p].timer = 3;
    }
    player[p].phys.rollOutTurnTimer++;
    player[p].phys.rollOutDistance++;
    if (!puff.NEUTRALSPECIALGROUNDTURN.interrupt(p)){
      player[p].phys.cVel.x = (player[p].phys.rollOutVel*player[p].phys.face*-1)-(player[p].phys.rollOutVel*0.045*player[p].phys.rollOutTurnTimer*player[p].phys.face*-1);
      if (player[p].phys.rollOutDistance % 5 == 0){
        drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
      }
    }
  },
  interrupt : function(p){
    if (player[p].phys.rollOutDistance > 100){
      player[p].actionState = "NEUTRALSPECIALGROUND";
      player[p].timer = 46;
      return true;
    }
    else if (player[p].phys.rollOutTurnTimer > 28){
      player[p].phys.cVel.x = player[p].phys.rollOutVel*player[p].phys.face;
      player[p].actionState = "NEUTRALSPECIALGROUND";
      player[p].timer = 15+player[p].timer;
      if (player[p].phys.rollOutCharge >= 19){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialground.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.neutralspecialground.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.neutralspecialground.id2;
        player[p].hitboxes.active = [true,true,true,false];
      }
      sounds.stronghit.play();
      return true;
    }
    else {
      return false;
    }
  },
  onPlayerHit : function(p){
    player[p].actionState = "NEUTRALSPECIALAIR";
    puff.NEUTRALSPECIALAIR.onPlayerHit(p);
  }
}

puff.SIDESPECIALAIR = {
  name : "SIDESPECIALAIR",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  groundVelocities : [1.88,1.50792,1.31208,1.14561,0.73439,0.34986,0.34461,0.33943,0.33430,0.32924,0.32424,0.31930,0.31443,0.30961,0.30486,0.30017,0.29554,0.29097,0.28647,0.28202,0.27764,0.27332,0.26906,0.26487,0.26074,0.25666,0.25265,0.23230,0.19657,0.16230,0.12950,0.09816,0.06830,0.03990],
  airVelocities : [2.024,1.86208,1.71311,1.57606,1.44998,1.33398,1.22726,1.12908,1.03876,0.95565,0.87920,0.80887,0.74416,0.68462,0.62985,0.57947,0.53311,0.49046,0.45122,0.41513,0.38192,0.35136,0.32325,0.29739,0.27360,0.25171,0.23158,0.21305],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "SIDESPECIALAIR";
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
    puff.SIDESPECIALAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.SIDESPECIALAIR.interrupt(p)){

      if (player[p].phys.grounded){
        if (player[p].timer > 11){
          player[p].phys.cVel.x = puff.SIDESPECIALAIR.groundVelocities[player[p].timer-12]*player[p].phys.face;
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
          player[p].phys.cVel.x = puff.SIDESPECIALAIR.airVelocities[player[p].timer-12]*player[p].phys.face*Math.cos(player[p].phys.upbAngleMultiplier);
          player[p].phys.cVel.y = puff.SIDESPECIALAIR.airVelocities[player[p].timer-12]*Math.sin(player[p].phys.upbAngleMultiplier);
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
        puff.WAIT.init(p);
      }
      else {
        puff.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "SIDESPECIALGROUND";
  }
}
puff.SIDESPECIALGROUND = {
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
    player[p].actionState = "SIDESPECIALGROUND";
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
    puff.SIDESPECIALGROUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.SIDESPECIALGROUND.interrupt(p)){

      if (player[p].phys.grounded){
        if (player[p].timer > 11){
          player[p].phys.cVel.x = puff.SIDESPECIALGROUND.groundVelocities[player[p].timer-12]*player[p].phys.face;
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
          player[p].phys.cVel.x = puff.SIDESPECIALGROUND.airVelocities[player[p].timer-12]*player[p].phys.face*Math.cos(player[p].phys.upbAngleMultiplier);
          player[p].phys.cVel.y = puff.SIDESPECIALGROUND.airVelocities[player[p].timer-12]*Math.sin(player[p].phys.upbAngleMultiplier);
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
        puff.WAIT.init(p);
      }
      else {
        puff.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
}
puff.DOWNSPECIALAIR = {
  name : "DOWNSPECIALAIR",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "DOWNSPECIALAIR";
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
    puff.DOWNSPECIALAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.DOWNSPECIALAIR.interrupt(p)){
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
        puff.WAIT.init(p);
      }
      else {
        puff.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    //player[p].actionState = 109;
  }
}

puff.DOWNSPECIALGROUND = {
  name : "DOWNSPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "DOWNSPECIALGROUND";
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
    puff.DOWNSPECIALGROUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.DOWNSPECIALGROUND.interrupt(p)){
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
        puff.WAIT.init(p);
      }
      else {
        puff.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    //player[p].actionState = 109;
  }
}

puff.UPSPECIAL = {
  name : "UPSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,true],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "UPSPECIAL";
    player[p].timer = 0;
    //23
    //71
    //122
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
    player[p].hitboxes.id[0] = player[p].charHitboxes.upb.id0;
    puff.UPSPECIAL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.UPSPECIAL.interrupt(p)){
      if (player[p].timer == 23 || player[p].timer == 71 || player[p].timer == 122){
        drawVfx("sing",new Vec2D(0,0),p);
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
        player[p].hitboxes.id[0].size = 10.937;
      }
      else if (player[p].timer == 36){
        player[p].hitboxes.id[0].size = 1;
      }
      else if (player[p].timer == 69){
        player[p].hitboxes.id[0].size = 10.937;
      }
      else if (player[p].timer == 77){
        player[p].hitboxes.id[0].size = 1;
      }
      else if (player[p].timer == 113){
        player[p].hitboxes.id[0].size = 12.890;
      }
      else if (player[p].timer == 126){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 179){
      if (player[p].phys.grounded){
        puff.WAIT.init(p);
      }
      else {
        puff.FALLSPECIAL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){

  }
}

// ---------- THROWS -----------

puff.THROWFORWARD = {
  name : "THROWFORWARD",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWFORWARD";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNPUFFFORWARD.init(player[p].phys.grabbing);
    var frame = frames[cS[player[p].phys.grabbing]].THROWNPUFFFORWARD;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwforward.id0;
    randomShout(cS[p]);
    puff.THROWFORWARD.main(p);
  },
  main : function(p){
    player[p].timer+=12/player[p].phys.releaseFrame;
    if (!puff.THROWFORWARD.interrupt(p)){
      if (Math.floor(player[p].timer+0.01) == 12){
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
      puff.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      puff.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

puff.THROWBACK = {
  name : "THROWBACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [-0.12755,-1.24035,-3.10533,-2.72023,-0.32654,0,0,0,0.00357,0.09035,0.22531,0.37797,0.54831,1.35048,1.60332,1.04371,0.81257,0.60621,0.42461,0.26777,0.1357,0.03,0],
  init : function(p){
    player[p].actionState = "THROWBACK";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNPUFFBACK.init(player[p].phys.grabbing);
    var frame = frames[cS[player[p].phys.grabbing]].THROWNPUFFBACK;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
    randomShout(cS[p]);
    puff.THROWBACK.main(p);
  },
  main : function(p){
    player[p].timer+=(22/player[p].phys.releaseFrame);
    if (!puff.THROWBACK.interrupt(p)){
      if (Math.floor(player[p].timer+0.01) > 13 && Math.floor(player[p].timer+0.01 < 37)){
        player[p].phys.cVel.x = puff.THROWBACK.setVelocities[Math.floor(player[p].timer+0.01)-14]*player[p].phys.face;
      }
      if (Math.floor(player[p].timer+0.01) == 22){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 43){
      player[p].phys.grabbing = -1;
      puff.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      puff.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.THROWUP = {
  name : "THROWUP",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWUP";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNPUFFUP.init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    var frame = frames[cS[player[p].phys.grabbing]].THROWNPUFFUP;
    player[p].phys.releaseFrame = frame+1;
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
    puff.THROWUP.main(p);
  },
  main : function(p){
    player[p].timer+=7/player[p].phys.releaseFrame;
    if (!puff.THROWUP.interrupt(p)){
      if (Math.floor(player[p].timer+0.01) == 7){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 41){
      player[p].phys.grabbing = -1;
      puff.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      console.log("test");
      puff.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

puff.THROWDOWN = {
  name : "THROWDOWN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWDOWN";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNPUFFDOWN.init(player[p].phys.grabbing);
    var frame = frames[cS[player[p].phys.grabbing]].THROWNPUFFDOWN;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwdownextra.id0;
    randomShout(cS[p]);
    puff.THROWDOWN.main(p);
  },
  main : function(p){
    player[p].timer+=61/player[p].phys.releaseFrame;
    if (!puff.THROWDOWN.interrupt(p)){
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
      if (Math.floor(player[p].timer+0.01) == 61){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 84){
      player[p].phys.grabbing = -1;
      puff.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      console.log("test");
      puff.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

//-----------THROWNS------------

puff.THROWNMARTHUP = {
  name : "THROWNMARTHUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.38,7.51],[-11.19,6.91],[-11.33,6.67],[-10.92,6.78],[-10.55,6.91],[-10.51,6.93],[-7.57,17.47],[-7.57,17.47]],
  init : function(p){
    player[p].actionState = "THROWNMARTHUP";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    puff.THROWNMARTHUP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNMARTHUP.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNMARTHUP.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNMARTHUP.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}


puff.THROWNMARTHDOWN = {
  name : "THROWNMARTHDOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.42,8.24],[-12.78,9.07],[-13.1,9.18],[-13.1,9.18],[-13.46,8.44],[-13.71,6.36],[-12.79,3.86],[-10.42,0.27],[-10.42,0.27]],
  init : function(p){
    player[p].actionState = "THROWNMARTHDOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    puff.THROWNMARTHDOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNMARTHDOWN.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNMARTHDOWN.offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNMARTHDOWN.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}


puff.THROWNMARTHBACK = {
  name : "THROWNMARTHBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-6.22,7.33],[-1.72,7.12],[-0.02,4.56],[0.80,2.86],[0.80,2.86]],
  init : function(p){
    player[p].actionState = "THROWNMARTHBACK";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    puff.THROWNMARTHBACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNMARTHBACK.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNMARTHBACK.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNMARTHBACK.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}


puff.THROWNMARTHFORWARD = {
  name : "THROWNMARTHFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-11.71,7.06],[-10.22,9.68],[-9.84,9.94],[-9.70,9.88],[-10.01,9.67],[-14.00,8.67],[-11.76,5.89],[-8.89,-0.35],[-8.89,-0.35]],
  init : function(p){
    player[p].actionState = "THROWNMARTHFORWARD";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    puff.THROWNMARTHFORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNMARTHFORWARD.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNMARTHFORWARD.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNMARTHFORWARD.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}
puff.THROWNPUFFFORWARD = {
  name : "THROWNPUFFFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.52,-3.27],[-9.84,-3.27],[-9.13,-3.27],[-8.70,-3.27],[-8.60,-3.27],[-8.61,-3.27],[-8.67,-3.27],[-8.70,-3.27],[-9.78,-3.27],[-9.78,0.01]],
  init : function(p){
    player[p].actionState = "THROWNPUFFFORWARD";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    puff.THROWNPUFFFORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNPUFFFORWARD.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNPUFFFORWARD.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNPUFFFORWARD.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

puff.THROWNPUFFDOWN = {
  name : "THROWNPUFFDOWN",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.26,0.98],[-7.67,-0.31],[-4.94,-1.56],[-3.10,-2.50],[-0.94,-3.59],[-0.90,-3.57],[-1.00,-3.52],[-1.01,-3.56],[-0.94,-3.62],[-0.97,-3.60],[-1.02,-3.58],[-1.04,-3.56],[-1.00,-3.57],[-0.93,-3.58],[-0.91,-3.61],[-0.92,-3.64],[-0.91,-3.63],[-0.92,-3.60],[-0.92,-3.57],[-0.97,-3.57],[-1.00,-3.59],[-0.98,-3.62],[-0.96,-3.62],[-0.92,-3.59],[-0.89,-3.55],[-0.91,-3.54],[-0.96,-3.57],[-0.95,-3.62],[-0.93,-3.67],[-0.93,-3.65],[-0.95,-3.58],[-0.89,-3.52],[-0.84,-3.53],[-0.89,-3.59],[-0.94,-3.60],[-0.96,-3.59],[-0.96,-3.56],[-0.90,-3.54],[-0.86,-3.58],[-0.88,-3.63],[-0.88,-3.61],[-0.90,-3.58],[-0.92,-3.56],[-0.97,-3.56],[-1.00,-3.58],[-1.00,-3.62],[-0.98,-3.63],[-0.94,-3.60],[-0.91,-3.55],[-0.94,-3.53],[-0.99,-3.55],[-0.98,-3.59],[-0.98,-3.62],[-0.96,-3.61],[-0.95,-3.58],[-0.91,-3.53],[-0.90,-3.53],[-0.94,-3.59],[-0.93,-3.61],[-0.90,-3.65],[-0.93,-3.64],[-0.98,-3.62],[-0.98,-3.62]],
  init : function(p){
    player[p].actionState = "THROWNPUFFDOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

    puff.THROWNPUFFDOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNPUFFDOWN.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNPUFFDOWN.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNPUFFDOWN.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

puff.THROWNPUFFBACK = {
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
    player[p].actionState = "THROWNPUFFBACK";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    puff.THROWNPUFFBACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNPUFFBACK.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNPUFFBACK.offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNPUFFBACK.offset[player[p].timer-1][1]);
        /*if (player[p].timer > 13 && player[p].timer < 19){
          player[p].phys.pos.x += aS[0].THROWNPUFFBACK.offsetVel[player[p].timer-14]*player[p].phys.face;
        }*/
      }

    }
  },
  interrupt : function(p){
    return false;
  }
}

puff.THROWNPUFFUP = {
  name : "THROWNPUFFUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.63,-3.65],[-9.46,-4.14],[-7.29,-4.39],[-2.98,-3.79],[2.65,-2.33],[4.95,-0.64],[4.95,-0.64]],
  init : function(p){
    player[p].actionState = "THROWNPUFFUP";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    puff.THROWNPUFFUP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNPUFFUP.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNPUFFUP.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNPUFFUP.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

puff.THROWNFOXFORWARD = {
  name : "THROWNFOXFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-7.74-0.08,2.53],[-7.17-0.22,3.27],[-7.15-0.24,3.42],[-7.34,3.43],[-7.44+0.68,3.60],[-7.65+1.67,3.79],[-8.06+2.69,3.95],[-8.77+3.47,4.02],[-10.03+4.04,3.91],[-12.03+4.61,3.68],[-12.03+4.61,3.68]],
  //[0.08,0.22,0.24,0,-0.68,-1.67,-2.69,-3.47,-4.04,-4.61]
  init : function(p){
    player[p].actionState = "THROWNFOXFORWARD";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    puff.THROWNFOXFORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNFOXFORWARD.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNFOXFORWARD.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNFOXFORWARD.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

puff.THROWNFOXDOWN = {
  name : "THROWNFOXDOWN",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-4.73,2.26],[-2.33,1.03],[-1.90,0.93],[-1.84,1.06],[-1.84,1.52],[-1.98,3.71],[-1.04,6.74],[-0.05,7.45],[0.82,7.62],[1.03,7.33],[1.07,6.86],[1.07,7.12],[1.07,7.30],[0.85,7.44],[-0.45,9.89],[-0.78,-0.74],[-0.82,-1.45],[-0.81,-0.59],[-0.78,0.19],[-0.72,-0.15],[-0.65,-0.88],[-0.57,-0.99],[-0.50,0.52],[-0.50,-1.74],[-0.50,-1.44],[-0.50,-1.14],[-0.50,-0.85],[-0.50,-0.58],[-0.50,-0.33],[-0.50,-0.10],[-0.50,0.10],[-0.50,0.26],[-0.50,0.26]],
  init : function(p){
    player[p].actionState = "THROWNFOXDOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

    puff.THROWNFOXDOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNFOXDOWN.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNFOXDOWN.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNFOXDOWN.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

puff.THROWNFOXBACK = {
  name : "THROWNFOXBACK",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  reverseModel : true,
  //[1.05,7.14],[3.78,7.55],[10.37,1.56],[13.72,-6.85],[13.66,-9.95],[13.67,-10.28],[13.85,-9.92],[14.04,-9.34],[14.04,-9.34]],
  offset : [[-7.91,1.71],[-5.60,1.14],[-1.22,-0.33],[3.34,-1.09],[8.23,6.71],[8.23,6.71]],
  //7.53
  init : function(p){
    player[p].actionState = "THROWNFOXBACK";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face*= -1;
    puff.THROWNFOXBACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNFOXBACK.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNFOXBACK.offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNFOXBACK.offset[player[p].timer-1][1]);
      }

    }
  },
  interrupt : function(p){
    return false;
  }
}

puff.THROWNFOXUP = {
  name : "THROWNFOXUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-6.30,2.16],[-5.56,2.71],[-5.19,2.38],[-3.03,12.89],[-3.03,12.89]],
  init : function(p){
    player[p].actionState = "THROWNFOXUP";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    puff.THROWNFOXUP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.THROWNFOXUP.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+puff.THROWNFOXUP.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+puff.THROWNFOXUP.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}


// --------------CLIFF ACTIONS--------

puff.CLIFFGETUPQUICK = {
  name : "CLIFFGETUPQUICK",
  canBeGrabbed : true,
  offset : [[-73.32063,-8.97483],[-73.806,-7.875],[-74.29,-6.36],[-74.51,-4.7],[-74.39,-2.91],[-74.06,-1.07],[-73.57,0.48],[-72.954,1.81],[-72.24,3.06],[-71.46,3.99],[-70.68,4.36],[-69.75,3.23],[-68.82,1.13],[-67.98,0],[-67.93,0],[-67.77,0],[-67.54,0],[-67.25,0],[-66.92,0],[-66.57,0],[-66.22,0],[-65.89,0],[-65.6,0],[-65.37,0],[-65.22,0],[-65.16,0],[-65.16,0],[-65.16,0],[-65.16,0],[-65.16,0],[-65.16,0],[-65.16,0],[-65.16,0]],
  init : function(p){
    player[p].actionState = "CLIFFGETUPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 30;
    puff.CLIFFGETUPQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.CLIFFGETUPQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 16){
        player[p].phys.pos = new Vec2D(x+(puff.CLIFFGETUPQUICK.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+puff.CLIFFGETUPQUICK.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.pos.x = x+(68.4+puff.CLIFFGETUPQUICK.offset[player[p].timer-1][0])*player[p].phys.face;
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

puff.CLIFFGETUPSLOW = {
  name : "CLIFFGETUPSLOW",
  offset : [[-73.10,-9.44],[-73.10,-9.56],[-73.09,-9.71],[-73.09,-9.87],[-73.09,-10.01],[-73.09,-10.12],[-73.09,-10.19],[-73.09,-10.23],[-73.09,-10.24],[-73.09,-10.21],[-73.09,-10.14],[-73.09,-10.04],[-73.09,-9.94],[-73.09,-9.89],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.63],[-73.09,-9.04],[-73.09,-8.28],[-73.09,-7.52],[-73.09,-6.76],[-73.09,-5.93],[-73.09,-5.07],[-73.09,-4.23],[-72.76,-3.35],[-71.98,-2.44],[-71.05,-1.60],[-70.28,-0.94],[-69.68,-0.50],[-69.11,-0.21],[-68.66,-0.05],[-68.14,0]],
  setVelocities : [0.12,0.10,0.08,0.07,0.06,0.05,0.05,0.06,0.07,0.08,0.09,0.12,0.16,0.20,0.23,0.25,0.25,0.24,0.21,0.17,0.12,0.05,0.004],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFGETUPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 55;
    puff.CLIFFGETUPSLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.CLIFFGETUPSLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 34){
        player[p].phys.pos = new Vec2D(x+(puff.CLIFFGETUPSLOW.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+puff.CLIFFGETUPSLOW.offset[player[p].timer-1][1]);
      }
      else if (player[p].timer < 57){
        player[p].phys.cVel.x = puff.CLIFFGETUPSLOW.setVelocities[player[p].timer-34]*player[p].phys.face;
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

puff.CLIFFESCAPEQUICK = {
  name : "CLIFFESCAPEQUICK",
  offset : [[-74.04,-8.78],[-74.48,-7.21],[-74.42,-5.16],[-74.24,-3.09],[-73.97,-1.28],[-73.59,0.24],[-73.14,1.46],[-72.61,2.35],[-72.01,2.87],[-71.36,3.00],[-70.66,2.72],[-69.93,1.80],[-69.17,0.60],[-67.63,0]],
  setVelocities : [0.64,0.40,0.21,0.08,-0.003,-0.03,0.002,0.09,0.23,0.42,0.67,0.97,1.27,1.52,1.76,1.99,2.21,2.42,2.62,2.81,2.99,3.16,3.32,3.48,0.12,0.33,0.49,0.59,0.65,0.65,0.60,0.49,0.34,0.13,0.002],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFESCAPEQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 28;
    puff.CLIFFESCAPEQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.CLIFFESCAPEQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 15){
        player[p].phys.pos = new Vec2D(x+(puff.CLIFFESCAPEQUICK.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+puff.CLIFFESCAPEQUICK.offset[player[p].timer-1][1]);
      }
      else if (player[p].timer < 50){
        player[p].phys.cVel.x = puff.CLIFFESCAPEQUICK.setVelocities[player[p].timer-15]*player[p].phys.face;
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }

}

puff.CLIFFESCAPESLOW = {
  name : "CLIFFESCAPESLOW",
  offset : [[-73.10,-9.44],[-73.09,-9.56],[-73.09,-9.71],[-73.09,-9.87],[-73.09,-10.01],[-73.09,-10.12],[-73.09,-10.19],[-73.09,-10.23],[-73.09,-10.24],[-73.09,-10.21],[-73.09,-10.14],[-73.09,-10.04],[-73.09,-9.94],[-73.09,-9.89],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.63],[-73.09,-9.04],[-73.09,-8.28],[-73.09,-7.52],[-73.09,-6.76],[-73.09,-5.93],[-73.09,-5.07],[-73.09,-4.23],[-72.78,-3.37],[-72.02,-2.48],[-71.10,-1.64],[-70.28,-0.94],[-69.52,-0.43],[-68.80,-0.11],[-68,0]],
  setVelocities : [0.63,1.31,1.52,1.24,0.96,1.01,1.05,1.08,1.11,1.14,1.16,1.18,1.20,1.21,1.22,1.22,1.22,1.21,1.20,1.19,1.17,1.15,1.12,1.09,1.06,1.02,0.98,0.93,0.88,0.82,0.77,0.70,0.63,0.56,0.49,0.41,0.32,0.24,0.15,0.05,0],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFESCAPESLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 53;
    puff.CLIFFESCAPESLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.CLIFFESCAPESLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 33){
        player[p].phys.pos = new Vec2D(x+(puff.CLIFFESCAPESLOW.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+puff.CLIFFESCAPESLOW.offset[player[p].timer-1][1]);
      }
      else if (player[p].timer < 74){
        player[p].phys.cVel.x = puff.CLIFFESCAPESLOW.setVelocities[player[p].timer-33]*player[p].phys.face;
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

puff.CLIFFATTACKSLOW = {
  name : "CLIFFATTACKSLOW",
  offset : [[-73.10,-9.44],[-73.10,-9.56],[-73.10,-9.71],[-73.09,-9.87],[-73.09,-10.01],[-73.09,-10.12],[-73.09,-10.19],[-73.09,-10.23],[-73.09,-10.24],[-73.09,-10.21],[-73.09,-10.14],[-73.09,-10.04],[-73.09,-9.94],[-73.09,-9.89],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.87],[-73.09,-9.63],[-73.09,-9.04],[-73.09,-8.28],[-73.09,-7.52],[-73.09,-6.76],[-73.09,-5.93],[-73.09,-5.07],[-73.09,-4.23],[-72.76,-3.35],[-71.98,-2.44],[-71.05,-1.60],[-70.28,-0.94],[-69.72,-0.50],[-69.22,-0.21],[-68.78,-0.05],[-68.02,0]],
  setVelocities : [0.34,0.34,0.35,0.38,0.43,0.50,0.59,0.69,1.86,2.03,1.09,1.02,0.85,0.58,0.22,-0.07,-0.20,-0.31,-0.40,-0.47,-0.53,-0.57,-0.59,-0.59,-0.58,-0.55,-0.50,-0.43,-0.35,-0.25,-0.16,-0.09,-0.03,0.002,0.02,0.03],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFATTACKSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 39;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupslow.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupslow.id1;
    puff.CLIFFATTACKSLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.CLIFFATTACKSLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 34){
        player[p].phys.pos = new Vec2D(x+(puff.CLIFFATTACKSLOW.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+puff.CLIFFATTACKSLOW.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = puff.CLIFFATTACKSLOW.setVelocities[player[p].timer-34]*player[p].phys.face;
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

puff.CLIFFATTACKQUICK = {
  name : "CLIFFATTACKQUICK",
  offset : [[-73.32,-8.97],[-73.81,-7.87],[-74.29,-6.36],[-74.51,-4.70],[-74.44,-2.88],[-74.22,-0.88],[-73.87,1.08],[-73.40,2.76],[-72.81,3.94],[-72.11,4.39],[-71.31,3.70],[-70.42,2.19],[-69.45,0.69],[-67.35,0]],
  setVelocities : [1.16,1.27,1.29,1.24,1.1,0.89,0.59,0.21,-0.18,-0.34,-0.18,0],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFATTACKQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 15;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupquick.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupquick.id1;
    puff.CLIFFATTACKQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.CLIFFATTACKQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 15){
        player[p].phys.pos = new Vec2D(x+(puff.CLIFFATTACKQUICK.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+puff.CLIFFATTACKQUICK.offset[player[p].timer-1][1]);
      }
      else if (player[p].timer < 27){
        player[p].phys.cVel.x = puff.CLIFFATTACKQUICK.setVelocities[player[p].timer-15]*player[p].phys.face;
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }

}

puff.CLIFFJUMPQUICK = {
  name : "CLIFFJUMPQUICK",
  offset : [[-73.32,-8.97],[-73.81,-7.87],[-74.29,-6.36],[-74.51,-4.70],[-74.43,-2.80],[-74.13,-0.84],[-73.57,0.48],[-72.72,1.10],[-71.70,1.48],[-70.62,1.63],[-69.61,1.60],[-68.82,1.43],[-68.42,0.95],[-68.36,0.32]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFJUMPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 14;
    puff.CLIFFJUMPQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.CLIFFJUMPQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 15){
        player[p].phys.pos = new Vec2D(x+(puff.CLIFFJUMPQUICK.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+puff.CLIFFJUMPQUICK.offset[player[p].timer-1][1]);
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
      puff.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

puff.CLIFFJUMPSLOW = {
  name : "CLIFFJUMPSLOW",
  offset : [[-73.10,-9.01],[-73.10,-8.03],[-73.09,-6.73],[-73.09,-5.37],[-73.09,-4.23],[-72.76,-3.29],[-71.98,-2.38],[-71.05,-1.58],[-70.28,-0.94],[-69.66,-0.50],[-69.05,-0.21],[-68.59,-0.05],[-68.4,0],[-68.4,0],[-68.4,0],[-68.4,0],[-68.4,0]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFJUMPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 17;
    puff.CLIFFJUMPSLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.CLIFFJUMPSLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 18){
        player[p].phys.pos = new Vec2D(x+(puff.CLIFFJUMPSLOW.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+puff.CLIFFJUMPSLOW.offset[player[p].timer-1][1]);
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
      puff.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
// --------------- MISC -------------
puff.CATCHATTACK = {
  name : "CATCHATTACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CATCHATTACK";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.pummel.id0;
    puff.CATCHATTACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.CATCHATTACK.interrupt(p)){
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
      puff.CATCHWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.GRAB = {
  name : "GRAB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "GRAB";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.grab.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.grab.id1;
    puff.GRAB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.GRAB.interrupt(p)){
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.DOWNATTACK = {
  name : "DOWNATTACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DOWNATTACK";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downattack1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.downattack1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.downattack1.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.downattack1.id3;
    puff.DOWNATTACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.DOWNATTACK.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 1){
        player[p].phys.intangibleTimer = 15
      }
      if (player[p].timer == 20){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 20 && player[p].timer < 22){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 22){
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
      puff.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

// ------- PUFF JUMPS ---------
window.puffMultiJumpDrift = function(p){
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

window.puffNextJump = function(p){
  if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 && Math.sign(player[p].inputs.lStickAxis[0].x) != player[p].phys.face){
    puff["AERIALTURN"+(1+player[p].phys.jumpsUsed)].init(p);
  }
  else {
    puff["JUMPAERIAL"+(1+player[p].phys.jumpsUsed)].init(p);
  }
}

puff.JUMPAERIAL1 = {
  name : "JUMPAERIAL1",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "JUMPAERIAL1";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.cVel.y = 1.65;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    puff.JUMPAERIAL1.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.JUMPAERIAL1.interrupt(p)){
      fastfall(p);
      puffMultiJumpDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      puff[a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      puff.ESCAPEAIR.init(p);
      return true;
    }
    else if (b[0]){
      puff[b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 28 && (player[p].inputs.x[0] || player[p].inputs.y[0] || player[p].inputs.lStickAxis[0].y > 0.7)){
      puffNextJump(p);
      return true;
    }
    else if (player[p].timer > 50){
      puff.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.JUMPAERIAL2 = {
  name : "JUMPAERIAL2",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "JUMPAERIAL2";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.59;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    puff.JUMPAERIAL2.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!puff.JUMPAERIAL2.interrupt(p)){
      fastfall(p);
      puffMultiJumpDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      puff[a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      puff.ESCAPEAIR.init(p);
      return true;
    }
    else if (b[0]){
      puff[b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 28 && (player[p].inputs.x[0] || player[p].inputs.y[0] || player[p].inputs.lStickAxis[0].y > 0.7)){
      puffNextJump(p);
      return true;
    }
    else if (player[p].timer > 50){
      puff.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.JUMPAERIAL3 = {
  name : "JUMPAERIAL3",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "JUMPAERIAL3";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.47;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    puff.JUMPAERIAL3.main(p);

  },
  main : function(p){
    player[p].timer++;
    if (!puff.JUMPAERIAL3.interrupt(p)){
      fastfall(p);
      puffMultiJumpDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      puff[a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      puff.ESCAPEAIR.init(p);
      return true;
    }
    else if (b[0]){
      puff[b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 28 && (player[p].inputs.x[0] || player[p].inputs.y[0] || player[p].inputs.lStickAxis[0].y > 0.7)){
      puffNextJump(p);
      return true;
    }
    else if (player[p].timer > 50){
      puff.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.JUMPAERIAL4 = {
  name : "JUMPAERIAL4",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "JUMPAERIAL4";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.36;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    puff.JUMPAERIAL4.main(p);

  },
  main : function(p){
    player[p].timer++;
    if (!puff.JUMPAERIAL4.interrupt(p)){
      fastfall(p);
      puffMultiJumpDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      puff[a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      puff.ESCAPEAIR.init(p);
      return true;
    }
    else if (b[0]){
      puff[b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 28 && (player[p].inputs.x[0] || player[p].inputs.y[0] || player[p].inputs.lStickAxis[0].y > 0.7)){
      puffNextJump(p);
      return true;
    }
    else if (player[p].timer > 50){
      puff.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.JUMPAERIAL5 = {
  name : "JUMPAERIAL5",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "JUMPAERIAL5";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.25;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    puff.JUMPAERIAL5.main(p);

  },
  main : function(p){
    player[p].timer++;
    if (!puff.JUMPAERIAL5.interrupt(p)){
      fastfall(p);
      puffMultiJumpDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      puff[a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      puff.ESCAPEAIR.init(p);
      return true;
    }
    else if (b[0]){
      puff[b[1]].init(p);
      return true;
    }
    else if (player[p].timer > 50){
      puff.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

puff.AERIALTURN1 = {
  name : "AERIALTURN1",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "AERIALTURN1";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.cVel.y = 1.65;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    puff.AERIALTURN1.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 13){
      player[p].timer--;
      player[p].actionState = "JUMPAERIAL1";
      puff.JUMPAERIAL1.main(p);
    }
    else {
      if (!puff.AERIALTURN1.interrupt(p)){
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
      puff[a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      puff.ESCAPEAIR.init(p);
      return true;
    }
    else if (b[0]){
      puff[b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.AERIALTURN2 = {
  name : "AERIALTURN2",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "AERIALTURN2";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.59;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    puff.AERIALTURN2.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 13){
      player[p].timer--;
      player[p].actionState = "JUMPAERIAL2";
      puff.JUMPAERIAL2.main(p);
    }
    else {
      if (!puff.AERIALTURN2.interrupt(p)){
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
      puff[a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      puff.ESCAPEAIR.init(p);
      return true;
    }
    else if (b[0]){
      puff[b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.AERIALTURN3 = {
  name : "AERIALTURN3",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "AERIALTURN3";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.47;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    puff.AERIALTURN3.main(p);

  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 13){
      player[p].timer--;
      player[p].actionState = "JUMPAERIAL3";
      puff.JUMPAERIAL3.main(p);
    }
    else {
      if (!puff.AERIALTURN3.interrupt(p)){
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
      puff[a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      puff.ESCAPEAIR.init(p);
      return true;
    }
    else if (b[0]){
      puff[b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.AERIALTURN4 = {
  name : "AERIALTURN4",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "AERIALTURN4";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.36;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    puff.AERIALTURN4.main(p);

  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 13){
      player[p].timer--;
      player[p].actionState = "JUMPAERIAL4";
      puff.JUMPAERIAL4.main(p);
    }
    else {
      if (!puff.AERIALTURN4.interrupt(p)){
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
      puff[a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      puff.ESCAPEAIR.init(p);
      return true;
    }
    else if (b[0]){
      puff[b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
puff.AERIALTURN5 = {
  name : "AERIALTURN5",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "AERIALTURN5";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = true;
    player[p].phys.cVel.y = 1.25;
    player[p].phys.cVel.x = (player[p].inputs.lStickAxis[0].x * 0.5);
    player[p].phys.jumpsUsed++;
    sounds.jump2.play();
    puff.AERIALTURN5.main(p);

  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer == 13){
      player[p].timer--;
      player[p].actionState = "JUMPAERIAL5";
      puff.JUMPAERIAL5.main(p);
    }
    else {
      if (!puff.AERIALTURN5.interrupt(p)){
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
      puff[a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      puff.ESCAPEAIR.init(p);
      return true;
    }
    else if (b[0]){
      puff[b[1]].init(p);
      return true;
    }
    else {
      return false;
    }
  }
}
// UNIQUE ACTION STATES END

// SET VELOCITIES AND POSITIONS

puff.ESCAPEB.setVelocities = [0,0,0,0,-0.18636,-0.53714,-0.85504,-1.14006,-1.39219,-1.61143,-1.79778,-1.90176,-1.87565,-1.74509,-1.51009,-1.17065,-0.72676,-0.60977,-0.87285,-1.11128,-1.32504,-1.51414,-1.67857,-1.81834,-1.79778,-1.61143,-1.39219,-1.14006,-0.85504,-0.53714,-0.18636,0.00168,0.0028,0.00056];
puff.ESCAPEF.setVelocities = [0,0,0,0,0,0.48128,1.26336,1.77472,2.01536,1.98528,1.81834,1.67857,1.51414,1.32504,1.11128,0.87286,0.60977,0.60977,0.87285,1.11128,1.32504,1.51414,1.67857,1.81834,1.79778,1.61143,1.39219,1.14006,0.85504,0.53714,0.18636,0.00092,0.00154,0.00031];
puff.DOWNSTANDB.setVelocities = [-0.06932,-0.07344,-0.07718,-0.08053,-0.08348,-0.08605,-0.17622,-0.34650,-0.50517,-0.65224,-0.78769,-0.91154,-1.02377,-1.1244,-1.21342,-1.29083,-1.35662,-1.41081,-1.4534,-1.48436,-1.50373,-1.51148,-1.50762,-1.49216,-1.46508,-1.42639,-1.37611,-1.31420,-1.24069,-1.15557,0,0,0,0,0];
puff.DOWNSTANDF.setVelocities = [0.01598,0.00249,-0.00243,0.00123,0.01347,0.0343,0.0637,0.10167,0.2669,0.53622,0.7794,0.99642,1.1873,1.35203,1.49061,1.60305,1.68934,1.74948,1.78347,1.79132,1.77302,1.72857,1.65796,1.56122,1.43833,1.28929,1.11411,0.91276,0.68529,0.43165,0.15188,0.00338,0.00283,0.00114,-0.00169];
puff.TECHB.setVelocities = [0,0.51119,1.12463,1.12463,0.51119,-1.15217,-2.11948,-2.01629,-2.15974,-2.27333,-2.35708,-2.41098,-2.43502,-2.42922,-2.39356,-2.32805,-2.2327,-2.10749,-1.95244,-1.76753,-1.55278,-1.30817,-1.03371,-0.72941,-0.51981,-0.42778,-0.34013,-0.25689,-0.17805,-0.1036,-0.03356,0.63449,1.17833,0.63449,0,0,0,0,0,0];
puff.TECHF.setVelocities = [0,-0.39214,-0.86272,-0.86272,-0.39214,0.75185,1.75788,2.16647,2.43012,2.62609,2.75436,2.81494,2.80783,2.73303,2.59053,2.38034,2.10247,1.7569,1.34363,0.86268,0.31404,0.01548,0.01231,0.00939,0.00673,0.00433,0.00219,0.0003,-0.00133,-0.00270,-0.00382,-0.00467,-0.00527,-0.00562,-0.00570,-0.00553,-0.00510,-0.00442,-0.00347,-0.00277];
puff.CLIFFCATCH.posOffset = [[-74.289,-8.13664],[-73.93011,-8.48632],[-73.54061,-8.90368],[-73.22807,-9.25336],[-73.1,-9.4],[-73.1,-9.4],[-73.1,-9.4]];
puff.CLIFFWAIT.posOffset = [-73.1,-9.4];
