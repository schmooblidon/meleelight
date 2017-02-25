import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {sounds} from "../../../main/sfx";
import {dancingBladeAirMobility} from "../dancingBladeAirMobility";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALAIR4DOWN",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALAIR4DOWN";
    player[p].timer = 0;
    turnOffHitboxes(p);
    marth.SIDESPECIALAIR4DOWN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.SIDESPECIALAIR4DOWN.interrupt(p, input)) {
      if (player[p].timer > 9 && player[p].timer < 41) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "SIDESPECIALAIR4DOWN",
            frame: player[p].timer - 10
          }
        });
      }
      dancingBladeAirMobility(p, input);
      if (player[p].timer > 12 && player[p].timer < 39) {
        switch (player[p].timer % 6) {
          case 1:
            const hbName = "dbair4down" + Math.floor((player[p].timer - 7) / 6);
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
  },
  land: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND4DOWN";
  }
};