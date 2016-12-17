import {player} from "../../../main/main";
import {turnOffHitboxes, reduceByTraction} from "../../../physics/actionStateShortcuts";
import marth from "./index";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "DOWNSPECIALGROUND",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  specialClank: true,
  init: function (p, input) {
    player[p].actionState = "DOWNSPECIALGROUND";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecialground.id0;
    marth.DOWNSPECIALGROUND.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.DOWNSPECIALGROUND.interrupt(p, input)) {
      reduceByTraction(p, true);
      if (player[p].timer === 5) {
        sounds.marthcounter.play();
        player[p].colourOverlayBool = true;
        player[p].colourOverlay = "white";
        player[p].hitboxes.active = [true, false, false, false];
        player[p].hitboxes.frame = 0;
      }
      else if (player[p].timer === 30) {
        turnOffHitboxes(p);
      }

      if (player[p].timer >= 6 && player[p].timer <= 28) {
        if (player[p].timer % 6 < 2) {
          player[p].colourOverlayBool = true;
          player[p].colourOverlay = "rgb(122, 122, 122)";
        }
        else if (player[p].timer % 6 < 4) {
          player[p].colourOverlayBool = true;
          player[p].colourOverlay = "rgb(200, 120, 255)";
        }
        else {
          player[p].colourOverlayBool = false;
        }
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 59) {
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
  },
  onClank: function (p, input) {
    player[p].hit.hitlag = 11;
    player[p].colourOverlayBool = false;
    marth.DOWNSPECIALGROUND2.init(p, input);
  }
};