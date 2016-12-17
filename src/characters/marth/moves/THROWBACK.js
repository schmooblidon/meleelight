import marth from "./index";
import {player, characterSelections} from "../../../main/main";
import {actionStates, turnOffHitboxes, randomShout} from "../../../physics/actionStateShortcuts";
import {framesData} from "../../../main/characters";
import {hitQueue} from 'physics/hitDetection';
import WAIT from "../../shared/moves/WAIT";
import CATCHCUT from "../../shared/moves/CATCHCUT";
export default {
  name: "THROWBACK",
  canEdgeCancel: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "THROWBACK";
    player[p].timer = 0;
    actionStates[characterSelections[player[p].phys.grabbing]].THROWNMARTHBACK.init(player[p].phys.grabbing, input);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
    randomShout(characterSelections[p]);
    const frame = framesData[characterSelections[player[p].phys.grabbing]].THROWNMARTHBACK;
    player[p].phys.releaseFrame = frame + 1;
    marth.THROWBACK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer += 7 / player[p].phys.releaseFrame;
    if (!marth.THROWBACK.interrupt(p, input)) {
      if (Math.floor(player[p].timer + 0.01) === 7) {
        hitQueue.push([player[p].phys.grabbing, p, 0, false, true, true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 39) {
      player[p].phys.grabbing = -1;
      WAIT.init(p, input);
      return true;
    }
    else if (player[p].timer < 7 && player[player[p].phys.grabbing].phys.grabbedBy !== p) {
      CATCHCUT.init(p, input);
      return true;
    }
    else {
      return false;
    }
  }
};