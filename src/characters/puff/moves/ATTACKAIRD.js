import {player} from "../../../main/main";
import {turnOffHitboxes, fastfall, airDrift} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {sounds} from "../../../main/sfx";
import FALL from "../../shared/moves/FALL";
import LANDING from "../../shared/moves/LANDING";
import LANDINGATTACKAIRD from "../../shared/moves/LANDINGATTACKAIRD";
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
    puff.ATTACKAIRD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.ATTACKAIRD.interrupt(p, input)) {
      fastfall(p, input);
      airDrift(p, input);
      if (player[p].timer === 4) {
        player[p].phys.autoCancel = false;
      }

      if (player[p].timer > 4 && player[p].timer < 29) {
        switch (player[p].timer % 3) {
          case 2:
            player[p].hitboxes.active = [true, true, true, true];
            player[p].hitboxes.frame = 0;
            sounds.normalswing2.play();
            break;
          case 0:
            player[p].hitboxes.frame++;
            break;
          case 1:
            turnOffHitboxes(p);
            break;

        }
      }

      if (player[p].timer === 40) {
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
      LANDINGATTACKAIRD.init(p, input);
    }
  }
};