
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
    player[p].IASATimer = 38;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dair.id2;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
      if (player[p].timer === 3){
        player[p].phys.autoCancel = false;
      }

      if (player[p].timer === 16){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
      }
      if (player[p].timer > 16 && player[p].timer < 21){
        player[p].hitboxes.frames++;
      }
      if (player[p].timer === 21){
        turnOffHitboxes(p);
      }

      if (player[p].timer === 36){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 44){
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
