import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {dancingBladeCombo} from "../dancingBladeCombo";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALGROUND3UP",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  setVelocities: [0, 0.37, 0.91, 1.18, 1.18, 0.9, 0.46, 0.22, 0.25, 0.55, 1.02, 1.32, 1.35, 1.11, 0.88, 0.76, 0.54, 0.20, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.04, -0.12, -0.18, -0.24, -0.28, -0.32, -0.34, -0.35, -0.35, -0.34, -0.32, -0.28, -0.24, -0.18, -0.12, -0.04, 0, 0.01, 0.01],
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND3UP";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground3up.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground3up.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground3up.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground3up.id3;
    sounds.shout3.play();
    marth.SIDESPECIALGROUND3UP.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    dancingBladeCombo(p, 18, 38, input);
    if (!marth.SIDESPECIALGROUND3UP.interrupt(p, input)) {
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND3UP.setVelocities[player[p].timer - 1] * player[p].phys.face;
      if (player[p].timer > 3 && player[p].timer < 21) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "SIDESPECIALGROUND3UP",
            frame: player[p].timer - 4
          }
        });
      }
      if (player[p].timer === 13) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 13 && player[p].timer < 18) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 18) {
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
        marth.SIDESPECIALGROUND4UP.init(p, input);
      }
      else if (input[p][0].lsY < -0.56) {
        marth.SIDESPECIALGROUND4DOWN.init(p, input);
      }
      else {
        marth.SIDESPECIALGROUND4FORWARD.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  }
};