import {player} from "../../../main/main";
import puff from "./index";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name: "THROWNFOXFORWARD",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-7.74 - 0.08, 2.53], [-7.17 - 0.22, 3.27], [-7.15 - 0.24, 3.42], [-7.34, 3.43], [-7.44 + 0.68, 3.60], [-7.65 + 1.67, 3.79], [-8.06 + 2.69, 3.95], [-8.77 + 3.47, 4.02], [-10.03 + 4.04, 3.91], [-12.03 + 4.61, 3.68], [-12.03 + 4.61, 3.68]],
  //[0.08,0.22,0.24,0,-0.68,-1.67,-2.69,-3.47,-4.04,-4.61]
  init: function (p, input) {
    player[p].actionState = "THROWNFOXFORWARD";
    if (player[p].phys.grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    puff.THROWNFOXFORWARD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.THROWNFOXFORWARD.interrupt(p, input)) {
      if (player[p].timer > 0) {
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x + puff.THROWNFOXFORWARD.offset[player[p].timer - 1][0] * player[p].phys.face, player[player[p].phys.grabbedBy].phys.pos.y + puff.THROWNFOXFORWARD.offset[player[p].timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};