export default {
  name : "TECHF",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p){
    player[p].actionState = "TECHF";
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[cS[p]].TECHF.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].TECHF.interrupt(p)){
      executeIntangibility("TECHF",p);
      player[p].phys.cVel.x = aS[cS[p]].TECHF.setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].TECHF){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

