
import MOVES from "characters/falcon/moves/index";
import JAB3 from "characters/falcon/moves/JAB3";
import WAIT from "characters/shared/moves/WAIT";
import WALK from "characters/shared/moves/WALK";
import DASH from "characters/shared/moves/DASH";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import SMASHTURN from "characters/shared/moves/SMASHTURN";
import TILTTURN from "characters/shared/moves/TILTTURN";
import {tiltTurnDashBuffer, checkForTiltTurn, checkForSmashTurn, checkForDash, checkForJump, checkForSmashes,
    checkForTilts
    , checkForSpecials
    , turnOffHitboxes
} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {player} from "main/main";

export default {
  name : "JAB2",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "JAB2";
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.jab2.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.jab2.id1;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer === 1){
        player[p].phys.cVel.x = 0;
      }
      else if (player[p].timer === 2){
        player[p].phys.cVel.x = 3.36*player[p].phys.face;
      }
      else if (player[p].timer === 4){
        player[p].phys.cVel.x = 0;
      }
      if (player[p].timer > 1 && player[p].timer < 26 && input[p][0].a && !input[p][1].a){
        player[p].phys.jabCombo = true;
      }
      if (player[p].timer === 3){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer > 3 && player[p].timer < 5){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 5){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 7 && player[p].phys.jabCombo){
      JAB3.init(p,input);
      return true;
    }
    else if (player[p].timer > 20){
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
