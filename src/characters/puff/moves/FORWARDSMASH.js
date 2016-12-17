import {player, characterSelections} from "../../../main/main";
import {turnOffHitboxes, randomShout, reduceByTraction} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
export default {
  name: "FORWARDSMASH",
  canEdgeCancel: false,
  canBeGrabbed: true,
  setVelocities: [0, 0, 0, 0, 0, 0.33572, 0.87287, 1.20857, 1.34283, 1.91688, 2.27501, 1.44811, 0.63219, 0.61772, 0.60393, 0.59084, 0.57844, 0.56672, 0.55570, 0.54536, 0.53572, 0.52676, 0.51849, 0.51092, 0.50402, 0.49783, 0.49232, 0.48749, 0.48336, 0.47992, 0.47717, 0.47510, 0.47373, 0.47304, 0.47304, 0.47374, 0.47512, 0.47719, 0.47995, 0.48340, 0.48754, 0.49237, 0.44503, 0.30789],
  init: function (p, input) {
    player[p].actionState = "FORWARDSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash1.id1;
    puff.FORWARDSMASH.main(p, input);
  },
  main: function (p, input) {
    if (player[p].timer === 4) {
      if (input[p][0].a || input[p][0].z) {
        player[p].phys.charging = true;
        player[p].phys.chargeFrames++;
        if (player[p].phys.chargeFrames === 5) {
          sounds.smashcharge.play();
        }
        if (player[p].phys.chargeFrames === 60) {
          player[p].timer++;
          player[p].phys.charging = false;
        }
      }
      else {
        player[p].timer++;
        player[p].phys.charging = false;
      }
    }
    else {
      player[p].timer++;
      player[p].phys.charging = false;
    }
    if (!puff.FORWARDSMASH.interrupt(p, input)) {
      reduceByTraction(p, true);

      player[p].phys.cVel.x = puff.FORWARDSMASH.setVelocities[player[p].timer - 1] * player[p].phys.face;
      if (player[p].timer === 6) {
        randomShout(characterSelections[p]);
      }

      if (player[p].timer === 12) {
        player[p].hitboxes.active = [true, true, false, false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing1.play();
      }
      if (player[p].timer > 12 && player[p].timer < 21) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 16) {
        player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash2.id1;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer === 21) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 44) {
      WAIT.init(p, input);
      return true;
    }
    else {
      return false;
    }
  }
};
