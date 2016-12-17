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
  name: "SIDESPECIALGROUND3FORWARD",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  setVelocities: [0, 0.41, 0.80, 0.58, 0.20, 0.10, 0.03, 0, -0.01, 0, 0, 0, 0, 1.10, 2.75, 3.58, 3.58, 2.76, 1.11, 0.01, 0, 0, 0, 0, 0, -0.01, -0.01, 0, 0, 0, 0, 0.01, 0.01, 0.03, -0.01, -0.18, -0.48, -0.99, -1.39, -1.43, -1.12, -0.45, 0, 0, 0, 0],
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND3FORWARD";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground3forward.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground3forward.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground3forward.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground3forward.id3;
    sounds.shout5.play();
    marth.SIDESPECIALGROUND3FORWARD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    dancingBladeCombo(p, 16, 37, input);
    if (!marth.SIDESPECIALGROUND3FORWARD.interrupt(p, input)) {
      player[p].phys.cVel.x = marth.SIDESPECIALGROUND3FORWARD.setVelocities[player[p].timer - 1] * player[p].phys.face;
      if (player[p].timer > 10 && player[p].timer < 18) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "SIDESPECIALGROUND3FORWARD",
          frame: player[p].timer - 11
        });
      }
      if (player[p].timer === 11) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 11 && player[p].timer < 15) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 15) {
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