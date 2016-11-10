// action state object creation
aS[2]={};
// base action states added
var keys = Object.keys(baseActionStates);
for (var i=0;i<keys.length;i++){
  aS[2][keys[i]] = {};
  $.extend(true,aS[2][keys[i]],baseActionStates[keys[i]]);
}
// set pointer for readibility
var fox = aS[2];

// OVERWRITES START

// OVERWRITES END

// UNIQUE ACTION STATES START

//--------------- NORMALS -----------------------
// TILTS

fox.JAB1 = {
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
    fox.JAB1.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.JAB1.interrupt(p)){
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
      fox.JAB2.init(p);
      return true;
    }
    else if (player[p].timer > 17){
      fox.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 15){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        fox.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        fox[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        fox[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        fox[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        fox.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        fox.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        fox.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        fox.WALK.init(p,true);
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

fox.JAB2 = {
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
    fox.JAB2.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.JAB2.interrupt(p)){
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
      fox.JAB3.init(p);
      return true;
    }
    else if (player[p].timer > 20){
      fox.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 16){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        fox.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        fox[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        fox[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        fox[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        fox.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        fox.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        fox.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        fox.WALK.init(p,true);
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

fox.JAB3 = {
  name : "JAB3",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "JAB3";
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    turnOffHitboxes(p);
    fox.JAB3.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.JAB3.interrupt(p)){
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
}

fox.DOWNTILT = {
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
    fox.DOWNTILT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.DOWNTILT.interrupt(p)){
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
      fox.SQUATWAIT.init(p);
      return true;
    }
    else if (player[p].timer > 27){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        fox.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        fox[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        fox[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        fox[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        fox.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        fox.SMASHTURN.init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        fox.TILTTURN.init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        fox.WALK.init(p,true);
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

fox.UPTILT = {
  name : "UPTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "UPTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.uptilt.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.uptilt.id3;
    fox.UPTILT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.UPTILT.interrupt(p)){
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
      fox.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 22){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        fox.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        fox[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        fox[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        fox[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        fox.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        fox.SMASHTURN.init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        fox.TILTTURN.init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        fox.WALK.init(p,true);
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

fox.FORWARDTILT = {
  name : "FORWARDTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FORWARDTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ftilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ftilt.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ftilt.id2;
    fox.FORWARDTILT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.FORWARDTILT.interrupt(p)){
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.FORWARDSMASH = {
  name : "FORWARDSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FORWARDSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.fsmash1.id2;
    fox.FORWARDSMASH.main(p);
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
    if (!fox.FORWARDSMASH.interrupt(p)){
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.UPSMASH = {
  name : "UPSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "UPSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upsmash1.id1;
    fox.UPSMASH.main(p);
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
    if (!fox.UPSMASH.interrupt(p)){
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.DOWNSMASH = {
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
    fox.DOWNSMASH.main(p);
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
    if (!fox.DOWNSMASH.interrupt(p)){
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
      fox.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 45 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        fox.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        fox[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        fox[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        fox[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        fox.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        fox.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        fox.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        fox.WALK.init(p,true);
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

// AERIALS

fox.ATTACKAIRF = {
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
    fox.ATTACKAIRF.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.ATTACKAIRF.interrupt(p)){
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
      fox.FALL.init(p);
      return true;
    }
    else if (player[p].timer > 52){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          fox.JUMPAERIALB.init(p);
        }
        else {
          fox.JUMPAERIALF.init(p);
        }
        return true;
      }
      else if (a[0]){
        fox[a[1]].init(p);
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
      fox.LANDING.init(p);
    }
    else {
      fox.LANDINGATTACKAIRF.init(p);
    }
  }
};

fox.ATTACKAIRB = {
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
    player[p].hitboxes.id[0] = player[p].charHitboxes.bair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.bair1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.bair1.id2;
    fox.ATTACKAIRB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.ATTACKAIRB.interrupt(p)){
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
      fox.FALL.init(p);
      return true;
    }
    else if (player[p].timer > 37){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          fox.JUMPAERIALB.init(p);
        }
        else {
          fox.JUMPAERIALF.init(p);
        }
        return true;
      }
      else if (a[0]){
        fox[a[1]].init(p);
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
      fox.LANDING.init(p);
    }
    else {
      fox.LANDINGATTACKAIRB.init(p);
    }
  }
};

fox.ATTACKAIRU = {
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
    player[p].hitboxes.id[0] = player[p].charHitboxes.upair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upair1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.upair1.id2;
    fox.ATTACKAIRU.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.ATTACKAIRU.interrupt(p)){
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
      fox.FALL.init(p);
      return true;
    }
    else if (player[p].timer > 35){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          fox.JUMPAERIALB.init(p);
        }
        else {
          fox.JUMPAERIALF.init(p);
        }
        return true;
      }
      else if (a[0]){
        fox[a[1]].init(p);
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
      fox.LANDING.init(p);
    }
    else {
      fox.LANDINGATTACKAIRU.init(p);
    }
  }
};

fox.ATTACKAIRD = {
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
    fox.ATTACKAIRD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.ATTACKAIRD.interrupt(p)){
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
      fox.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      fox.LANDING.init(p);
    }
    else {
      fox.LANDINGATTACKAIRD.init(p);
    }
  }
};

fox.ATTACKAIRN = {
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
    player[p].hitboxes.id[2] = player[p].charHitboxes.nair1.id2;
    fox.ATTACKAIRN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.ATTACKAIRN.interrupt(p)){
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
      fox.FALL.init(p);
      return true;
    }
    else if (player[p].timer > 41){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          fox.JUMPAERIALB.init(p);
        }
        else {
          fox.JUMPAERIALF.init(p);
        }
        return true;
      }
      else if (a[0]){
        fox[a[1]].init(p);
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
      fox.LANDING.init(p);
    }
    else {
      fox.LANDINGATTACKAIRN.init(p);
    }
  }
};

// OTHER

fox.ATTACKDASH = {
  name : "ATTACKDASH",
  canEdgeCancel : false,
  setVelocities : [0.99874,1.82126,2.22815,2.43704,1.91481,1.39379,1.36213,1.33162,1.30228,1.27408,1.24704,1.22115,1.19642,1.17284,1.15042,1.12915,1.10902,1.09006,1.06475,1.01691,0.94598,0.85192,0.73477,0.59452,0.43115,0.32167,0.28310,0.24695,0.21323,0.18194,0.15309,0.12666,0.10266,0.08109,0.06194,0.04524,0.03096,0.0191,0.00968],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "ATTACKDASH";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dashattack1.id1;
    fox.ATTACKDASH.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.ATTACKDASH.interrupt(p)){
      player[p].phys.cVel.x = fox.ATTACKDASH.setVelocities[player[p].timer-1]*player[p].phys.face;

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
      fox.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < 5 && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      if (player[p].phys.cVel.x*player[p].phys.face > player[p].charAttributes.dMaxV){
        player[p].phys.cVel.x = player[p].charAttributes.dMaxV*player[p].phys.face;
      }
      fox.GRAB.init(p);
      return true;
    }
    else if (player[p].timer > 35){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        fox.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        fox[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        fox[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        fox[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        fox.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        fox.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        fox.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        fox.WALK.init(p,true);
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

// ---------------------------SPECIALS--------------------------------

fox.UPSPECIAL = {
  name : "UPSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,true],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  canEdgeCancel : true,
  disableTeeter : true,
  airborneState : "UPSPECIAL",
  landType : 1,
  init : function(p){
    player[p].actionState = "UPSPECIAL";
    player[p].timer = 0;
    player[p].phys.cVel.x *= 0.8;
    player[p].phys.cVel.y = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.landingMultiplier = 10;
    sounds.foxupbburn.play();
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upb1.id0;
    fox.UPSPECIAL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.UPSPECIAL.interrupt(p)){

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
        fox.WAIT.init(p);
      }
      else {
        fox.FALLSPECIAL.init(p);
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
        fox.FIREFOXBOUNCE.init(p);
      }
      else {
        drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
      }
    }
  }
};


fox.FIREFOXBOUNCE = {
  name : "FIREFOXBOUNCE",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  setVelocities : [0.00062,0.00062,0.00062,5.27148,5.4568,2.56,0.0638,0.02712,-0.00286,-0.02613,-0.0427,-0.05257,-0.05573,-1.83217],
  landType : 1,
  init : function(p){
    player[p].actionState = "FIREFOXBOUNCE";
    player[p].timer = 0;
    player[p].phys.grounded = false;
    fox.FIREFOXBOUNCE.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.FIREFOXBOUNCE.interrupt(p)){
      if (player[p].phys.cVel.x != 0){
        player[p].phys.cVel.x -= 0.03*player[p].phys.face;
        if (player[p].phys.cVel.x*player[p].phys.face < 0){
          player[p].phys.cVel.x = 0;
        }
      }
      player[p].phys.cVel.y = fox.FIREFOXBOUNCE.setVelocities[player[p].timer-1];
    }
  },
  interrupt : function(p){
    if (player[p].timer > 14){
      if (player[p].phys.grounded){
      }
      else {
        fox.FALLSPECIAL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

fox.NEUTRALSPECIALAIR = {
  name : "NEUTRALSPECIALAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "NEUTRALSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.laserCombo = false;
    fox.NEUTRALSPECIALAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.NEUTRALSPECIALAIR.interrupt(p)){
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
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+9),player[p].phys.face,0);
        articles.LASER.init(p,8,9,0);
      }
      if (player[p].timer == 30){
        sounds.foxlaserholster.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 36){
      fox.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.NEUTRALSPECIALGROUND = {
  name : "NEUTRALSPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  airborneState : "NEUTRALSPECIALAIR",
  init : function(p){
    player[p].actionState = "NEUTRALSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.laserCombo = false;
    fox.NEUTRALSPECIALGROUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.NEUTRALSPECIALGROUND.interrupt(p)){
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
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+7),player[p].phys.face,0);
        articles.LASER.init(p,8,7,0);
      }
      if (player[p].timer == 37){
        sounds.foxlaserholster.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.SIDESPECIALAIR = {
  name : "SIDESPECIALAIR",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [true,false],
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
      player[p].phys.cVel.x *= 0.667;
      player[p].phys.cVel.y = 0;
    }
    player[p].phys.landingMultiplier = 1.5;
    drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
    turnOffHitboxes(p);
    sounds.star.play();
    fox.SIDESPECIALAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.SIDESPECIALAIR.interrupt(p)){
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
          articles.ILLUSION.init(p,0);
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
        player[p].actionState = "SIDESPECIALAIR";
        player[p].timer--;
        fox.SIDESPECIALAIR.main(p);
      }
      if (player[p].timer >= 21 && player[p].timer <= 24){
        drawVfx("illusion",player[p].phys.posPrev,player[p].phys.face);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 63){
      if (player[p].phys.grounded){
        fox.WAIT.init(p);
      }
      else {
        fox.FALLSPECIAL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].timer >= 20){
      fox.LANDINGFALLSPECIAL.init(p);
    }
    else {
      player[p].actionState = "SIDESPECIALGROUND";
    }
  }
};

fox.SIDESPECIALGROUND = {
  name : "SIDESPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : true,
  disableTeeter : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  airborneState : "SIDESPECIALAIR",
  init : function(p){
    player[p].actionState = "SIDESPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.landingMultiplier = 1.5;
    drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
    turnOffHitboxes(p);
    sounds.star.play();
    fox.SIDESPECIALGROUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.SIDESPECIALGROUND.interrupt(p)){
      if (player[p].phys.grounded){
        if (player[p].timer == 21){
          articles.ILLUSION.init(p,1);
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
        player[p].actionState = "SIDESPECIALAIR";
        player[p].timer--;
        fox.SIDESPECIALAIR.main(p);
      }

      if (player[p].timer >= 21 && player[p].timer <= 24){
        drawVfx("illusion",player[p].phys.posPrev,player[p].phys.face);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 63){
      if (player[p].phys.grounded){
        fox.WAIT.init(p);
      }
      else {
        fox.FALLSPECIAL.init(p);
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

fox.DOWNSPECIALAIR = {
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
    fox.DOWNSPECIALAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    player[p].phys.inShine++;
    if (!fox.DOWNSPECIALAIR.interrupt(p)){
      if (player[p].phys.grounded){
        player[p].actionState = "DOWNSPECIALGROUND";
        player[p].timer--;
        fox.DOWNSPECIALGROUND.main(p);
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
          drawVfx("shineloop",new Vec2D(0,0),p);
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
          player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,1);
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
        if ((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y >= 0.7 && player[p].inputs.lStickAxis[3].y < 0.7)){
          if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
            fox.JUMPAERIALB.init(p);
          }
          else {
            fox.JUMPAERIALF.init(p);
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
        fox.WAIT.init(p);
      }
      else {
        fox.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "DOWNSPECIALGROUND";
  }
};

fox.DOWNSPECIALGROUND = {
  name : "DOWNSPECIALGROUND",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  canEdgeCancel : true,
  disableTeeter : true,
  airborneState : "DOWNSPECIALAIR",
  init : function(p){
    player[p].actionState = "DOWNSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.inShine = 0;
    sounds.foxshine.play();
    player[p].shineLoop = 6;
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("shine",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+6));
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecial.id0;
    fox.DOWNSPECIALGROUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    player[p].phys.inShine++;
    if (!fox.DOWNSPECIALGROUND.interrupt(p)){
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
          drawVfx("shineloop",new Vec2D(0,0),p);
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
          player[p].phys.intangibleTimer = Math.max(player[p].phys.intangibleTimer,1);
        }
        if (player[p].timer == 2){
          turnOffHitboxes(p);
        }
      }
      else {
        player[p].actionState = "DOWNSPECIALAIR";
        player[p].timer--;
        fox.DOWNSPECIALAIR.main(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer >= 4 && player[p].timer <= 32){
      var j = checkForJump(p);
      if (j[0]){
        fox.KNEEBEND.init(p,j[1]);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 49){
      if (player[p].phys.grounded){
        fox.WAIT.init(p);
      }
      else {
        fox.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};


// -----------------------THROWS----------------------------

fox.THROWBACK = {
  name : "THROWBACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWBACK";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNFOXBACK.init(player[p].phys.grabbing);
    var frame = frames[cS[player[p].phys.grabbing]].THROWNFOXBACK;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
    randomShout(cS[p]);
    fox.THROWBACK.main(p);
  },
  main : function(p){
    var prevFrame = player[p].timer;
    player[p].timer+=8/player[p].phys.releaseFrame;
    if (!fox.THROWBACK.interrupt(p)){
      if (prevFrame < 10 && player[p].timer >= 10){
        player[p].phys.face *= -1;
      }
      if (prevFrame < 14 && player[p].timer >= 14){
        articles.LASER.init(p,5.2,10,Math.PI*0.22);
        sounds.foxlaserfire.play();
        // 135
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(5.2*player[p].phys.face),player[p].phys.pos.y+10),player[p].phys.face,Math.PI*0.22);
      }
      else if (prevFrame < 16 && player[p].timer >= 16){
        articles.LASER.init(p,5.4,9.7,Math.PI*0.20);
        sounds.foxlaserfire.play();
        // 135
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(5.4*player[p].phys.face),player[p].phys.pos.y+9.7),player[p].phys.face,Math.PI*0.20);
      }
      else if (prevFrame < 19 && player[p].timer >= 19){
        articles.LASER.init(p,5.3,9.8,Math.PI*0.22);
        sounds.foxlaserfire.play();
        // 135
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(5.3*player[p].phys.face),player[p].phys.pos.y+9.8),player[p].phys.face,Math.PI*0.22);
      }
      if (Math.floor(player[p].timer+0.01) == 8){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 32){
      player[p].phys.grabbing = -1;
      fox.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      fox.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.THROWDOWN = {
  name : "THROWDOWN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWDOWN";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNFOXDOWN.init(player[p].phys.grabbing);
    var frame = frames[cS[player[p].phys.grabbing]].THROWNFOXDOWN;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
    randomShout(cS[p]);
    fox.THROWDOWN.main(p);
  },
  main : function(p){
    var prevFrame = player[p].timer;
    player[p].timer+=33/player[p].phys.releaseFrame;
    if (!fox.THROWDOWN.interrupt(p)){
      if (Math.floor(player[p].timer+0.01) == 33){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

      if (prevFrame < 23 && player[p].timer >= 23){
        articles.LASER.init(p,1,12,Math.PI*275/180);
        sounds.foxlaserfire.play();
        // 275
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(1*player[p].phys.face),player[p].phys.pos.y+12),player[p].phys.face,Math.PI*275/180);
      }
      else if (prevFrame < 25 && player[p].timer >= 25){
        articles.LASER.init(p,1,16,Math.PI*260/180);
        sounds.foxlaserfire.play();
        // 260
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(1*player[p].phys.face),player[p].phys.pos.y+16),player[p].phys.face,Math.PI*260/180);
      }
      else if (prevFrame < 28 && player[p].timer >= 28){
        articles.LASER.init(p,2,15,Math.PI*290/180);
        sounds.foxlaserfire.play();
        // 290
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(2*player[p].phys.face),player[p].phys.pos.y+15),player[p].phys.face,Math.PI*290/180);
      }
      else if (prevFrame < 31 && player[p].timer >= 31){
        articles.LASER.init(p,2,17,Math.PI*275/180);
        sounds.foxlaserfire.play();
        // 275
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(2*player[p].phys.face),player[p].phys.pos.y+17),player[p].phys.face,Math.PI*275/180);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 43){
      player[p].phys.grabbing = -1;
      fox.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      fox.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.THROWUP = {
  name : "THROWUP",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWUP";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNFOXUP.init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    var frame = frames[cS[player[p].phys.grabbing]].THROWNFOXUP;
    player[p].phys.releaseFrame = frame+1;
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
    fox.THROWUP.main(p);
  },
  main : function(p){
    var prevFrame = player[p].timer;
    player[p].timer+=7/player[p].phys.releaseFrame;
    if (!fox.THROWUP.interrupt(p)){
      if (prevFrame < 13 && player[p].timer >= 13){
        sounds.foxlasercock.play();
      }
      else if (prevFrame < 16 && player[p].timer >= 16){
        articles.LASER.init(p,1.6,18,Math.PI*85/180);
        // rotate 85
        sounds.foxlaserfire.play();
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(1.6*player[p].phys.face),player[p].phys.pos.y+18),player[p].phys.face,Math.PI*85/180);
      }
      else if (prevFrame < 18 && player[p].timer >= 18){
        articles.LASER.init(p,0.5,18,Math.PI/2);
        // rotate 90
        sounds.foxlaserfire.play();
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(0.5*player[p].phys.face),player[p].phys.pos.y+18),player[p].phys.face,Math.PI/2);
      }
      else if (prevFrame < 21 && player[p].timer >= 21){
        articles.LASER.init(p,0,18,Math.PI*87/180);
        // rotate 87
        sounds.foxlaserfire.play();
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(0*player[p].phys.face),player[p].phys.pos.y+18),player[p].phys.face,Math.PI*87/180);
      }
      else if (prevFrame < 33 && player[p].timer >= 33){
        sounds.foxlaserholster.play();
      }
      if (Math.floor(player[p].timer+0.01) == 7){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 33){
      player[p].phys.grabbing = -1;
      fox.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      fox.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.THROWFORWARD = {
  name : "THROWFORWARD",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [-0.08,-0.14,-0.03,0.24,0.68,0.99,1.02,0.78,0.57,0.57,0.57,0.57,0.56,0.56,0.55,0.54,0.53,0.52,0.50,0.49,0.47,0.45,0.43,0.41,0.39,0.36,0,0,0,0,0,0,0],
  init : function(p){
    player[p].actionState = "THROWFORWARD";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNFOXFORWARD.init(player[p].phys.grabbing);
    var frame = frames[cS[player[p].phys.grabbing]].THROWNFOXFORWARD;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwforward.id0;
    randomShout(cS[p]);
    fox.THROWFORWARD.main(p);
  },
  main : function(p){
    player[p].timer+=11/player[p].phys.releaseFrame;
    if (!fox.THROWFORWARD.interrupt(p)){
      player[p].phys.cVel.x = fox.THROWFORWARD.setVelocities[Math.floor(player[p].timer+0.01)-1]*player[p].phys.face;
      if (Math.floor(player[p].timer+0.01) == 11){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }
      /*if (player[p].timer == 11){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwforwardextra.id0;
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer == 12){
        turnOffHitboxes(p);
      }*/
    }
  },
  interrupt : function(p){
    if (player[p].timer > 33){
      player[p].phys.grabbing = -1;
      fox.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy != p){
      fox.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

// -----------------------THROWNS----------------------------

fox.THROWNPUFFFORWARD = {
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
    fox.THROWNPUFFFORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNPUFFFORWARD.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNPUFFFORWARD.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNPUFFFORWARD.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

fox.THROWNPUFFDOWN = {
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

    fox.THROWNPUFFDOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNPUFFDOWN.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNPUFFDOWN.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNPUFFDOWN.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

fox.THROWNPUFFBACK = {
  name : "THROWNPUFFBACK",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  reverseModel : true,
  //[1.05,7.14],[3.78,7.55],[10.37,1.56],[13.72,-6.85],[13.66,-9.95],[13.67,-10.28],[13.85,-9.92],[14.04,-9.34],[14.04,-9.34]],
  offset : [[-11.22,-3.35],[-11.51,-3.60],[-11.64,-3.90],[-11.51,-4.11],[-10.99,-4.13],[-9.98,-4.05],[-8.74,-3.92],[-7.52,-3.55],[-6.37,-2.46],[-5.04,-0.22],[-3.44,2.32],[-1.58,3.79],[0.31,4.86],[0.92,7.14],[2.41,7.55],[5.89,1.56],[6.52,-6.85],[6.13,-9.95],[6.14,-10.28],[6.32,-9.92],[6.51,-9.34],[6.51,-9.34],[6.51,-9.34]],
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
    fox.THROWNPUFFBACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNPUFFBACK.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNPUFFBACK.offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNPUFFBACK.offset[player[p].timer-1][1]);
      }

    }
  },
  interrupt : function(p){
    return false;
  }
};

fox.THROWNPUFFUP = {
  name : "THROWNPUFFUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.63,-3.65],[-9.46,-4.14],[-7.29,-4.39],[-2.98,-3.79],[2.65,-2.33],[4.95,-0.64],[4.95,-0.64],[4.95,-0.64]],
  init : function(p){
    player[p].actionState = "THROWNPUFFUP";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    fox.THROWNPUFFUP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNPUFFUP.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNPUFFUP.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNPUFFUP.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

fox.THROWNMARTHUP = {
  name : "THROWNMARTHUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.07,4.25],[-10.75,3.96],[-11.43,3.40],[-11.27,3.38],[-10.92,3.48],[-10.61,3.59],[-10.51,3.63],[-13.02,6.00],[-5.68,16.09],[-5.68,16.09]],
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
    fox.THROWNMARTHUP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNMARTHUP.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNMARTHUP.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNMARTHUP.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

fox.THROWNMARTHDOWN = {
  name : "THROWNMARTHDOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-9.91,4.76],[-11.99,5.49],[-13.10,5.88],[-13.10,5.88],[-13.10,5.88],[-13.33,5.45],[-13.76,3.95],[-13.44,2.14],[-12.48,-0.03],[-10.43,-3.03],[-10.43,-3.03]],
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
    fox.THROWNMARTHDOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNMARTHDOWN.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNMARTHDOWN.offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNMARTHDOWN.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};


fox.THROWNMARTHBACK = {
  name : "THROWNMARTHBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-6.96,4.12],[-3.7,3.89],[-0.79,3.40],[0.35,0.47],[0.80,-0.44],[0.80,-0.44]],
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
    fox.THROWNMARTHBACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNMARTHBACK.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNMARTHBACK.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNMARTHBACK.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

fox.THROWNMARTHFORWARD = {
  name : "THROWNMARTHFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-11.08,3.81],[-10.84,5.65],[-10.05,6.53],[-9.79,6.65],[-9.70,6.58],[-9.90,6.41],[-11.24,6.09],[-13.48,4.96],[-11.16,1.54],[-8.89,-3.65],[-8.89,-3.65]],
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
    fox.THROWNMARTHFORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNMARTHFORWARD.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNMARTHFORWARD.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNMARTHFORWARD.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

fox.THROWNFOXUP = {
  name : "THROWNFOXUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-6.51,-1.28],[-5.85,-0.71],[-5.36,-0.70],[-5.17,1.05],[-3.03,9.59],[-3.03,9.59]],
  init : function(p){
    player[p].actionState = "THROWNFOXUP";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    fox.THROWNFOXUP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNFOXUP.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNFOXUP.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNFOXUP.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

fox.THROWNFOXDOWN = {
  name : "THROWNFOXDOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-4.73,-1.04],[-2.33,-2.27],[-1.90,-2.37],[-1.84,-2.24],[-1.84,-1.78],[-1.98,0.41],[-1.04,3.44],[-0.05,4.15],[0.82,4.32],[1.03,4.03],[1.07,3.56],[1.07,3.82],[1.07,4.00],[0.85,4.14],[-0.45,6.59],[-0.78,-4.04],[-0.82,-4.75],[-0.81,-3.89],[-0.78,-3.11],[-0.72,-3.45],[-0.65,-4.18],[-0.57,-4.29],[-0.50,-2.78],[-0.50,-5.04],[-0.50,-4.74],[-0.50,-4.44],[-0.50,-4.15],[-0.50,-3.88],[-0.50,-3.63],[-0.50,-3.40],[-0.50,-3.20],[-0.50,-3.04],[-0.50,-3.04]],
  init : function(p){
    player[p].actionState = "THROWNFOXDOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    fox.THROWNFOXDOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNFOXDOWN.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNFOXDOWN.offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNFOXDOWN.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};


fox.THROWNFOXBACK = {
  name : "THROWNFOXBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-8.09,-1.57],[-6.98,-1.81],[-3.72,-2.73],[-0.66,-3.92],[3.34,-4.39],[7.60,2.89],[7.60,2.89]],
  init : function(p){
    player[p].actionState = "THROWNFOXBACK";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    fox.THROWNFOXBACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNFOXBACK.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNFOXBACK.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNFOXBACK.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

fox.THROWNFOXFORWARD = {
  name : "THROWNFOXFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-7.74-0.08,-0.77],[-7.17-0.22,-0.03],[-7.15-0.24,0.12],[-7.34,0.13],[-7.44+0.68,0.30],[-7.65+1.67,0.49],[-8.06+2.69,0.65],[-8.77+3.47,0.72],[-10.03+4.04,0.61],[-12.03+4.61,0.38],[-12.03+4.61,0.38]],
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
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    fox.THROWNFOXFORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.THROWNFOXFORWARD.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+fox.THROWNFOXFORWARD.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+fox.THROWNFOXFORWARD.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
}

// ------------------- CLIFF ACTIONS -------------------------------

fox.CLIFFGETUPQUICK = {
  name : "CLIFFGETUPQUICK",
  canBeGrabbed : true,
  offset : [[-70.7039,-13.92],[-71.27977,-12.96],[-71.69937,-12.06755],[-72.07638,-11.06843],[-72.24,-9.6],[-72.24,-6.74401],[-72.24,-3.84],[-71.35111,-1.99111],[-69.60889,-0.56889],[-67.19112,0]],
  setVelocities : [0.48171,0.47829,0.50249,0.51401,0.45477,0.32475,0.12398,0,0,0,0],
  init : function(p){
    player[p].actionState = "CLIFFGETUPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 30;
    fox.CLIFFGETUPQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.CLIFFGETUPQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 24){
        if (player[p].timer >= 14)
        player[p].phys.pos = new Vec2D(x+(fox.CLIFFGETUPQUICK.offset[player[p].timer-14][0]+68.4)*player[p].phys.face,y+fox.CLIFFGETUPQUICK.offset[player[p].timer-14][1]);
      }
      else {
        player[p].phys.cVel.x = fox.CLIFFGETUPQUICK.setVelocities[player[p].timer-24]*player[p].phys.face;
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.CLIFFGETUPSLOW = {
  name : "CLIFFGETUPSLOW",
  offset : [[-70.32,-14.23684],[-70.32,-14.04406],[-70.32,-13.83467],[-70.32,-13.62174],[-70.32,-13.41828],[-70.32,-13.23734],[-70.32,-13.09195],[-70.32,-12.99516],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.94646],[-70.32,-12.90716],[-70.32,-12.84404],[-70.32,-12.75909],[-70.32,-12.65426],[-70.32,-12.53151],[-70.32,-12.3928],[-70.32,-12.24],[-70.32,-12.07538],[-70.32,-11.90058],[-70.32,-11.71768],[-70.32,-11.52864],[-70.32,-11.33542],[-70.32,-11.13999],[-70.32,-10.94429],[-70.32,-10.75031],[-70.32,-10.56],[-70.32,-10.33863],[-70.32,-10.05937],[-70.32,-9.73605],[-70.32,-9.3825],[-70.32,-9.01255],[-70.32,-8.64],[-70.32,-8.29058],[-70.32,-7.96354],[-70.32,-7.63306],[-70.32,-7.27329],[-70.32,-6.85842],[-70.32,-6.3626],[-70.32,-5.76],[-70.22906,-4.87181],[-69.98633,-3.67591],[-69.63692,-2.38155],[-69.22598,-1.19796],[-68.79863,-0.33436],[-68.00137,0]],
  setVelocities : [0.38672,0.41407,0.42994,0.43436,0.42731,0.40879],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFGETUPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 55;
    fox.CLIFFGETUPSLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.CLIFFGETUPSLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 54){
        player[p].phys.pos = new Vec2D(x+(fox.CLIFFGETUPSLOW.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+fox.CLIFFGETUPSLOW.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = fox.CLIFFGETUPSLOW.setVelocities[player[p].timer-54]*player[p].phys.face;
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.CLIFFESCAPEQUICK = {
  name : "CLIFFESCAPEQUICK",
  offset : [[-70.67906,-13.98],[-71.27813,-12.96],[-71.87907,-11.55],[-72.24,-9.6],[-72.24,-6.62999],[-72.24,-3.84],[-71.35111,-1.99114],[-69.60889,-0.5689],[-67.19112,0]],
  setVelocities : [0.7218,1.0418,1.11641,1.55599,1.324,0.93156,1.16625,0.78219,0.37686,0.33425,0.24889,0.27022,0.35558,0.3342,1.92,2.4414,2.54756,2.57555,2.52538,2.39703,2.19051,1.90581,1.54296,1.10192,0.73904,0.52734,0.34701,0.19804],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFESCAPEQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 34;
    fox.CLIFFESCAPEQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.CLIFFESCAPEQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 22){
        if (player[p].timer >= 13){
          player[p].phys.pos = new Vec2D(x+(fox.CLIFFESCAPEQUICK.offset[player[p].timer-13][0]+68.4)*player[p].phys.face,y+fox.CLIFFESCAPEQUICK.offset[player[p].timer-13][1]);
        }
      }
      else if (player[p].timer < 50){
        player[p].phys.cVel.x = fox.CLIFFESCAPEQUICK.setVelocities[player[p].timer-22]*player[p].phys.face;
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }

};

fox.CLIFFESCAPESLOW = {
  name : "CLIFFESCAPESLOW",
  offset : [[-70.32,-14.23684],[-70.32,-14.04406],[-70.32,-13.83467],[-70.32,-13.62174],[-70.32,-13.41828],[-70.32,-13.23734],[-70.32,-13.09195],[-70.32,-12.99516],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.94646],[-70.32,-12.90716],[-70.32,-12.84404],[-70.32,-12.75909],[-70.32,-12.65426],[-70.32,-12.53151],[-70.32,-12.3928],[-70.32,-12.24],[-70.32,-12.07538],[-70.32,-11.90058],[-70.32,-11.71768],[-70.32,-11.52864],[-70.32,-11.33542],[-70.32,-11.13999],[-70.32,-10.94429],[-70.32,-10.75031],[-70.32,-10.56],[-70.32,-10.33863],[-70.32,-10.05937],[-70.32,-9.73605],[-70.32,-9.3825],[-70.32,-9.01255],[-70.32,-8.64],[-70.32,-8.29058],[-70.32,-7.96354],[-70.32,-7.63306],[-70.32,-7.27329],[-70.32,-6.85842],[-70.32,-6.3626],[-70.32,-5.76],[-70.17775,-4.87171],[-69.82212,-3.67591],[-69.35983,-2.38155],[-68.89757,-1.19796],[-68.54206,-0.33436],[-68.25794,0]],
  setVelocities : [0.48879,1.49473,2.5425,3.63211,2.55094,2.41367,2.27723,2.14161,2.00682,1.87285,1.7397,1.60738,1.47588,1.34521,1.21536,1.08633,0.95814,0.83076,0.67258,0.49966,0.35163,0.22852,0.13032,0.05701,0.00862,-0.01488],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFESCAPESLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 62;
    fox.CLIFFESCAPESLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.CLIFFESCAPESLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 54){
        player[p].phys.pos = new Vec2D(x+(fox.CLIFFESCAPESLOW.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+fox.CLIFFESCAPESLOW.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = fox.CLIFFESCAPESLOW.setVelocities[player[p].timer-54]*player[p].phys.face;
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.CLIFFJUMPQUICK = {
  name : "CLIFFJUMPQUICK",
  offset : [[-70.8428,-14.38776],[-71.49446,-14.32052],[-72.19153,-14.1652],[-72.85054,-13.88868],[-73.38803,-13.45787],[-73.72054,-12.83965],[-73.76461,-12.00094],[-73.50131,-10.89611],[-73.00593,-9.5458],[-72.33633,-8.01628],[-71.55035,-6.37383],[-70.70587,-4.6847],[-69.86075,-3.01518],[-69.07284,-1.43152]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFJUMPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 14;
    fox.CLIFFJUMPQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.CLIFFJUMPQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 15){
        player[p].phys.pos = new Vec2D(x+(fox.CLIFFJUMPQUICK.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+fox.CLIFFJUMPQUICK.offset[player[p].timer-1][1]);
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
      fox.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.CLIFFJUMPSLOW = {
  name : "CLIFFJUMPSLOW",
  offset : [[-70.24197,-14.37161],[-70.01204,-14.25485],[-69.68486,-14.01434],[-69.31504,-13.61466],[-68.9572,-13.0204],[-68.66598,-12.19617],[-68.49598,-11.10656],[-68.49598,-8.58951],[-69.17776,-4.88456],[-68.95471,-2.05875],[-68.61933,-0.74366],[-68.49973,-0.30766],[-68.72181,-0.92297],[-69.22082,-2.17673],[-69.18517,-2.92594],[-69.0908,-3.15013],[-69.0474,-3.24815],[-69.17303,-2.92594],[-69.01739,-1.4797]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFJUMPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 19;
    fox.CLIFFJUMPSLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.CLIFFJUMPSLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 20){
        player[p].phys.pos = new Vec2D(x+(fox.CLIFFJUMPSLOW.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+fox.CLIFFJUMPSLOW.offset[player[p].timer-1][1]);
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
      fox.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.CLIFFATTACKSLOW = {
  name : "CLIFFATTACKSLOW",
  offset : [[-70.32,-14.23684],[-70.32,-14.04406],[-70.32,-13.83467],[-70.32,-13.62174],[-70.32,-13.41828],[-70.32,-13.23734],[-70.32,-13.09195],[-70.32,-12.99516],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.94935],[-70.32,-12.91799],[-70.32,-12.86679],[-70.32,-12.79665],[-70.32,-12.70842],[-70.32,-12.603],[-70.32,-12.48127],[-70.32,-12.3441],[-70.32,-12.19237],[-70.32,-12.02697],[-70.32,-11.84876],[-70.32,-11.65864],[-70.32,-11.45747],[-70.32,-11.24615],[-70.32,-11.02554],[-70.32,-10.79653],[-70.32,-10.56],[-70.32,-10.31413],[-70.32,-10.05515],[-70.32,-9.78105],[-70.32,-9.48977],[-70.32,-9.17929],[-70.32,-8.84757],[-70.32,-8.49258],[-70.32,-8.11228],[-70.32,-7.70465],[-70.32,-7.26763],[-70.32,-6.79921],[-70.32,-6.29734],[-70.32,-5.76],[-70.17651,-4.94739],[-69.81816,-3.77266],[-69.35315,-2.46318],[-68.88966,-1.24633],[-68.53587,-0.34948],[-68.26413,0]],
  setVelocities : [0.34921,0.88711,1.15682,1.15835,0.89168,0.35682,0,0,0,0,0,-0.16,-0.32,-0.350399,-0.385,-0.37701],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFATTACKSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 53;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupslow.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupslow.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ledgegetupslow.id1;
    fox.CLIFFATTACKSLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.CLIFFATTACKSLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 54){
        player[p].phys.pos = new Vec2D(x+(fox.CLIFFATTACKSLOW.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+fox.CLIFFATTACKSLOW.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = fox.CLIFFATTACKSLOW.setVelocities[player[p].timer-54]*player[p].phys.face;
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.CLIFFATTACKQUICK = {
  name : "CLIFFATTACKQUICK",
  offset : [[-70.70355,-13.91997],[-71.27906,-12.96],[-71.69882,-12.06759],[-72.07618,-11.06843],[-72.24,-9.6],[-72.24,-6.74399],[-72.24,-3.84],[-71.01049,-1.99348],[-68.39889,-0.57355],[-63.64237,0]],
  setVelocities : [0.1943,0.03352,1.59986,1.91979,2.12469,2.21458,2.18944,2.04928,1.79411,1.42391,0.93869,0.33846,0,0,0,-0.34,-0.61998,-0.75406,-1.08875,-1.3431,-1.5171,-1.61075,-1.62405,-1.557,-1.4096,-1.18185,-0.87376,-0.69279,-0.65007,-0.54367,-0.3736],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFATTACKQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 15;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupquick.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupquick.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ledgegetupquick.id2;
    fox.CLIFFATTACKQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.CLIFFATTACKQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 24){
        if (player[p].timer >= 14){
          player[p].phys.pos = new Vec2D(x+(fox.CLIFFATTACKQUICK.offset[player[p].timer-14][0]+68.4)*player[p].phys.face,y+fox.CLIFFATTACKQUICK.offset[player[p].timer-14][1]);
        }
      }
      else {
        player[p].phys.cVel.x = fox.CLIFFATTACKQUICK.setVelocities[player[p].timer-24]*player[p].phys.face;
      }
      if (player[p].timer == 24){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer == 25){
        player[p].hitboxes.active = [true,true,true,false];
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }

};

// ------------------ MISC ----------------------

fox.DOWNATTACK = {
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
    fox.DOWNATTACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.DOWNATTACK.interrupt(p)){
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.GRAB = {
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
    fox.GRAB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.GRAB.interrupt(p)){
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
      fox.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

fox.CATCHATTACK = {
  name : "CATCHATTACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CATCHATTACK";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.pummel.id0;
    fox.CATCHATTACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!fox.CATCHATTACK.interrupt(p)){
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
      fox.CATCHWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

// UNIQUE ACTION STATES END

// SET VELOCITIES AND POSITIONS

fox.ESCAPEB.setVelocities = [0,0,0,0,0,0,-0.46222,-1.31556,-2.06222,-5.76,-2.36391,-1.47609,-1.19896,-0.97833,-1.10208,-1.37792,-1.50167,-1.51354,-1.47984,-1.53891,-1.75248,-1.86955,-1.70572,-1.261,-0.73878,-0.42036,-0.24296,-0.20661,-0.31128,-0.58266,-0.37734];
fox.ESCAPEF.setVelocities = [0,0,0,0,0,0,2.4,4.32,4.8,1.0299,0.89,1.08094,1.74377,1.86418,1.80236,1.70153,1.68123,1.658,1.63183,1.60272,1.44005,1.16476,0.9179,0.69951,0.50956,0.34806,0.21502,0.11042,0.03427,-0.01343,-0.03268];
fox.DOWNSTANDB.setVelocities = [-0.10375,-0.1061,-0.110,-0.11575,-0.12306,-0.23723,-0.44395,-0.63087,-0.79798,-0.9453,-1.07281,-1.18053,-1.26844,-1.33655,-1.38486,-1.41336,-1.35442,-1.24543,-1.17278,-1.13645,-1.13645,-1.17278,-1.24543,-1.33619,-1.40092,-1.43573,-1.44064,-1.41564,-1.36074,-1.27593,-1.16121,-1.01659,-0.84207,-0.63763,-0.40329];
fox.DOWNSTANDF.setVelocities = [0.1659,0.21687,0.53598,1.35686,1.56439,3.82358,3.48149,3.15542,2.84537,2.55133,2.27332,2.01131,1.76532,1.53536,1.3214,1.12347,0.94155,0.77564,0.62576,0.49189,0.37403,0.2722,0.18638,0.11658,0.06279,0.02502,0.00327,-0.00247,-0.00023,-0.00056,-0.00069,-0.00063,-0.00036,0.0001,0.00076];
fox.TECHB.setVelocities = [0,-1.90448,-1.87286,-1.84,-1.81,-1.77,-1.73,-1.70,-1.66,-1.62,-1.58,-1.53,-1.49,-1.44,-1.40,-1.35,-1.30,-1.25,-1.20,-1.15,-1.09,-1.04,-0.98,-0.93,-0.87,-0.81,-0.75,-0.68,-0.62,-0.56,-0.49,0,0,0,0,0,0,-0.002,-0.002,-0.002];
fox.TECHF.setVelocities = [0,0,0,0,0,0,0,2.56,2.49,2.43,2.36,2.29,2.22,2.14,2.07,1.99,1.90,1.82,1.73,1.64,1.54,1.45,1.35,1.24,1.14,1.03,0.92,0.81,0.70,0.58,0,0,0,0,0,0,0,0,0,0];
fox.CLIFFCATCH.posOffset = [[-73.09594,-13.47469],[-72.8175,-13.5675],[-72.41531,-13.70156],[-71.94,-13.86],[-71.44219,-14.02594],[-70.9725,-14.1825],[-70.58157,-14.31281]];
fox.CLIFFWAIT.posOffset = [-70.32,-14.4];
