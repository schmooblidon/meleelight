import {finishGame, characterSelections, percentShake, screenShake, player} from "main/main";
import {playSounds, actionStates, isFinalDeath} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "DEADLEFT",
  canBeGrabbed : false,
  ignoreCollision : true,
  dead : true,
  init : function(p,input){
    player[p].actionState = "DEADLEFT";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].percent = 0;
    drawVfx("blastzoneExplosion",player[p].phys.pos,90);
    if (!isFinalDeath()){
      screenShake(500);
      percentShake(500,p);
    }
    sounds.kill.play();
    actionStates[characterSelections[p]].DEADLEFT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("DEAD",p);
    if (!actionStates[characterSelections[p]].DEADLEFT.interrupt(p,input)){
      player[p].phys.outOfCameraTimer = 0;
      player[p].phys.intangibleTimer = 2;
      if (player[p].timer == 4){
        if (isFinalDeath()){
          finishGame(input);
        }
        else {
          screenShake(500);
          percentShake(500,p);
        }
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 60){
      if (player[p].stocks > 0){
        actionStates[characterSelections[p]].REBIRTH.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SLEEP.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  }
};

