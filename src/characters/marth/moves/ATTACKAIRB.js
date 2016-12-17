import {player} from "../../../main/main";
import marth from "./index";
import {turnOffHitboxes, fastfall, airDrift, checkForAerials} from "../../../physics/actionStateShortcuts";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {sounds} from "../../../main/sfx";
import FALL from "../../shared/moves/FALL";
import JUMPAERIALB from "../../shared/moves/JUMPAERIALB";
import JUMPAERIALF from "../../shared/moves/JUMPAERIALF";
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
    player[p].phys.autoCancel = false;
    player[p].inAerial = true;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.bair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.bair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.bair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.bair.id3;
    marth.ATTACKAIRB.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.ATTACKAIRB.interrupt(p, input)) {
      if (player[p].timer === 30) {
        player[p].phys.face *= -1;
      }
      fastfall(p, input);
      airDrift(p, input);
      if (player[p].timer > 2 && player[p].timer < 12) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "BAIR",
          frame: player[p].timer - 3
        });
      }
      if (player[p].timer === 7) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.sword3.play();
      }
      if (player[p].timer > 7 && player[p].timer < 12) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 12) {
        turnOffHitboxes(p);
      }
      if (player[p].timer === 32) {
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
      if (((input[p][0].x && !input[p][1].x) || (input[p][0].y && !input[p][1].y) || (input[p][0].lsY > 0.7 && input[p][1].lsY <= 0.7)) && !player[p].phys.doubleJumped) {
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
      LANDINGATTACKAIRB.init(p, input);
    }
  }
};