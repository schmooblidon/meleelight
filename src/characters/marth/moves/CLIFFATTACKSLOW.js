import marth from "./index";
import {player, characterSelections} from "../../../main/main";
import {turnOffHitboxes, randomShout} from "../../../physics/actionStateShortcuts";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "CLIFFATTACKSLOW",
  offset: [[-71.27, -23.58], [-71.22, -23.27], [-71.16, -22.72], [-71.09, -21.97], [-71.00, -21.05], [-70.91, -20.00], [-70.82, -18.83], [-70.72, -17.58], [-70.62, -16.29], [-70.52, -14.97], [-70.43, -13.67], [-70.34, -12.40], [-70.25, -11.21], [-70.18, -10.11], [-70.1, -8.54], [-70.00, -6.96], [-69.87, -5.72], [-69.72, -4.66], [-69.53, -3.63], [-69.31, -2.56], [-69.05, -1.55], [-68.75, -0.66], [-67.85, 0]],
  setVelocities: [0.66, 0.79, 0.76, 0.65, 0.56, 0.51, 0.47, 0.47, 0.46, 0.42, 0.34, 0.24, 0.11, 0.03, 0.03, 0.03, 0.02, 0.01, 0, -0.01, -0.02, -0.04, -0.06, -0.08, -0.10, -0.13, -0.16, -0.19, -0.21, -0.21, -0.21, -0.20, -0.18, -0.16, -0.13, -0.09],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFATTACKSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 34;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupslow.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupslow.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ledgegetupslow.id2;
    marth.CLIFFATTACKSLOW.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.CLIFFATTACKSLOW.interrupt(p, input)) {
      const x = activeStage.ledge[player[p].phys.onLedge][1] ? activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.x : activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 33) {
        if (player[p].timer > 9) {
          player[p].phys.pos = new Vec2D(x + (marth.CLIFFATTACKSLOW.offset[player[p].timer - 10][0] + 68.4) * player[p].phys.face, y + marth.CLIFFATTACKSLOW.offset[player[p].timer - 10][1]);
        }
        else {
          player[p].phys.pos = new Vec2D(x + (-71.31 + 68.4) * player[p].phys.face, y - 23.71);
        }
      }
      else {
        player[p].phys.cVel.x = marth.CLIFFATTACKSLOW.setVelocities[player[p].timer - 33] * player[p].phys.face;
      }
      if (player[p].timer === 32) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0, activeStage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer === 38) {
        player[p].hitboxes.active = [true, true, true, false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        randomShout(characterSelections[p]);
      }
      else if (player[p].timer > 38 && player[p].timer < 42) {
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 42) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 68) {
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
