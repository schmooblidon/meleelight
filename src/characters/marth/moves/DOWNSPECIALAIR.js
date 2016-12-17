import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "DOWNSPECIALAIR",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  specialClank: true,
  init: function (p, input) {
    player[p].actionState = "DOWNSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.cVel.y = 0;
    player[p].phys.cVel.x *= 0.5;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecialair.id0;
    marth.DOWNSPECIALAIR.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.DOWNSPECIALAIR.interrupt(p, input)) {
      player[p].phys.cVel.y -= 0.04;
      if (player[p].phys.cVel.y < -1.2) {
        player[p].phys.cVel.y = -1.2;
      }
      const sign = Math.sign(player[p].phys.cVel.x);
      player[p].phys.cVel.x -= sign * 0.0025;
      if (player[p].phys.cVel.x * sign < 0) {
        player[p].phys.cVel.x = 0;
      }
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
  land: function (p, input) {
    player[p].actionState = "DOWNSPECIALGROUND";
  },
  onClank: function (p, input) {
    player[p].hit.hitlag = 11;
    player[p].colourOverlayBool = false;
    marth.DOWNSPECIALAIR2.init(p, input);
  }
};