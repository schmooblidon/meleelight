export default {
  name : "DOWNDAMAGE",
  canEdgeCancel : true,
  disableTeeter : true,
  airborneState : "DOWNDAMAGE",
  canBeGrabbed : true,
  downed : true,
  landType : 1,
  canGrabLedge : [false,false],
  init : function(p){
    player[p].actionState = "DOWNDAMAGE";
    player[p].timer = 0;
    player[p].phys.jabReset = true;
    player[p].phys.grounded = false;
    aS[cS[p]].DOWNDAMAGE.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNDAMAGE.interrupt(p)){
      if (!player[p].phys.grounded){
        player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      }
      else {
        reduceByTraction(p,true);
      }
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 13){
      if (player[p].phys.grounded){
        if (player[p].hit.hitstun <= 0){
          aS[cS[p]].DOWNSTANDN.init(p);
        }
        else {
          aS[cS[p]].DOWNWAIT.init(p);
        }
      }
      else {
        aS[cS[p]].FALL.init(p);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){

  }
};

