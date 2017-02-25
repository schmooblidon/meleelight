import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes, fastfall, airDrift, checkForAerials, checkForDoubleJump} from "../../../physics/actionStateShortcuts";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {sounds} from "../../../main/sfx";
import FALL from "../../shared/moves/FALL";
import JUMPAERIALB from "../../shared/moves/JUMPAERIALB";
import JUMPAERIALF from "../../shared/moves/JUMPAERIALF";
import LANDING from "../../shared/moves/LANDING";
import LANDINGATTACKAIRF from "../../shared/moves/LANDINGATTACKAIRF";
export default {
  name: "ATTACKAIRF",
  canPassThrough: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "ATTACKAIRF";
    player[p].timer = 0;
    player[p].phys.autoCancel = false;
    player[p].inAerial = true;
    player[p].hitboxes.id[0] = player[p].charHitboxes.fair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.fair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.fair.id3;
    turnOffHitboxes(p);
    marth.ATTACKAIRF.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.ATTACKAIRF.interrupt(p, input)) {
      fastfall(p, input);
      airDrift(p, input);
      if (player[p].timer > 2 && player[p].timer < 11) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "FAIR",
            frame: player[p].timer - 3
          }
        });
      }
      if (player[p].timer === 4) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.sword3.play();
      }
      if (player[p].timer > 4 && player[p].timer < 8) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 8) {
        turnOffHitboxes(p);
      }
      if (player[p].timer === 27) {
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 33) {
      FALL.init(p, input);
      return true;
    }
    else if (player[p].timer > 29) {
      const a = checkForAerials(p, input);
      if (checkForDoubleJump(p,input) && !player[p].phys.doubleJumped) {
        if (input[p][0].lsX * player[p].phys.face < -0.3) {
          JUMPAERIALB.init(p, input);
        }
        else {
          JUMPAERIALF.init(p, input);
        }
        return true;
      }
      else if (a[0]) {
        marth[a[1]].init(p, input);
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
  land: function (p, input) {
    if (player[p].phys.autoCancel) {
      LANDING.init(p, input);
    }
    else {
      LANDINGATTACKAIRF.init(p, input);
    }
  }
};