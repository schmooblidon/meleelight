import {player} from "../../../main/main";
import {turnOffHitboxes, reduceByTraction} from "../../../physics/actionStateShortcuts";
import puff from "./index";
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
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "DOWNSPECIALGROUND";
    player[p].timer = 0;
    if (player[p].phys.grounded) {
      if (player[p].phys.cVel.x > 0) {
        player[p].phys.cVel.x -= 0.1;
      }
      if (player[p].phys.cVel.x < 0) {
        player[p].phys.cVel.x += 0.1;
      }
    }
    else {
      player[p].phys.fastfalled = false;
      if (player[p].phys.cVel.y < -player[p].charAttributes.terminalV) {
        player[p].phys.cVel.y = -player[p].charAttributes.terminalV;
      }
    }
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecial.id0;
    puff.DOWNSPECIALGROUND.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.DOWNSPECIALGROUND.interrupt(p, input)) {
      if (player[p].phys.grounded) {
        reduceByTraction(p);
      }
      else {
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

      if (player[p].timer === 1) {
        player[p].hitboxes.active = [true, false, false, false];
        player[p].hitboxes.frame = 0;
        player[p].phys.intangibleTimer = 26;
      }
      if (player[p].timer === 2) {
        turnOffHitboxes(p);
      }
      if (player[p].timer === 10) {
        sounds.rest1.play();
        sounds.restbubbles.play();
      }
      if (player[p].timer === 210) {
        sounds.rest2.play();
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 249) {
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
    //player[p].actionState = 109;
  }
};