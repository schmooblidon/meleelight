export default {
  name : "SHIELDBREAKFALL",
  canPassThrough : false,
  canBeGrabbed : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  landType : 1,
  init : function(p){
    player[p].actionState = "SHIELDBREAKFALL";
    player[p].timer = 0;
    aS[cS[p]].SHIELDBREAKFALL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].SHIELDBREAKFALL.interrupt(p)){
      player[p].phys.intangibleTimer = 1;
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
    }
  },
  interrupt : function(p){
    if (player[p].timer > frames[cS[p]].SHIELDBREAKFALL){
      aS[cS[p]].SHIELDBREAKFALL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    aS[cS[p]].SHIELDBREAKDOWNBOUND.init(p);
  }
};

