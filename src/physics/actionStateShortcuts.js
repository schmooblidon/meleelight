/* eslint-disable */

window.randomShout = function(char){
  //playSfx("shout"+Math.round(0.5+Math.random()*5.99));
  switch (char){
    case 0:
      var shout = Math.round(0.5+Math.random()*5.99);
      switch (shout){
        case 1:
          sounds.shout1.play();
          break;
        case 2:
          sounds.shout2.play();
          break;
        case 3:
          sounds.shout3.play();
          break;
        case 4:
          sounds.shout4.play();
          break;
        case 5:
          sounds.shout5.play();
          break;
        case 6:
          sounds.shout6.play();
          break;
        default:
          break;
      }
      break;
    case 1:
      var shout = Math.round(0.5+Math.random()*4.99);
      switch (shout){
        case 1:
          sounds.puffshout1.play();
          break;
        case 2:
          sounds.puffshout2.play();
          break;
        case 3:
          sounds.puffshout3.play();
          break;
        case 4:
          sounds.puffshout4.play();
          break;
        case 5:
          sounds.puffshout5.play();
          break;
        default:
          break;
      }
      break;
    case 2:
      var shout = Math.round(0.5+Math.random()*4.99);
      switch (shout){
        case 1:
          sounds.foxshout1.play();
          break;
        case 2:
          sounds.foxshout2.play();
          break;
        case 3:
          sounds.foxshout3.play();
          break;
        case 4:
          sounds.foxshout4.play();
          break;
        case 5:
          sounds.foxshout5.play();
          break;
        default:
          break;
        }
        break;
    default:
      break;
  }
}

window.executeIntangibility = function(actionStateName,p){
  if (player[p].timer == intangibility[cS[p]][actionStateName][0]){
    player[p].phys.intangibleTimer = intangibility[cS[p]][actionStateName][1];
  }
}

window.playSounds = function(actionStateName,p){
  for (var i=0;i<actionSounds[cS[p]][actionStateName].length;i++){
    if (player[p].timer == actionSounds[cS[p]][actionStateName][i][0]){
      sounds[actionSounds[cS[p]][actionStateName][i][1]].play();
    }
  }
}

window.isFinalDeath = function(){
  if (gameMode == 5){
    return true;
  }
  else if (versusMode){
    return false;
  }
  else {
    var finalDeaths = 0;
    var totalPlayers = 0;
    for (var j=0;j<4;j++){
      if (playerType[j] > -1){
        totalPlayers++;
        if (player[j].stocks == 0){
          finalDeaths++;
        }
      }
    }
    return (finalDeaths >= totalPlayers - 1);
  }
}

window.getAngle = function(x,y){
  var angle = 0;
  if (x != 0 || y != 0) {
    angle = Math.atan2(y, x);
  }
  return angle;
}
//aC = 180/Math.PI;
window.turnOffHitboxes = function(p){
  player[p].hitboxes.active = [false,false,false,false];
  player[p].hitboxes.hitList = [];
}

window.shieldTilt = function(p,shieldstun){
  if (!shieldstun && !player[p].inCSS){
    var x = player[p].inputs.lStickAxis[0].x;
    var y = player[p].inputs.lStickAxis[0].y;
    var targetOffset = Math.sqrt(x*x+y*y)*3;
    var targetAngle = getAngle(x,y);
    targetPosition = new Vec2D(Math.cos(targetAngle) * targetOffset, Math.sin(targetAngle) * targetOffset);
    player[p].phys.shieldPosition = new Vec2D(
      player[p].phys.shieldPosition.x+((targetPosition.x-player[p].phys.shieldPosition.x)/5 + 0.01),
      player[p].phys.shieldPosition.y+((targetPosition.y-player[p].phys.shieldPosition.y)/5 + 0.01));
  }
  player[p].phys.shieldPositionReal = new Vec2D(player[p].phys.pos.x+player[p].phys.shieldPosition.x+(player[p].charAttributes.shieldOffset[0]*player[p].phys.face/4.5),player[p].phys.pos.y+player[p].phys.shieldPosition.y+(player[p].charAttributes.shieldOffset[1]/4.5));
}

window.reduceByTraction = function(p,applyDouble){
  if (player[p].phys.cVel.x > 0){
    if (applyDouble && player[p].phys.cVel.x > player[p].charAttributes.maxWalk){
      player[p].phys.cVel.x -= player[p].charAttributes.traction*2;
    }
    else {
      player[p].phys.cVel.x -= player[p].charAttributes.traction;
    }
    if (player[p].phys.cVel.x < 0){
      player[p].phys.cVel.x = 0;
    }
  }
  else {
    if (applyDouble && player[p].phys.cVel.x < -player[p].charAttributes.maxWalk){
      player[p].phys.cVel.x += player[p].charAttributes.traction*2;
    }
    else {
      player[p].phys.cVel.x += player[p].charAttributes.traction;
    }
    if (player[p].phys.cVel.x > 0){
      player[p].phys.cVel.x = 0;
    }
  }
}

