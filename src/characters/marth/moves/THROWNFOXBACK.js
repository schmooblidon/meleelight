import marth from "./index";
import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name: "THROWNFOXBACK",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  reverseModel: true,
  //[1.05,7.14],[3.78,7.55],[10.37,1.56],[13.72,-6.85],[13.66,-9.95],[13.67,-10.28],[13.85,-9.92],[14.04,-9.34],[14.04,-9.34]],
  offset: [[-7.76, -3.11], [-7.01, -3.24], [-4.87, -3.80], [-1.68, -4.84], [0.47, -5.78], [4.54, -5.55], [8.21, 1.48], [8.21, 1.48]],
  //7.53
  init: function (p, input) {
    player[p].actionState = "THROWNFOXBACK";
    if (player[p].phys.grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    marth.THROWNFOXBACK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.THROWNFOXBACK.interrupt(p, input)) {
      if (player[p].timer > 0) {
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x + marth.THROWNFOXBACK.offset[player[p].timer - 1][0] * player[p].phys.face * -1, player[player[p].phys.grabbedBy].phys.pos.y + marth.THROWNFOXBACK.offset[player[p].timer - 1][1]);
      }

    }
  },
  interrupt: function (p, input) {
    return false;
  }
};