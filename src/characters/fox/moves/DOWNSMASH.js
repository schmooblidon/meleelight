/* globals player, turnOffHitboxes, sounds, cS, checkForJump, checkForTilts,
checkForSmashes, checkForDash, checkForSmashTurn, checkForTiltTurn, randomShout,
tiltTurnDashBuffer, reduceByTraction, checkForSpecials, fox */

import MOVES from "./index";
import DASH from "characters/shared/moves/DASH";
import SMASHTURN from "characters/shared/moves/SMASHTURN";
import TILTTURN from "characters/shared/moves/TILTTURN";
import WALK from "characters/shared/moves/WALK";
import WAIT from "characters/shared/moves/WAIT";
import KNEEBEND from "characters/shared/moves/KNEEBEND";

export default {
  name : "DOWNSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "DOWNSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dsmash.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dsmash.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dsmash.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dsmash.id3;
    this.main(p);
  },
  main : function(p){
    if (player[p].timer === 2){
      if (player[p].inputs.a[0] || player[p].inputs.z[0]){
        player[p].phys.charging = true;
        player[p].phys.chargeFrames++;
        if (player[p].phys.chargeFrames === 5){
          sounds.smashcharge.play();
        }
        if (player[p].phys.chargeFrames === 60){
          player[p].timer++;
          player[p].phys.charging = false;
        }
      }
      else {
        player[p].timer++;
        player[p].phys.charging = false;
      }
    }
    else {
      player[p].timer++;
      player[p].phys.charging = false;
    }
    if (!this.interrupt(p)){
      reduceByTraction(p,true);

      if (player[p].timer === 6){
        player[p].hitboxes.active = [true,true,true,true];
        player[p].hitboxes.frame = 0;
        randomShout(cS[p]);
        sounds.normalswing1.play();
      }
      if (player[p].timer > 6 && player[p].timer < 11){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 11){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 49){
      WAIT.init(p);
      return true;
    }
    else if (player[p].timer > 45 && !player[p].inCSS){
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
