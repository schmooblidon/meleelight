import {aS, turnOffHitboxes, reduceByTraction, checkForSpecials, checkForTilts, checkForSmashes, checkForJump,
    checkForDash
    , checkForSmashTurn
    , checkForTiltTurn
    , tiltTurnDashBuffer
    , fastfall
    , airDrift
    , checkForAerials
    , randomShout
} from "physics/actionStateShortcuts";
import {baseActionStates} from "characters/baseActionStates";
import {player, drawVfx, palettes, pPal, cS, stage, deepCopyObject} from "main/main";
import {Vec2D,framesData} from "main/characters";
import {sounds} from "main/sfx";

import {hitQueue} from 'physics/hitDetection';
import {setAS} from "../../physics/actionStateShortcuts";
import {CHARIDS} from "../../main/characters";
/* eslint-disable */

// action state object creation
setAS(CHARIDS.MARTH_ID,{});
// base action states added
var keys = Object.keys(baseActionStates);
for (var i=0;i<keys.length;i++){
  aS[0][keys[i]] = {};
    deepCopyObject(true,aS[0][keys[i]],baseActionStates[keys[i]]);
}
// set pointer for readibility
var marth = aS[0];

// OVERWRITES START

// OVERWRITES END

// UNIQUE ACTION STATES START

//--------------- NORMALS -----------------------
// TILTS

marth.JAB1 = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.jab1.id3;
    marth.JAB1.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.JAB1.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 3 && player[p].timer < 15){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"JAB1",
          frame:player[p].timer-4
        });
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
      marth.JAB2.init(p);
      return true;
    }
    else if (player[p].timer > 27){
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 26){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
        var s = checkForSmashes(p);
        var j = checkForJump(p);
        if (j[0]){
        marth.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        marth[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        marth[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        marth[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        marth.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        marth.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
          player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
          marth.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        marth.WALK.init(p,true);
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

marth.JAB2 = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.jab2.id3;
    marth.JAB2.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.JAB2.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 4 && player[p].timer < 15){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"JAB2",
          frame:player[p].timer-5
        });
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
      marth.JAB1.init(p);
      return true;
    }
    else if (player[p].timer > 28){
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 27){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        marth.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        marth[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        marth[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        marth[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        marth.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        marth.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        marth.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        marth.WALK.init(p,true);
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

marth.DOWNTILT = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.dtilt.id3;
    marth.DOWNTILT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.DOWNTILT.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 5 && player[p].timer < 11){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"DOWNTILT",
          frame:player[p].timer-6
        });
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
      marth.SQUATWAIT.init(p);
      return true;
    }
    else if (player[p].timer > 19){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        marth.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        marth[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        marth[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        marth[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        marth.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        marth.SMASHTURN.init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        marth.TILTTURN.init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        marth.WALK.init(p,true);
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

marth.UPTILT = {
  name : "UPTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "UPTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.uptilt1.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.uptilt1.id3;
    marth.UPTILT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.UPTILT.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 4 && player[p].timer < 15){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"UPTILT",
          frame:player[p].timer-5
        });
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
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 31){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        marth.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        marth[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        marth[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        marth[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        marth.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        marth.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        marth.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        marth.WALK.init(p,true);
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

marth.FORWARDTILT = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.ftilt.id3;
    marth.FORWARDTILT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.FORWARDTILT.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 5 && player[p].timer < 14){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"FORWARDTILT",
          frame:player[p].timer-6
        });
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
      marth.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

// ---------- AERIALS --------------

marth.ATTACKAIRF = {
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
    player[p].phys.autoCancel = false;
    player[p].inAerial = true;
    player[p].hitboxes.id[0] = player[p].charHitboxes.fair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.fair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.fair.id3;
    turnOffHitboxes(p);
    marth.ATTACKAIRF.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.ATTACKAIRF.interrupt(p)){
        fastfall(p);
        airDrift(p);
        if (player[p].timer > 2 && player[p].timer < 11){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"FAIR",
          frame:player[p].timer-3
        });
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
      marth.FALL.init(p);
      return true;
    }
    else if (player[p].timer > 29){
        var a = checkForAerials(p);
        if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          marth.JUMPAERIALB.init(p);
        }
        else {
          marth.JUMPAERIALF.init(p);
        }
        return true;
      }
      else if (a[0]){
        marth[a[1]].init(p);
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
      marth.LANDING.init(p);
    }
    else {
      marth.LANDINGATTACKAIRF.init(p);
    }
  }
};

marth.ATTACKAIRB = {
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
    player[p].phys.autoCancel = false;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.bair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.bair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.bair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.bair.id3;
    marth.ATTACKAIRB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.ATTACKAIRB.interrupt(p)){
      if (player[p].timer == 30){
        player[p].phys.face *= -1;
      }
      fastfall(p);
      airDrift(p);
      if (player[p].timer > 2 && player[p].timer < 12){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"BAIR",
          frame:player[p].timer-3
        });
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
      marth.FALL.init(p);
      return true;
    }
    else if (player[p].timer > 34){
      var a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          marth.JUMPAERIALB.init(p);
        }
        else {
          marth.JUMPAERIALF.init(p);
        }
        return true;
      }
      else if (a[0]){
        marth[a[1]].init(p);
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
      marth.LANDING.init(p);
    }
    else {
      marth.LANDINGATTACKAIRB.init(p);
    }
  }
};

marth.ATTACKAIRU = {
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
    player[p].hitboxes.id[1] = player[p].charHitboxes.upair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.upair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.upair.id3;
    marth.ATTACKAIRU.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.ATTACKAIRU.interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer > 4 && player[p].timer < 18){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"UPAIR",
          frame:player[p].timer-5
        });
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
      marth.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      marth.LANDING.init(p);
    }
    else {
      marth.LANDINGATTACKAIRU.init(p);
    }
  }
};

marth.ATTACKAIRD = {
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
    marth.ATTACKAIRD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.ATTACKAIRD.interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer > 4 && player[p].timer < 12){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"DAIR",
          frame:player[p].timer-5
        });
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
      marth.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      marth.LANDING.init(p);
    }
    else {
      marth.LANDINGATTACKAIRD.init(p);
    }
  }
};

marth.ATTACKAIRN = {
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
    player[p].hitboxes.id[3] = player[p].charHitboxes.nair1.id3;
    marth.ATTACKAIRN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.ATTACKAIRN.interrupt(p)){
      fastfall(p);
      airDrift(p);
      if (player[p].timer > 4 && player[p].timer < 9){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"NAIR1",
          frame:player[p].timer-5
        });
      }
      if (player[p].timer > 13 && player[p].timer < 21){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"NAIR2",
          frame:player[p].timer-14
        });
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
      marth.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      marth.LANDING.init(p);
    }
    else {
      marth.LANDINGATTACKAIRN.init(p);
    }
  }
};

