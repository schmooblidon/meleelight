import {player, characterSelections} from "../../../main/main";
import {actionStates, turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {framesData} from "../../../main/characters";
import puff from "./index";

import {hitQueue} from 'physics/hitDetection';
import WAIT from "../../shared/moves/WAIT";
import CATCHCUT from "../../shared/moves/CATCHCUT";
export default {
  name: "THROWUP",
  canEdgeCancel: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "THROWUP";
    player[p].timer = 0;
    const grabbing = player[p].phys.grabbing;
    if(grabbing === -1){
      return;
    }
    actionStates[characterSelections[grabbing]].THROWNPUFFUP.init(grabbing, input);
    turnOffHitboxes(p);
    const frame = framesData[characterSelections[grabbing]].THROWNPUFFUP;
    player[p].phys.releaseFrame = frame + 1;
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
    puff.THROWUP.main(p, input);
  },
  main: function (p, input) {
    player[p].timer += 7 / player[p].phys.releaseFrame;
    if (!puff.THROWUP.interrupt(p, input)) {
      if (Math.floor(player[p].timer + 0.01) === 7) {
        hitQueue.push([player[p].phys.grabbing, p, 0, false, true, false]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 41) {
      player[p].phys.grabbing = -1;
      WAIT.init(p, input);
      return true;
    }
    else {
      const grabbing = player[p].phys.grabbing;
      if(grabbing === -1 ){
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