window.airDrift = function(p){
  if (Math.abs(player[p].inputs.lStickAxis[0].x) < 0.3){
    var tempMax = 0
  }
  else {
    var tempMax = player[p].charAttributes.aerialHmaxV * player[p].inputs.lStickAxis[0].x;
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
    player[p].phys.cVel.x += (player[p].charAttributes.airMobA * player[p].inputs.lStickAxis[0].x) + (Math.sign(player[p].inputs.lStickAxis[0].x) * player[p].charAttributes.airMobB);
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

window.fastfall = function(p){
  if (!player[p].phys.fastfalled){
    player[p].phys.cVel.y -= player[p].charAttributes.gravity;
    if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
      player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
    }
    if (player[p].inputs.lStickAxis[0].y < -0.65 && player[p].inputs.lStickAxis[3].y > -0.1 && player[p].phys.cVel.y < 0){
      sounds.fastfall.play();
      player[p].phys.fastfalled = true;
      player[p].phys.cVel.y = -player[p].charAttributes.fastFallV;
    }
  }
}

window.shieldDepletion = function(p){
  //(0.28*input - (1-input/10))
  var input = Math.max(player[p].inputs.lAnalog[0], player[p].inputs.rAnalog[0]);
  player[p].phys.shieldHP -= 0.28*input - ((1-input)/10);
  if (player[p].phys.shieldHP <= 0){
    player[p].phys.shielding = false;
    player[p].phys.cVel.y = player[p].charAttributes.shieldBreakVel;
    player[p].phys.grounded = false;
    player[p].phys.shieldHP = 0;
    drawVfx("breakShield",player[p].phys.pos,player[p].phys.face);
    sounds.shieldbreak.play();
    aS[cS[p]].SHIELDBREAKFALL.init(p);
  }
}

window.shieldSize = function(p,lock){
   //shield size * 0.575 * model scaling
  //(shield size * 0.575 * hp/60) + (1-input)*0.60714*shieldsize
  player[p].phys.shieldAnalog = Math.max(player[p].inputs.lAnalog[0], player[p].inputs.rAnalog[0]);
  if (lock && player[p].phys.shieldAnalog == 0){
    player[p].phys.shieldAnalog = 1;
  }
  player[p].phys.shieldSize = (player[p].charAttributes.shieldScale * 0.575 * player[p].charAttributes.modelScale * (player[p].phys.shieldHP/60)) + ((1-player[p].phys.shieldAnalog)*0.6*player[p].charAttributes.shieldScale) + ((60 - player[p].phys.shieldHP)/60 * 2);
}

window.mashOut = function(p){
  if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
    return true;
  }
  else if (player[p].inputs.b[0] && !player[p].inputs.b[1]){
    return true;
  }
  else if (player[p].inputs.x[0] && !player[p].inputs.x[1]){
    return true;
  }
  else if (player[p].inputs.y[0] && !player[p].inputs.y[1]){
    return true;
  }
  else if (player[p].inputs.lStickAxis[0].x > 0.8 && !player[p].inputs.lStickAxis[1].x < 0.7){
    return true;
  }
  else if (player[p].inputs.lStickAxis[0].x < -0.8 && !player[p].inputs.lStickAxis[1].x < -0.7){
    return true;
  }
  else if (player[p].inputs.lStickAxis[0].y > 0.8 && !player[p].inputs.lStickAxis[1].y < 0.7){
    return true;
  }
  else if (player[p].inputs.lStickAxis[0].y < -0.8 && !player[p].inputs.lStickAxis[1].y > -0.7){
    return true;
  }
  else if (player[p].inputs.cStickAxis[0].x > 0.8 && !player[p].inputs.cStickAxis[1].x < 0.7){
    return true;
  }
  else if (player[p].inputs.cStickAxis[0].x < -0.8 && !player[p].inputs.cStickAxis[1].x < -0.7){
    return true;
  }
  else if (player[p].inputs.cStickAxis[0].y > 0.8 && !player[p].inputs.cStickAxis[1].y < 0.7){
    return true;
  }
  else if (player[p].inputs.cStickAxis[0].y < -0.8 && !player[p].inputs.cStickAxis[1].y > -0.7){
    return true;
  }
  else {
    return false;
  }
}