// ----------------SMASHES -----------
marth.FORWARDSMASH = {
  name : "FORWARDSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FORWARDSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.fsmash.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.fsmash.id3;
    marth.FORWARDSMASH.main(p);
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
    if (!marth.FORWARDSMASH.interrupt(p)){
      reduceByTraction(p,true);


      if (player[p].timer == 5){
        sounds.sword3.play();
      }

      if (player[p].timer > 5 && player[p].timer < 14){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"FORWARDSMASH",
          frame:player[p].timer-6
        });
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
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 47 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        marth.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        marth[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        marth[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        marth[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        marth.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        marth.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        marth.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        marth.WALK.init(p,true);
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

marth.UPSMASH = {
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
    player[p].hitboxes.id[2] = player[p].charHitboxes.upsmash.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.upsmash.id3;
    marth.UPSMASH.main(p);
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
    if (!marth.UPSMASH.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 10 && player[p].timer < 16){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"UPSMASH",
          frame:player[p].timer-11,
        });
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
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 45 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        marth.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        marth[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        marth[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        marth[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        marth.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        marth.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        marth.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        marth.WALK.init(p,true);
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

marth.DOWNSMASH = {
  name : "DOWNSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DOWNSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dsmash1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dsmash1.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dsmash1.id3;
    marth.DOWNSMASH.main(p);
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
    if (!marth.DOWNSMASH.interrupt(p)){
      reduceByTraction(p,true);




      if (player[p].timer > 3 && player[p].timer < 11){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"DOWNSMASH1",
          frame:player[p].timer-4
        });
      }
      if (player[p].timer > 16 && player[p].timer < 26){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"DOWNSMASH2",
          frame:player[p].timer-17
        });
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
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 61 && !player[p].inCSS){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        marth.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        marth[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        marth[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        marth[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        marth.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        marth.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        marth.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        marth.WALK.init(p,true);
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

// OTHER

marth.GRAB = {
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
    player[p].hitboxes.id[2] = player[p].charHitboxes.grab.id2;
    marth.GRAB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.GRAB.interrupt(p)){
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
      marth.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};


marth.ATTACKDASH = {
  name : "ATTACKDASH",
  canEdgeCancel : false,
  setVelocities : [0.755,1.962,2.714,3.010,2.849,2.232,1.184,0.542,0.704,1.325,1.487,1.079,0.666,0.631,0.597,0.565,0.536,0.508,0.482,0.458,0.436,0.416,0.398,0.370,0.332,0.299,0.270,0.244,0.222,0.205,0.191,0.181,0.176,0.165,0.148,0.130,0.112,0.093,0.073,0.053,0.032,0.011,-0.783,-0.783,0,0,0.001,0.001,0],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "ATTACKDASH";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dashattack.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dashattack.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dashattack.id3;
    marth.ATTACKDASH.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.ATTACKDASH.interrupt(p)){
      player[p].phys.cVel.x = marth.ATTACKDASH.setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer > 9 && player[p].timer < 21){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"DASHATTACK",
          frame:player[p].timer-10
        });
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
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < 5 && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      if (player[p].phys.cVel.x*player[p].phys.face > player[p].charAttributes.dMaxV){
        player[p].phys.cVel.x = player[p].charAttributes.dMaxV*player[p].phys.face;
      }
      marth.GRAB.init(p);
      return true;
    }
    else if (player[p].timer > 39){
      var b = checkForSpecials(p);
      var t = checkForTilts(p);
      var s = checkForSmashes(p);
      var j = checkForJump(p);
      if (j[0]){
        marth.KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        marth[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        marth[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        marth[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        marth.DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        marth.SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        marth.TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        marth.WALK.init(p,true);
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

// -------- SPECIALS -----------

window.dancingBladeCombo = function(p,min,max){
  if (player[p].timer > 1){
    if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1]) && !player[p].phys.dancingBladeDisable){
      if (player[p].timer < min){
        player[p].phys.dancingBladeDisable = true;
      }
      else if (player[p].timer <= max){
        player[p].phys.dancingBlade = true;
      }
    }
  }
};

marth.SIDESPECIALGROUND = {
  name : "SIDESPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "SIDESPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    player[p].phys.cVel.x *= 0.2;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground.id3;
    sounds.shout6.play();
    marth.SIDESPECIALGROUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,8,26);
    if (!marth.SIDESPECIALGROUND.interrupt(p)){
      if (player[p].timer == 6){
        sounds.dancingBlade.play();
      }
      reduceByTraction(p,true);
      if (player[p].timer > 4 && player[p].timer < 12){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALGROUND1",
          frame:player[p].timer-5
        });
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
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALGROUND2UP.init(p);
      }
      else {
        marth.SIDESPECIALGROUND2FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

marth.SIDESPECIALGROUND2FORWARD = {
  name : "SIDESPECIALGROUND2FORWARD",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "SIDESPECIALGROUND2FORWARD";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground2forward.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground2forward.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground2forward.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground2forward.id3;
    sounds.shout7.play();
    marth.SIDESPECIALGROUND2FORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,17,33);
    if (!marth.SIDESPECIALGROUND2FORWARD.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 12 && player[p].timer < 17){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALGROUND2FORWARD",
          frame:player[p].timer-13
        });
      }
      if (player[p].timer == 14){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade2.play();
      }
      if (player[p].timer > 14 && player[p].timer < 17){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 17){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALGROUND3UP.init(p);
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.56){
        marth.SIDESPECIALGROUND3DOWN.init(p);
      }
      else {
        marth.SIDESPECIALGROUND3FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

marth.SIDESPECIALGROUND2UP = {
  name : "SIDESPECIALGROUND2UP",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "SIDESPECIALGROUND2UP";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground2up.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground2up.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground2up.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground2up.id3;
    sounds.shout1.play();
    marth.SIDESPECIALGROUND2UP.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,17,32);
    if (!marth.SIDESPECIALGROUND2UP.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 10 && player[p].timer < 20){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALGROUND2UP",
          frame:player[p].timer-11
        });
      }
      if (player[p].timer == 12){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade2.play();
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
    if (player[p].timer > 40){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALGROUND3UP.init(p);
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.56){
        marth.SIDESPECIALGROUND3DOWN.init(p);
      }
      else {
        marth.SIDESPECIALGROUND3FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

marth.SIDESPECIALGROUND3DOWN = {
  name : "SIDESPECIALGROUND3DOWN",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  setVelocities : [0,2.53,3.15,1.25,1.25,1.21,1.13,1.01,0.85,0.66,0.42,0.15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.32,-0.85,-1.20,-1.37,-1.37,-1.20,-0.85,-0.32,0.03,0.10,0.15,0.18,0.21,0.22,0.22,0.20,0.18,0.14,0.09],
  init : function(p){
    player[p].actionState = "SIDESPECIALGROUND3DOWN";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground3down.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground3down.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground3down.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground3down.id3;
    sounds.shout8.play();
    marth.SIDESPECIALGROUND3DOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,19,35);
    if (!marth.SIDESPECIALGROUND3DOWN.interrupt(p)){
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND3DOWN.setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer > 13 && player[p].timer < 18){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALGROUND3DOWN",
          frame:player[p].timer-14
        });
      }
      if (player[p].timer == 15){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 15 && player[p].timer < 19){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 19){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 46){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALGROUND4UP.init(p);
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.56){
        marth.SIDESPECIALGROUND4DOWN.init(p);
      }
      else {
        marth.SIDESPECIALGROUND4FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

marth.SIDESPECIALGROUND3FORWARD = {
  name : "SIDESPECIALGROUND3FORWARD",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  setVelocities : [0,0.41,0.80,0.58,0.20,0.10,0.03,0,-0.01,0,0,0,0,1.10,2.75,3.58,3.58,2.76,1.11,0.01,0,0,0,0,0,-0.01,-0.01,0,0,0,0,0.01,0.01,0.03,-0.01,-0.18,-0.48,-0.99,-1.39,-1.43,-1.12,-0.45,0,0,0,0],
  init : function(p){
    player[p].actionState = "SIDESPECIALGROUND3FORWARD";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground3forward.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground3forward.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground3forward.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground3forward.id3;
    sounds.shout5.play();
    marth.SIDESPECIALGROUND3FORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,16,37);
    if (!marth.SIDESPECIALGROUND3FORWARD.interrupt(p)){
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND3FORWARD.setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer > 10 && player[p].timer < 18){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALGROUND3FORWARD",
          frame:player[p].timer-11
        });
      }
      if (player[p].timer == 11){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 11 && player[p].timer < 15){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 15){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 46){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALGROUND4UP.init(p);
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.56){
        marth.SIDESPECIALGROUND4DOWN.init(p);
      }
      else {
        marth.SIDESPECIALGROUND4FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

marth.SIDESPECIALGROUND3UP = {
  name : "SIDESPECIALGROUND3UP",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  setVelocities : [0,0.37,0.91,1.18,1.18,0.9,0.46,0.22,0.25,0.55,1.02,1.32,1.35,1.11,0.88,0.76,0.54,0.20,0,0,0,0,0,0,0,0,0,-0.04,-0.12,-0.18,-0.24,-0.28,-0.32,-0.34,-0.35,-0.35,-0.34,-0.32,-0.28,-0.24,-0.18,-0.12,-0.04,0,0.01,0.01],
  init : function(p){
    player[p].actionState = "SIDESPECIALGROUND3UP";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground3up.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground3up.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground3up.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground3up.id3;
    sounds.shout3.play();
    marth.SIDESPECIALGROUND3UP.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,18,38);
    if (!marth.SIDESPECIALGROUND3UP.interrupt(p)){
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND3UP.setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer > 3 && player[p].timer < 21){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALGROUND3UP",
          frame:player[p].timer-4
        });
      }
      if (player[p].timer == 13){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 13 && player[p].timer < 18){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 18){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 46){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALGROUND4UP.init(p);
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.56){
        marth.SIDESPECIALGROUND4DOWN.init(p);
      }
      else {
        marth.SIDESPECIALGROUND4FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

marth.SIDESPECIALGROUND4DOWN = {
  name : "SIDESPECIALGROUND4DOWN",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  setVelocities : [0,1.37,1.61,1.56,1.20,0.94,0.94,0.91,0.83,0.71,0.56,0.36,0.13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.01,-0.02,-0.02,-0.02,-0.02,-0.02,-0.02,-0.01,0,0,0,0,-0.02,-0.05,-0.08,-0.09,-0.10,-0.11,-0.10,-0.09,-0.07,-0.04],
  init : function(p){
    player[p].actionState = "SIDESPECIALGROUND4DOWN";
    player[p].timer = 0;
    turnOffHitboxes(p);
    marth.SIDESPECIALGROUND4DOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.SIDESPECIALGROUND4DOWN.interrupt(p)){
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND4DOWN.setVelocities[player[p].timer-1]*player[p].phys.face;
      /*13-15
      19-21
      25-27
      31-33
      37-38*/
      if (player[p].timer > 9 && player[p].timer < 40){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALGROUND4DOWN",
          frame:player[p].timer-10
        });
      }
      if (player[p].timer > 12 && player[p].timer < 39){
        switch (player[p].timer%6){
          case 1:
            var hbName = "dbground4down"+Math.floor((player[p].timer-7)/6);
            player[p].hitboxes.id[0] = player[p].charHitboxes[hbName].id0;
            player[p].hitboxes.id[1] = player[p].charHitboxes[hbName].id1;
            player[p].hitboxes.id[2] = player[p].charHitboxes[hbName].id2;
            player[p].hitboxes.id[3] = player[p].charHitboxes[hbName].id3;
            player[p].hitboxes.active = [true,true,true,true];
            player[p].hitboxes.frame = 0;
            sounds.dancingBlade2.play();
            if (player[p].timer < 37){
              sounds.shout6.play();
            }
            break;
          case 2:
          case 3:
            player[p].hitboxes.frame++;
            break;
          case 4:
            turnOffHitboxes(p);
            break;
          default:
            break;
        }
      }
      if (player[p].timer == 39){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

marth.SIDESPECIALGROUND4FORWARD = {
  name : "SIDESPECIALGROUND4FORWARD",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  setVelocities : [0,0.38,1.33,1.49,1.56,1.53,1.41,1.19,0.88,0.62,0.50,0.40,0.31,0.25,0.21,0.19,0.19,0.21,0.22,0.21,0.19,0.18,0.16,0.14,0.11,0.08,0.05,0.02,0,0,0,0,0,0,0,0,0,0,-0.04,-0.11,-0.18,-0.22,-0.25,-0.27,-0.28,-0.27,-0.25,-0.22,-0.17,-0.11,-0.05],
  init : function(p){
    player[p].actionState = "SIDESPECIALGROUND4FORWARD";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground4forward.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground4forward.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground4forward.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground4forward.id3;
    sounds.shout2.play();
    marth.SIDESPECIALGROUND4FORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.SIDESPECIALGROUND4FORWARD.interrupt(p)){
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND4FORWARD.setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer > 21 && player[p].timer < 30){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALGROUND4FORWARD",
          frame:player[p].timer-22
        });
      }
      if (player[p].timer == 23){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 23 && player[p].timer < 27){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 27){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 50){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

marth.SIDESPECIALGROUND4UP = {
  name : "SIDESPECIALGROUND4UP",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  setVelocities : [0,0.87,0.91,0.94,0.97,0.98,0.99,0.98,0.97,0.95,0.92,0.88,0.83,0.77,0.70,0.60,0.49,0.39,0.32,0.26,0.23,0.21,0.21,0.23,0.27,0.30,0.25,0.10,0,0,0,0,0,0,0,0,0,0,0,-0.36,-0.93,-1.28,-1.39,-1.28,-0.93,-0.36,0,0,0,0],
  init : function(p){
    player[p].actionState = "SIDESPECIALGROUND4UP";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground4up.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground4up.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground4up.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground4up.id3;
    sounds.shout4.play();
    marth.SIDESPECIALGROUND4UP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.SIDESPECIALGROUND4UP.interrupt(p)){
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND4UP.setVelocities[player[p].timer-1]*player[p].phys.face;
      if (player[p].timer > 18 && player[p].timer < 27){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALGROUND4UP",
          frame:player[p].timer-19
        });
      }
      if (player[p].timer == 20){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 20 && player[p].timer < 26){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 26){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 50){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

window.dancingBladeAirMobility = function(p){
  player[p].phys.cVel.y -= 0.06;
  if (player[p].phys.cVel.y < -1.5){
    player[p].phys.cVel.y = -1.5;
  }
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
};

marth.SIDESPECIALAIR = {
  name : "SIDESPECIALAIR",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "SIDESPECIALAIR";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
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
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair.id3;
    sounds.shout6.play();
    marth.SIDESPECIALAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,8,26);
    if (!marth.SIDESPECIALAIR.interrupt(p)){
      if (player[p].timer == 6){
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 4 && player[p].timer < 12){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALAIR1",
          frame:player[p].timer-5
        });
      }

      dancingBladeAirMobility(p);

      if (player[p].timer > 4 && player[p].timer < 12){

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
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALAIR2UP.init(p);
      }
      else {
        marth.SIDESPECIALAIR2FORWARD.init(p);
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
};

marth.SIDESPECIALAIR2FORWARD = {
  name : "SIDESPECIALAIR2FORWARD",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "SIDESPECIALAIR2FORWARD";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair2forward.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair2forward.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair2forward.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair2forward.id3;
    sounds.shout7.play();
    marth.SIDESPECIALAIR2FORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,17,33);
    if (!marth.SIDESPECIALAIR2FORWARD.interrupt(p)){
      if (player[p].timer > 11 && player[p].timer < 25){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALAIR2FORWARD",
          frame:player[p].timer-12
        });
      }
      dancingBladeAirMobility(p);
      if (player[p].timer == 14){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade2.play();
      }
      if (player[p].timer > 14 && player[p].timer < 17){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 17){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 40){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALAIR3UP.init(p);
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.56){
        marth.SIDESPECIALAIR3DOWN.init(p);
      }
      else {
        marth.SIDESPECIALAIR3FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "SIDESPECIALGROUND2FORWARD";
  }
};

marth.SIDESPECIALAIR2UP = {
  name : "SIDESPECIALAIR2UP",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "SIDESPECIALAIR2UP";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair2up.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair2up.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair2up.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair2up.id3;
    sounds.shout1.play();
    marth.SIDESPECIALAIR2UP.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,17,32);
    if (!marth.SIDESPECIALAIR2UP.interrupt(p)){
      if (player[p].timer > 10 && player[p].timer < 21){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALAIR2UP",
          frame:player[p].timer-11
        });
      }
      dancingBladeAirMobility(p);
      if (player[p].timer == 12){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade2.play();
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
    if (player[p].timer > 40){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALAIR3UP.init(p);
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.56){
        marth.SIDESPECIALAIR3DOWN.init(p);
      }
      else {
        marth.SIDESPECIALAIR3FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "SIDESPECIALGROUND2UP";
  }
};

marth.SIDESPECIALAIR3DOWN = {
  name : "SIDESPECIALAIR3DOWN",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "SIDESPECIALAIR3DOWN";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair3down.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair3down.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair3down.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair3down.id3;
    sounds.shout8.play();
    marth.SIDESPECIALAIR3DOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,19,35);
    if (!marth.SIDESPECIALAIR3DOWN.interrupt(p)){
      if (player[p].timer > 13 && player[p].timer < 18){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALAIR3DOWN",
          frame:player[p].timer-14
        });
      }
      dancingBladeAirMobility(p);
      player[p].phys.cVel.x = 0;
      if (player[p].timer == 15){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 15 && player[p].timer < 19){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 19){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 46){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALAIR4UP.init(p);
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.56){
        marth.SIDESPECIALAIR4DOWN.init(p);
      }
      else {
        marth.SIDESPECIALAIR4FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "SIDESPECIALGROUND3DOWN";
  }
};

marth.SIDESPECIALAIR3FORWARD = {
  name : "SIDESPECIALAIR3FORWARD",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "SIDESPECIALAIR3FORWARD";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair3forward.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair3forward.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair3forward.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair3forward.id3;
    sounds.shout5.play();
    marth.SIDESPECIALAIR3FORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,16,37);
    if (!marth.SIDESPECIALAIR3FORWARD.interrupt(p)){
      if (player[p].timer > 9 && player[p].timer < 18){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALAIR3FORWARD",
          frame:player[p].timer-10
        });
      }
      dancingBladeAirMobility(p);
      player[p].phys.cVel.x = 0;
      if (player[p].timer == 11){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 11 && player[p].timer < 15){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 15){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 46){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALAIR4UP.init(p);
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.56){
        marth.SIDESPECIALAIR4DOWN.init(p);
      }
      else {
        marth.SIDESPECIALAIR4FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "SIDESPECIALGROUND3FORWARD";
  }
};

marth.SIDESPECIALAIR3UP = {
  name : "SIDESPECIALAIR3UP",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "SIDESPECIALAIR3UP";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair3up.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair3up.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair3up.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair3up.id3;
    sounds.shout3.play();
    marth.SIDESPECIALAIR3UP.main(p);
  },
  main : function(p){
    player[p].timer++;
    dancingBladeCombo(p,18,38);
    if (!marth.SIDESPECIALAIR3UP.interrupt(p)){
      if (player[p].timer > 9 && player[p].timer < 18){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALAIR3UP",
          frame:player[p].timer-10
        });
      }
      dancingBladeAirMobility(p);
      player[p].phys.cVel.x = 0;
      if (player[p].timer == 13){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 13 && player[p].timer < 18){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 18){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 46){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade){
      if (player[p].inputs.lStickAxis[0].y > 0.56){
        marth.SIDESPECIALAIR4UP.init(p);
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.56){
        marth.SIDESPECIALAIR4DOWN.init(p);
      }
      else {
        marth.SIDESPECIALAIR4FORWARD.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "SIDESPECIALGROUND3UP";
  }
};

marth.SIDESPECIALAIR4DOWN = {
  name : "SIDESPECIALAIR4DOWN",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "SIDESPECIALAIR4DOWN";
    player[p].timer = 0;
    turnOffHitboxes(p);
    marth.SIDESPECIALAIR4DOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.SIDESPECIALAIR4DOWN.interrupt(p)){
      if (player[p].timer > 9 && player[p].timer < 41){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALAIR4DOWN",
          frame:player[p].timer-10
        });
      }
      dancingBladeAirMobility(p);
      if (player[p].timer > 12 && player[p].timer < 39){
        switch (player[p].timer%6){
          case 1:
            var hbName = "dbair4down"+Math.floor((player[p].timer-7)/6);
            player[p].hitboxes.id[0] = player[p].charHitboxes[hbName].id0;
            player[p].hitboxes.id[1] = player[p].charHitboxes[hbName].id1;
            player[p].hitboxes.id[2] = player[p].charHitboxes[hbName].id2;
            player[p].hitboxes.id[3] = player[p].charHitboxes[hbName].id3;
            player[p].hitboxes.active = [true,true,true,true];
            player[p].hitboxes.frame = 0;
            sounds.dancingBlade2.play();
            if (player[p].timer < 37){
              sounds.shout6.play();
            }
            break;
          case 2:
          case 3:
            player[p].hitboxes.frame++;
            break;
          case 4:
            turnOffHitboxes(p);
            break;
          default:
            break;
        }
      }
      if (player[p].timer == 39){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "SIDESPECIALGROUND4DOWN";
  }
};

