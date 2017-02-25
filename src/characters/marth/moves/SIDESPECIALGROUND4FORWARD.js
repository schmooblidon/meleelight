import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default  {
  name: "SIDESPECIALGROUND4FORWARD",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  setVelocities: [0, 0.38, 1.33, 1.49, 1.56, 1.53, 1.41, 1.19, 0.88, 0.62, 0.50, 0.40, 0.31, 0.25, 0.21, 0.19, 0.19, 0.21, 0.22, 0.21, 0.19, 0.18, 0.16, 0.14, 0.11, 0.08, 0.05, 0.02, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.04, -0.11, -0.18, -0.22, -0.25, -0.27, -0.28, -0.27, -0.25, -0.22, -0.17, -0.11, -0.05],
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND4FORWARD";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground4forward.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground4forward.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground4forward.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground4forward.id3;
    sounds.shout2.play();
    marth.SIDESPECIALGROUND4FORWARD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.SIDESPECIALGROUND4FORWARD.interrupt(p, input)) {
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND4FORWARD.setVelocities[player[p].timer - 1] * player[p].phys.face;
      if (player[p].timer > 21 && player[p].timer < 30) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "SIDESPECIALGROUND4FORWARD",
            frame: player[p].timer - 22
          }
        });
      }
      if (player[p].timer === 23) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 23 && player[p].timer < 27) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 27) {
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