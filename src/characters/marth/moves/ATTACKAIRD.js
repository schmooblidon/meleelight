import marth from "./index";
import {player} from "../../../main/main";
import {sounds} from "../../../main/sfx";
import {fastfall, turnOffHitboxes, airDrift} from "../../../physics/actionStateShortcuts";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import LANDING from "../../shared/moves/LANDING";
import LANDINGATTACKAIRD from "../../shared/moves/LANDINGATTACKAIRD";
import FALL from "../../shared/moves/FALL";
export default {
  name: "ATTACKAIRD",
  canPassThrough: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "ATTACKAIRD";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dair.id3;
    marth.ATTACKAIRD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.ATTACKAIRD.interrupt(p, input)) {
      fastfall(p, input);
      airDrift(p, input);
      if (player[p].timer > 4 && player[p].timer < 12) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "DAIR",
          frame: player[p].timer - 5
        });
      }
      if (player[p].timer === 6) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.sword3.play();
      }
      if (player[p].timer > 6 && player[p].timer < 10) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 10) {
        turnOffHitboxes(p);
      }
      if (player[p].timer === 48) {
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 59) {
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
      LANDINGATTACKAIRD.init(p, input);
    }
  }
};