import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "CLIFFATTACKSLOW",
  offset: [[-73.10, -9.44], [-73.10, -9.56], [-73.10, -9.71], [-73.09, -9.87], [-73.09, -10.01], [-73.09, -10.12], [-73.09, -10.19], [-73.09, -10.23], [-73.09, -10.24], [-73.09, -10.21], [-73.09, -10.14], [-73.09, -10.04], [-73.09, -9.94], [-73.09, -9.89], [-73.09, -9.87], [-73.09, -9.87], [-73.09, -9.87], [-73.09, -9.63], [-73.09, -9.04], [-73.09, -8.28], [-73.09, -7.52], [-73.09, -6.76], [-73.09, -5.93], [-73.09, -5.07], [-73.09, -4.23], [-72.76, -3.35], [-71.98, -2.44], [-71.05, -1.60], [-70.28, -0.94], [-69.72, -0.50], [-69.22, -0.21], [-68.78, -0.05], [-68.02, 0]],
  setVelocities: [0.34, 0.34, 0.35, 0.38, 0.43, 0.50, 0.59, 0.69, 1.86, 2.03, 1.09, 1.02, 0.85, 0.58, 0.22, -0.07, -0.20, -0.31, -0.40, -0.47, -0.53, -0.57, -0.59, -0.59, -0.58, -0.55, -0.50, -0.43, -0.35, -0.25, -0.16, -0.09, -0.03, 0.002, 0.02, 0.03],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFATTACKSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 39;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupslow.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupslow.id1;
    puff.CLIFFATTACKSLOW.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.CLIFFATTACKSLOW.interrupt(p, input)) {
      const onLedge = player[p].phys.onLedge;
      if(onLedge === -1){
        this.canGrabLedge = false;
        return;
      }
      const l = activeStage.ledge[onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 34) {
        player[p].phys.pos = new Vec2D(x + (puff.CLIFFATTACKSLOW.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + puff.CLIFFATTACKSLOW.offset[player[p].timer - 1][1]);
      }
      else {
        player[p].phys.cVel.x = puff.CLIFFATTACKSLOW.setVelocities[player[p].timer - 34] * player[p].phys.face;
      }
      if (player[p].timer === 33) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer === 43) {
        player[p].hitboxes.active = [true, true, false, false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      else if (player[p].timer > 43 && player[p].timer < 60) {
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 60) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 69) {
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