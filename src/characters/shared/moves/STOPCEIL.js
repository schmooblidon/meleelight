export default {
  name : "STOPCEIL",
  canPassThrough : true,
  canGrabLedge : [true,false],
  wallJumpAble : false,
  headBonk : true,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "STOPCEIL";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    turnOffHitboxes(p);
    aS[cS[p]].STOPCEIL.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].STOPCEIL.interrupt(p)){
      if (player[p].timer == 2){
        player[p].phys.kVel.y *= -0.8;
        player[p].phys.kVel.x *= 0.8;
        player[p].phys.kDec.y *= -1
      }
      if (player[p].hit.hitstun > 0){
        if (player[p].hit.hitstun % 10 == 0){
          drawVfx("flyingDust",player[p].phys.pos);
        }
        player[p].hit.hitstun--;
        player[p].phys.cVel.y -= player[p].charAttributes.gravity;
        if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV){
          player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
        }
      }
      else {
        airDrift(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 5 && player[p].hit.hitstun <= 0){
      aS[cS[p]].FALL.init(p);
    }
    else if (player[p].timer > frames[cS[p]].STOPCEIL){
      if (player[p].hit.hitstun <= 0){
        aS[cS[p]].DAMAGEFALL.init(p);
        return true;
      }
      else {
        player[p].timer = frames[cS[p]].STOPCEIL;
        return false;
      }
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].hit.hitstun > 0){
      if (player[p].phys.techTimer > 0){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.5){
          aS[cS[p]].TECHF.init(p);
        }
        else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.5){
          aS[cS[p]].TECHB.init(p);
        }
        else {
          aS[cS[p]].TECHN.init(p);
        }
      }
      else {
        aS[cS[p]].DOWNBOUND.init(p);
      }
    }
    else {
      aS[cS[p]].LANDING.init(p);
    }
  }
};

