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
  init : function(p){
    player[p].actionState = "ESCAPEAIR";
    player[p].timer = 0;
    if (Math.abs(player[p].inputs.lsX[0]) > 0 || Math.abs(player[p].inputs.lsY[0]) > 0){
      var ang = getAngle(player[p].inputs.lsX[0],player[p].inputs.lsY[0]);
      player[p].phys.cVel.x = 3.1 * Math.cos(ang);
      player[p].phys.cVel.y = 3.1 * Math.sin(ang);
    }
    else {
      player[p].phys.cVel.x = 0;
      player[p].phys.cVel.y = 0;
    }
    player[p].phys.fastfalled = false;
    player[p].phys.landingMultiplier = 3;
    actionStates[characterSelections[p]].ESCAPEAIR.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].ESCAPEAIR.interrupt(p)){
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
      actionStates[characterSelections[p]].FALLSPECIAL.init(p);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p){
    player[p].phys.intangibleTimer = 0;
    player[p].phys.hurtBoxState = 0;
    actionStates[characterSelections[p]].LANDINGFALLSPECIAL.init(p);
  }
};

