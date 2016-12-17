import {player} from "../../../main/main";
import puff from "./index";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "CLIFFESCAPESLOW",
  offset: [[-73.10, -9.44], [-73.09, -9.56], [-73.09, -9.71], [-73.09, -9.87], [-73.09, -10.01], [-73.09, -10.12], [-73.09, -10.19], [-73.09, -10.23], [-73.09, -10.24], [-73.09, -10.21], [-73.09, -10.14], [-73.09, -10.04], [-73.09, -9.94], [-73.09, -9.89], [-73.09, -9.87], [-73.09, -9.87], [-73.09, -9.87], [-73.09, -9.63], [-73.09, -9.04], [-73.09, -8.28], [-73.09, -7.52], [-73.09, -6.76], [-73.09, -5.93], [-73.09, -5.07], [-73.09, -4.23], [-72.78, -3.37], [-72.02, -2.48], [-71.10, -1.64], [-70.28, -0.94], [-69.52, -0.43], [-68.80, -0.11], [-68, 0]],
  setVelocities: [0.63, 1.31, 1.52, 1.24, 0.96, 1.01, 1.05, 1.08, 1.11, 1.14, 1.16, 1.18, 1.20, 1.21, 1.22, 1.22, 1.22, 1.21, 1.20, 1.19, 1.17, 1.15, 1.12, 1.09, 1.06, 1.02, 0.98, 0.93, 0.88, 0.82, 0.77, 0.70, 0.63, 0.56, 0.49, 0.41, 0.32, 0.24, 0.15, 0.05, 0],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFESCAPESLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 53;
    puff.CLIFFESCAPESLOW.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.CLIFFESCAPESLOW.interrupt(p, input)) {
      const x = activeStage.ledge[player[p].phys.onLedge][1] ? activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.x : activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 33) {
        player[p].phys.pos = new Vec2D(x + (puff.CLIFFESCAPESLOW.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + puff.CLIFFESCAPESLOW.offset[player[p].timer - 1][1]);
      }
      else if (player[p].timer < 74) {
        player[p].phys.cVel.x = puff.CLIFFESCAPESLOW.setVelocities[player[p].timer - 33] * player[p].phys.face;
      }
      if (player[p].timer === 32) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0, activeStage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 79) {
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      WAIT.init(p, input);
      return true;
    }
    else {
      return false;
    }
  }
};