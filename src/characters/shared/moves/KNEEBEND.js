import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
export default {
  name : "KNEEBEND",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : true,
  init : function(p,type,input){
    player[p].actionState = "KNEEBEND";
    player[p].timer = 0;
    player[p].phys.jumpType = 1;
    player[p].phys.jumpSquatType = type;
    actionStates[characterSelections[p]].KNEEBEND.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].KNEEBEND.interrupt(p,input)){
      reduceByTraction(p,true);
      // if jumpsquat initiated by stick
      if (player[p].phys.jumpSquatType){
        if (input[p].lsY[0] < 0.67){
          player[p].phys.jumpType = 0;
        }
      }
      // else if jumpsquat initiated by button
      else {
        if (!input[p].x[0] && !input[p].y[0]){
          player[p].phys.jumpType = 0;
        }
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer === player[p].charAttributes.jumpSquat){
      // so they can be detected as above current surface instantly
      player[p].phys.pos.y += 0.001;
    }
    if (player[p].timer > player[p].charAttributes.jumpSquat){
      if (input[p].lsX[2] * player[p].phys.face >= -0.3){
        actionStates[characterSelections[p]].JUMPF.init(p,player[p].phys.jumpType);
      }
      else {
        actionStates[characterSelections[p]].JUMPB.init(p,player[p].phys.jumpType);
      }
      return true;
    }
    else if (input[p].a[0] && !input[p].a[1] && (input[p].lA[0] > 0 || input[p].rA[0] > 0)){
      actionStates[characterSelections[p]].GRAB.init(p,input);
      return true;
    }
    else if ((input[p].a[0] && !input[p].a[1] && input[p].lsY[0] >= 0.8 && input[p].lsY[3] < 0.3) || (input[p].csY[0] >= 0.8 && input[p].csY[3] < 0.3)){
      actionStates[characterSelections[p]].UPSMASH.init(p,input);
      return true;
    }
    else if (input[p].b[0] && !input[p].b[1] && input[p].lsY[0] > 0.58){
      actionStates[characterSelections[p]].UPSPECIAL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
