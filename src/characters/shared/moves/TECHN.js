export default {
  name : "TECHN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "TECHN";
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[cS[p]].TECHN.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].TECHN.interrupt(p)){
      reduceByTraction(p,true);
      executeIntangibility("TECHN",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].TECHN){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

