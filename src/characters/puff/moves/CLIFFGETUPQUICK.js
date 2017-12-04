import {player} from "../../../main/main";
import puff from "./index";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "CLIFFGETUPQUICK",
  canBeGrabbed: true,
  offset: [[-73.32063, -8.97483], [-73.806, -7.875], [-74.29, -6.36], [-74.51, -4.7], [-74.39, -2.91], [-74.06, -1.07], [-73.57, 0.48], [-72.954, 1.81], [-72.24, 3.06], [-71.46, 3.99], [-70.68, 4.36], [-69.75, 3.23], [-68.82, 1.13], [-67.98, 0], [-67.93, 0], [-67.77, 0], [-67.54, 0], [-67.25, 0], [-66.92, 0], [-66.57, 0], [-66.22, 0], [-65.89, 0], [-65.6, 0], [-65.37, 0], [-65.22, 0], [-65.16, 0], [-65.16, 0], [-65.16, 0], [-65.16, 0], [-65.16, 0], [-65.16, 0], [-65.16, 0], [-65.16, 0]],
  init: function (p, input) {
    player[p].actionState = "CLIFFGETUPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 30;
    puff.CLIFFGETUPQUICK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.CLIFFGETUPQUICK.interrupt(p, input)) {
      const onLedge = player[p].phys.onLedge;
      if(onLedge === -1){
        this.canGrabLedge = false;
        return;
      }
      const l = activeStage.ledge[onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 16) {
        player[p].phys.pos = new Vec2D(x + (puff.CLIFFGETUPQUICK.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + puff.CLIFFGETUPQUICK.offset[player[p].timer - 1][1]);
      }
      else {
        player[p].phys.pos.x = x + (68.4 + puff.CLIFFGETUPQUICK.offset[player[p].timer - 1][0]) * player[p].phys.face;
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