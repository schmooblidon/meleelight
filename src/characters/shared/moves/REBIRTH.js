import {characterSelections, player} from "main/main";
import {actionStates} from "physics/actionStateShortcuts";
import {activeStage} from "stages/activeStage";
export default {
  name : "REBIRTH",
  canBeGrabbed : false,
  ignoreCollision : true,
  init : function(p,input){
    player[p].actionState = "REBIRTH";
    player[p].timer = 1;
    player[p].phys.pos.x = activeStage.respawnPoints[p].x;
    player[p].phys.pos.y = activeStage.respawnPoints[p].y+135;
    //player[p].phys.grounded = true;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = -1.5;
    player[p].phys.face = activeStage.respawnFace[p];
    player[p].phys.doubleJumped = false;
    player[p].phys.fastfalled = false;
    player[p].phys.jumpsUsed = 0;
    player[p].phys.wallJumpCount = 0;
    player[p].phys.sideBJumpFlag = true;
    player[p].spawnWaitTime = 0;
    player[p].percent = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].hit.hitstun = 0;
    player[p].phys.shieldHP = 60;
    player[p].burning = 0;
    player[p].shocked = 0;
  },
  main : function(p,input){
    player[p].timer+= 1;
    if (!actionStates[characterSelections[p]].REBIRTH.interrupt(p,input)){
      player[p].phys.outOfCameraTimer = 0;
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 90){
      actionStates[characterSelections[p]].REBIRTHWAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

