import marth from "./index";
import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default  {
  name: "THROWNFOXFORWARD",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-7.32 - 0.08, -2.32], [-6.75 - 0.22, -1.58], [-6.72 - 0.24, -1.42], [-6.91, -1.41], [-7.01 + 0.68, -1.25], [-7.22 + 1.67, -1.06], [-7.63 + 2.69, -0.90], [-8.35 + 3.47, -0.83], [-9.61 + 4.04, -0.93], [-11.60 + 4.04, -1.17], [-11.60 + 4.61, -1.17]],
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
    marth.THROWNFOXFORWARD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.THROWNFOXFORWARD.interrupt(p, input)) {
      if (player[p].timer > 0) {
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x + marth.THROWNFOXFORWARD.offset[player[p].timer - 1][0] * player[p].phys.face, player[player[p].phys.grabbedBy].phys.pos.y + marth.THROWNFOXFORWARD.offset[player[p].timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};