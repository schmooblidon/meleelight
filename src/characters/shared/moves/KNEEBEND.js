/* globals player, aS, cS, frames, reduceByTraction */

export default {
  name : "KNEEBEND",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p,type){
    player[p].actionState = "KNEEBEND";
    player[p].timer = 0;
    player[p].phys.jumpType = 1;
    player[p].phys.jumpSquatType = type;
    aS[cS[p]].KNEEBEND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].KNEEBEND.interrupt(p)){
      reduceByTraction(p,true);
      // if jumpsquat initiated by stick
      if (player[p].phys.jumpSquatType){
        if (player[p].inputs.lStickAxis[0].y < 0.67){
          player[p].phys.jumpType = 0;
        }
      }
      // else if jumpsquat initiated by button
      else {
        if (!player[p].inputs.x[0] && !player[p].inputs.y[0]){
          player[p].phys.jumpType = 0;
        }
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer === player[p].charAttributes.jumpSquat){
      // so they can be detected as above current surface instantly
      player[p].phys.pos.y += 0.001;
    }
    if (player[p].timer > player[p].charAttributes.jumpSquat){
      if (player[p].inputs.lStickAxis[2].x * player[p].phys.face >= -0.3){
        aS[cS[p]].JUMPF.init(p,player[p].phys.jumpType);
      }
      else {
        aS[cS[p]].JUMPB.init(p,player[p].phys.jumpType);
      }
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1] && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      aS[cS[p]].GRAB.init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1] && player[p].inputs.lStickAxis[0].y >= 0.8 && player[p].inputs.lStickAxis[3].y < 0.3) || (player[p].inputs.cStickAxis[0].y >= 0.8 && player[p].inputs.cStickAxis[3].y < 0.3)){
      aS[cS[p]].UPSMASH.init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && player[p].inputs.lStickAxis[0].y > 0.58){
      aS[cS[p]].UPSPECIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
