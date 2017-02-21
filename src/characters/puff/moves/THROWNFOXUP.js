import {player} from "../../../main/main";
import puff from "./index";
import {Vec2D} from "../../../main/util/Vec2D";
export default  {
  name: "THROWNFOXUP",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  offset: [[-6.30, 2.16], [-5.56, 2.71], [-5.19, 2.38], [-3.03, 12.89], [-3.03, 12.89]],
  init: function (p, input) {
    player[p].actionState = "THROWNFOXUP";
    if (player[p].phys.grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    puff.THROWNFOXUP.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.THROWNFOXUP.interrupt(p, input)) {
      if (player[p].timer > 0) {
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x + puff.THROWNFOXUP.offset[player[p].timer - 1][0] * player[p].phys.face, player[player[p].phys.grabbedBy].phys.pos.y + puff.THROWNFOXUP.offset[player[p].timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};