// Global Interrupts
window.checkForSmashes = function(p){
  if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
    if (Math.abs(player[p].inputs.lStickAxis[0].x) >= 0.79 && player[p].inputs.lStickAxis[2].x*Math.sign(player[p].inputs.lStickAxis[0].x) < 0.3){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      return [true,"FORWARDSMASH"];
    }
    else if (player[p].inputs.lStickAxis[0].y >= 0.66 && player[p].inputs.lStickAxis[2].y < 0.3){
      return [true,"UPSMASH"];
    }
    else if (player[p].inputs.lStickAxis[0].y <= -0.66 && player[p].inputs.lStickAxis[2].y > -0.3){
      return [true,"DOWNSMASH"];
    }
    else {
      return [false,false];
    }
  }
  else if (Math.abs(player[p].inputs.cStickAxis[0].x) >= 0.79 && Math.abs(player[p].inputs.cStickAxis[1].x) < 0.79){
    player[p].phys.face = Math.sign(player[p].inputs.cStickAxis[0].x);
    return [true,"FORWARDSMASH"];
  }
  else if (player[p].inputs.cStickAxis[0].y >= 0.66 && player[p].inputs.cStickAxis[1].y < 0.66){
    return [true,"UPSMASH"];
  }
  else if (player[p].inputs.cStickAxis[0].y <= -0.66 && player[p].inputs.cStickAxis[1].y > -0.66){
    return [true,"DOWNSMASH"];
  }
  else {
    return [false,false];
  }
}

window.checkForTilts = function(p,reverse){
  var reverse = reverse || 1;
  if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
    if (player[p].inputs.lStickAxis[0].x*player[p].phys.face*reverse > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x)-(Math.abs(player[p].inputs.lStickAxis[0].y)) > -0.05){
      return [true,"FORWARDTILT"];
    }
    else if (player[p].inputs.lStickAxis[0].y < -0.3){
      return [true,"DOWNTILT"];
    }
    else if (player[p].inputs.lStickAxis[0].y > 0.3){
      return [true,"UPTILT"];
    }
    else {
      return [true,"JAB1"];
    }
  }
  else {
    return [false,false];
  }
}

window.checkForSpecials = function(p){
  if (player[p].inputs.b[0] && !player[p].inputs.b[1]){
    if (player[p].phys.grounded){
      if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.58 || (player[p].inputs.lStickAxis[0].y > 0.58 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y - 0.2)){
        player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
        return [true,"SIDESPECIALGROUND"];
      }
      else if (player[p].inputs.lStickAxis[0].y > 0.58){
        return [true,"UPSPECIAL"];
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.58){
        return [true,"DOWNSPECIALGROUND"];
      }
      else {
        return [true,"NEUTRALSPECIALGROUND"];
      }
    }
    else {
      if (player[p].inputs.lStickAxis[0].y > 0.58 || (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.58 && player[p].inputs.lStickAxis[0].y > Math.abs(player[p].inputs.lStickAxis[0].x) - 0.2)){
        return [true,"UPSPECIAL"];
      }
      else if (player[p].inputs.lStickAxis[0].y < -0.58 || (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.58 && -player[p].inputs.lStickAxis[0].y > Math.abs(player[p].inputs.lStickAxis[0].x) - 0.2)){
        return [true,"DOWNSPECIALAIR"];
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.58){
        player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
        return [true,"SIDESPECIALAIR"];
      }
      else {
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.25){
          player[p].phys.face *= -1;
        }
        else if (player[p].phys.bTurnaroundTimer > 0){
          player[p].phys.face = player[p].phys.bTurnaroundDirection;
        }
        return [true,"NEUTRALSPECIALAIR"];
      }
    }
  }
  else {
    return [false,false];
  }
}

window.checkForAerials = function(p){
  if (player[p].inputs.cStickAxis[0].x * player[p].phys.face >= 0.3 && player[p].inputs.cStickAxis[1].x * player[p].phys.face < 0.3 && Math.abs(player[p].inputs.cStickAxis[0].x) > Math.abs(player[p].inputs.cStickAxis[0].y) - 0.1){
    return [true,"ATTACKAIRF"];
  }
  else if (player[p].inputs.cStickAxis[0].x * player[p].phys.face <= -0.3 && player[p].inputs.cStickAxis[1].x * player[p].phys.face > -0.3 && Math.abs(player[p].inputs.cStickAxis[0].x) > Math.abs(player[p].inputs.cStickAxis[0].y) - 0.1){
    return [true,"ATTACKAIRB"];
  }
  else if (player[p].inputs.cStickAxis[0].y >= 0.3 && player[p].inputs.cStickAxis[1].y < 0.3){
    return [true,"ATTACKAIRU"];
  }
  else if (player[p].inputs.cStickAxis[0].y < -0.3 && player[p].inputs.cStickAxis[1].y > -0.3){
    return [true,"ATTACKAIRD"];
  }
  else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.z[0] && !player[p].inputs.z[1])){
    if (player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > Math.abs(player[p].inputs.lStickAxis[0].y) - 0.1){
      return [true,"ATTACKAIRF"];
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > Math.abs(player[p].inputs.lStickAxis[0].y) - 0.1){
      return [true,"ATTACKAIRB"];
    }
    else if (player[p].inputs.lStickAxis[0].y > 0.3){
      return [true,"ATTACKAIRU"];
    }
    else if (player[p].inputs.lStickAxis[0].y < -0.3){
      return [true,"ATTACKAIRD"];
    }
    else {
      return [true,"ATTACKAIRN"];
    }
  }
  return [false,0];
}


