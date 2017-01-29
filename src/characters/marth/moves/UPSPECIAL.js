import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes, fastfall, airDrift} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {drawVfx} from "../../../main/vfx/drawVfx";
import FALLSPECIAL from "../../shared/moves/FALLSPECIAL";
import LANDINGFALLSPECIAL from "../../shared/moves/LANDINGFALLSPECIAL";
export default {
  name: "UPSPECIAL",
  canPassThrough: true,
  canGrabLedge: [true, false],
  setVelocities: [[0.75685, 14.41555],
    [0.71450, 15.51062],
    [0.67334, 8.65633],
    [0.63338, 2.42162],
    [0.59462, 2.11897],
    [0.55706, 1.83569],
    [0.52069, 1.57181],
    [0.48552, 1.32731],
    [0.45155, 1.10218],
    [0.41878, 0.89645],
    [0.38720, 0.71010],
    [0.35682, 0.54314],
    [0.32765, 0.39556],
    [0.29966, 0.26735],
    [0.27288, 0.15855],
    [0.24729, 0.06912],
    [0.22290, -0.00093]],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "UPSPECIAL";
    player[p].timer = 0;
    player[p].phys.cVel = new Vec2D(0, 0);
    player[p].phys.fastfalled = false;
    player[p].phys.upbAngleMultiplier = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.upb1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.upb1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.upb1.id2;
    player[p].phys.landingMultiplier = 30 / 34;
    sounds.dolphinSlash.play();
    sounds.dolphinSlash2.play();
    marth.UPSPECIAL.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.UPSPECIAL.interrupt(p, input)) {
      if (player[p].phys.cVel.y <= 0) {
        player[p].phys.canWallJump = true;
      }
      if (player[p].timer < 6) {
        if (Math.abs(input[p][0].lsX) > 0.7) {
          player[p].phys.upbAngleMultiplier = -input[p][0].lsX * Math.PI / 16;
        }
      }
      if (player[p].timer === 6) {
        player[p].phys.grounded = false;
        if (input[p][0].lsX * player[p].phys.face < -0.28) {
          player[p].phys.face *= -1;
        }
      }
      if (player[p].timer > 5 && player[p].timer < 23) {
        player[p].phys.cVel = new Vec2D(marth.UPSPECIAL.setVelocities[player[p].timer - 6][0] * player[p].phys.face * Math.cos(player[p].phys.upbAngleMultiplier) - marth.UPSPECIAL.setVelocities[player[p].timer - 6][1] * Math.sin(player[p].phys.upbAngleMultiplier), marth.UPSPECIAL.setVelocities[player[p].timer - 6][0] * player[p].phys.face * Math.sin(player[p].phys.upbAngleMultiplier) + marth.UPSPECIAL.setVelocities[player[p].timer - 6][1] * Math.cos(player[p].phys.upbAngleMultiplier));
      }
      else if (player[p].timer > 22) {
        fastfall(p, input);
        airDrift(p, input);
        if (Math.abs(player[p].phys.cVel.x) > 0.36) {
          player[p].phys.cVel.x = 0.36 * Math.sign(player[p].phys.cVel.x);
        }
      }

      if (player[p].timer === 5) {
        player[p].hitboxes.active = [true, true, true, false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer === 6) {
        player[p].hitboxes.id[0] = player[p].charHitboxes.upb2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.upb2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.upb2.id2;
      }
      if (player[p].timer > 6 && player[p].timer < 11) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 11) {
        turnOffHitboxes(p);
      }
      if (player[p].timer > 2 && player[p].timer < 12) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "UPSPECIAL",
          frame: player[p].timer - 3
        });
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 39) {
      FALLSPECIAL.init(p, input);
      return true;
    }
    else {
      return false;
    }
  },
  land: function (p, input) {
    if (   player[p].phys.cVel.y + player[p].phys.kVel.y <= 0 
        || player[p].phys.ECBp[0].y <= player[p].phys.ECB1[0].y 
        || player[p].phys.pos.y <= player[p].phys.posPrev.y ) {
      LANDINGFALLSPECIAL.init(p, input);
    }
  }
};