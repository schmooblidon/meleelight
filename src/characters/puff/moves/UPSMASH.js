import {player, characterSelections} from "../../../main/main";
import {turnOffHitboxes, randomShout, reduceByTraction, checkForSpecials, checkForTilts, checkForSmashes, checkForJump,
  checkForDash
  , checkForSmashTurn
  , checkForTiltTurn
  , tiltTurnDashBuffer
} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
import KNEEBEND from "../../shared/moves/KNEEBEND";
import DASH from "../../shared/moves/DASH";
import SMASHTURN from "../../shared/moves/SMASHTURN";
import TILTTURN from "../../shared/moves/TILTTURN";
import WALK from "../../shared/moves/WALK";
export default {
  name: "UPSMASH",
  canEdgeCancel: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "UPSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upsmash.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upsmash.id1;
    randomShout(characterSelections[p]);
    puff.UPSMASH.main(p, input);
  },
  main: function (p, input) {
    if (player[p].timer === 5) {
      if (input[p][0].a || input[p][0].z) {
        player[p].phys.charging = true;
        player[p].phys.chargeFrames++;
        if (player[p].phys.chargeFrames === 5) {
          sounds.smashcharge.play();
        }
        if (player[p].phys.chargeFrames === 60) {
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
    if (!puff.UPSMASH.interrupt(p, input)) {
      reduceByTraction(p, true);

      if (player[p].timer === 7) {
        player[p].hitboxes.active = [true, true, false, false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing1.play();

      }
      if (player[p].timer > 7 && player[p].timer < 11) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 11) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 54) {
      WAIT.init(p, input);
      return true;
    }
    else if (player[p].timer > 44 && !player[p].inCSS) {
      const b = checkForSpecials(p, input);
      const t = checkForTilts(p, input);
      const s = checkForSmashes(p, input);
      const j = checkForJump(p, input);
      if (j[0]) {
        KNEEBEND.init(p, j[1], input);
        return true;
      }
      else if (b[0]) {
        puff[b[1]].init(p, input);
        return true;
      }
      else if (s[0]) {
        puff[s[1]].init(p, input);
        return true;
      }
      else if (t[0]) {
        puff[t[1]].init(p, input);
        return true;
      }
      else if (checkForDash(p, input)) {
        DASH.init(p, input);
        return true;
      }
      else if (checkForSmashTurn(p, input)) {
        SMASHTURN.init(p, input);
        return true;
      }
      else if (checkForTiltTurn(p, input)) {
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p, input);
        TILTTURN.init(p, input);
        return true;
      }
      else if (Math.abs(input[p][0].lsX) > 0.3) {
        WALK.init(p, true, input);
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