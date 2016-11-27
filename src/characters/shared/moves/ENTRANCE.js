export default {
  name : "ENTRANCE",
  canBeGrabbed : false,
  init : function(p){
    player[p].actionState = "ENTRANCE";
    player[p].timer = 0;
    player[p].phys.grounded = false;
    aS[cS[p]].ENTRANCE.main(p);
  },
  main : function(p){
    player[p].timer++;
    aS[cS[p]].ENTRANCE.interrupt(p);
  },
  interrupt : function(p){
    if (player[p].timer > 60){
      aS[cS[p]].FALL.init(p);
    }
  }
};

