import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {dancingBladeCombo} from "../dancingBladeCombo";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALGROUND3DOWN",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  setVelocities: [0, 2.53, 3.15, 1.25, 1.25, 1.21, 1.13, 1.01, 0.85, 0.66, 0.42, 0.15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.32, -0.85, -1.20, -1.37, -1.37, -1.20, -0.85, -0.32, 0.03, 0.10, 0.15, 0.18, 0.21, 0.22, 0.22, 0.20, 0.18, 0.14, 0.09],
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND3DOWN";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground3down.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground3down.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground3down.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground3down.id3;
    sounds.shout8.play();
    marth.SIDESPECIALGROUND3DOWN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    dancingBladeCombo(p, 19, 35, input);
    if (!marth.SIDESPECIALGROUND3DOWN.interrupt(p, input)) {
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND3DOWN.setVelocities[player[p].timer - 1] * player[p].phys.face;
      if (player[p].timer > 13 && player[p].timer < 18) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "SIDESPECIALGROUND3DOWN",
          frame: player[p].timer - 14
        });
      }
      if (player[p].timer === 15) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 15 && player[p].timer < 19) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 19) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 46) {
      if (player[p].phys.grounded) {
        WAIT.init(p, input);
      }
      else {
        FALL.init(p, input);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade) {
      if (input[p][0].lsY > 0.56) {
        marth.SIDESPECIALGROUND4UP.init(p, input);
      }
      else if (input[p][0].lsY < -0.56) {
        marth.SIDESPECIALGROUND4DOWN.init(p, input);
      }
      else {
        marth.SIDESPECIALGROUND4FORWARD.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  }
};