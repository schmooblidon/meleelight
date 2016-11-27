export default {
  name : "DOWNSTANDF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p){
    player[p].actionState = "DOWNSTANDF";
    player[p].timer = 0;
    aS[cS[p]].DOWNSTANDF.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNSTANDF.interrupt(p)){
      player[p].phys.cVel.x = aS[cS[p]].DOWNSTANDF.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("DOWNSTANDF",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].DOWNSTANDF){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

