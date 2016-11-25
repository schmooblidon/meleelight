/* globals player, turnOffHitboxes, fastfall, airDrift, sounds, checkForAerials */

import MOVES from "./index";
import LANDING from "characters/shared/moves/LANDING";
import LANDINGATTACKAIRB from "characters/shared/moves/LANDINGATTACKAIRB";
import JUMPAERIALB from "characters/shared/moves/JUMPAERIALB";
import JUMPAERIALF from "characters/shared/moves/JUMPAERIALF";
import FALL from "characters/shared/moves/FALL";

export default {
  name : "ATTACKAIRB",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p){
    player[p].actionState = "ATTACKAIRB";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.bair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.bair1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.bair1.id2;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      fastfall(p);
      airDrift(p);

      if (player[p].timer === 3){
        player[p].phys.autoCancel = false;
      }
      if (player[p].timer === 4){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs swing3
      }
      if (player[p].timer > 4 && player[p].timer < 20){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 8){
        player[p].hitboxes.id[0] = player[p].charHitboxes.bair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.bair2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.bair2.id2;
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer === 20){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 25){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      FALL.init(p);
      return true;
    }
    else if (player[p].timer > 37){
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
      LANDINGATTACKAIRB.init(p);
    }
  }
};
