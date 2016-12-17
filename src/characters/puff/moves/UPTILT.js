import {player} from "../../../main/main";
import {turnOffHitboxes, reduceByTraction} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "UPTILT",
  canEdgeCancel: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "UPTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt1.id1;
    puff.UPTILT.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.UPTILT.interrupt(p, input)) {
      reduceByTraction(p, true);

      if (player[p].timer === 8) {
        player[p].hitboxes.active = [true, true, false, false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer === 9) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 10) {
        player[p].hitboxes.id[0] = player[p].charHitboxes.uptilt2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.uptilt2.id1;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 10 && player[p].timer < 15) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 15) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 23) {
      WAIT.init(p, input);
      return true;
    }
    else {
      return false;
    }
  }
};