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
  name: "SIDESPECIALAIR3DOWN",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALAIR3DOWN";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair3down.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair3down.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair3down.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair3down.id3;
    sounds.shout8.play();
    marth.SIDESPECIALAIR3DOWN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    dancingBladeCombo(p, 19, 35, input);
    if (!marth.SIDESPECIALAIR3DOWN.interrupt(p, input)) {
      if (player[p].timer > 13 && player[p].timer < 18) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "SIDESPECIALAIR3DOWN",
            frame: player[p].timer - 14
          }
        });
      }
      dancingBladeAirMobility(p, input);
      player[p].phys.cVel.x = 0;
      if (player[p].timer === 15) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 15 && player[p].timer < 19) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 19) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 46) {
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
        marth.SIDESPECIALAIR4UP.init(p, input);
      }
      else if (input[p][0].lsY < -0.56) {
        marth.SIDESPECIALAIR4DOWN.init(p, input);
      }
      else {
        marth.SIDESPECIALAIR4FORWARD.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND3DOWN";
  }
};