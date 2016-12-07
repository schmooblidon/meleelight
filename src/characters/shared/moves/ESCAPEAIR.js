import {playSounds, executeIntangibility, fastfall, airDrift, actionStates, getAngle} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
export default {
  name : "ESCAPEAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  vCancel : true,
  init : function(p,input){
    player[p].actionState = "ESCAPEAIR";
    player[p].timer = 0;
    if (Math.abs(input[p].lsX[0]) > 0 || Math.abs(input[p].lsY[0]) > 0){
      var ang = getAngle(input[p].lsX[0],input[p].lsY[0]);
      player[p].phys.cVel.x = 3.1 * Math.cos(ang);
      player[p].phys.cVel.y = 3.1 * Math.sin(ang);
    }
    else {
      player[p].phys.cVel.x = 0;
      player[p].phys.cVel.y = 0;
    }
    player[p].phys.fastfalled = false;
    player[p].phys.landingMultiplier = 3;
    actionStates[characterSelections[p]].ESCAPEAIR.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].ESCAPEAIR.interrupt(p,input)){
      if (player[p].timer < 30){
        player[p].phys.cVel.x *= 0.9;
        player[p].phys.cVel.y *= 0.9;
      }
      else {
        airDrift(p,input);
        fastfall(pminput,input);
      }
      executeIntangibility("ESCAPEAIR",p);
      playSounds("ESCAPEAIR",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 49){
      actionStates[characterSelections[p]].FALLSPECIAL.init(p,input);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    player[p].phys.intangibleTimer = 0;
    player[p].phys.hurtBoxState = 0;
    actionStates[characterSelections[p]].LANDINGFALLSPECIAL.init(p,input);
  }
};

