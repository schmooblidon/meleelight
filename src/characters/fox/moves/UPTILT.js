/* globals player, turnOffHitboxes, reduceByTraction, sounds, checkForJump,
checkForTilts, checkForDash, checkForSmashes, checkForSpecials,
checkForSmashTurn, tiltTurnDashBuffer */

import MOVES from "./index";
import WAIT from "characters/shared/moves/WAIT";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import DASH from "characters/shared/moves/DASH";
import SMASHTURN from "characters/shared/moves/SMASHTURN";
import TILTTURN from "characters/shared/moves/TILTTURN";
import WALK from "characters/shared/moves/WALK";

export default {
  name : "UPTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "UPTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.uptilt.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.uptilt.id3;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer === 5){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
      }
      if (player[p].timer > 5 && player[p].timer < 12){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 12){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 23){
      WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 22){
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
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face < -0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        TILTTURN.init(p);
        return true;
      }
      else if (player[p].inputs.lStickAxis[0].x*player[p].phys.face > 0.3 && Math.abs(player[p].inputs.lStickAxis[0].x) > player[p].inputs.lStickAxis[0].y*-1){
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
