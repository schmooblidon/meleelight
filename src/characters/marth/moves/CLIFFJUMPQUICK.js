import marth from "./index";
import {player} from "../../../main/main";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import {airDrift, fastfall} from "../../../physics/actionStateShortcuts";
import FALL from "../../shared/moves/FALL";
export default {
  name: "CLIFFJUMPQUICK",
  offset: [[-70.91, -23.37], [-70.48, -22.70], [-70.03, -21.59], [-69.59, -20.23], [-69.16, -18.77], [-68.76, -17.39], [-68.82, -16.26], [-69.31, -15.57], [-69.00, -13.87], [-68.51, -8.90], [-68.4, -2.95]],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFJUMPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 11;
    marth.CLIFFJUMPQUICK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.CLIFFJUMPQUICK.interrupt(p, input)) {
      const x = activeStage.ledge[player[p].phys.onLedge][1] ? activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.x : activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 12) {
        player[p].phys.pos = new Vec2D(x + (marth.CLIFFJUMPQUICK.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + marth.CLIFFJUMPQUICK.offset[player[p].timer - 1][1]);
      }
      if (player[p].timer === 12) {
        player[p].phys.cVel = new Vec2D(1 * player[p].phys.face, 2.4);
      }
      if (player[p].timer > 12) {
        airDrift(p, input);
        fastfall(p, input);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 50) {
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
