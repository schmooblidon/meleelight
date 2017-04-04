import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {drawVfx} from "../../../main/vfx/drawVfx";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALGROUND4DOWN",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  setVelocities: [0, 1.37, 1.61, 1.56, 1.20, 0.94, 0.94, 0.91, 0.83, 0.71, 0.56, 0.36, 0.13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.01, -0.02, -0.02, -0.02, -0.02, -0.02, -0.02, -0.01, 0, 0, 0, 0, -0.02, -0.05, -0.08, -0.09, -0.10, -0.11, -0.10, -0.09, -0.07, -0.04],
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND4DOWN";
    player[p].timer = 0;
    turnOffHitboxes(p);
    marth.SIDESPECIALGROUND4DOWN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.SIDESPECIALGROUND4DOWN.interrupt(p, input)) {
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND4DOWN.setVelocities[player[p].timer - 1] * player[p].phys.face;
      /*13-15
       19-21
       25-27
       31-33
       37-38*/
      if (player[p].timer > 9 && player[p].timer < 40) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "SIDESPECIALGROUND4DOWN",
            frame: player[p].timer - 10
          }
        });
      }
      if (player[p].timer > 12 && player[p].timer < 39) {
        switch (player[p].timer % 6) {
          case 1:
            const hbName = "dbground4down" + Math.floor((player[p].timer - 7) / 6);
            player[p].hitboxes.id[0] = player[p].charHitboxes[hbName].id0;
            player[p].hitboxes.id[1] = player[p].charHitboxes[hbName].id1;
            player[p].hitboxes.id[2] = player[p].charHitboxes[hbName].id2;
            player[p].hitboxes.id[3] = player[p].charHitboxes[hbName].id3;
            player[p].hitboxes.active = [true, true, true, true];
            player[p].hitboxes.frame = 0;
            sounds.dancingBlade2.play();
            if (player[p].timer < 37) {
              sounds.shout6.play();
            }
            break;
          case 2:
          case 3:
            player[p].hitboxes.frame++;
            break;
          case 4:
            turnOffHitboxes(p);
            break;
          default:
            break;
        }
      }
      if (player[p].timer === 39) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 60) {
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