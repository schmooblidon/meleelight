
import LANDING from "characters/shared/moves/LANDING";
import LANDINGATTACKAIRD from "characters/shared/moves/LANDINGATTACKAIRD";
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {sounds} from "main/sfx";
import {turnOffHitboxes, airDrift, fastfall, checkForAerials, checkForDoubleJump, checkForIASA} from "physics/actionStateShortcuts";
export default {
  name : "ATTACKAIRD",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "ATTACKAIRD";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    player[p].IASATimer = 60;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dair1.id1;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
      if (player[p].timer === 4){
        player[p].phys.autoCancel = false;
      }

      if (player[p].timer === 5){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      } 
      else if ((player[p].timer > 5 && player[p].timer < 15) || (player[p].timer > 15 && player[p].timer < 25)){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 15) {
        player[p].hitboxes.id[0] = player[p].charHitboxes.dair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.dair2.id1;
        player[p].hitboxes.frame = 0;
      }
      else if (player[p].timer === 25) {
        turnOffHitboxes(p);
      }

      if (player[p].timer === 31){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 49){
      FALL.init(p,input);
      return true;
    } else if (checkForIASA(p,input,true)) { //yes I know this is pointless.
      return true;
    } else {
      return false;
    }
  },
  land : function(p,input){
    if (player[p].phys.autoCancel){
      LANDING.init(p,input);
    }
    else {
      LANDINGATTACKAIRD.init(p,input);
    }
  }
};
