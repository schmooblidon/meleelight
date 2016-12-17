import marth from "./index";
import {player} from "../../../main/main";
import {
  turnOffHitboxes, reduceByTraction, checkForSpecials, checkForTilts, checkForSmashes, checkForJump, checkForDash,
  checkForSmashTurn
  , checkForTiltTurn
  , tiltTurnDashBuffer
} from "../../../physics/actionStateShortcuts";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
import KNEEBEND from "../../shared/moves/KNEEBEND";
import DASH from "../../shared/moves/DASH";
import SMASHTURN from "../../shared/moves/SMASHTURN";
import TILTTURN from "../../shared/moves/TILTTURN";
import WALK from "../../shared/moves/WALK";
export default {
  name: "UPTILT",
  canEdgeCancel: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "UPTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.uptilt1.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.uptilt1.id3;
    marth.UPTILT.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.UPTILT.interrupt(p, input)) {
      reduceByTraction(p, true);
      if (player[p].timer > 4 && player[p].timer < 15) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "UPTILT",
          frame: player[p].timer - 5
        });
      }
      if (player[p].timer === 6) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 6 && player[p].timer < 13) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 9) {
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.uptilt2.id2;
        player[p].hitboxes.id[3] = player[p].charHitboxes.uptilt2.id3;
      }
      if (player[p].timer === 13) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 39) {
      WAIT.init(p, input);
      return true;
    }
    else if (player[p].timer > 31) {
      const b = checkForSpecials(p, input);
      const t = checkForTilts(p, input);
      const s = checkForSmashes(p, input);
      const j = checkForJump(p, input);
      if (j[0]) {
        KNEEBEND.init(p, j[1], input);
        return true;
      }
      else if (b[0]) {
        marth[b[1]].init(p, input);
        return true;
      }
      else if (s[0]) {
        marth[s[1]].init(p, input);
        return true;
      }
      else if (t[0]) {
        marth[t[1]].init(p, input);
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