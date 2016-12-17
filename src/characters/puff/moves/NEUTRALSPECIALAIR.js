import {player} from "../../../main/main";
import {sounds} from "../../../main/sfx";
import {turnOffHitboxes, airDrift} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {activeStage} from "../../../stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import FALLSPECIAL from "../../shared/moves/FALLSPECIAL";
import LANDINGFALLSPECIAL from "../../shared/moves/LANDINGFALLSPECIAL";
export default  {
  name: "NEUTRALSPECIALAIR",
  canPassThrough: false,
  canGrabLedge: [true, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  specialWallCollide: true,
  specialOnHit: true,
  init: function (p, input) {
    player[p].actionState = "NEUTRALSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.rollOutCharging = false;
    player[p].phys.rollOutCharge = 0;
    player[p].phys.rollOutDistance = 0;
    player[p].phys.rollOutChargeAttempt = true;
    player[p].phys.rollOutVel = 0.5;
    player[p].phys.rollOutPlayerHit = false;
    player[p].phys.rollOutWallHit = false;
    player[p].phys.rollOutPlayerHitTimer = 0;
    player[p].colourOverlay = "rgba(255, 248, 88, 0.83)";
    player[p].phys.cVel.y = Math.max(-1.3, player[p].phys.cVel.y);
    sounds.rolloutshout.play();
    turnOffHitboxes(p);
    puff.NEUTRALSPECIALAIR.main(p, input);
  },
  main: function (p, input) {
    if (player[p].timer === 15) {
      drawVfx("dashDust", player[p].phys.pos, player[p].phys.face);
    }
    if (player[p].timer >= 16 && player[p].timer <= 45 && player[p].phys.rollOutChargeAttempt) {
      if (input[p][0].b) {
        player[p].phys.rollOutCharging = true;
        player[p].phys.rollOutCharge++;
        if (player[p].phys.rollOutCharge > 44) {
          player[p].phys.rollOutCharge = 44;
        }
        if (player[p].phys.rollOutCharge >= 21) {
          if (player[p].timer === 16) {
            drawVfx("dashDust", player[p].phys.pos, player[p].phys.face);
          }
        }
      }
      else {
        player[p].timer++;
        player[p].phys.rollOutCharging = false;
        player[p].phys.rollOutChargeAttempt = false;
        player[p].phys.rollOutVel = Math.max(0.5, Math.min(4.1, (0.2 + (0.09 * player[p].phys.rollOutCharge))));
        player[p].phys.cVel.x = player[p].phys.rollOutVel * player[p].phys.face;
        sounds.rolloutlaunch.play();
        sounds.rollouttickair.play();
        if (player[p].phys.rollOutCharge >= 21) {
          player[p].hitboxes.frame = 0;
          player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialair.id0;
          player[p].hitboxes.active = [true, false, false, false];
        }
      }
    }
    if (player[p].phys.rollOutCharging || player[p].phys.rollOutDistance < 100 || player[p].phys.rollOutPlayerHit) {
      player[p].colourOverlayBool = false;
      if (player[p].timer >= 24 && player[p].timer <= 28 && player[p].phys.rollOutCharge >= 21 && !player[p].phys.rollOutPlayerHit) {
        player[p].colourOverlayBool = true;
      }
      player[p].timer += 1 + (2 * (player[p].phys.rollOutCharge / 44));
      if (player[p].timer > 39) {
        player[p].timer = 16;
        sounds.rollouttickair.play();
      }
    }
    else {
      player[p].timer++;
    }
    if (!puff.NEUTRALSPECIALAIR.interrupt(p, input)) {
      player[p].phys.cVel.y -= 0.07;
      if (player[p].phys.cVel.y < -1.3) {
        player[p].phys.cVel.y = -1.3;
      }
      if (player[p].timer > 15 && player[p].timer < 39 && !player[p].phys.rollOutCharging && !player[p].phys.rollOutChargeAttempt) {
        player[p].phys.rollOutDistance++;
        if (!player[p].phys.rollOutPlayerHit) {
          const newDmg = 12 + Math.round((player[p].phys.rollOutCharge - 19) / 4);
          player[p].hitboxes.id[0].dmg = newDmg;
          player[p].hitboxes.id[1].dmg = newDmg;
          player[p].hitboxes.id[2].dmg = newDmg;
          if (player[p].phys.rollOutCharge >= 21) {
            if (player[p].phys.rollOutDistance % 10 === 0) {
              drawVfx("dashDust", player[p].phys.pos, player[p].phys.face);
            }
          }
        }
        if (player[p].phys.rollOutDistance > 100 && !player[p].phys.rollOutPlayerHit) {
          player[p].timer = 39;
          player[p].phys.cVel.x *= 0.6;
          player[p].colourOverlayBool = false;
          turnOffHitboxes(p);
        }
      }
      if (player[p].phys.rollOutPlayerHit) {
        player[p].phys.rollOutPlayerHitTimer++;
        if (player[p].phys.rollOutPlayerHitTimer > 42) {
          airDrift(p, input);
        }
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 70) {
      FALLSPECIAL.init(p, input);
      return false;
    }
    else {
      return false;
    }
  },
  land: function (p, input) {
    if (player[p].phys.rollOutPlayerHit) {
      LANDINGFALLSPECIAL.init(p, input);
    }
    else {
      player[p].actionState = "NEUTRALSPECIALGROUND";
      if (player[p].phys.rollOutCharge >= 21) {
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialair.id0;
        player[p].hitboxes.active = [true, false, false, false];
      }
    }
  },
  onWallCollide: function (p, wallFace, wallNum) {
    if (!player[p].phys.rollOutCharging && !player[p].phys.rollOutChargeAttempt && !player[p].phys.rollOutPlayerHit) {
      player[p].phys.cVel.x *= -0.75;
      player[p].phys.rollOutVel *= 0.75;
      player[p].timer = 16;
      player[p].phys.face *= -1;
      sounds.rollouthit.play();
      if (wallFace === "R") {
        drawVfx("wallBounce", new Vec2D(activeStage.wallR[wallNum][1].x, player[p].phys.ECBp[3].y), 1, 1);
      }
      else {
        drawVfx("wallBounce", new Vec2D(activeStage.wallL[wallNum][1].x, player[p].phys.ECBp[1].y), -1, 0);
      }
    }
  },
  onPlayerHit: function (p) {
    player[p].phys.rollOutPlayerHit = true;
    player[p].phys.rollOutPlayerHitTimer = 0;
    player[p].phys.cVel.x *= -0.13;
    player[p].phys.cVel.y = 1.6;
    player[p].phys.grounded = false;
    sounds.rollouthit.play();
    player[p].colourOverlayBool = false;
    turnOffHitboxes(p);
  }
};