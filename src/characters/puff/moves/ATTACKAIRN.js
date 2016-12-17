import {player} from "../../../main/main";
import {turnOffHitboxes, fastfall, airDrift} from "../../../physics/actionStateShortcuts";
import puff from "./index";
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
    puff.ATTACKAIRN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.ATTACKAIRN.interrupt(p, input)) {
      fastfall(p, input);
      airDrift(p, input);
      if (player[p].timer === 5) {
        player[p].phys.autoCancel = false;
      }

      if (player[p].timer === 6) {
        player[p].hitboxes.active = [true, true, false, false];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.normalswing2.play();
        // needs normalswing3
      }
      if (player[p].timer === 7) {
        player[p].hitboxes.frames++;
      }
      if (player[p].timer === 8) {
        player[p].hitboxes.id[0] = player[p].charHitboxes.nair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.nair2.id1;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 8 && player[p].timer < 29) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 29) {
        turnOffHitboxes(p);
      }

      if (player[p].timer === 30) {
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