export default {
  name : "CAPTURECUT",
  canEdgeCancel : false,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  canBeGrabbed : true,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CAPTURECUT";
    player[p].timer = 0;
    player[p].phys.grabbedBy = -1
    player[p].phys.cVel.x = -1*player[p].phys.face;
    aS[cS[p]].CAPTURECUT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CAPTURECUT.interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.grabTech = false;
      }
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].CAPTURECUT){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

