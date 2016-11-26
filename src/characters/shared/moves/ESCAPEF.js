export default {
  name : "ESCAPEF",
  setVelocities : [],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "ESCAPEF";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    aS[cS[p]].ESCAPEF.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("ESCAPEF",p);
    if (!aS[cS[p]].ESCAPEF.interrupt(p)){
      player[p].phys.cVel.x = aS[cS[p]].ESCAPEF.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("ESCAPEF",p);
      if (player[p].timer == 4){
        sounds.roll.play();
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].ESCAPEF){
      player[p].phys.cVel.x = 0;
      player[p].phys.face *= -1;
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

