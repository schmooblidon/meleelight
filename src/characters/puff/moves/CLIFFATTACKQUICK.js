import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {activeStage} from "../../../stages/activeStage";
import {sounds} from "../../../main/sfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
export default  {
  name: "CLIFFATTACKQUICK",
  offset: [[-73.32, -8.97], [-73.81, -7.87], [-74.29, -6.36], [-74.51, -4.70], [-74.44, -2.88], [-74.22, -0.88], [-73.87, 1.08], [-73.40, 2.76], [-72.81, 3.94], [-72.11, 4.39], [-71.31, 3.70], [-70.42, 2.19], [-69.45, 0.69], [-67.35, 0]],
  setVelocities: [1.16, 1.27, 1.29, 1.24, 1.1, 0.89, 0.59, 0.21, -0.18, -0.34, -0.18, 0],
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "CLIFFATTACKQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 15;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupquick.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupquick.id1;
    puff.CLIFFATTACKQUICK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.CLIFFATTACKQUICK.interrupt(p, input)) {
      const onLedge = player[p].phys.onLedge;
      if(onLedge === -1){
        this.canGrabLedge = false;
        return;
      }
      const l = activeStage.ledge[onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 15) {
        player[p].phys.pos = new Vec2D(x + (puff.CLIFFATTACKQUICK.offset[player[p].timer - 1][0] + 68.4) * player[p].phys.face, y + puff.CLIFFATTACKQUICK.offset[player[p].timer - 1][1]);
      }
      else if (player[p].timer < 27) {
        player[p].phys.cVel.x = puff.CLIFFATTACKQUICK.setVelocities[player[p].timer - 15] * player[p].phys.face;
      }
      if (player[p].timer === 15) {
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
      if (player[p].timer === 19) {
        player[p].hitboxes.active = [true, true, false, false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      else if (player[p].timer > 19 && player[p].timer < 24) {
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 24) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 55) {
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