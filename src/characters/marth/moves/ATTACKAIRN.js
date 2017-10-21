import {player} from "../../../main/main";
import marth from "./index";
import {turnOffHitboxes, fastfall, airDrift} from "../../../physics/actionStateShortcuts";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {sounds} from "../../../main/sfx";
import FALL from "../../shared/moves/FALL";
import LANDING from "../../shared/moves/LANDING";
import LANDINGATTACKAIRN from "../../shared/moves/LANDINGATTACKAIRN";
export default {
  name: "ATTACKAIRN",
  canPassThrough: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "ATTACKAIRN";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.nair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.nair1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.nair1.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.nair1.id3;
    marth.ATTACKAIRN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.ATTACKAIRN.interrupt(p, input)) {
      fastfall(p, input);
      airDrift(p, input);
      if (player[p].timer > 4 && player[p].timer < 9) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0), face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "NAIR1",
            frame: player[p].timer - 5
          }
        });
      }
      if (player[p].timer > 13 && player[p].timer < 21) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "NAIR2",
            frame: player[p].timer - 14
          }
        });
      }
      if (player[p].timer === 6) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.sword1.play();
      }
      if (player[p].timer === 7) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 8) {
        turnOffHitboxes(p);
      }

      if (player[p].timer === 15) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.id[0] = player[p].charHitboxes.nair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.nair2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.nair2.id2;
        player[p].hitboxes.id[3] = player[p].charHitboxes.nair2.id3;
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 15 && player[p].timer < 22) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 22) {
        turnOffHitboxes(p);
      }
      if (player[p].timer === 25) {
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 49) {
      FALL.init(p, input);
      return true;
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
      LANDINGATTACKAIRN.init(p, input);
    }
  }
};