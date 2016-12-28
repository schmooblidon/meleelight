import marth from "./index";
import {player, characterSelections} from "../../../main/main";
import {turnOffHitboxes, actionStates, randomShout} from "../../../physics/actionStateShortcuts";
import {framesData} from "../../../main/characters";
import {hitQueue} from 'physics/hitDetection';
import WAIT from "../../shared/moves/WAIT";
import CATCHCUT from "../../shared/moves/CATCHCUT";
export default {
  name: "THROWDOWN",
  canEdgeCancel: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "THROWDOWN";
    player[p].timer = 0;
    const grabbing = player[p].phys.grabbing;
    if(grabbing === -1 ){
      return;
    }
    actionStates[characterSelections[grabbing]].THROWNMARTHDOWN.init(grabbing, input);
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
    randomShout(characterSelections[p]);
    const frame = framesData[characterSelections[grabbing]].THROWNMARTHDOWN;
    player[p].phys.releaseFrame = frame + 1;
    marth.THROWDOWN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer += 13 / player[p].phys.releaseFrame;
    if (!marth.THROWDOWN.interrupt(p, input)) {
      if (Math.floor(player[p].timer + 0.01) === 13) {
        hitQueue.push([player[p].phys.grabbing, p, 0, false, true, true]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 37) {
      player[p].phys.grabbing = -1;
      WAIT.init(p, input);
      return true;
    }
    else {
      const grabbing = player[p].phys.grabbing;
      if(grabbing === -1){
        return;
      }
      if (player[p].timer < 13 && player[grabbing].phys.grabbedBy !== p) {
            console.log("test");
            CATCHCUT.init(p, input);
            return true;
          }
          else {
            return false;
          }
    }
  }
};