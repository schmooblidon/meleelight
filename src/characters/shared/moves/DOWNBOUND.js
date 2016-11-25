export default {
  name : "DOWNBOUND",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : false,
  downed : true,
  init : function(p){
    player[p].actionState = "DOWNBOUND";
    player[p].timer = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.jabReset = false;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    aS[cS[p]].DOWNBOUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNBOUND.interrupt(p)){
      if (player[p].timer == 1){
        reduceByTraction(p,true);
      }
      else {
        player[p].phys.cVel.x = 0;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].DOWNBOUND){
      aS[cS[p]].DOWNWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

