import marth from "./index";
import {player} from "../../../main/main";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "CLIFFGETUPQUICK",
  canBeGrabbed: true,
  offset: [[-71.33, -23.71], [-71.38, -23.71], [-71.42, -23.71], [-71.45, -23.71], [-71.46, -23.71], [-71.44, -23.71], [-71.38, -23.71], [-71.26, -23.71], [-71.07, -22.69], [-70.80, -19.99], [-70.47, -16.19], [-70.11, -11.83], [-69.71, -7.48], [-69.28, -3.68], [-68.83, -1.01], [-67.88, 0], [-67.38, 0], [-66.87, 0], [-66.35, 0], [-65.81, 0], [-65.27, 0], [-64.73, 0], [-64.19, 0], [-63.65, 0], [-63.12, 0], [-62.59, 0], [-62.08, 0], [-61.60, 0], [-61.17, 0], [-60.80, 0], [-60.50, 0], [-60.28, 0]],
  init: function (p, input) {
    player[p].actionState = "CLIFFGETUPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 30;
    marth.CLIFFGETUPQUICK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.CLIFFGETUPQUICK.interrupt(p, input)) {
      const l = activeStage.ledge[player[p].phys.onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 16) {
        player[p].phys.pos = new Vec2D(x + (marth.CLIFFGETUPQUICK.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + marth.CLIFFGETUPQUICK.offset[player[p].timer - 1][1]);
      }
      else {
        player[p].phys.pos.x = x + (68.4 + marth.CLIFFGETUPQUICK.offset[player[p].timer - 1][0]) * player[p].phys.face;
      }
      if (player[p].timer === 16) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 32) {
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = true;
      WAIT.init(p, input);
      return true;
    }
    else {
      return false;
    }
  }
};