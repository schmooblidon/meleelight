import marth from "./index";
import {player, characterSelections} from "../../../main/main";
import {turnOffHitboxes, randomShout} from "../../../physics/actionStateShortcuts";
import {activeStage} from "../../../stages/activeStage";
import {sounds} from "../../../main/sfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "CLIFFATTACKQUICK",
  offset: [[-71.31, -23.71], [-71.32, -23.71], [-71.36, -23.71], [-71.41, -23.71], [-71.46, -23.71], [-71.49, -23.71], [-71.48, -23.71], [-71.42, -23.71], [-71.28, -23.71], [-71.06, -22.49], [-70.72, -19.41], [-70.33, -15.28], [-69.94, -11.06], [-69.55, -7.59], [-69.16, -4.33], [-68.77, -1.27], [-67.98, 0]],
  setVelocities: [0.39, 0.39, 0.38, 0.38, 0.38, 0.38, 0.37, 0.37, 0.36, 0.36, 0.35, 0.35, 0.29, 0.19, 0.11, 0.05, 0, -0.02, -0.03, -0.01, 0, -0.01, -0.01, -0.02, -0.02, -0.03, -0.03, -0.04, -0.04, -0.04, -0.04, -0.04, -0.04, -0.05, -0.04, -0.04, -0.04],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFATTACKQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 20;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupquick.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupquick.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ledgegetupquick.id2;
    marth.CLIFFATTACKQUICK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.CLIFFATTACKQUICK.interrupt(p, input)) {
      const x = activeStage.ledge[player[p].phys.onLedge][1] ? activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.x : activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = activeStage.box[activeStage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 18) {
        player[p].phys.pos = new Vec2D(x + (marth.CLIFFATTACKQUICK.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + marth.CLIFFATTACKQUICK.offset[player[p].timer - 1][1]);
      }
      else {
        player[p].phys.cVel.x = marth.CLIFFATTACKQUICK.setVelocities[player[p].timer - 18] * player[p].phys.face;
      }
      if (player[p].timer === 17) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0, activeStage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer === 24) {
        player[p].hitboxes.active = [true, true, false, false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
        randomShout(characterSelections[p]);
      }
      else if (player[p].timer > 24 && player[p].timer < 28) {
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 28) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 54) {
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