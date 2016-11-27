/* globals player, aS, cS, frames, sounds, reduceByTraction, drawVfx */

export default {
  name : "LANDINGATTACKAIRD",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDINGATTACKAIRD";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[cS[p]].LANDINGATTACKAIRD.main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[cS[p]].LANDINGATTACKAIRD.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].LANDINGATTACKAIRD){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
