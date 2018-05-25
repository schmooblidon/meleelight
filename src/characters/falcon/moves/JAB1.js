
import MOVES from "characters/falcon/moves/index";
import JAB2 from "characters/falcon/moves/JAB2";
import WAIT from "characters/shared/moves/WAIT";
import WALK from "characters/shared/moves/WALK";
import DASH from "characters/shared/moves/DASH";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import SMASHTURN from "characters/shared/moves/SMASHTURN";
import TILTTURN from "characters/shared/moves/TILTTURN";
import {player} from "main/main";
import {turnOffHitboxes, reduceByTraction, checkForSpecials, checkForTilts, checkForSmashes, checkForJump, checkForDash,
    tiltTurnDashBuffer
    , checkForTiltTurn
    , checkForSmashTurn
} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";

export default {
  name : "JAB1",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "JAB1";
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.jab1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.jab1.id1;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      reduceByTraction(p,true);

      if (player[p].timer > 2 && player[p].timer < 25 && input[p][0].a && !input[p][1].a){
        player[p].phys.jabCombo = true;
      }
      if (player[p].timer === 2){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer > 2 && player[p].timer < 4){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 4){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 8 && player[p].phys.jabCombo){
      JAB2.init(p,input);
      return true;
    }
    else if (player[p].timer > 21){
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
