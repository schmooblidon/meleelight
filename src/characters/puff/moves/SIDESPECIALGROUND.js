import {player} from "../../../main/main";
import {turnOffHitboxes, airDrift, fastfall} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALGROUND",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  groundVelocities: [1.88, 1.50792, 1.31208, 1.14561, 0.73439, 0.34986, 0.34461, 0.33943, 0.33430, 0.32924, 0.32424, 0.31930, 0.31443, 0.30961, 0.30486, 0.30017, 0.29554, 0.29097, 0.28647, 0.28202, 0.27764, 0.27332, 0.26906, 0.26487, 0.26074, 0.25666, 0.25265, 0.23230, 0.19657, 0.16230, 0.12950, 0.09816, 0.06830, 0.03990],
  airVelocities: [2.024, 1.86208, 1.71311, 1.57606, 1.44998, 1.33398, 1.22726, 1.12908, 1.03876, 0.95565, 0.87920, 0.80887, 0.74416, 0.68462, 0.62985, 0.57947, 0.53311, 0.49046, 0.45122, 0.41513, 0.38192, 0.35136, 0.32325, 0.29739, 0.27360, 0.25171, 0.23158, 0.21305],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND";
    player[p].timer = 0;
    if (player[p].phys.grounded) {
      player[p].phys.cVel.x = 0;
    }
    else {
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV) {
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.sidespecial.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.sidespecial.id1;
    puff.SIDESPECIALGROUND.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.SIDESPECIALGROUND.interrupt(p, input)) {

      if (player[p].phys.grounded) {
        if (player[p].timer > 11) {
          player[p].phys.cVel.x = puff.SIDESPECIALGROUND.groundVelocities[player[p].timer - 12] * player[p].phys.face;
        }
      }
      else {
        if (player[p].timer === 12) {
          player[p].phys.fastfalled = false;
          player[p].phys.upbAngleMultiplier = input[p][0].lsY * Math.PI * (20 / 180);
          //decide angle
          //max 20 degrees
          player[p].phys.cVel.y = 0;
        }
        if (player[p].timer < 12) {
          if (player[p].phys.cVel.x > 0) {
            player[p].phys.cVel.x -= player[p].charAttributes.airFriction;
            if (player[p].phys.cVel.x < 0) {
              player[p].phys.cVel.x = 0;
            }
          }
          else if (player[p].phys.cVel.x < 0) {
            player[p].phys.cVel.x += player[p].charAttributes.airFriction;
            if (player[p].phys.cVel.x > 0) {
              player[p].phys.cVel.x = 0;
            }
          }
          player[p].phys.cVel.y -= player[p].charAttributes.gravity;
          if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV) {
            player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
          }
        }
        else if (player[p].timer > 11 && player[p].timer < 40) {
          player[p].phys.cVel.x = puff.SIDESPECIALGROUND.airVelocities[player[p].timer - 12] * player[p].phys.face * Math.cos(player[p].phys.upbAngleMultiplier);
          player[p].phys.cVel.y = puff.SIDESPECIALGROUND.airVelocities[player[p].timer - 12] * Math.sin(player[p].phys.upbAngleMultiplier);
        }
        else {
          airDrift(p, input);
          fastfall(p, input);
        }
      }

      if (player[p].timer === 12) {
        player[p].hitboxes.active = [true, true, false, false];
        player[p].hitboxes.frame = 0;
        sounds.puffshout1.play();
      }
      if (player[p].timer > 12 && player[p].timer < 28) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 28) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 45) {
      if (player[p].phys.grounded) {
        WAIT.init(p, input);
      }
      else {
        FALL.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  }
};