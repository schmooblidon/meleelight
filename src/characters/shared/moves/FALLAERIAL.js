export default {
  name : "FALLAERIAL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p){
    player[p].actionState = "FALLAERIAL";
    player[p].timer = 0;
    aS[cS[p]].FALLAERIAL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FALLAERIAL.interrupt(p)){
      fastfall(p);
      airDrift(p);
    }
  },
  interrupt : function(p){
    var a = checkForAerials(p);
    var b = checkForSpecials(p);
    if (a[0]){
      aS[cS[p]][a[1]].init(p);
      return true;
    }
    else if ((player[p].inputs.l[0] && !player[p].inputs.l[1]) || (player[p].inputs.r[0] && !player[p].inputs.r[1])){
      aS[cS[p]].ESCAPEAIR.init(p);
      return true;
    }
    else if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && (!player[p].phys.doubleJumped || (player[p].phys.jumpsUsed < 5 && player[p].charAttributes.multiJump))){
      if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
        aS[cS[p]].JUMPAERIALB.init(p);
      }
      else {
        aS[cS[p]].JUMPAERIALF.init(p);
      }
      return true;
    }
    else if (b[0]){
      aS[cS[p]][b[1]].init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].FALLAERIAL){
      aS[cS[p]].FALLAERIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

