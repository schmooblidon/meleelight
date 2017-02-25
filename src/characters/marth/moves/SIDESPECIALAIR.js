import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {dancingBladeCombo} from "../dancingBladeCombo";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {dancingBladeAirMobility} from "../dancingBladeAirMobility";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALAIR",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALAIR";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    if (!player[p].phys.grounded) {
      if (player[p].phys.sideBJumpFlag) {
        player[p].phys.cVel.y = 1;
        player[p].phys.sideBJumpFlag = false;
      }
      else {
        player[p].phys.cVel.y = 0;
      }
      player[p].phys.fastfalled = false;
      player[p].phys.cVel.x *= 0.8;
    }
    else {
      player[p].phys.cVel.x *= 0.2;
    }
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair.id3;
    sounds.shout6.play();
    marth.SIDESPECIALAIR.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    dancingBladeCombo(p, 8, 26, input);
    if (!marth.SIDESPECIALAIR.interrupt(p, input)) {
      if (player[p].timer === 6) {
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 4 && player[p].timer < 12) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "SIDESPECIALAIR1",
            frame: player[p].timer - 5
          }
        });
      }

      dancingBladeAirMobility(p, input);

      if (player[p].timer > 4 && player[p].timer < 12) {

      }
      if (player[p].timer === 6) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 6 && player[p].timer < 9) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 9) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 29) {
      if (player[p].phys.grounded) {
        WAIT.init(p, input);
      }
      else {
        FALL.init(p, input);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade) {
      if (input[p][0].lsY > 0.56) {
        marth.SIDESPECIALAIR2UP.init(p, input);
      }
      else {
        marth.SIDESPECIALAIR2FORWARD.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND";
  }
};