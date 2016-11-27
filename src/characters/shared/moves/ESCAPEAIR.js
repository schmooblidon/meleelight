export default {
  name : "ESCAPEAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  vCancel : true,
  init : function(p){
    player[p].actionState = "ESCAPEAIR";
    player[p].timer = 0;
    if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0 || Math.abs(player[p].inputs.lStickAxis[0].y) > 0){
      var ang = getAngle(player[p].inputs.lStickAxis[0].x,player[p].inputs.lStickAxis[0].y);
      player[p].phys.cVel.x = 3.1 * Math.cos(ang);
      player[p].phys.cVel.y = 3.1 * Math.sin(ang);
    }
    else {
      player[p].phys.cVel.x = 0;
      player[p].phys.cVel.y = 0;
    }
    player[p].phys.fastfalled = false;
    player[p].phys.landingMultiplier = 3;
    aS[cS[p]].ESCAPEAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].ESCAPEAIR.interrupt(p)){
      if (player[p].timer < 30){
        player[p].phys.cVel.x *= 0.9;
        player[p].phys.cVel.y *= 0.9;
      }
      else {
        airDrift(p);
        fastfall(p);
      }
      executeIntangibility("ESCAPEAIR",p);
      playSounds("ESCAPEAIR",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      aS[cS[p]].FALLSPECIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].phys.intangibleTimer = 0;
    player[p].phys.hurtBoxState = 0;
    aS[cS[p]].LANDINGFALLSPECIAL.init(p);
  }
};

