import {player} from "../../../main/main";
import puff from "./index";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name: "THROWNFOXDOWN",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-4.73, 2.26], [-2.33, 1.03], [-1.90, 0.93], [-1.84, 1.06], [-1.84, 1.52], [-1.98, 3.71], [-1.04, 6.74], [-0.05, 7.45], [0.82, 7.62], [1.03, 7.33], [1.07, 6.86], [1.07, 7.12], [1.07, 7.30], [0.85, 7.44], [-0.45, 9.89], [-0.78, -0.74], [-0.82, -1.45], [-0.81, -0.59], [-0.78, 0.19], [-0.72, -0.15], [-0.65, -0.88], [-0.57, -0.99], [-0.50, 0.52], [-0.50, -1.74], [-0.50, -1.44], [-0.50, -1.14], [-0.50, -0.85], [-0.50, -0.58], [-0.50, -0.33], [-0.50, -0.10], [-0.50, 0.10], [-0.50, 0.26], [-0.50, 0.26]],
  init: function (p, input) {
    player[p].actionState = "THROWNFOXDOWN";
    if (player[p].phys.grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

    puff.THROWNFOXDOWN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.THROWNFOXDOWN.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > puff.THROWNFOXDOWN.offset.length){
          timer = puff.THROWNFOXDOWN.offset.length -1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + puff.THROWNFOXDOWN.offset[timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + puff.THROWNFOXDOWN.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};