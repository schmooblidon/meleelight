import marth from "./index";
import {player} from "../../../main/main";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "CLIFFGETUPSLOW",
  offset: [[-71.28, -23.58], [-71.24, -23.27], [-71.18, -22.72], [-71.11, -21.97], [-71.04, -21.05], [-70.96, -20.00], [-70.87, -18.83], [-70.77, -17.58], [-70.67, -16.29], [-70.58, -14.97], [-70.48, -13.67], [-70.38, -12.40], [-70.28, -11.21], [-70.19, -10.05], [-70.10, -8.66], [-69.99, -6.99], [-69.86, -5.26], [-69.76, -3.64], [-69.74, -2.33], [-69.85, -1.49], [-70.07, -1.06], [-70.35, -0.79], [-70.62, -0.59], [-70.83, -0.41], [-70.92, -0.23], [-70.84, -0.1], [-70.66, -0.02], [-70.48, 0.03], [-70.28, 0.05], [-70.08, 0.05], [-69.87, 0.04], [-69.64, 0.02], [-69.40, 0.01], [-69.15, 0], [-68.87, 0], [-68.58, 0], [-67.95, 0]],
  setVelocities: [0.34, 0.36, 0.39, 0.40, 0.41, 0.41, 0.41, 0.41, 0.40, 0.40, 0.39, 0.39, 0.38],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFGETUPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 55;
    marth.CLIFFGETUPSLOW.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.CLIFFGETUPSLOW.interrupt(p, input)) {
      const l = activeStage.ledge[player[p].phys.onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 46) {
        if (player[p].timer > 8) {
          player[p].phys.pos = new Vec2D(x + (marth.CLIFFGETUPSLOW.offset[player[p].timer - 9][0] + 68.4) * player[p].phys.face, y + marth.CLIFFGETUPSLOW.offset[player[p].timer - 9][1]);
        }
        else {
          player[p].phys.pos = new Vec2D(x + (-71.31 + 68.4) * player[p].phys.face, y - 23.71);
        }
      }
      else {
        player[p].phys.cVel.x = marth.CLIFFGETUPSLOW.setVelocities[player[p].timer - 46] * player[p].phys.face;
      }
      if (player[p].timer === 45) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 58) {
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