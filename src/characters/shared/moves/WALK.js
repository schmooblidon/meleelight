/* globals player, aS, cS, frames, checkForSpecials, checkForTilts,
checkForSmashes, checkForSquat, checkForDash, checkForSmashTurn,
checkForTiltTurn, checkForJump, tiltTurnDashBuffer, sounds, reduceByTraction */

export default {
  name : "WALK",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,addInitV){
    player[p].actionState = "WALK";
    player[p].timer = 1;
    if (addInitV){
      const tempInit = player[p].charAttributes.walkInitV * player[p].phys.face;
      if ((tempInit > 0 && player[p].phys.cVel.x < tempInit) || (tempInit < 0 && player[p].phys.cVel.x > tempInit)){
        player[p].phys.cVel.x += player[p].charAttributes.walkInitV * player[p].phys.face;
      }
    }
    aS[cS[p]].WALK.main(p);
  },
  main : function(p){
    if (!aS[cS[p]].WALK.interrupt(p)){
      const footstep = [false, false];
      if (player[p].timer < 5){
        footstep[0] = true;
      }
      if (player[p].timer < 15){
        footstep[1] = true;
      }

      //Current Walk Acceleration = ((MaxWalkVel * Xinput) - PreviousFrameVelocity) * (1/(MaxWalkVel * 2)) * (InitWalkVel * WalkAcc)
      const tempMax = player[p].charAttributes.walkMaxV * player[p].inputs.lStickAxis[0].x;

      if (Math.abs(player[p].phys.cVel.x) > Math.abs(tempMax)){
        reduceByTraction(p, true);
      }
      else {
        const tempAcc = (tempMax - player[p].phys.cVel.x) * (1/(player[p].charAttributes.walkMaxV*2)) * (player[p].charAttributes.walkInitV + player[p].charAttributes.walkAcc);

        player[p].phys.cVel.x += tempAcc;
        if (player[p].phys.cVel.x * player[p].phys.face > tempMax * player[p].phys.face){
          player[p].phys.cVel.x = tempMax;
        }
      }

      const time = (player[p].phys.cVel.x * player[p].phys.face) / player[p].charAttributes.walkMaxV;
      if (time > 0){
        player[p].timer += time;
      }
      if ((footstep[0] && player[p].timer >= 5) || (footstep[1] && player[p].timer >= 15)){
        sounds.footstep.play();
      }
    }
  },
  interrupt : function(p){
    const b = checkForSpecials(p);
    const t = checkForTilts(p);
    const s = checkForSmashes(p);
    const j = checkForJump(p);
    if (player[p].timer > frames[cS[p]].WALK){
      aS[cS[p]].WALK.init(p,false);
      return true;
    }
    if (player[p].inputs.lStickAxis[0].x === 0){
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
