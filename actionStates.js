function convertATname(n){
  switch (n){
    case 0:
      return "Wait";
    case 1:
      return "Dash";
    case 2:
      return "Run";
    case 3:
      return "SmashTurn";
    case 4:
      return "TiltTurn";
    case 5:
      return "RunBrake";
    case 6:
      return "RunTurnaround";
    case 7:
      return "JumpSquat";
    case 8:
      return "Jump";
    case 9:
      return "DoubleJump";
    case 10:
      return "Fall";
    case 11:
      return "Landing";
    case 12:
      return "Jab";
    case 13:
      return "Usmash";
    case 14:
      return "Dsmash";
    case 15:
      return "Fsmash";
    default:
      break;
  }
}

function randomShout(char){
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

function isFinalDeath(){
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

function getAngle(x,y){
  var angle = 0;
  if (x != 0 || y != 0) {
    angle = Math.atan2(y, x);
  }
  return angle;
}
//aC = 180/Math.PI;
function turnOffHitboxes(p){
  player[p].hitboxes.active = [false,false,false,false];
  player[p].hitboxes.hitList = [];
}

function shieldTilt(p,shieldstun){
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

function reduceByTraction(p,applyDouble){
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

function airDrift(p){
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

function fastfall(p){
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

function shieldDepletion(p){
  //(0.28*input - (1-input/10))
  var input = Math.max(player[p].inputs.lAnalog[0], player[p].inputs.rAnalog[0]);
  player[p].phys.shieldHP -= 0.28*input - ((1-input)/10);
  if (player[p].phys.shieldHP <= 0){
    player[p].phys.shielding = false;
    player[p].phys.cVel.y = 2.5;
    player[p].phys.grounded = false;
    player[p].phys.shieldHP = 0;
    drawVfx("breakShield",player[p].phys.pos,player[p].phys.face);
    sounds.shieldbreak.play();
    aS[cS[p]][69].init(p);
  }
}

function shieldSize(p,lock){
   //shield size * 0.575 * model scaling
  //(shield size * 0.575 * hp/60) + (1-input)*0.60714*shieldsize
  player[p].phys.shieldAnalog = Math.max(player[p].inputs.lAnalog[0], player[p].inputs.rAnalog[0]);
  if (lock && player[p].phys.shieldAnalog == 0){
    player[p].phys.shieldAnalog = 1;
  }
  player[p].phys.shieldSize = (player[p].charAttributes.shieldScale * 0.575 * player[p].charAttributes.modelScale * (player[p].phys.shieldHP/60)) + ((1-player[p].phys.shieldAnalog)*0.6*player[p].charAttributes.shieldScale) + ((60 - player[p].phys.shieldHP)/60 * 2);
}

function mashOut(p){
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
function checkForSmashes(p){
  if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
    if (Math.abs(player[p].inputs.lStickAxis[0].x) >= 0.79 && player[p].inputs.lStickAxis[2].x*Math.sign(player[p].inputs.lStickAxis[0].x) < 0.3){
      player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
      return [true,57];
    }
    else if (player[p].inputs.lStickAxis[0].y >= 0.66 && player[p].inputs.lStickAxis[2].y < 0.3){
      return [true,58];
    }
    else if (player[p].inputs.lStickAxis[0].y <= -0.66 && player[p].inputs.lStickAxis[2].y > -0.3){
      return [true,59];
    }
    else {
      return [false,false];
    }
  }
  else if (Math.abs(player[p].inputs.cStickAxis[0].x) >= 0.79 && Math.abs(player[p].inputs.cStickAxis[1].x) < 0.79){
    player[p].phys.face = Math.sign(player[p].inputs.cStickAxis[0].x);
    return [true,57];
  }
  else if (player[p].inputs.cStickAxis[0].y >= 0.66 && player[p].inputs.cStickAxis[1].y < 0.66){
    return [true,58];
  }
  else if (player[p].inputs.cStickAxis[0].y <= -0.66 && player[p].inputs.cStickAxis[1].y > -0.66){
    return [true,59];
  }
  else {
    return [false,false];
  }
}

function checkForTilts(p,reverse){
  var reverse = reverse || 1;
  if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
    if (player[p].inputs.lStickAxis[0].x*player[p].phys.face*reverse > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x)-(Math.abs(player[p].inputs.lStickAxis[0].y)) > -0.05){
      return [true,49];
    }
    else if (player[p].inputs.lStickAxis[0].y < -0.3){
      return [true,47];
    }
    else if (player[p].inputs.lStickAxis[0].y > 0.3){
      return [true,48];
    }
    else {
      return [true,50];
    }
  }
  else {
    return [false,false];
  }
}

function checkForSpecials(p){
  if (player[p].inputs.b[0] && !player[p].inputs.b[1]){
    if (player[p].phys.grounded){
      if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.58 || (player[p].inputs.lStickAxis[0].y > 0.58 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y - 0.2)){
        player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
        return [true,56];
      }
      else if (player[p].inputs.lStickAxis[0].y > 0.58){
        return [true,38];
      }
      else if (cS[p] > 0 && player[p].inputs.lStickAxis[0].y < -0.58){
        return [true,104];
      }
      else {
        if (cS[p] == 2){
          return [true,112];
        }
        else {
          return [false,false];
        }
      }
    }
    else {
      if (player[p].inputs.lStickAxis[0].y > 0.58 || (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.58 && player[p].inputs.lStickAxis[0].y > Math.abs(player[p].inputs.lStickAxis[0].x) - 0.2)){
        return [true,38];
      }
      else if (cS[p] > 0 && (player[p].inputs.lStickAxis[0].y < -0.58 || (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.58 && -player[p].inputs.lStickAxis[0].y > Math.abs(player[p].inputs.lStickAxis[0].x) - 0.2))){
        return [true,104];
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.58){
        player[p].phys.face = Math.sign(player[p].inputs.lStickAxis[0].x);
        return [true,103];
      }
      else {
        if (cS[p] == 2){
          return [true,111];
        }
        else {
          return [false,false];
        }
      }
    }
  }
  else {
    return [false,false];
  }
}

function checkForAerials(p){
  if (player[p].inputs.cStickAxis[0].x * player[p].phys.face >= 0.3 && player[p].inputs.cStickAxis[1].x * player[p].phys.face < 0.3 && Math.abs(player[p].inputs.cStickAxis[0].x) > Math.abs(player[p].inputs.cStickAxis[0].y) - 0.1){
    return [true,33];
  }
  else if (player[p].inputs.cStickAxis[0].x * player[p].phys.face <= -0.3 && player[p].inputs.cStickAxis[1].x * player[p].phys.face > -0.3 && Math.abs(player[p].inputs.cStickAxis[0].x) > Math.abs(player[p].inputs.cStickAxis[0].y) - 0.1){
    return [true,34];
  }
  else if (player[p].inputs.cStickAxis[0].y >= 0.3 && player[p].inputs.cStickAxis[1].y < 0.3){
    return [true,35];
  }
  else if (player[p].inputs.cStickAxis[0].y < -0.3 && player[p].inputs.cStickAxis[1].y > -0.3){
    return [true,36];
  }
  else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.z[0] && !player[p].inputs.z[1])){
    if (player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > Math.abs(player[p].inputs.lStickAxis[0].y) - 0.1){
      return [true,33];
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > Math.abs(player[p].inputs.lStickAxis[0].y) - 0.1){
      return [true,34];
    }
    else if (player[p].inputs.lStickAxis[0].y > 0.3){
      return [true,35];
    }
    else if (player[p].inputs.lStickAxis[0].y < -0.3){
      return [true,36];
    }
    else {
      return [true,37];
    }
  }
  return [false,0];
}


function checkForDash(p){
  if (player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.79 && player[p].inputs.lStickAxis[2].x * player[p].phys.face < 0.3){
    return true;
  }
  else {
    return false;
  }
}

function checkForSmashTurn(p){
  if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.79 && player[p].inputs.lStickAxis[2].x * player[p].phys.face > -0.3){
    return true;
  }
  else {
    return false;
  }
}

function tiltTurnDashBuffer(p){
  if (player[p].inputs.lStickAxis[1].x * player[p].phys.face > -0.3){
    return true;
  }
  else {
    return false;
  }
}

function checkForTiltTurn(p){
  if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
    return true;
  }
  else {
    return false;
  }
}

function checkForJump(p){
  if ((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1])){
    return true;
  }
  else if (player[p].inputs.lStickAxis[0].y > 0.66 && player[p].inputs.lStickAxis[3].y < 0.2){
    return true;
  }
  else {
    return false;
  }
}

function checkForSquat(p){
  if (player[p].inputs.lStickAxis[0].y < -0.69){
    return true;
  }
  else {
    return false;
  }
}

aS = [];

/* char id:
0 - marth
1 - jiggs
2 - fox
*/
