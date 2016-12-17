import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes, reduceByTraction} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {dancingBladeCombo} from "../dancingBladeCombo";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALGROUND",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    player[p].phys.cVel.x *= 0.2;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground.id3;
    sounds.shout6.play();
    marth.SIDESPECIALGROUND.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    dancingBladeCombo(p, 8, 26, input);
    if (!marth.SIDESPECIALGROUND.interrupt(p, input)) {
      if (player[p].timer === 6) {
        sounds.dancingBlade.play();
      }
      reduceByTraction(p, true);
      if (player[p].timer > 4 && player[p].timer < 12) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "SIDESPECIALGROUND1",
          frame: player[p].timer - 5
        });
      }
      if (player[p].timer === 6) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer > 6 && player[p].timer < 9) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 9) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 29) {
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
        marth.SIDESPECIALGROUND2UP.init(p, input);
      }
      else {
        marth.SIDESPECIALGROUND2FORWARD.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  }
};