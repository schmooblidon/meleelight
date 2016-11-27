/* globals player, turnOffHitboxes, reduceByTraction, sounds, checkForJump,
checkForTilts, checkForDash, checkForSmashes, checkForSmashes, checkForSpecials,
checkForTiltTurn, checkForSmashTurn, tiltTurnDashBuffer */

import MOVES from "./index";
import JAB2 from "./JAB2";
import WAIT from "characters/shared/moves/WAIT";
import WALK from "characters/shared/moves/WALK";
import DASH from "characters/shared/moves/DASH";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import SMASHTURN from "characters/shared/moves/SMASHTURN";
import TILTTURN from "characters/shared/moves/TILTTURN";

export default {
  name : "JAB1",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "JAB1";
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.jab1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.jab1.id1;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer > 2 && player[p].timer < 32 && player[p].inputs.a[0] && !player[p].inputs.a[1]){
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
  interrupt : function(p){
    if (player[p].timer > 5 && player[p].phys.jabCombo){
      JAB2.init(p);
      return true;
    }
    else if (player[p].timer > 17){
      WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 15){
      const b = checkForSpecials(p);
      const t = checkForTilts(p);
      const s = checkForSmashes(p);
      const j = checkForJump(p);
      if (j[0]){
        KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        MOVES[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        MOVES[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        MOVES[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        WALK.init(p,true);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
};
