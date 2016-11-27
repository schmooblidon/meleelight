export default {
  name : "SLEEP",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = "SLEEP";
    player[p].timer = 0;
    player[p].hit.hitstun = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.pos.x = 300;
    aS[cS[p]].SLEEP.main(p);
  },
  main : function(p){
    player[p].phys.outOfCameraTimer = 0;
  },
  interrupt : function(p){
    return false;
  }
};

