export default {
  name : "RUNTURN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "RUNTURN";
    player[p].timer = 0;
    aS[cS[p]].RUNTURN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].RUNTURN.interrupt(p)){
      if (player[p].timer == player[p].charAttributes.runTurnBreakPoint+1){
        player[p].phys.face *= -1;
      }

      if (player[p].timer <= player[p].charAttributes.runTurnBreakPoint && player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
        var tempAcc = (player[p].charAttributes.dAccA - (1 - Math.abs(player[p].inputs.lStickAxis[0].x))*(player[p].charAttributes.dAccA))*player[p].phys.face;
        player[p].phys.cVel.x -= tempAcc;
      }
      else if (player[p].timer > player[p].charAttributes.runTurnBreakPoint && player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.3){
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

      if (player[p].timer == player[p].charAttributes.runTurnBreakPoint){
        if (player[p].phys.cVel.x * player[p].phys.face > 0){
          player[p].timer--;
        }
      }
    }
  },
  interrupt : function(p){
    var j = checkForJump(p);
    if (j[0]){
      aS[cS[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].RUNTURN){
      if(player[p].inputs.lStickAxis[0].x * player[p].phys.face > 0.6){
        aS[cS[p]].RUN.init(p);
      }
      else {
        aS[cS[p]].WAIT.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

