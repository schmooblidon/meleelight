/* globals player, aS, cS, frames, turnOffHitboxes, airDrift, fastfall, checkForAerials, checkForSpecials */

export default {
  name : "FALL",
  canPassThrough : true,
  canGrabLedge : [true, false],
  wallJumpAble : true,
  headBonk : true,
  canBeGrabbed : true,
  landType : 0,
  vCancel : true,
  init : function(p,disableInputs){
    const dInputs = disableInputs || false;
    player[p].actionState = "FALL";
    player[p].timer = 0;
    turnOffHitboxes(p);
    aS[cS[p]].FALL.main(p, dInputs);
  },
  main : function(p,disableInputs){
    player[p].timer++;
    if (disableInputs){
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      airDrift(p);
    }
    else {
      if (!aS[cS[p]].FALL.interrupt(p)){
        fastfall(p);
        airDrift(p);
      }
    }
  },
  interrupt : function(p,disableInputs){
    const a = checkForAerials(p);
    const b = checkForSpecials(p);
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
    else if (player[p].timer > frames[cS[p]].FALL){
      aS[cS[p]].FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
