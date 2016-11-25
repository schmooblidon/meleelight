export default {
  name : "DOWNSTANDB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p){
    player[p].actionState = "DOWNSTANDB";
    player[p].timer = 0;
    aS[cS[p]].DOWNSTANDB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNSTANDB.interrupt(p)){
      player[p].phys.cVel.x = aS[cS[p]].DOWNSTANDB.setVelocities[player[p].timer-1]*player[p].phys.face;
      executeIntangibility("DOWNSTANDB",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].DOWNSTANDB){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

