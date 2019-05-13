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
    const grabbing = player[p].phys.grabbing;
    if(grabbing === -1){
      return;
    }
    actionStates[characterSelections[grabbing]].THROWNMARTHBACK.init(grabbing, input);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
    randomShout(characterSelections[p]);
    const frame = framesData[characterSelections[grabbing]].THROWNMARTHBACK;
    player[p].phys.releaseFrame = frame + 1;
    marth.THROWBACK.main(p, input);
  },
  main: function (p, input) {
    const prevFrame = player[p].timer;
    player[p].timer += 7 / player[p].phys.releaseFrame;
    if (!marth.THROWBACK.interrupt(p, input)) {
      if (Math.floor(player[p].timer + 0.01) >= 7 && Math.floor(prevFrame+0.01) < 7) {
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
    else {
      const grabbing = player[p].phys.grabbing;
      if(grabbing === -1){
        return;
      }
      if (player[p].timer < 7 && player[grabbing].phys.grabbedBy !== p) {
        CATCHCUT.init(p, input);
        return true;
      }
      else {
        return false;
      }
    }
  }
};