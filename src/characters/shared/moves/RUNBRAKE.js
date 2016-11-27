export default {
  name : "RUNBRAKE",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "RUNBRAKE";
    player[p].timer = 0;
    sounds.runbrake.play();
    aS[cS[p]].RUNBRAKE.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].RUNBRAKE.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    var j = checkForJump(p);
    if (j[0]){
      aS[cS[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].timer > 1 && checkForSquat(p)){
      aS[cS[p]].SQUAT.init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x * player[p].phys.face < -0.3){
      aS[cS[p]].RUNTURN.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].RUNBRAKE){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

