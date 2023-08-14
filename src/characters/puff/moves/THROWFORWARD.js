import {player, characterSelections} from "../../../main/main";
import {actionStates, turnOffHitboxes, randomShout} from "../../../physics/actionStateShortcuts";
import {framesData} from "../../../main/characters";
import puff from "./index";

import {hitQueue} from 'physics/hitDetection';
import WAIT from "../../shared/moves/WAIT";
import CATCHCUT from "../../shared/moves/CATCHCUT";
export default {
  name: "THROWFORWARD",
  canEdgeCancel: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "THROWFORWARD";
    player[p].timer = 0;
    const grabbing = player[p].phys.grabbing;
    if(grabbing === -1){
      return;
    }
    actionStates[characterSelections[grabbing]].THROWNPUFFFORWARD.init(grabbing, input);
    const frame = framesData[characterSelections[grabbing]].THROWNPUFFFORWARD;
    player[p].phys.releaseFrame = frame + 1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwforward.id0;
    randomShout(characterSelections[p]);
    puff.THROWFORWARD.main(p, input);
  },
  main: function (p, input) {
    const prevFrame = player[p].timer;
    player[p].timer += 12 / player[p].phys.releaseFrame;
    if (!puff.THROWFORWARD.interrupt(p, input)) {
      if (Math.floor(player[p].timer + 0.01) >= 12 && prevFrame < 12) {
        if(player[p].phys.grabbing === -1) return;
        hitQueue.push([player[p].phys.grabbing, p, 0, false, true, true]);
        turnOffHitboxes(p);
      }
      if (player[p].timer === 11) {
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwforwardextra.id0;
        player[p].hitboxes.active = [true, false, false, false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer === 12) {
        turnOffHitboxes(p);
      }

    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 35) {
      player[p].phys.grabbing = -1;
      WAIT.init(p, input);
      return true;
    }
    else {
      const grabbing = player[p].phys.grabbing;
      if(grabbing === -1){
        return;
      }
      if (player[p].timer < player[p].phys.releaseFrame && player[grabbing].phys.grabbedBy !== p) {
        CATCHCUT.init(p, input);
        return true;
      }
      else {
        return false;
      }
    }
  }
};