import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALGROUND4UP",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  setVelocities: [0, 0.87, 0.91, 0.94, 0.97, 0.98, 0.99, 0.98, 0.97, 0.95, 0.92, 0.88, 0.83, 0.77, 0.70, 0.60, 0.49, 0.39, 0.32, 0.26, 0.23, 0.21, 0.21, 0.23, 0.27, 0.30, 0.25, 0.10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.36, -0.93, -1.28, -1.39, -1.28, -0.93, -0.36, 0, 0, 0, 0],
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND4UP";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground4up.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground4up.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground4up.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground4up.id3;
    sounds.shout4.play();
    marth.SIDESPECIALGROUND4UP.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.SIDESPECIALGROUND4UP.interrupt(p, input)) {
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND4UP.setVelocities[player[p].timer - 1] * player[p].phys.face;
      if (player[p].timer > 18 && player[p].timer < 27) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "SIDESPECIALGROUND4UP",
            frame: player[p].timer - 19
          }
        });
      }
      if (player[p].timer === 20) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 20 && player[p].timer < 26) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 26) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 50) {
      if (player[p].phys.grounded) {
        WAIT.init(p, input);
      }
      else {
        FALL.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  }
};