marth.SIDESPECIALAIR4FORWARD = {
  name : "SIDESPECIALAIR4FORWARD",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "SIDESPECIALAIR4FORWARD";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair4forward.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair4forward.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair4forward.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair4forward.id3;
    sounds.shout2.play();
    marth.SIDESPECIALAIR4FORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.SIDESPECIALAIR4FORWARD.interrupt(p)){
      if (player[p].timer > 21 && player[p].timer < 30){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALAIR4FORWARD",
          frame:player[p].timer-22
        });
      }
      dancingBladeAirMobility(p);
      player[p].phys.cVel.x = 0;
      if (player[p].timer == 23){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 23 && player[p].timer < 27){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 27){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 50){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "SIDESPECIALGROUND4FORWARD";
  }
};

marth.SIDESPECIALAIR4UP = {
  name : "SIDESPECIALAIR4UP",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "SIDESPECIALAIR4UP";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair4up.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair4up.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair4up.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair4up.id3;
    sounds.shout4.play();
    marth.SIDESPECIALAIR4UP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.SIDESPECIALAIR4UP.interrupt(p)){
      if (player[p].timer > 17 && player[p].timer < 27){
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"SIDESPECIALAIR4UP",
          frame:player[p].timer-18
        });
      }
      dancingBladeAirMobility(p);
      player[p].phys.cVel.x = 0;
      if (player[p].timer == 20){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 20 && player[p].timer < 26){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer == 26){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 50){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "SIDESPECIALGROUND4UP";
  }
};

