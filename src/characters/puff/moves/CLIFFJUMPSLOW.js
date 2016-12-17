import {player} from "../../../main/main";
import puff from "./index";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import {airDrift, fastfall} from "../../../physics/actionStateShortcuts";
import FALL from "../../shared/moves/FALL";
export default {
  name: "CLIFFJUMPSLOW",
  offset: [[-73.10, -9.01], [-73.10, -8.03], [-73.09, -6.73], [-73.09, -5.37], [-73.09, -4.23], [-72.76, -3.29], [-71.98, -2.38], [-71.05, -1.58], [-70.28, -0.94], [-69.66, -0.50], [-69.05, -0.21], [-68.59, -0.05], [-68.4, 0], [-68.4, 0], [-68.4, 0], [-68.4, 0], [-68.4, 0]],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFJUMPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 17;
    puff.CLIFFJUMPSLOW.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.CLIFFJUMPSLOW.interrupt(p, input)) {
      const x = activeStage.ledge[player[p].phys.onLedge][1] ? activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.x : activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 18) {
        player[p].phys.pos = new Vec2D(x + (puff.CLIFFJUMPSLOW.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + puff.CLIFFJUMPSLOW.offset[player[p].timer - 1][1]);
      }
      if (player[p].timer === 18) {
        player[p].phys.cVel = new Vec2D(1.1 * player[p].phys.face, 1.8);
      }
      if (player[p].timer > 18) {
        airDrift(p, input);
        fastfall(p, input);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 38) {
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      FALL.init(p, input);
      return true;
    }
    else {
      return false;
    }
  }
};