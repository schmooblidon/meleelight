import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
import puff from "./index";
export default {
  name: "THROWNMARTHFORWARD",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-11.71, 7.06], [-10.22, 9.68], [-9.84, 9.94], [-9.70, 9.88], [-10.01, 9.67], [-14.00, 8.67], [-11.76, 5.89], [-8.89, -0.35], [-8.89, -0.35]],
  init: function (p, input) {
    player[p].actionState = "THROWNMARTHFORWARD";
    if (player[p].phys.grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x, player[player[p].phys.grabbedBy].phys.pos.y);
    puff.THROWNMARTHFORWARD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.THROWNMARTHFORWARD.interrupt(p, input)) {
      if (player[p].timer > 0) {
        if(player[p].phys.grabbedBy === -1){
          return;
        }
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x + puff.THROWNMARTHFORWARD.offset[player[p].timer - 1][0] * player[p].phys.face, player[player[p].phys.grabbedBy].phys.pos.y + puff.THROWNMARTHFORWARD.offset[player[p].timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};