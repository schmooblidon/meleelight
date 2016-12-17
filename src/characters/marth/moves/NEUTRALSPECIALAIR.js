import marth from "./index";
import {player, palettes, pPal} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {blendColours} from "../../../main/vfx/blendColours";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import FALL from "../../shared/moves/FALL";
export default {
  name: "NEUTRALSPECIALAIR",
  canPassThrough: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "NEUTRALSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.shieldBreakerCharge = 0;
    player[p].phys.shieldBreakerChargeAttempt = true;
    player[p].phys.shieldBreakerCharging = false;
    player[p].phys.cVel.x *= 0.8;
    player[p].phys.cVel.y = Math.max(0, player[p].phys.cVel.y);
    player[p].phys.fastfalled = false;
    player[p].colourOverlayBool = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.neutralspecialair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.neutralspecialair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.neutralspecialair.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.neutralspecialair.id3;
    sounds.jump.play();
    marth.NEUTRALSPECIALAIR.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (player[p].timer >= 12 && player[p].timer <= 41 && player[p].phys.shieldBreakerChargeAttempt) {
      if (input[p][0].b) {
        player[p].phys.shieldBreakerCharging = true;
        player[p].phys.shieldBreakerCharge++;
        let originalColour = palettes[pPal[p]][0];
        originalColour = originalColour.substr(4, originalColour.length - 5);
        const colourArray = originalColour.split(",");
        const newCol = blendColours(colourArray, [117, 50, 227], Math.min(1, player[p].phys.shieldBreakerCharge / 120));
        player[p].colourOverlay = "rgb(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + ")";
        player[p].colourOverlayBool = true;
        if (player[p].phys.shieldBreakerCharge % 6 === 0) {
          drawVfx("dashDust", player[p].phys.pos, player[p].phys.face);
        }
      }
      else {
        player[p].phys.shieldBreakerCharging = false;
        player[p].phys.shieldBreakerChargeAttempt = false;
        player[p].colourOverlayBool = false;
        player[p].timer = 42;
        sounds.shieldbreakercharge.stop(player[p].shieldBreakerID);
      }
    }
    if (player[p].phys.shieldBreakerCharging) {
      if (player[p].timer > 41) {
        player[p].timer = 12;
      }
      if (player[p].phys.shieldBreakerCharge === 122) {
        player[p].timer = 42;
        player[p].phys.shieldBreakerCharging = false;
        player[p].phys.shieldBreakerChargeAttempt = false;
        player[p].colourOverlayBool = false;
        sounds.shieldbreakercharge.stop(player[p].shieldBreakerID);
      }
    }

    if (!marth.NEUTRALSPECIALAIR.interrupt(p, input)) {
      player[p].phys.cVel.y -= player[p].charAttributes.gravity;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV) {
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
      let decrease;
      if (player[p].timer < 12) {
        decrease = 0.02;
      }
      else {
        decrease = 0.005;
      }
      const sign = Math.sign(player[p].phys.cVel.x);
      player[p].phys.cVel.x -= decrease * sign;
      if (player[p].phys.cVel.x * sign < 0) {
        player[p].phys.cVel.x = 0;
      }

      if (player[p].timer === 7) {
        sounds.shieldbreaker1.play();
      }
      else if (player[p].timer === 11) {
        player[p].shieldBreakerID = sounds.shieldbreakercharge.play();
      }
      else if (player[p].timer === 43) {
        sounds.shieldbreakershout.play();
        sounds.shieldbreaker2.play();

      }
      else if (player[p].timer === 46) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        const newDmg = 7 + (5 * Math.floor(player[p].phys.shieldBreakerCharge / 30)) + 1 * (Math.floor(player[p].phys.shieldBreakerCharge / 120));
        player[p].hitboxes.id[0].dmg = newDmg;
        player[p].hitboxes.id[1].dmg = newDmg;
        player[p].hitboxes.id[2].dmg = newDmg;
        player[p].hitboxes.id[3].dmg = newDmg;
        if (player[p].phys.shieldBreakerCharge >= 120) {
          sounds.firestronghit.play();
        }
        else {
          sounds.sword3.play();
        }
      }
      else if (player[p].timer > 46 && player[p].timer < 52) {
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 52) {
        turnOffHitboxes(p);
      }

      if (player[p].timer === 50) {
        if (player[p].phys.shieldBreakerCharge >= 120) {
          drawVfx("groundBounce", new Vec2D(player[p].phys.pos.x + 18 * player[p].phys.face, player[p].phys.pos.y), player[p].phys.face);
        }
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 74) {
      FALL.init(p, input);
      return true;
    }
    else {
      return false;
    }
  },
  land: function (p, input) {
    player[p].actionState = "NEUTRALSPECIALGROUND";
  }
};