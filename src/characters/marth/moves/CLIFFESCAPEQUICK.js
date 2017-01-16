import marth from "./index";
import {player} from "../../../main/main";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "CLIFFESCAPEQUICK",
  offset: [[-70.31, -23.71], [-71.33, -23.71], [-71.36, -23.71], [-71.40, -23.71], [-71.43, -23.71], [-71.44, -23.71], [-71.42, -23.71], [-71.37, -23.71], [-71.28, -23.71], [-71.13, -22.69], [-70.93, -19.99], [-70.69, -16.19], [-70.40, -11.83], [-70.04, -7.48], [-69.69, -3.68], [-69.05, -1.01], [-67.74, 0]],
  setVelocities: [4.23, 4.22, 4.21, 1.74, 1.67, 1.61, 1.56, 1.51, 1.47, 1.44, 1.41, 1.39, 1.37, 1.36, 1.36, 1.36, 1.37, 0.14, 0.22, 0.42, 0.62, 0.68, 0.63, 0.49, 0.34, 0.27, 0.21, 0.17, 0.14, 0.13, 0.13],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFESCAPEQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 38;
    marth.CLIFFESCAPEQUICK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.CLIFFESCAPEQUICK.interrupt(p, input)) {
      const onLedge = player[p].phys.onLedge;
      if(onLedge === -1){
        this.canGrabLedge = false;
        return;
      }
      const x = activeStage.ledge[onLedge][1] ? activeStage.box[activeStage.ledge[onLedge][0]].max.x : activeStage.box[activeStage.ledge[onLedge][0]].min.x;
      const y = activeStage.box[activeStage.ledge[onLedge][0]].max.y;
      if (player[p].timer < 18) {
        player[p].phys.pos = new Vec2D(x + (marth.CLIFFESCAPEQUICK.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + marth.CLIFFESCAPEQUICK.offset[player[p].timer - 1][1]);
      }
      else {
        player[p].phys.cVel.x = marth.CLIFFESCAPEQUICK.setVelocities[player[p].timer - 18] * player[p].phys.face;
      }
      if (player[p].timer === 17) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0, activeStage.ledge[onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 48) {
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