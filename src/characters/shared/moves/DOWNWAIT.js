export default {
  name : "DOWNWAIT",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : false,
  downed : true,
  init : function(p){
    player[p].actionState = "DOWNWAIT";
    player[p].timer = 0;
    aS[cS[p]].DOWNWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].DOWNWAIT.interrupt(p)){
      reduceByTraction(p,true);
      if (player[p].timer > 1){
        player[p].hit.hitstun--;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].DOWNWAIT){
      aS[cS[p]].DOWNWAIT.init(p);
      return true;
    }
    else if (player[p].phys.jabReset){
      if (player[p].hit.hitstun <= 0){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7){
          aS[cS[p]].DOWNSTANDB.init(p);
          return true;
        }
        else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7){
          aS[cS[p]].DOWNSTANDF.init(p);
          return true;
        }
        else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1])){
          aS[cS[p]].DOWNATTACK.init(p);
          return true;
        }
        else {
          aS[cS[p]].DOWNSTANDN.init(p);
          return true;
        }
      }
      else {
        return false;
      }
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7){
      aS[cS[p]].DOWNSTANDB.init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7){
      aS[cS[p]].DOWNSTANDF.init(p);
      return true;
    }
    else if (player[p].inputs.lStickAxis[0].y > 0.7){
      aS[cS[p]].DOWNSTANDN.init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1]) || (player[p].inputs.b[0] && !player[p].inputs.b[1])){
      aS[cS[p]].DOWNATTACK.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

