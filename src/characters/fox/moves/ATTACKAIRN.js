
import MOVES from "characters/fox/moves/index";
import LANDING from "characters/shared/moves/LANDING";
import LANDINGATTACKAIRN from "characters/shared/moves/LANDINGATTACKAIRN";
import JUMPAERIALB from "characters/shared/moves/JUMPAERIALB";
import JUMPAERIALF from "characters/shared/moves/JUMPAERIALF";
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {turnOffHitboxes, fastfall, airDrift, checkForAerials} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";

export default {
  name : "ATTACKAIRN",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "ATTACKAIRN";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.nair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.nair1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.nair1.id2;
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

      if (player[p].timer === 4){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.normalswing2.play();
        // needs normalswing3
      }
      if (player[p].timer > 4 && player[p].timer < 8){
        player[p].hitboxes.frames++;
      }
      if (player[p].timer === 8){
        player[p].hitboxes.id[0] = player[p].charHitboxes.nair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.nair2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.nair2.id2;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 8 && player[p].timer < 32){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 32){
        turnOffHitboxes(p);
      }

      if (player[p].timer === 38){
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 49){
      FALL.init(p,input);
      return true;
    }
    else if (player[p].timer > 41){
      const a = checkForAerials(p,input);
      if (((input[p][0].x && !input[p][1].x) || (input[p][0].y && !input[p][1].y) || (input[p][0].lsY > 0.7 && input[p][1].lsY <= 0.7)) && !player[p].phys.doubleJumped){
        if (input[p][0].lsX*player[p].phys.face < -0.3){
          JUMPAERIALB.init(p,input);
        }
        else {
          JUMPAERIALF.init(p,input);
        }
        return true;
      }
      else if (a[0]){
        MOVES[a[1]].init(p,input);
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
  land : function(p,input){
    if (player[p].phys.autoCancel){
      LANDING.init(p,input);
    }
    else {
      LANDINGATTACKAIRN.init(p,input);
    }
  }
};
