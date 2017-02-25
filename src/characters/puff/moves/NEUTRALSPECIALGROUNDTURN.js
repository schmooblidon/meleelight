import {player} from "../../../main/main";
import {sounds} from "../../../main/sfx";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {drawVfx} from "../../../main/vfx/drawVfx";
export default {
  name: "NEUTRALSPECIALGROUNDTURN",
  canEdgeCancel: false,
  canBeGrabbed: true,
  specialOnHit: true,
  init: function (p, input) {
    player[p].actionState = "NEUTRALSPECIALGROUNDTURN";
    player[p].timer = 0;
    player[p].phys.rollOutTurnTimer = 0;
    player[p].phys.face *= -1;
    sounds.rolloutlaunch.play();
    turnOffHitboxes(p);
    puff.NEUTRALSPECIALGROUNDTURN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer += 3;
    if (player[p].timer > 30) {
      player[p].timer = 3;
    }
    player[p].phys.rollOutTurnTimer++;
    player[p].phys.rollOutDistance++;
    if (!puff.NEUTRALSPECIALGROUNDTURN.interrupt(p, input)) {
      player[p].phys.cVel.x = (player[p].phys.rollOutVel * player[p].phys.face * -1) - (player[p].phys.rollOutVel * 0.045 * player[p].phys.rollOutTurnTimer * player[p].phys.face * -1);
      if (player[p].phys.rollOutDistance % 5 === 0) {
        drawVfx({
          name: "dashDust",
          pos: player[p].phys.pos,
          face: player[p].phys.face
        });
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].phys.rollOutDistance > 100) {
      player[p].actionState = "NEUTRALSPECIALGROUND";
      player[p].timer = 46;
      return true;
    }
    else if (player[p].phys.rollOutTurnTimer > 28) {
      player[p].phys.cVel.x = player[p].phys.rollOutVel * player[p].phys.face;
      player[p].actionState = "NEUTRALSPECIALGROUND";
      player[p].timer = 15 + player[p].timer;
      if (player[p].phys.rollOutCharge >= 19) {
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialground.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.neutralspecialground.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.neutralspecialground.id2;
        player[p].hitboxes.active = [true, true, true, false];
      }
      sounds.stronghit.play();
      return true;
    }
    else {
      return false;
    }
  },
  onPlayerHit: function (p) {
    player[p].actionState = "NEUTRALSPECIALAIR";
    puff.NEUTRALSPECIALAIR.onPlayerHit(p);
  }
};