export default {
  name : "CLIFFWAIT",
  canGrabLedge : false,
  canBeGrabbed : false,
  wallJumpAble : false,
  posOffset : [],
  landType : 0,
  init : function(p){
    player[p].actionState = "CLIFFWAIT";
    player[p].timer = 0;
    aS[cS[p]].CLIFFWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CLIFFWAIT.interrupt(p)){
      player[p].phys.ledgeHangTimer++;
    }
  },
  interrupt : function(p){
    if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.2 && player[p].inputs.lStickAxis[1].x*player[p].phys.face >= -0.2) || (player[p].inputs.lStickAxis[0].y < -0.2 && player[p].inputs.lStickAxis[1].y >= -0.2) || (player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.2 && player[p].inputs.cStickAxis[1].x*player[p].phys.face >= -0.2) || (player[p].inputs.cStickAxis[0].y < -0.2 && player[p].inputs.cStickAxis[1].y >= -0.2)){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[cS[p]].FALL.init(p,true);
      return true;
    }
    else if ((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.65 && player[p].inputs.lStickAxis[1].y <= 0.65)){
      if (player[p].percent < 100){
        aS[cS[p]].CLIFFJUMPQUICK.init(p);
      }
      else {
        aS[cS[p]].CLIFFJUMPSLOW.init(p);
      }
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.2 && player[p].inputs.lStickAxis[1].x*player[p].phys.face <= 0.2) || (player[p].inputs.lStickAxis[0].y > 0.2 && player[p].inputs.lStickAxis[1].y <= 0.2)){
      if (player[p].percent < 100){
        aS[cS[p]].CLIFFGETUPQUICK.init(p);
      }
      else {
        aS[cS[p]].CLIFFGETUPSLOW.init(p);
      }
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1]) || (player[p].inputs.cStickAxis[0].y > 0.65 && player[p].inputs.cStickAxis[1].y <= 0.65)){
      if (player[p].percent < 100){
        aS[cS[p]].CLIFFATTACKQUICK.init(p);
      }
      else {
        aS[cS[p]].CLIFFATTACKSLOW.init(p);
      }
      return true;
    }
    else if ((player[p].inputs.lAnalog[0] > 0.3 && player[p].inputs.lAnalog[1] <= 0.3) || (player[p].inputs.rAnalog[0] > 0.3 && player[p].inputs.rAnalog[1] <= 0.3) || (player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.8 && player[p].inputs.cStickAxis[1].x*player[p].phys.face <= 0.8)){
      if (player[p].percent < 100){
        aS[cS[p]].CLIFFESCAPEQUICK.init(p);
      }
      else {
        aS[cS[p]].CLIFFESCAPESLOW.init(p);
      }
      return true;
    }
    else if (player[p].phys.ledgeHangTimer > 600){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      aS[cS[p]].DAMAGEFALL.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].CLIFFWAIT){
      aS[cS[p]].CLIFFWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

