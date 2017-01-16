import marth from "./index";
import {player} from "../../../main/main";
import {activeStage} from "../../../stages/activeStage";
import {airDrift, fastfall} from "../../../physics/actionStateShortcuts";
import {Vec2D} from "../../../main/util/Vec2D";
import FALL from "../../shared/moves/FALL";
export default {
  name: "CLIFFJUMPSLOW",
  offset: [[-71.27, -23.71], [-71.15, -23.55], [-70.96, -23.07], [-70.73, -22.26], [-70.48, -21.16], [-70.21, -19.81], [-69.94, -18.28], [-69.70, -16.60], [-69.45, -14.12], [-69.19, -10.70], [-69.37, -7.08], [-68.97, -3.53], [-68.59, -1.00], [-68.40, 0], [-68.4, 0], [-68.4, 0], [-68.4, 0], [-68.4, 0]],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFJUMPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 18;
    marth.CLIFFJUMPSLOW.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.CLIFFJUMPSLOW.interrupt(p, input)) {
      const onLedge = player[p].phys.onLedge;
      if(onLedge === -1){
        this.canGrabLedge = false;
        return;
      }
      const x = activeStage.ledge[onLedge][1] ? activeStage.box[activeStage.ledge[onLedge][0]].max.x : activeStage.box[activeStage.ledge[onLedge][0]].min.x;
      const y = activeStage.box[activeStage.ledge[onLedge][0]].max.y;
      if (player[p].timer < 19) {
        player[p].phys.pos = new Vec2D(x + (marth.CLIFFJUMPSLOW.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + marth.CLIFFJUMPSLOW.offset[player[p].timer - 1][1]);
      }
      if (player[p].timer === 19) {
        player[p].phys.cVel = new Vec2D(1 * player[p].phys.face, 2.4);
      }
      if (player[p].timer > 19) {
        airDrift(p, input);
        fastfall(p, input);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 57) {
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