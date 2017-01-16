import {player} from "../../../main/main";
import puff from "./index";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
export default  {
  name: "CLIFFESCAPEQUICK",
  offset: [[-74.04, -8.78], [-74.48, -7.21], [-74.42, -5.16], [-74.24, -3.09], [-73.97, -1.28], [-73.59, 0.24], [-73.14, 1.46], [-72.61, 2.35], [-72.01, 2.87], [-71.36, 3.00], [-70.66, 2.72], [-69.93, 1.80], [-69.17, 0.60], [-67.63, 0]],
  setVelocities: [0.64, 0.40, 0.21, 0.08, -0.003, -0.03, 0.002, 0.09, 0.23, 0.42, 0.67, 0.97, 1.27, 1.52, 1.76, 1.99, 2.21, 2.42, 2.62, 2.81, 2.99, 3.16, 3.32, 3.48, 0.12, 0.33, 0.49, 0.59, 0.65, 0.65, 0.60, 0.49, 0.34, 0.13, 0.002],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFESCAPEQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 28;
    puff.CLIFFESCAPEQUICK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.CLIFFESCAPEQUICK.interrupt(p, input)) {
      const onLedge = player[p].phys.onLedge;
      if(onLedge === -1){
        this.canGrabLedge = false;
        return;
      }
      const x = activeStage.ledge[onLedge][1] ? activeStage.box[activeStage.ledge[onLedge][0]].max.x : activeStage.box[activeStage.ledge[onLedge][0]].min.x;
      const y = activeStage.box[activeStage.ledge[onLedge][0]].max.y;
      if (player[p].timer < 15) {
        player[p].phys.pos = new Vec2D(x + (puff.CLIFFESCAPEQUICK.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + puff.CLIFFESCAPEQUICK.offset[player[p].timer - 1][1]);
      }
      else if (player[p].timer < 50) {
        player[p].phys.cVel.x = puff.CLIFFESCAPEQUICK.setVelocities[player[p].timer - 15] * player[p].phys.face;
      }
      if (player[p].timer === 15) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0, activeStage.ledge[onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 49) {
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