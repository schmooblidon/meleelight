import {player} from "../../../main/main";
import marth from "./index";
import {
  turnOffHitboxes, checkForSpecials, checkForTilts, checkForSmashes, checkForJump, checkForDash,
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
export default  {
  name: "ATTACKDASH",
  canEdgeCancel: false,
  setVelocities: [0.755, 1.962, 2.714, 3.010, 2.849, 2.232, 1.184, 0.542, 0.704, 1.325, 1.487, 1.079, 0.666, 0.631, 0.597, 0.565, 0.536, 0.508, 0.482, 0.458, 0.436, 0.416, 0.398, 0.370, 0.332, 0.299, 0.270, 0.244, 0.222, 0.205, 0.191, 0.181, 0.176, 0.165, 0.148, 0.130, 0.112, 0.093, 0.073, 0.053, 0.032, 0.011, -0.783, -0.783, 0, 0, 0.001, 0.001, 0],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "ATTACKDASH";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dashattack.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dashattack.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dashattack.id3;
    marth.ATTACKDASH.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.ATTACKDASH.interrupt(p, input)) {
      player[p].phys.cVel.x = marth.ATTACKDASH.setVelocities[player[p].timer - 1] * player[p].phys.face;

      if (player[p].timer > 9 && player[p].timer < 21) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "DASHATTACK",
            frame: player[p].timer - 10
          }
        });
      }
      if (player[p].timer === 12) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.sword1.play();
      }
      if (player[p].timer > 12 && player[p].timer < 16) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 16) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 49) {
      WAIT.init(p, input);
      return true;
    }
    else if (player[p].timer < 5 && (input[p][0].lA > 0 || input[p][0].rA > 0)) {
      if (player[p].phys.cVel.x * player[p].phys.face > player[p].charAttributes.dMaxV) {
        player[p].phys.cVel.x = player[p].charAttributes.dMaxV * player[p].phys.face;
      }
      marth.GRAB.init(p, input);
      return true;
    }
    else if (player[p].timer > 39) {
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