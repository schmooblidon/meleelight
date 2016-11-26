export default {
  name : "MISSFOOT",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  init : function(p){
    player[p].actionState = "MISSFOOT";
    player[p].timer = 0;
    player[p].hit.hitstun = 0;
    turnOffHitboxes(p);
    aS[cS[p]].MISSFOOT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].MISSFOOT.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 26){
      aS[cS[p]].DAMAGEFALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