window.checkForDash = function(p){
  if (player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].inputs.lStickAxis[2].x * player[p].phys.face < 0.3){
    return true;
  }
  else {
    return false;
  }
}

window.checkForSmashTurn = function(p){
  if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.79 && player[p].inputs.lStickAxis[2].x * player[p].phys.face > -0.3){
    return true;
  }
  else {
    return false;
  }
}

window.tiltTurnDashBuffer = function(p){
  if (player[p].inputs.lStickAxis[1].x * player[p].phys.face > -0.3){
    return true;
  }
  else {
    return false;
  }
}

window.checkForTiltTurn = function(p){
  if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
    return true;
  }
  else {
    return false;
  }
}

window.checkForJump = function(p){
  if ((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1])){
    return [true,0];
  }
  else if (player[p].inputs.lStickAxis[0].y > 0.66 && player[p].inputs.lStickAxis[3].y < 0.2){
    return [true,1];
  }
  else {
    return [false,false];
  }
}

window.checkForSquat = function(p){
  if (player[p].inputs.lStickAxis[0].y < -0.69){
    return true;
  }
  else {
    return false;
  }
}

window.turboAirborneInterrupt = function(p){
  var a = checkForAerials(p);
  var b = checkForSpecials(p);
  if (a[0] && a[1] != player[p].actionState){
    turnOffHitboxes(p);
    aS[cS[p]][a[1]].init(p);
    return true;
  }
  else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
    turnOffHitboxes(p);
    aS[cS[p]].ESCAPEAIR.init(p);
    return true;
  }
  else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
    turnOffHitboxes(p);
    if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
      aS[cS[p]].JUMPAERIALB.init(p);
    }
    else {
      aS[cS[p]].JUMPAERIALF.init(p);
    }
    return true;
  }
  else if (b[0] && b[1] != player[p].actionState){
    turnOffHitboxes(p);
    aS[cS[p]][b[1]].init(p);
    return true;
  }
  else {
    return false;
  }
}

window.turboGroundedInterrupt = function(p){
  var b = checkForSpecials(p);
  var t = checkForTilts(p);
  var s = checkForSmashes(p);
  var j = checkForJump(p);
  if (j[0]){
    turnOffHitboxes(p);
    aS[cS[p]].KNEEBEND.init(p,j[1]);
    return true;
  }
  else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
    turnOffHitboxes(p);
    aS[cS[p]].GUARDON.init(p);
    return true;
  }
  else if (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0){
    turnOffHitboxes(p);
    aS[cS[p]].GUARDON.init(p);
    return true;
  }
  else if (b[0] && b[1] != player[p].actionState){
    turnOffHitboxes(p);
    aS[cS[p]][b[1]].init(p);
    return true;
  }
  else if (s[0] && s[1] != player[p].actionState){
    turnOffHitboxes(p);
    aS[cS[p]][s[1]].init(p);
    return true;
  }
  else if (t[0] && t[1] != player[p].actionState){
    turnOffHitboxes(p);
    aS[cS[p]][t[1]].init(p);
    return true;
  }
  else if (checkForSquat(p)){
    turnOffHitboxes(p);
    aS[cS[p]].SQUAT.init(p);
    return true;
  }
  else if (checkForDash(p)){
    turnOffHitboxes(p);
    aS[cS[p]].DASH.init(p);
    return true;
  }
  else if (checkForSmashTurn(p)){
    turnOffHitboxes(p);
    aS[cS[p]].SMASHTURN.init(p);
    return true;
  }
  else if (checkForTiltTurn(p)){
    turnOffHitboxes(p);
    player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
    aS[cS[p]].TILTTURN.init(p);
    return true;
  }
  else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
    turnOffHitboxes(p);
    aS[cS[p]].WALK.init(p,true);
    return true;
  }
  else {
    return false;
  }
}

window.aS = [];

/* char id:
0 - marth
1 - jiggs
2 - fox
*/
