
import MOVES from "characters/falcon/moves/index";
import LANDING from "characters/shared/moves/LANDING";
import LANDINGATTACKAIRF from "characters/shared/moves/LANDINGATTACKAIRF";
import JUMPAERIALB from "characters/shared/moves/JUMPAERIALB";
import JUMPAERIALF from "characters/shared/moves/JUMPAERIALF";
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {turnOffHitboxes, airDrift, fastfall, checkForAerials, checkForDoubleJump, checkForIASA} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";

export default {
  name : "ATTACKAIRF",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "ATTACKAIRF";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    player[p].IASATimer = 36;
    player[p].hitboxes.id[0] = player[p].charHitboxes.fairClean.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fairClean.id1;
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
      if (player[p].timer === 6){
        player[p].phys.autoCancel = false;
      }
      if (player[p].timer === 14){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 14 && player[p].timer < 31){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 17){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fairLate.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fairLate.id1;
        player[p].hitboxes.active = [true,true,false,false];
      }
      if (player[p].timer === 31){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 35){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 39){
      FALL.init(p,input);
      return true;
    } else if (checkForIASA(p,input,true)) {
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
      LANDINGATTACKAIRF.init(p,input);
    }
  }
};
