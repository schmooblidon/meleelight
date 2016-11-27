export default {
  name : "FURASLEEPEND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FURASLEEPEND";
    player[p].timer = 0;
    aS[cS[p]].FURASLEEPEND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FURASLEEPEND.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].FURASLEEPEND){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

