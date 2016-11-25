export default {
  name : "DEADLEFT",
  canBeGrabbed : false,
  ignoreCollision : true,
  dead : true,
  init : function(p){
    player[p].actionState = "DEADLEFT";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].percent = 0;
    drawVfx("blastzoneExplosion",player[p].phys.pos,90);
    if (!isFinalDeath()){
      screenShake(500);
      percentShake(500,p);
    }
    sounds.kill.play();
    aS[cS[p]].DEADLEFT.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("DEAD",p);
    if (!aS[cS[p]].DEADLEFT.interrupt(p)){
      player[p].phys.outOfCameraTimer = 0;
      player[p].phys.intangibleTimer = 2;
      if (player[p].timer == 4){
        if (isFinalDeath()){
          finishGame();
        }
        else {
          screenShake(500);
          percentShake(500,p);
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      if (player[p].stocks > 0){
        aS[cS[p]].REBIRTH.init(p);
      }
      else {
        aS[cS[p]].SLEEP.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

