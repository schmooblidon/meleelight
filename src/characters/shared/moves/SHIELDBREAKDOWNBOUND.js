export default {
  name : "SHIELDBREAKDOWNBOUND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "SHIELDBREAKDOWNBOUND";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.y = 0;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    aS[cS[p]].SHIELDBREAKDOWNBOUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SHIELDBREAKDOWNBOUND.interrupt(p)){
      player[p].phys.intangibleTimer = 1;
      if (player[p].timer == 1){
        reduceByTraction(p,true);
      }
      else {
        player[p].phys.cVel.x = 0;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].SHIELDBREAKDOWNBOUND){
      aS[cS[p]].SHIELDBREAKSTAND.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

