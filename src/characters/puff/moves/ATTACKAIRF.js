import {player} from "../../../main/main";
import {turnOffHitboxes, fastfall, airDrift, checkForAerials, checkForMultiJump} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {sounds} from "../../../main/sfx";
import FALL from "../../shared/moves/FALL";
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
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    player[p].hitboxes.id[0] = player[p].charHitboxes.fair1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fair1.id1;
    turnOffHitboxes(p);
    puff.ATTACKAIRF.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.ATTACKAIRF.interrupt(p, input)) {
      fastfall(p, input);
      airDrift(p, input);

      if (player[p].timer === 7) {
        player[p].hitboxes.active = [true, true, false, false];
        player[p].hitboxes.frame = 0;
        player[p].phys.autoCancel = false;
        sounds.normalswing2.play();
        //needs normalswing3
      }
      if (player[p].timer === 8) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 9) {
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.fair2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fair2.id1;
      }
      if (player[p].timer > 9 && player[p].timer < 23) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 23) {
        turnOffHitboxes(p);
      }
      if (player[p].timer === 35) {
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 39) {
      FALL.init(p, input);
      return true;
    }
    else if (player[p].timer > 34) {
      const a = checkForAerials(p, input);
      if (checkForMultiJump(p, input) && player[p].phys.jumpsUsed < 5) {
        puff.JUMPAERIALF.init(p, input);
        return true;
      }
      else if (a[0]) {
        puff[a[1]].init(p, input);
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
