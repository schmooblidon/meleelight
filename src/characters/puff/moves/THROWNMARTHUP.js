import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
import puff from "./index";
export default {
  name: "THROWNMARTHUP",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-10.38, 7.51], [-11.19, 6.91], [-11.33, 6.67], [-10.92, 6.78], [-10.55, 6.91], [-10.51, 6.93], [-7.57, 17.47], [-7.57, 17.47]],
  init: function (p, input) {
    player[p].actionState = "THROWNMARTHUP";
    if (player[p].phys.grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x, player[player[p].phys.grabbedBy].phys.pos.y);
    puff.THROWNMARTHUP.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.THROWNMARTHUP.interrupt(p, input)) {
      if (player[p].timer > 0) {
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x + puff.THROWNMARTHUP.offset[player[p].timer - 1][0] * player[p].phys.face, player[player[p].phys.grabbedBy].phys.pos.y + puff.THROWNMARTHUP.offset[player[p].timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};