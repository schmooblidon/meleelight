import {player} from "../../../main/main";
import puff from "./index";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import {airDrift, fastfall} from "../../../physics/actionStateShortcuts";
import FALL from "../../shared/moves/FALL";
export default {
  name: "CLIFFJUMPQUICK",
  offset: [[-73.32, -8.97], [-73.81, -7.87], [-74.29, -6.36], [-74.51, -4.70], [-74.43, -2.80], [-74.13, -0.84], [-73.57, 0.48], [-72.72, 1.10], [-71.70, 1.48], [-70.62, 1.63], [-69.61, 1.60], [-68.82, 1.43], [-68.42, 0.95], [-68.36, 0.32]],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFJUMPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 14;
    puff.CLIFFJUMPQUICK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.CLIFFJUMPQUICK.interrupt(p, input)) {
      const onLedge = player[p].phys.onLedge;
      if(onLedge === -1){
        this.canGrabLedge = false;
        return;
      }
      const l = activeStage.ledge[onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 15) {
        player[p].phys.pos = new Vec2D(x + (puff.CLIFFJUMPQUICK.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + puff.CLIFFJUMPQUICK.offset[player[p].timer - 1][1]);
      }
      if (player[p].timer === 15) {
        player[p].phys.cVel = new Vec2D(1.1 * player[p].phys.face, 1.8);
      }
      if (player[p].timer > 15) {
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