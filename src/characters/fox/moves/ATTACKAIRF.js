/* globals player, turnOffHitboxes, fastfall, airDrift, sounds, checkForAerials */

import MOVES from "./index";
import LANDING from "characters/shared/moves/LANDING";
import LANDINGATTACKAIRF from "characters/shared/moves/LANDINGATTACKAIRF";
import JUMPAERIALB from "characters/shared/moves/JUMPAERIALB";
import JUMPAERIALF from "characters/shared/moves/JUMPAERIALF";
import FALL from "characters/shared/moves/FALL";

export default {
  name : "ATTACKAIRF",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "ATTACKAIRF";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    player[p].hitboxes.id[0] = player[p].charHitboxes.fair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fair1.id1;
    turnOffHitboxes(p);
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      fastfall(p);
      airDrift(p);
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
  interrupt : function(p){
    if (player[p].timer > 59){
      FALL.init(p);
      return true;
    }
    else if (player[p].timer > 52){
      const a = checkForAerials(p);
      if (((player[p].inputs.x[0] && !player[p].inputs.x[1]) || (player[p].inputs.y[0] && !player[p].inputs.y[1]) || (player[p].inputs.lStickAxis[0].y > 0.7 && player[p].inputs.lStickAxis[1].y <= 0.7)) && !player[p].phys.doubleJumped){
        if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3){
          JUMPAERIALB.init(p);
        }
        else {
          JUMPAERIALF.init(p);
        }
        return true;
      }
      else if (a[0]){
        MOVES[a[1]].init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  land : function(p){
    if (player[p].phys.autoCancel){
      LANDING.init(p);
    }
    else {
      LANDINGATTACKAIRF.init(p);
    }
  }
};
