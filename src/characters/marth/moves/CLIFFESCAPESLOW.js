import {player} from "../../../main/main";
import marth from "./index";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "CLIFFESCAPESLOW",
  offset: [[-71.27, -23.58], [-71.21, -23.27], [-71.14, -22.72], [-71.05, -21.97], [-70.96, -21.05], [-70.86, -20.0], [-70.76, -18.83], [-70.65, -17.58], [-70.55, -16.29], [-70.45, -14.97], [-70.37, -13.67], [-70.29, -12.40], [-70.23, -11.21], [-70.18, -10.07], [-70.13, -8.90], [-70.01, -6.95], [-69.12, -2.82], [-67.68, 0]],
  setVelocities: [0, 0, 0, 0, 0, 0, 0, 0, 0.02, 2.76, 2.65, 2.55, 2.44, 2.34, 2.23, 2.12, 2.01, 1.90, 1.79, 1.68, 1.56, 1.45, 1.34, 1.24, 1.15, 1.07, 0.99, 0.91, 0.85, 0.79, 0.64, 0.42, 0.25, 0.14, 0.08, 0.07, 0.08, 0.07, 0.06, 0.05, 0.05, 0.04, 0.03, 0.02, 0.02, 0.01, 0.01, 0, 0, 0, -0.01],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFESCAPESLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 56;
    marth.CLIFFESCAPESLOW.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.CLIFFESCAPESLOW.interrupt(p, input)) {
      const x = activeStage.ledge[player[p].phys.onLedge][1] ? activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.x : activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 28) {
        if (player[p].timer > 9) {
          player[p].phys.pos = new Vec2D(x + (marth.CLIFFESCAPESLOW.offset[player[p].timer - 10][0] + 68.4) * player[p].phys.face, y + marth.CLIFFESCAPESLOW.offset[player[p].timer - 10][1]);
        }
        else {
          player[p].phys.pos = new Vec2D(x + (-71.31 + 68.4) * player[p].phys.face, y - 23.71);
        }
      }
      else {
        player[p].phys.cVel.x = marth.CLIFFESCAPESLOW.setVelocities[player[p].timer - 28] * player[p].phys.face;
      }
      if (player[p].timer === 27) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0, activeStage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 78) {
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