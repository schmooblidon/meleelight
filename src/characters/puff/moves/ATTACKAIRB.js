import {player} from "../../../main/main";
import {turnOffHitboxes, checkForAerials, fastfall, airDrift} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {sounds} from "../../../main/sfx";
import FALL from "../../shared/moves/FALL";
import LANDING from "../../shared/moves/LANDING";
import LANDINGATTACKAIRB from "../../shared/moves/LANDINGATTACKAIRB";
export default {
  name: "ATTACKAIRB",
  canPassThrough: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "ATTACKAIRB";
    player[p].timer = 0;
    player[p].phys.autoCancel = true;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.bair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.bair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.bair.id2;
    puff.ATTACKAIRB.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.ATTACKAIRB.interrupt(p, input)) {
      fastfall(p, input);
      airDrift(p, input);

      if (player[p].timer === 8) {
        player[p].phys.autocancel = false;
      }
      if (player[p].timer === 9) {
        player[p].hitboxes.active = [true, true, true, false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing1.play();
      }
      if (player[p].timer > 9 && player[p].timer < 13) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 13) {
        turnOffHitboxes(p);
      }
      if (player[p].timer === 26) {
        player[p].phys.autoCancel = true;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 39) {
      FALL.init(p, input);
      return true;
    }
    else if (player[p].timer > 30) {
      const a = checkForAerials(p, input);
      if (((input[p][0].x && !input[p][1].x) || (input[p][0].y && !input[p][1].y) || (input[p][0].lsY > 0.7 && input[p][1].lsY <= 0.7)) && player[p].phys.jumpsUsed < 5) {
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
      LANDINGATTACKAIRB.init(p, input);
    }
  }
};