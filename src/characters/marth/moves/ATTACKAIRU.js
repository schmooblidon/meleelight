import {player} from "../../../main/main";
import marth from "./index";
import {turnOffHitboxes, fastfall, airDrift} from "../../../physics/actionStateShortcuts";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {sounds} from "../../../main/sfx";
import FALL from "../../shared/moves/FALL";
import LANDING from "../../shared/moves/LANDING";
import LANDINGATTACKAIRU from "../../shared/moves/LANDINGATTACKAIRU";
export default  {
  name: "ATTACKAIRU",
  canPassThrough: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "ATTACKAIRU";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.upair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.upair.id3;
    marth.ATTACKAIRU.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.ATTACKAIRU.interrupt(p, input)) {
      fastfall(p, input);
      airDrift(p, input);
      if (player[p].timer > 4 && player[p].timer < 18) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "UPAIR",
          frame: player[p].timer - 5
        });
      }
      if (player[p].timer === 5) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.sword3.play();
      }
      if (player[p].timer > 5 && player[p].timer < 9) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 9) {
        turnOffHitboxes(p);
      }
      if (player[p].timer === 27) {
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 45) {
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
      LANDINGATTACKAIRU.init(p, input);
    }
  }
};