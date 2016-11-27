/* globals player, aS, cS, turnOffHitboxes, frames */

export default {
  name : "CATCHWAIT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CATCHWAIT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[cS[p]].CATCHWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].CATCHWAIT.interrupt(p)){

    }
  },
  interrupt : function(p){
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      aS[cS[p]].CATCHATTACK.init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7) || (player[p].inputs.cStickAxis[0].y > 0.7 && player[p].inputs.cStickAxis[1].y <= 0.7)){
      aS[cS[p]].THROWUP.init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].y < -0.7 && player[p].inputs.lStickAxis[1].y >= -0.7) || player[p].inputs.cStickAxis[0].y < -0.7){
      aS[cS[p]].THROWDOWN.init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.lStickAxis[1].x*player[p].phys.face >= -0.7) || (player[p].inputs.cStickAxis[0].x*player[p].phys.face < -0.7 && player[p].inputs.cStickAxis[1].x*player[p].phys.face >= -0.7)){
      aS[cS[p]].THROWBACK.init(p);
      return true;
    }
    else if ((player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.lStickAxis[1].x*player[p].phys.face <= 0.7) || (player[p].inputs.cStickAxis[0].x*player[p].phys.face > 0.7 && player[p].inputs.cStickAxis[1].x*player[p].phys.face <= 0.7)){
      aS[cS[p]].THROWFORWARD.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].CATCHWAIT){
      aS[cS[p]].CATCHWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
