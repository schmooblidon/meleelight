import {player, characterSelections} from "../../../main/main";
import {actionStates, turnOffHitboxes, randomShout} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {hitQueue} from 'physics/hitDetection';
import {framesData} from "../../../main/characters";
import WAIT from "../../shared/moves/WAIT";
import CATCHCUT from "../../shared/moves/CATCHCUT";
export default  {
  name: "THROWBACK",
  canEdgeCancel: false,
  canBeGrabbed: true,
  setVelocities: [-0.12755, -1.24035, -3.10533, -2.72023, -0.32654, 0, 0, 0, 0.00357, 0.09035, 0.22531, 0.37797, 0.54831, 1.35048, 1.60332, 1.04371, 0.81257, 0.60621, 0.42461, 0.26777, 0.1357, 0.03, 0],
  init: function (p, input) {
    player[p].actionState = "THROWBACK";
    player[p].timer = 0;
    const grabbing = player[p].phys.grabbing;
    if(grabbing === -1){
      return;
    }
    actionStates[characterSelections[grabbing]].THROWNPUFFBACK.init(grabbing, input);
    const frame = framesData[characterSelections[grabbing]].THROWNPUFFBACK;
    player[p].phys.releaseFrame = frame + 1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
    randomShout(characterSelections[p]);
    puff.THROWBACK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer += (22 / player[p].phys.releaseFrame);
    if (!puff.THROWBACK.interrupt(p, input)) {
      if (Math.floor(player[p].timer + 0.01) > 13 && Math.floor(player[p].timer + 0.01 < 37)) {
        player[p].phys.cVel.x = puff.THROWBACK.setVelocities[Math.floor(player[p].timer + 0.01) - 14] * player[p].phys.face;
      }
      if (Math.floor(player[p].timer + 0.01) === 22) {
        hitQueue.push([player[p].phys.grabbing, p, 0, false, true, true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 43) {
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