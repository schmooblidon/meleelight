import {player} from "../../../main/main";
import puff from "./index";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "CLIFFGETUPSLOW",
  offset: [[-73.10, -9.44], [-73.10, -9.56], [-73.09, -9.71], [-73.09, -9.87], [-73.09, -10.01], [-73.09, -10.12], [-73.09, -10.19], [-73.09, -10.23], [-73.09, -10.24], [-73.09, -10.21], [-73.09, -10.14], [-73.09, -10.04], [-73.09, -9.94], [-73.09, -9.89], [-73.09, -9.87], [-73.09, -9.87], [-73.09, -9.87], [-73.09, -9.63], [-73.09, -9.04], [-73.09, -8.28], [-73.09, -7.52], [-73.09, -6.76], [-73.09, -5.93], [-73.09, -5.07], [-73.09, -4.23], [-72.76, -3.35], [-71.98, -2.44], [-71.05, -1.60], [-70.28, -0.94], [-69.68, -0.50], [-69.11, -0.21], [-68.66, -0.05], [-68.14, 0]],
  setVelocities: [0.12, 0.10, 0.08, 0.07, 0.06, 0.05, 0.05, 0.06, 0.07, 0.08, 0.09, 0.12, 0.16, 0.20, 0.23, 0.25, 0.25, 0.24, 0.21, 0.17, 0.12, 0.05, 0.004],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFGETUPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 55;
    puff.CLIFFGETUPSLOW.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.CLIFFGETUPSLOW.interrupt(p, input)) {
      const x = activeStage.ledge[player[p].phys.onLedge][1] ? activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.x : activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 34) {
        player[p].phys.pos = new Vec2D(x + (puff.CLIFFGETUPSLOW.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + puff.CLIFFGETUPSLOW.offset[player[p].timer - 1][1]);
      }
      else if (player[p].timer < 57) {
        player[p].phys.cVel.x = puff.CLIFFGETUPSLOW.setVelocities[player[p].timer - 34] * player[p].phys.face;
      }
      if (player[p].timer === 34) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0, activeStage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 59) {
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