import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
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
    actionStates[characterSelections[p]].KNEEBEND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].KNEEBEND.interrupt(p)){
      reduceByTraction(p,true);
      // if jumpsquat initiated by stick
      if (player[p].phys.jumpSquatType){
        if (player[p].inputs.lsY[0] < 0.67){
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
      if (player[p].inputs.lsX[2] * player[p].phys.face >= -0.3){
        actionStates[characterSelections[p]].JUMPF.init(p,player[p].phys.jumpType);
      }
      else {
        actionStates[characterSelections[p]].JUMPB.init(p,player[p].phys.jumpType);
      }
      return true;
    }
    else if (player[p].inputs.a[0] && !player[p].inputs.a[1] && (player[p].inputs.lA[0] > 0 || player[p].inputs.rA[0] > 0)){
      actionStates[characterSelections[p]].GRAB.init(p);
      return true;
    }
    else if ((player[p].inputs.a[0] && !player[p].inputs.a[1] && player[p].inputs.lsY[0] >= 0.8 && player[p].inputs.lsY[3] < 0.3) || (player[p].inputs.csY[0] >= 0.8 && player[p].inputs.csY[3] < 0.3)){
      actionStates[characterSelections[p]].UPSMASH.init(p);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && player[p].inputs.lsY[0] > 0.58){
      actionStates[characterSelections[p]].UPSPECIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
