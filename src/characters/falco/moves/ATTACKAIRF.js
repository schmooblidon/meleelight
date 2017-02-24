
import MOVES from "characters/falco/moves/index";
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
    player[p].IASATimer = 52;
    player[p].hitboxes.id[0] = player[p].charHitboxes.fair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fair1.id1;
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      fastfall(p,input);
      airDrift(p,input);
      if (player[p].timer === 5){
        player[p].phys.autoCancel = false;
      }
      if (player[p].timer === 6){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        //needs normalswing3
      }
      if (player[p].timer === 7 || player[p].timer === 8){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 9){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 16){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fair2.id1;
        player[p].hitboxes.active = [true,true,false,false];
        sounds.normalswing2.play();
      }
      if (player[p].timer > 16 && player[p].timer < 19){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 19){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 24){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fair3.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fair3.id1;
        player[p].hitboxes.active = [true,true,false,false];
        sounds.normalswing2.play();
      }
      if (player[p].timer > 24 && player[p].timer < 27){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 27){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 33){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fair4.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fair4.id1;
        player[p].hitboxes.active = [true,true,false,false];
        sounds.normalswing2.play();
      }
      if (player[p].timer > 33 && player[p].timer < 36){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 36){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 43){
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fair5.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fair5.id1;
        player[p].hitboxes.active = [true,true,false,false];
        sounds.normalswing2.play();
      }
      if (player[p].timer > 43 && player[p].timer < 46){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 46){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 50){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 59){
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
