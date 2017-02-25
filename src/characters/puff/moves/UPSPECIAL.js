import {player} from "../../../main/main";
import {turnOffHitboxes, reduceByTraction} from "../../../physics/actionStateShortcuts";
import puff from "./index";
import {Vec2D} from "../../../main/util/Vec2D";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {sounds} from "../../../main/sfx";
import WAIT from "../../shared/moves/WAIT";
import FALLSPECIAL from "../../shared/moves/FALLSPECIAL";
export default {
  name: "UPSPECIAL",
  canPassThrough: true,
  canGrabLedge: [true, true],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "UPSPECIAL";
    player[p].timer = 0;
    //23
    //71
    //122
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
    player[p].hitboxes.id[0] = player[p].charHitboxes.upb.id0;
    puff.UPSPECIAL.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.UPSPECIAL.interrupt(p, input)) {
      if (player[p].timer === 23) {
        drawVfx({
          name: "sing",
          pos: new Vec2D(0, 0),
          face: p
        });
      }
      else if (player[p].timer === 71) {
        drawVfx({
          name: "sing2",
          pos: new Vec2D(0, 0),
          face: p
        });
      }
      else if (player[p].timer === 122) {
        drawVfx({
          name: "sing3",
          pos: new Vec2D(0, 0),
          face: p
        });
      }
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
      if (player[p].timer === 18) {
        sounds.sing1.play();
      }
      if (player[p].timer === 69) {
        sounds.sing2.play();
      }
      if (player[p].timer === 28) {
        player[p].hitboxes.active = [true, false, false, false];
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0].size = 10.937;
      }
      else if (player[p].timer === 36) {
        player[p].hitboxes.id[0].size = 1;
      }
      else if (player[p].timer === 69) {
        player[p].hitboxes.id[0].size = 10.937;
      }
      else if (player[p].timer === 77) {
        player[p].hitboxes.id[0].size = 1;
      }
      else if (player[p].timer === 113) {
        player[p].hitboxes.id[0].size = 12.890;
      }
      else if (player[p].timer === 126) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 179) {
      if (player[p].phys.grounded) {
        WAIT.init(p, input);
      }
      else {
        FALLSPECIAL.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land: function (p, input) {

  }
};