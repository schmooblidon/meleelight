import {player} from "../../../main/main";
import {sounds} from "../../../main/sfx";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {drawVfx} from "../../../main/vfx/drawVfx";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "NEUTRALSPECIALGROUND",
  canEdgeCancel: true,
  canBeGrabbed: true,
  disableTeeter: true,
  airborneState: "NEUTRALSPECIALAIR",
  specialOnHit: true,
  init: function (p, input) {
    player[p].actionState = "NEUTRALSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.rollOutCharging = false;
    player[p].phys.rollOutCharge = 0;
    player[p].phys.rollOutDistance = 0;
    player[p].phys.rollOutChargeAttempt = true;
    player[p].phys.rollOutVel = 0.3;
    player[p].phys.rollOutPlayerHit = false;
    player[p].phys.rollOutWallHit = false;
    player[p].phys.rollOutPlayerHitTimer = 0;
    player[p].colourOverlay = "rgba(255, 248, 88, 0.83)";
    player[p].phys.cVel.x = 0.0001 * player[p].phys.face;
    sounds.rolloutshout.play();
    turnOffHitboxes(p);
    puff.NEUTRALSPECIALGROUND.main(p, input);
  },
  main: function (p, input) {
    if (player[p].timer === 15) {
      drawVfx({
        name: "dashDust",
        pos: player[p].phys.pos,
        face: player[p].phys.face
      });
    }
    if (player[p].timer >= 16 && player[p].timer <= 45 && player[p].phys.rollOutChargeAttempt) {
      if (input[p][0].b) {
        player[p].phys.rollOutCharging = true;
        player[p].phys.rollOutCharge++;
        if (player[p].phys.rollOutCharge > 44) {
          player[p].phys.rollOutCharge = 44;
        }
        if (player[p].phys.rollOutCharge >= 19) {
          if (player[p].timer === 16) {
            drawVfx({
              name: "dashDust",
              pos: player[p].phys.pos,
              face: player[p].phys.face
            });
          }
        }
        player[p].phys.cVel.x = 0.0001 * player[p].phys.face;
      }
      else {
        player[p].timer++;
        player[p].phys.rollOutCharging = false;
        player[p].phys.rollOutChargeAttempt = false;
        player[p].phys.rollOutVel = Math.min(4.2, (0.3 + (0.09 * player[p].phys.rollOutCharge)));
        sounds.stronghit.play();
        sounds.rolloutlaunch.play();
        sounds.rollouttickground.play();
        if (player[p].phys.rollOutCharge >= 19) {
          player[p].hitboxes.frame = 0;
          player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialground.id0;
          player[p].hitboxes.id[1] = player[p].charHitboxes.neutralspecialground.id1;
          player[p].hitboxes.id[2] = player[p].charHitboxes.neutralspecialground.id2;
          player[p].hitboxes.active = [true, true, true, false];
        }
      }
    }
    if (player[p].phys.rollOutCharging || player[p].phys.rollOutDistance < 100) {
      player[p].timer += 1 + (2 * (player[p].phys.rollOutCharge / 44));
      player[p].colourOverlayBool = false;
      if (player[p].timer >= 28 && player[p].timer <= 34 && player[p].phys.rollOutCharge >= 19 && !player[p].phys.rollOutPlayerHit) {
        player[p].colourOverlayBool = true;
      }
      if (player[p].timer > 45) {
        player[p].timer = 16;
        sounds.rollouttickground.play();
      }
    }
    else {
      player[p].timer++;
    }
    if (!puff.NEUTRALSPECIALGROUND.interrupt(p, input)) {

      if (player[p].timer > 15 && player[p].timer < 46 && !player[p].phys.rollOutCharging && !player[p].phys.rollOutChargeAttempt) {
        player[p].phys.rollOutDistance++;
        if (!player[p].phys.rollOutPlayerHit) {
          const newDmg = 12 + Math.round((player[p].phys.rollOutCharge - 19) / 4);
          player[p].hitboxes.id[0].dmg = newDmg;
          player[p].hitboxes.id[1].dmg = newDmg;
          player[p].hitboxes.id[2].dmg = newDmg;
          if (player[p].phys.rollOutCharge >= 19) {
            if (player[p].phys.rollOutDistance % 10 === 0) {
              drawVfx({
                name: "dashDust",
                pos: player[p].phys.pos,
                face: player[p].phys.face
              });
            }
          }
        }
        if (player[p].phys.rollOutDistance > 100) {
          turnOffHitboxes(p);
          player[p].timer = 46;
          player[p].phys.cVel.x *= 0.6;
          player[p].colourOverlayBool = false;
        }
        else {
          player[p].phys.cVel.x = player[p].phys.rollOutVel * player[p].phys.face;
          if (input[p][0].lsX * player[p].phys.face < -0.49) {
            puff.NEUTRALSPECIALGROUNDTURN.init(p, input);
            player[p].colourOverlayBool = false;
          }
        }
      }
      if (player[p].timer >= 46) {
        const sign = Math.sign(player[p].phys.cVel.x);
        player[p].phys.cVel.x -= 0.09 * sign;
        if (player[p].phys.cVel.x * sign < 0) {
          player[p].phys.cVel.x = 0;
        }
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 77) {
      WAIT.init(p, input);
      return false;
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