export default {
  name : "ESCAPEB",
  setVelocities : [],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "ESCAPEB";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    aS[cS[p]].ESCAPEB.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("ESCAPEB",p);
    if (!aS[cS[p]].ESCAPEB.interrupt(p)){
      player[p].phys.cVel.x = aS[cS[p]].ESCAPEB.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("ESCAPEB",p);
      if (player[p].timer == 4){
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].ESCAPEB){
      player[p].phys.cVel.x = 0;
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

