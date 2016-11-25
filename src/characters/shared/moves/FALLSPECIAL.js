/* globals player, aS, cS, frames, fastfall, airDrift */

export default {
  name : "FALLSPECIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  vCancel : true,
  init : function(p){
    player[p].actionState = "FALLSPECIAL";
    player[p].timer = 0;
    aS[cS[p]].FALLSPECIAL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FALLSPECIAL.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].FALLSPECIAL){
      aS[cS[p]].FALLSPECIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    aS[cS[p]].LANDINGFALLSPECIAL.init(p);
  }
};
