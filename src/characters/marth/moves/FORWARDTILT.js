import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes, reduceByTraction} from "../../../physics/actionStateShortcuts";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "FORWARDTILT",
  canEdgeCancel: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "FORWARDTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ftilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ftilt.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ftilt.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.ftilt.id3;
    marth.FORWARDTILT.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.FORWARDTILT.interrupt(p, input)) {
      reduceByTraction(p, true);
      if (player[p].timer > 5 && player[p].timer < 14) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "FORWARDTILT",
            frame: player[p].timer - 6
          }
        });
      }
      if (player[p].timer === 7) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.sword2.play();
      }
      if (player[p].timer > 7 && player[p].timer < 11) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 11) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 35) {
      WAIT.init(p, input);
      return true;
    }
    else {
      return false;
    }
  }
};