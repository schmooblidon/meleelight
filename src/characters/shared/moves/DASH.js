/* globals player, aS, cS, frames, sounds, reduceByTraction, checkForJump, checkForSmashTurn, drawVfx */

export default {
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
      if (player[p].timer === 2){
        player[p].phys.cVel.x += player[p].charAttributes.dInitV * player[p].phys.face;
        if (Math.abs(player[p].phys.cVel.x) > player[p].charAttributes.dMaxV){
          player[p].phys.cVel.x = player[p].charAttributes.dMaxV * player[p].phys.face;
        }
      }
      if (player[p].timer === 4){
        drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
      }
      if (player[p].timer > 1){
        if (Math.abs(player[p].inputs.lStickAxis[0].x) < 0.3){
          reduceByTraction(p,false);
        }
        else {
          const tempMax = player[p].inputs.lStickAxis[0].x * player[p].charAttributes.dMaxV;
          //var tempAcc = (player[p].charAttributes.dAcc - (1 - Math.abs(player[p].inputs.lStickAxis[0].x))*(player[p].charAttributes.dAcc))*player[p].phys.face;
          const tempAcc = player[p].inputs.lStickAxis[0].x * player[p].charAttributes.dAccA;

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
    const j = checkForJump(p);
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