marth.DOWNSPECIALAIR = {
  name : "DOWNSPECIALAIR",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  specialClank : true,
  init : function(p){
    player[p].actionState = "DOWNSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.cVel.y = 0;
    player[p].phys.cVel.x *= 0.5;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecialair.id0;
    marth.DOWNSPECIALAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.DOWNSPECIALAIR.interrupt(p)){
      player[p].phys.cVel.y -= 0.04;
      if (player[p].phys.cVel.y < -1.2){
        player[p].phys.cVel.y = -1.2;
      }
      var sign = Math.sign(player[p].phys.cVel.x);
      player[p].phys.cVel.x -= sign*0.0025;
      if (player[p].phys.cVel.x*sign < 0){
        player[p].phys.cVel.x = 0;
      }
      if (player[p].timer == 5){
        sounds.marthcounter.play();
        player[p].colourOverlayBool = true;
        player[p].colourOverlay = "white";
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      else if (player[p].timer == 30){
        turnOffHitboxes(p);
      }
      if (player[p].timer >= 6 && player[p].timer <= 28){
        if (player[p].timer % 6 < 2){
          player[p].colourOverlayBool = true;
          player[p].colourOverlay = "rgb(122, 122, 122)";
        }
        else if (player[p].timer % 6 < 4){
          player[p].colourOverlayBool = true;
          player[p].colourOverlay = "rgb(200, 120, 255)";
        }
        else {
          player[p].colourOverlayBool = false;
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 59){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "DOWNSPECIALGROUND";
  },
  onClank : function(p){
    player[p].hit.hitlag = 11;
    player[p].colourOverlayBool = false;
    marth.DOWNSPECIALAIR2.init(p);
  }
};

marth.DOWNSPECIALAIR2 = {
  name : "DOWNSPECIALAIR2",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DOWNSPECIALAIR2";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 16;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecialair2.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.downspecialair2.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.downspecialair2.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.downspecialair2.id3;
    sounds.powershield.play();
    sounds.marthcounterclank.play();
    sounds.marthcountershout.play();
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("powershield",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+8),player[p].phys.face);
    marth.DOWNSPECIALAIR2.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.DOWNSPECIALAIR2.interrupt(p)){
      player[p].phys.cVel.y -= 0.04;
      if (player[p].phys.cVel.y < -1.2){
        player[p].phys.cVel.y = -1.2;
      }
      var sign = Math.sign(player[p].phys.cVel.x);
      player[p].phys.cVel.x -= sign*0.0025;
      if (player[p].timer == 4){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
      }
      else if (player[p].timer > 4 && player[p].timer < 11){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 11){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 36){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

marth.DOWNSPECIALGROUND = {
  name : "DOWNSPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  specialClank : true,
  init : function(p){
    player[p].actionState = "DOWNSPECIALGROUND";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecialground.id0;
    marth.DOWNSPECIALGROUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.DOWNSPECIALGROUND.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer == 5){
        sounds.marthcounter.play();
        player[p].colourOverlayBool = true;
        player[p].colourOverlay = "white";
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
      }
      else if (player[p].timer == 30){
        turnOffHitboxes(p);
      }

      if (player[p].timer >= 6 && player[p].timer <= 28){
        if (player[p].timer % 6 < 2){
          player[p].colourOverlayBool = true;
          player[p].colourOverlay = "rgb(122, 122, 122)";
        }
        else if (player[p].timer % 6 < 4){
          player[p].colourOverlayBool = true;
          player[p].colourOverlay = "rgb(200, 120, 255)";
        }
        else {
          player[p].colourOverlayBool = false;
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 59){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  onClank : function(p){
    player[p].hit.hitlag = 11;
    player[p].colourOverlayBool = false;
    marth.DOWNSPECIALGROUND2.init(p);
  }
};

marth.DOWNSPECIALGROUND2 = {
  name : "DOWNSPECIALGROUND2",
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  init : function(p){
    reduceByTraction(p,true);
    player[p].actionState = "DOWNSPECIALGROUND2";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 16;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecialground2.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.downspecialground2.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.downspecialground2.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.downspecialground2.id3;
    sounds.powershield.play();
    sounds.marthcounterclank.play();
    sounds.marthcountershout.play();
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("powershield",new Vec2D(player[p].phys.pos.x,player[p].phys.pos.y+8),player[p].phys.face);
    marth.DOWNSPECIALGROUND2.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.DOWNSPECIALGROUND2.interrupt(p)){
      if (player[p].timer == 4){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
      }
      else if (player[p].timer > 4 && player[p].timer < 11){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 11){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 36){
      if (player[p].phys.grounded){
        marth.WAIT.init(p);
      }
      else {
        marth.FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

marth.NEUTRALSPECIALAIR = {
  name : "NEUTRALSPECIALAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "NEUTRALSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.shieldBreakerCharge = 0;
    player[p].phys.shieldBreakerChargeAttempt = true;
    player[p].phys.shieldBreakerCharging = false;
    player[p].phys.cVel.x *= 0.8;
    player[p].phys.cVel.y = Math.max(0,player[p].phys.cVel.y);
    player[p].phys.fastfalled = false;
    player[p].colourOverlayBool = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.neutralspecialair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.neutralspecialair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.neutralspecialair.id3;
    sounds.jump.play();
    marth.NEUTRALSPECIALAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer >= 12 && player[p].timer <= 41 && player[p].phys.shieldBreakerChargeAttempt){
      if (player[p].inputs.b[0]){
        player[p].phys.shieldBreakerCharging = true;
        player[p].phys.shieldBreakerCharge++;
        var originalColour = palettes[pPal[p]][0];
        originalColour = originalColour.substr(4,originalColour.length-5);
        var colourArray = originalColour.split(",");
        var newCol = blendColours(colourArray,[117,50,227],Math.min(1,player[p].phys.shieldBreakerCharge/120));
        player[p].colourOverlay = "rgb("+newCol[0]+","+newCol[1]+","+newCol[2]+")";
        player[p].colourOverlayBool = true;
        if (player[p].phys.shieldBreakerCharge % 6 == 0){
          drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
        }
      }
      else {
        player[p].phys.shieldBreakerCharging = false;
        player[p].phys.shieldBreakerChargeAttempt = false;
        player[p].colourOverlayBool = false;
        player[p].timer = 42;
        sounds.shieldbreakercharge.stop(player[p].shieldBreakerID);
      }
    }
    if (player[p].phys.shieldBreakerCharging){
      if (player[p].timer > 41){
        player[p].timer = 12;
      }
      if (player[p].phys.shieldBreakerCharge == 122){
        player[p].timer = 42;
        player[p].phys.shieldBreakerCharging = false;
        player[p].phys.shieldBreakerChargeAttempt = false;
        player[p].colourOverlayBool = false;
        sounds.shieldbreakercharge.stop(player[p].shieldBreakerID);
      }
    }

    if (!marth.NEUTRALSPECIALAIR.interrupt(p)){
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
      if (player[p].timer < 12){
        var decrease = 0.02;
      }
      else {
        var decrease = 0.005;
      }
      var sign = Math.sign(player[p].phys.cVel.x);
      player[p].phys.cVel.x -= decrease*sign;
      if (player[p].phys.cVel.x*sign < 0){
        player[p].phys.cVel.x = 0;
      }

      if (player[p].timer == 7){
        sounds.shieldbreaker1.play();
      }
      else if (player[p].timer == 11){
        player[p].shieldBreakerID = sounds.shieldbreakercharge.play();
      }
      else if (player[p].timer == 43){
        sounds.shieldbreakershout.play();
        sounds.shieldbreaker2.play();

      }
      else if (player[p].timer == 46){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        var newDmg = 7+(5*Math.floor(player[p].phys.shieldBreakerCharge/30))+1*(Math.floor(player[p].phys.shieldBreakerCharge/120));
        player[p].hitboxes.id[0].dmg = newDmg;
        player[p].hitboxes.id[1].dmg = newDmg;
        player[p].hitboxes.id[2].dmg = newDmg;
        player[p].hitboxes.id[3].dmg = newDmg;
        if (player[p].phys.shieldBreakerCharge >= 120){
          sounds.firestronghit.play();
        }
        else {
          sounds.sword3.play();
        }
      }
      else if (player[p].timer > 46 && player[p].timer < 52){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 52){
        turnOffHitboxes(p);
      }

      if (player[p].timer == 50){
        if (player[p].phys.shieldBreakerCharge >= 120){
          drawVfx("groundBounce",new Vec2D(player[p].phys.pos.x+18*player[p].phys.face,player[p].phys.pos.y),player[p].phys.face);
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 74){
      marth.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].actionState = "NEUTRALSPECIALGROUND";
  }
};

window.blendColours = function(start,end,opacity){
  var blended = [];
  var difference = [];
  for (var i=0;i<3;i++){
    start[i] = parseInt(start[i]);
    difference[i] = end[i]-start[i];
    blended[i] = start[i]+difference[i]*opacity;
  }
  return [Math.floor(blended[0]),Math.floor(blended[1]),Math.floor(blended[2])];
};

marth.NEUTRALSPECIALGROUND = {
  name : "NEUTRALSPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "NEUTRALSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.shieldBreakerCharge = 0;
    player[p].phys.shieldBreakerChargeAttempt = true;
    player[p].phys.shieldBreakerCharging = false;
    player[p].colourOverlayBool = false;
    player[p].phys.cVel.x *= 0.8;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialground.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.neutralspecialground.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.neutralspecialground.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.neutralspecialground.id3;
    sounds.jump.play();
    marth.NEUTRALSPECIALGROUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (player[p].timer >= 12 && player[p].timer <= 41 && player[p].phys.shieldBreakerChargeAttempt){
      if (player[p].inputs.b[0]){
        player[p].phys.shieldBreakerCharging = true;
        player[p].phys.shieldBreakerCharge++;
        var originalColour = palettes[pPal[p]][0];
        originalColour = originalColour.substr(4,originalColour.length-5);
        var colourArray = originalColour.split(",");
        var newCol = blendColours(colourArray,[117,50,227],Math.min(1,player[p].phys.shieldBreakerCharge/120));
        player[p].colourOverlay = "rgb("+newCol[0]+","+newCol[1]+","+newCol[2]+")";
        player[p].colourOverlayBool = true;
        if (player[p].phys.shieldBreakerCharge % 6 == 0){
          drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
        }
      }
      else {
        player[p].phys.shieldBreakerCharging = false;
        player[p].phys.shieldBreakerChargeAttempt = false;
        player[p].colourOverlayBool = false;
        player[p].timer = 42;
        sounds.shieldbreakercharge.stop(player[p].shieldBreakerID);
      }
    }
    if (player[p].phys.shieldBreakerCharging){
      if (player[p].timer > 41){
        player[p].timer = 12;
      }
      if (player[p].phys.shieldBreakerCharge == 122){
        player[p].timer = 42;
        player[p].phys.shieldBreakerCharging = false;
        player[p].phys.shieldBreakerChargeAttempt = false;
        player[p].colourOverlayBool = false;
        sounds.shieldbreakercharge.stop(player[p].shieldBreakerID);
      }
    }

    if (!marth.NEUTRALSPECIALGROUND.interrupt(p)){
      if (player[p].timer < 12){
        var sign = Math.sign(player[p].phys.cVel.x);
        player[p].phys.cVel.x -= 0.02*sign;
        if (player[p].phys.cVel.x*sign < 0){
          player[p].phys.cVel.x = 0;
        }
      }
      else {
        reduceByTraction(p);
      }

      if (player[p].timer == 7){
        sounds.shieldbreaker1.play();
      }
      else if (player[p].timer == 11){
        player[p].shieldBreakerID = sounds.shieldbreakercharge.play();
      }
      else if (player[p].timer == 43){
        sounds.shieldbreakershout.play();
        sounds.shieldbreaker2.play();

      }
      else if (player[p].timer == 46){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        var newDmg = 7+(5*Math.floor(player[p].phys.shieldBreakerCharge/30))+1*(Math.floor(player[p].phys.shieldBreakerCharge/120));
        player[p].hitboxes.id[0].dmg = newDmg;
        player[p].hitboxes.id[1].dmg = newDmg;
        player[p].hitboxes.id[2].dmg = newDmg;
        player[p].hitboxes.id[3].dmg = newDmg;
        if (player[p].phys.shieldBreakerCharge >= 120){
          sounds.firestronghit.play();
        }
        else {
          sounds.sword3.play();
        }
      }
      else if (player[p].timer > 46 && player[p].timer < 52){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 52){
        turnOffHitboxes(p);
      }

      if (player[p].timer == 50){
        if (player[p].phys.shieldBreakerCharge >= 120){
          drawVfx("groundBounce",new Vec2D(player[p].phys.pos.x+18*player[p].phys.face,player[p].phys.pos.y),player[p].phys.face);
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 74){
      marth.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
marth.UPSPECIAL = {
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
  landType : 1,
  init : function(p){
    player[p].actionState = "UPSPECIAL";
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
    marth.UPSPECIAL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.UPSPECIAL.interrupt(p)){
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
        if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.28){
          player[p].phys.face *= -1;
        }
      }
      if (player[p].timer > 5 && player[p].timer < 23){
        player[p].phys.cVel = new Vec2D(marth.UPSPECIAL.setVelocities[player[p].timer-6][0]*player[p].phys.face*Math.cos(player[p].phys.upbAngleMultiplier)-marth.UPSPECIAL.setVelocities[player[p].timer-6][1]*Math.sin(player[p].phys.upbAngleMultiplier),marth.UPSPECIAL.setVelocities[player[p].timer-6][0]*player[p].phys.face*Math.sin(player[p].phys.upbAngleMultiplier)+marth.UPSPECIAL.setVelocities[player[p].timer-6][1]*Math.cos(player[p].phys.upbAngleMultiplier));
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
        drawVfx("swing",new Vec2D(0,0),player[p].phys.face,{
          pNum:p,
          swingType:"UPSPECIAL",
          frame:player[p].timer-3
        });
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      marth.FALLSPECIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.cVel.y+player[p].phys.kVel.y <= 0){
      marth.LANDINGFALLSPECIAL.init(p);
    }
  }
};

// --------------- THROWS ------------
marth.THROWFORWARD = {
  name : "THROWFORWARD",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWFORWARD";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNMARTHFORWARD.init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwforward.id0;
    randomShout(cS[p]);
    var frame = framesData[cS[player[p].phys.grabbing]].THROWNMARTHFORWARD;
    player[p].phys.releaseFrame = frame+1;
    marth.THROWFORWARD.main(p);
  },
  main : function(p){
    player[p].timer+=13/player[p].phys.releaseFrame;
    if (!marth.THROWFORWARD.interrupt(p)){
      if (Math.floor(player[p].timer+0.01) == 13){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 27){
      player[p].phys.grabbing = -1;
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < 13 && player[player[p].phys.grabbing].phys.grabbedBy != p){
      marth.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
marth.THROWBACK = {
  name : "THROWBACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWBACK";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNMARTHBACK.init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
    randomShout(cS[p]);
    var frame = framesData[cS[player[p].phys.grabbing]].THROWNMARTHBACK;
    player[p].phys.releaseFrame = frame+1;
    marth.THROWBACK.main(p);
  },
  main : function(p){
    player[p].timer+=7/player[p].phys.releaseFrame;
    if (!marth.THROWBACK.interrupt(p)){
      if (Math.floor(player[p].timer+0.01) == 7){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      player[p].phys.grabbing = -1;
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < 7 && player[player[p].phys.grabbing].phys.grabbedBy != p){
      marth.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
marth.THROWUP = {
  name : "THROWUP",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWUP";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNMARTHUP.init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
    var frame = framesData[cS[player[p].phys.grabbing]].THROWNMARTHUP;
    player[p].phys.releaseFrame = frame+1;
    randomShout(cS[p]);
    marth.THROWUP.main(p);
  },
  main : function(p){
    player[p].timer+=12/player[p].phys.releaseFrame;
    if (!marth.THROWUP.interrupt(p)){
      if (Math.floor(player[p].timer+0.01) == 12){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      player[p].phys.grabbing = -1;
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < 11 && player[player[p].phys.grabbing].phys.grabbedBy != p){
      marth.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
marth.THROWDOWN = {
  name : "THROWDOWN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWDOWN";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNMARTHDOWN.init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
    randomShout(cS[p]);
    var frame = framesData[cS[player[p].phys.grabbing]].THROWNMARTHDOWN;
    player[p].phys.releaseFrame = frame+1;
    marth.THROWDOWN.main(p);
  },
  main : function(p){
    player[p].timer+=13/player[p].phys.releaseFrame;
    if (!marth.THROWDOWN.interrupt(p)){
      if (Math.floor(player[p].timer+0.01) == 13){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 37){
      player[p].phys.grabbing = -1;
      marth.WAIT.init(p);
      return true;
    }
    else if (player[p].timer < 13 && player[player[p].phys.grabbing].phys.grabbedBy != p){
      console.log("test");
      marth.CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

//---------------------THROWNS--------
marth.THROWNMARTHUP = {
  name : "THROWNMARTHUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-9.42,2.73],[-10.14,2.56],[-10.83,2.00],[-10.97,1.82],[-10.74,1.85],[-10.44,1.95],[-10.17,2.05],[-10.08,2.08],[-11.07,2.81],[-8.94,11.00],[-8.94,11.00]],
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
    marth.THROWNMARTHUP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNMARTHUP.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNMARTHUP.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNMARTHUP.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};


marth.THROWNMARTHDOWN = {
  name : "THROWNMARTHDOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-9.23,3.12],[-11.00,3.75],[-12.45,4.26],[-12.67,4.33],[-12.67,4.33],[-12.67,4.33],[-12.92,3.86],[-13.31,2.59],[-13.16,1.05],[-12.50,-0.70],[-11.29,-2.85],[-8.43,-6.34],[-8.43,-6.34]],
  init : function(p){
    player[p].actionState = "THROWNMARTHDOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    marth.THROWNMARTHDOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNMARTHDOWN.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNMARTHDOWN.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNMARTHDOWN.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};


marth.THROWNMARTHBACK = {
  name : "THROWNMARTHBACK",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-6.93,2.63],[-4.37,2.35],[-1.03,2.23],[-0.04,0.73],[1.12,-1.77],[1.23,-2.01],[1.23,-2.01]],
  init : function(p){
    player[p].actionState = "THROWNMARTHBACK";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    marth.THROWNMARTHBACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNMARTHBACK.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNMARTHBACK.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNMARTHBACK.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};


marth.THROWNMARTHFORWARD = {
  name : "THROWNMARTHFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.23,2.34],[-11.36,2.91],[-9.76,4.86],[-9.49,5.06],[-9.31,5.09],[-9.28,5.01],[-9.49,4.86],[-10.27,4.65],[-13.57,3.61],[-11.63,1.55],[-9.61,-2.20],[-7.85,-7.66],[-7.85,-7.66]],
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
    marth.THROWNMARTHFORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNMARTHFORWARD.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNMARTHFORWARD.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNMARTHFORWARD.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};
marth.THROWNPUFFFORWARD = {
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
    marth.THROWNPUFFFORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNPUFFFORWARD.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNPUFFFORWARD.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNPUFFFORWARD.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

marth.THROWNPUFFDOWN = {
  name : "THROWNPUFFDOWN",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-9.84,-3.86],[-7.24,-5.16],[-4.52,-6.41],[-2.68,-7.35],[-0.51,-8.44],[-0.48,-8.42],[-0.58,-8.37],[-0.59,-8.41],[-0.51,-8.47],[-0.54,-8.45],[-0.59,-8.42],[-0.61,-8.41],[-0.57,-8.42],[-0.50,-8.43],[-0.48,-8.46],[-0.49,-8.49],[-0.49,-8.48],[-0.49,-8.44],[-0.50,-8.42],[-0.54,-8.41],[-0.57,-8.44],[-0.56,-8.47],[-0.54,-8.47],[-0.50,-8.44],[-0.46,-8.40],[-0.49,-8.39],[-0.54,-8.42],[-0.52,-8.47],[-0.51,-8.52],[-0.50,-8.50],[-0.52,-8.43],[-0.46,-8.37],[-0.41,-8.38],[-0.47,-8.44],[-0.51,-8.45],[-0.53,-8.43],[-0.54,-8.41],[-0.47,-8.39],[-0.44,-8.43],[-0.45,-8.48],[-0.46,-8.46],[-0.48,-8.43],[-0.49,-8.41],[-0.55,-8.41],[-0.57,-8.43],[-0.57,-8.46],[-0.55,-8.47],[-0.51,-8.45],[-0.48,-8.40],[-0.51,-8.38],[-0.57,-8.39],[-0.55,-8.44],[-0.55,-8.47],[-0.54,-8.46],[-0.53,-8.43],[-0.48,-8.38],[-0.48,-8.38],[-0.52,-8.44],[-0.50,-8.46],[-0.48,-8.50],[-0.51,-8.49],[-0.55,-8.47],[-0.55,-8.47]],
  init : function(p){
    player[p].actionState = "THROWNPUFFDOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

    marth.THROWNPUFFDOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNPUFFDOWN.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNPUFFDOWN.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNPUFFDOWN.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

marth.THROWNPUFFBACK = {
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
    player[p].phys.face*= -1;
    marth.THROWNPUFFBACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNPUFFBACK.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNPUFFBACK.offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNPUFFBACK.offset[player[p].timer-1][1]);
        /*if (player[p].timer > 13 && player[p].timer < 19){
          player[p].phys.pos.x += marth.THROWNPUFFBACK.offsetVel[player[p].timer-14]*player[p].phys.face;
        }*/
      }

    }
  },
  interrupt : function(p){
    return false;
  }
};

marth.THROWNPUFFUP = {
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
    marth.THROWNPUFFUP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNPUFFUP.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNPUFFUP.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNPUFFUP.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

marth.THROWNFOXFORWARD = {
  name : "THROWNFOXFORWARD",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-7.32-0.08,-2.32],[-6.75-0.22,-1.58],[-6.72-0.24,-1.42],[-6.91,-1.41],[-7.01+0.68,-1.25],[-7.22+1.67,-1.06],[-7.63+2.69,-0.90],[-8.35+3.47,-0.83],[-9.61+4.04,-0.93],[-11.60+4.04,-1.17],[-11.60+4.61,-1.17]],
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
    marth.THROWNFOXFORWARD.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNFOXFORWARD.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNFOXFORWARD.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNFOXFORWARD.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

marth.THROWNFOXDOWN = {
  name : "THROWNFOXDOWN",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-4.30,-2.59],[-1.90,-3.81],[-1.47,-3.92],[-1.42,-3.79],[-1.41,-3.32],[-1.56,-1.14],[-0.61,1.89],[0.37,2.60],[1.24,2.77],[1.46,2.48],[1.49,2.02],[1.50,2.27],[1.50,2.46],[1.28,2.59],[-0.02,5.04],[-0.35,-5.59],[-0.40,-6.30],[-0.39,-5.43],[-0.35,-4.66],[-0.30,-5.00],[-0.22,-5.73],[-0.14,-5.84],[-0.07,-4.33],[-0.07,-6.59],[-0.07,-6.29],[-0.07,-5.99],[-0.07,-5.70],[-0.07,-5.43],[-0.07,-5.17],[-0.07,-4.95],[-0.07,-4.75],[-0.07,-4.58],[-0.07,-4.58]],
  init : function(p){
    player[p].actionState = "THROWNFOXDOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

    marth.THROWNFOXDOWN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNFOXDOWN.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNFOXDOWN.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNFOXDOWN.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

marth.THROWNFOXBACK = {
  name : "THROWNFOXBACK",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  reverseModel : true,
  //[1.05,7.14],[3.78,7.55],[10.37,1.56],[13.72,-6.85],[13.66,-9.95],[13.67,-10.28],[13.85,-9.92],[14.04,-9.34],[14.04,-9.34]],
  offset : [[-7.76,-3.11],[-7.01,-3.24],[-4.87,-3.80],[-1.68,-4.84],[0.47,-5.78],[4.54,-5.55],[8.21,1.48],[8.21,1.48]],
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
    marth.THROWNFOXBACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNFOXBACK.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNFOXBACK.offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNFOXBACK.offset[player[p].timer-1][1]);
      }

    }
  },
  interrupt : function(p){
    return false;
  }
};

marth.THROWNFOXUP = {
  name : "THROWNFOXUP",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-6.22,-2.90],[-5.58,-2.40],[-5.10,-2.15],[-4.84,-2.89],[-4.66,2.92],[-1.86,9.18],[-1.86,9.18],[-1.86,9.18]],
  init : function(p){
    player[p].actionState = "THROWNFOXUP";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    marth.THROWNFOXUP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.THROWNFOXUP.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+marth.THROWNFOXUP.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+marth.THROWNFOXUP.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};

//------------CLIFF ACTIONS-----------

marth.CLIFFGETUPQUICK = {
  name : "CLIFFGETUPQUICK",
  canBeGrabbed : true,
  offset : [[-71.33,-23.71],[-71.38,-23.71],[-71.42,-23.71],[-71.45,-23.71],[-71.46,-23.71],[-71.44,-23.71],[-71.38,-23.71],[-71.26,-23.71],[-71.07,-22.69],[-70.80,-19.99],[-70.47,-16.19],[-70.11,-11.83],[-69.71,-7.48],[-69.28,-3.68],[-68.83,-1.01],[-67.88,0],[-67.38,0],[-66.87,0],[-66.35,0],[-65.81,0],[-65.27,0],[-64.73,0],[-64.19,0],[-63.65,0],[-63.12,0],[-62.59,0],[-62.08,0],[-61.60,0],[-61.17,0],[-60.80,0],[-60.50,0],[-60.28,0]],
  init : function(p){
    player[p].actionState = "CLIFFGETUPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 30;
    marth.CLIFFGETUPQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.CLIFFGETUPQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 16){
        player[p].phys.pos = new Vec2D(x+(marth.CLIFFGETUPQUICK.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+marth.CLIFFGETUPQUICK.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.pos.x = x+(68.4+marth.CLIFFGETUPQUICK.offset[player[p].timer-1][0])*player[p].phys.face;
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
      marth.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

marth.CLIFFGETUPSLOW = {
  name : "CLIFFGETUPSLOW",
  offset : [[-71.28,-23.58],[-71.24,-23.27],[-71.18,-22.72],[-71.11,-21.97],[-71.04,-21.05],[-70.96,-20.00],[-70.87,-18.83],[-70.77,-17.58],[-70.67,-16.29],[-70.58,-14.97],[-70.48,-13.67],[-70.38,-12.40],[-70.28,-11.21],[-70.19,-10.05],[-70.10,-8.66],[-69.99,-6.99],[-69.86,-5.26],[-69.76,-3.64],[-69.74,-2.33],[-69.85,-1.49],[-70.07,-1.06],[-70.35,-0.79],[-70.62,-0.59],[-70.83,-0.41],[-70.92,-0.23],[-70.84,-0.1],[-70.66,-0.02],[-70.48,0.03],[-70.28,0.05],[-70.08,0.05],[-69.87,0.04],[-69.64,0.02],[-69.40,0.01],[-69.15,0],[-68.87,0],[-68.58,0],[-67.95,0]],
  setVelocities : [0.34,0.36,0.39,0.40,0.41,0.41,0.41,0.41,0.40,0.40,0.39,0.39,0.38],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFGETUPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 55;
    marth.CLIFFGETUPSLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.CLIFFGETUPSLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 46){
        if (player[p].timer > 8){
          player[p].phys.pos = new Vec2D(x+(marth.CLIFFGETUPSLOW.offset[player[p].timer-9][0]+68.4)*player[p].phys.face,y+marth.CLIFFGETUPSLOW.offset[player[p].timer-9][1]);
        }
        else {
          player[p].phys.pos = new Vec2D(x+(-71.31+68.4)*player[p].phys.face,y-23.71);
        }
      }
      else {
        player[p].phys.cVel.x = marth.CLIFFGETUPSLOW.setVelocities[player[p].timer-46]*player[p].phys.face;
      }
      if (player[p].timer == 45){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 58){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      marth.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

marth.CLIFFESCAPEQUICK = {
  name : "CLIFFESCAPEQUICK",
  offset : [[-70.31,-23.71],[-71.33,-23.71],[-71.36,-23.71],[-71.40,-23.71],[-71.43,-23.71],[-71.44,-23.71],[-71.42,-23.71],[-71.37,-23.71],[-71.28,-23.71],[-71.13,-22.69],[-70.93,-19.99],[-70.69,-16.19],[-70.40,-11.83],[-70.04,-7.48],[-69.69,-3.68],[-69.05,-1.01],[-67.74,0]],
  setVelocities : [4.23,4.22,4.21,1.74,1.67,1.61,1.56,1.51,1.47,1.44,1.41,1.39,1.37,1.36,1.36,1.36,1.37,0.14,0.22,0.42,0.62,0.68,0.63,0.49,0.34,0.27,0.21,0.17,0.14,0.13,0.13],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFESCAPEQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 38;
    marth.CLIFFESCAPEQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.CLIFFESCAPEQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 18){
        player[p].phys.pos = new Vec2D(x+(marth.CLIFFESCAPEQUICK.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+marth.CLIFFESCAPEQUICK.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = marth.CLIFFESCAPEQUICK.setVelocities[player[p].timer-18]*player[p].phys.face;
      }
      if (player[p].timer == 17){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 48){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      marth.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }

};

marth.CLIFFESCAPESLOW = {
  name : "CLIFFESCAPESLOW",
  offset : [[-71.27,-23.58],[-71.21,-23.27],[-71.14,-22.72],[-71.05,-21.97],[-70.96,-21.05],[-70.86,-20.0],[-70.76,-18.83],[-70.65,-17.58],[-70.55,-16.29],[-70.45,-14.97],[-70.37,-13.67],[-70.29,-12.40],[-70.23,-11.21],[-70.18,-10.07],[-70.13,-8.90],[-70.01,-6.95],[-69.12,-2.82],[-67.68,0]],
  setVelocities : [0,0,0,0,0,0,0,0,0.02,2.76,2.65,2.55,2.44,2.34,2.23,2.12,2.01,1.90,1.79,1.68,1.56,1.45,1.34,1.24,1.15,1.07,0.99,0.91,0.85,0.79,0.64,0.42,0.25,0.14,0.08,0.07,0.08,0.07,0.06,0.05,0.05,0.04,0.03,0.02,0.02,0.01,0.01,0,0,0,-0.01],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFESCAPESLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 56;
    marth.CLIFFESCAPESLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.CLIFFESCAPESLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 28){
        if (player[p].timer > 9){
          player[p].phys.pos = new Vec2D(x+(marth.CLIFFESCAPESLOW.offset[player[p].timer-10][0]+68.4)*player[p].phys.face,y+marth.CLIFFESCAPESLOW.offset[player[p].timer-10][1]);
        }
        else {
          player[p].phys.pos = new Vec2D(x+(-71.31+68.4)*player[p].phys.face,y-23.71);
        }
      }
      else {
        player[p].phys.cVel.x = marth.CLIFFESCAPESLOW.setVelocities[player[p].timer-28]*player[p].phys.face;
      }
      if (player[p].timer == 27){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 78){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      marth.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

marth.CLIFFJUMPQUICK = {
  name : "CLIFFJUMPQUICK",
  offset : [[-70.91,-23.37],[-70.48,-22.70],[-70.03,-21.59],[-69.59,-20.23],[-69.16,-18.77],[-68.76,-17.39],[-68.82,-16.26],[-69.31,-15.57],[-69.00,-13.87],[-68.51,-8.90],[-68.4,-2.95]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFJUMPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 11;
    marth.CLIFFJUMPQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.CLIFFJUMPQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 12){
        player[p].phys.pos = new Vec2D(x+(marth.CLIFFJUMPQUICK.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+marth.CLIFFJUMPQUICK.offset[player[p].timer-1][1]);
      }
      if (player[p].timer == 12){
        player[p].phys.cVel = new Vec2D(1*player[p].phys.face,2.4);
      }
      if (player[p].timer > 12){
        airDrift(p);
        fastfall(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 50){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      marth.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

marth.CLIFFJUMPSLOW = {
  name : "CLIFFJUMPSLOW",
  offset : [[-71.27,-23.71],[-71.15,-23.55],[-70.96,-23.07],[-70.73,-22.26],[-70.48,-21.16],[-70.21,-19.81],[-69.94,-18.28],[-69.70,-16.60],[-69.45,-14.12],[-69.19,-10.70],[-69.37,-7.08],[-68.97,-3.53],[-68.59,-1.00],[-68.40,0],[-68.4,0],[-68.4,0],[-68.4,0],[-68.4,0]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFJUMPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 18;
    marth.CLIFFJUMPSLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.CLIFFJUMPSLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 19){
        player[p].phys.pos = new Vec2D(x+(marth.CLIFFJUMPSLOW.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+marth.CLIFFJUMPSLOW.offset[player[p].timer-1][1]);
      }
      if (player[p].timer == 19){
        player[p].phys.cVel = new Vec2D(1*player[p].phys.face,2.4);
      }
      if (player[p].timer > 19){
        airDrift(p);
        fastfall(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 57){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      marth.FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

marth.CLIFFATTACKSLOW = {
  name : "CLIFFATTACKSLOW",
  offset : [[-71.27,-23.58],[-71.22,-23.27],[-71.16,-22.72],[-71.09,-21.97],[-71.00,-21.05],[-70.91,-20.00],[-70.82,-18.83],[-70.72,-17.58],[-70.62,-16.29],[-70.52,-14.97],[-70.43,-13.67],[-70.34,-12.40],[-70.25,-11.21],[-70.18,-10.11],[-70.1,-8.54],[-70.00,-6.96],[-69.87,-5.72],[-69.72,-4.66],[-69.53,-3.63],[-69.31,-2.56],[-69.05,-1.55],[-68.75,-0.66],[-67.85,0]],
  setVelocities : [0.66,0.79,0.76,0.65,0.56,0.51,0.47,0.47,0.46,0.42,0.34,0.24,0.11,0.03,0.03,0.03,0.02,0.01,0,-0.01,-0.02,-0.04,-0.06,-0.08,-0.10,-0.13,-0.16,-0.19,-0.21,-0.21,-0.21,-0.20,-0.18,-0.16,-0.13,-0.09],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFATTACKSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 34;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupslow.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupslow.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ledgegetupslow.id2;
    marth.CLIFFATTACKSLOW.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.CLIFFATTACKSLOW.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 33){
        if (player[p].timer > 9){
          player[p].phys.pos = new Vec2D(x+(marth.CLIFFATTACKSLOW.offset[player[p].timer-10][0]+68.4)*player[p].phys.face,y+marth.CLIFFATTACKSLOW.offset[player[p].timer-10][1]);
        }
        else {
          player[p].phys.pos = new Vec2D(x+(-71.31+68.4)*player[p].phys.face,y-23.71);
        }
      }
      else {
        player[p].phys.cVel.x = marth.CLIFFATTACKSLOW.setVelocities[player[p].timer-33]*player[p].phys.face;
      }
      if (player[p].timer == 32){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer == 38){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        randomShout(cS[p]);
      }
      else if (player[p].timer > 38 && player[p].timer < 42){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 42){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 68){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      marth.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

marth.CLIFFATTACKQUICK = {
  name : "CLIFFATTACKQUICK",
  offset : [[-71.31,-23.71],[-71.32,-23.71],[-71.36,-23.71],[-71.41,-23.71],[-71.46,-23.71],[-71.49,-23.71],[-71.48,-23.71],[-71.42,-23.71],[-71.28,-23.71],[-71.06,-22.49],[-70.72,-19.41],[-70.33,-15.28],[-69.94,-11.06],[-69.55,-7.59],[-69.16,-4.33],[-68.77,-1.27],[-67.98,0]],
  setVelocities : [0.39,0.39,0.38,0.38,0.38,0.38,0.37,0.37,0.36,0.36,0.35,0.35,0.29,0.19,0.11,0.05,0,-0.02,-0.03,-0.01,0,-0.01,-0.01,-0.02,-0.02,-0.03,-0.03,-0.04,-0.04,-0.04,-0.04,-0.04,-0.04,-0.05,-0.04,-0.04,-0.04],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFATTACKQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 20;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupquick.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupquick.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ledgegetupquick.id2;
    marth.CLIFFATTACKQUICK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.CLIFFATTACKQUICK.interrupt(p)){
      var x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      var y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 18){
        player[p].phys.pos = new Vec2D(x+(marth.CLIFFATTACKQUICK.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+marth.CLIFFATTACKQUICK.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = marth.CLIFFATTACKQUICK.setVelocities[player[p].timer-18]*player[p].phys.face;
      }
      if (player[p].timer == 17){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer == 24){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
        randomShout(cS[p]);
      }
      else if (player[p].timer > 24 && player[p].timer < 28){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer == 28){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 54){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      marth.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }

};

//------------MISC----------------
marth.CATCHATTACK = {
  name : "CATCHATTACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CATCHATTACK";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.pummel.id0;
    marth.CATCHATTACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.CATCHATTACK.interrupt(p)){
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
      marth.CATCHWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
marth.DOWNATTACK = {
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
    marth.DOWNATTACK.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!marth.DOWNATTACK.interrupt(p)){
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
      marth.WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

// UNIQUE ACTION STATES END

// SET VELOCITIES AND POSITIONS

marth.ESCAPEB.setVelocities = [-2.267,-2.536,-2.706,-2.780,-2.758,-2.640,-2.426,-2.116,-1.711,-1.209,-0.888,-0.819,-0.758,-0.707,-0.664,-0.631,-0.606,-0.591,-0.585,-0.587,-0.599,-0.620,-0.809,-1.072,-1.205,-1.207,-1.078,-0.819,-0.617,-0.556,-0.487,-0.413,-0.332,-0.245,-0.152];
marth.ESCAPEF.setVelocities = [1.282,1.254,1.267,1.322,1.418,1.557,1.737,1.959,4.447,4.593,2.338,2.229,2.070,1.862,1.605,1.298,0.941,0.727,0.687,0.648,0.608,0.569,0.529,0.490,0.450,0.411,0.372,0.332,0.293,0.254,0.215,0.176,0.137,0.098,0.058];
marth.DOWNSTANDB.setVelocities = [-0.185,-0.370,-0.573,-1.540,-1.614,-1.586,-1.566,-1.614,-1.647,-1.666,-1.669,-1.657,-1.630,-1.588,-1.531,-1.397,-1.224,-1.094,-1.006,-0.962,-0.960,-0.926,-0.816,-0.684,-0.529,-0.352,-0.226,-0.171,-0.124,-0.084,-0.051,-0.025,-0.007,0.004,0.008];
marth.DOWNSTANDF.setVelocities = [0.467,1.360,1.733,2.135,2.355,2.581,2.055,2.281,2.184,1.902,1.703,1.521,1.357,1.211,1.082,0.971,0.878,0.802,0.743,0.703,0.680,0.674,0.686,0.716,0.763,0.775,0.727,0.661,0.577,0.474,0.352,0.241,0.163,0.101,0.055];
marth.TECHB.setVelocities = [0,0,0,0,0,0,0,-2.832,-2.726,-2.622,-2.521,-2.422,-2.326,-2.233,-2.142,-2.054,-1.968,-1.885,-1.811,-1.748,-1.691,-1.639,-1.593,-1.553,-1.519,-1.490,-1.467,-1.450,-1.439,-1.433,-1.433,-0.002,-0.003,-0.004,-0.005,-0.006,-0.006,-0.007,-0.007,-0.006];
marth.TECHF.setVelocities = [0,0,0,0,0,0,0,4.036,3.526,2.726,2.317,1.862,1.656,1.625,1.768,1.989,2.094,2.083,1.956,1.846,1.814,1.757,1.676,1.570,1.440,1.286,1.107,0.949,0.834,0.727,0.629,0.540,0.459,0.387,0.323,0.268,0.222,0.184,0.155,0.135];
marth.CLIFFCATCH.posOffset = [[-71.9,-22.3],[-73.1,-22.19],[-72.21,-24],[-71.8,-24],[-71.1,-23.74],[-70.74,-23.76],[-71.3,-23.75]];
marth.CLIFFWAIT.posOffset = [-71.3,-23.75];
