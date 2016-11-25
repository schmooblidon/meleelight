export default {
  name : "REBIRTHWAIT",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = "REBIRTHWAIT";
    player[p].timer = 1;
    player[p].phys.cVel.y = 0;
  },
  main : function(p){
    player[p].timer+= 1;
    player[p].spawnWaitTime++;
    if (!aS[cS[p]].REBIRTHWAIT.interrupt(p)){
      player[p].phys.outOfCameraTimer = 0;
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].WAIT){
      aS[cS[p]].REBIRTHWAIT.init(p);
      return true;
    }
    else if (player[p].spawnWaitTime > 300){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      aS[cS[p]].FALL.init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3 || Math.abs(player[p].inputs.lStickAxis[0].y) > 0.3 ){
      player[p].phys.grounded = false;
      player[p].phys.invincibleTimer = 120;
      aS[cS[p]].FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

