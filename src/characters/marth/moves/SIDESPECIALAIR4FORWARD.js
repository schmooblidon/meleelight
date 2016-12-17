import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {dancingBladeAirMobility} from "../dancingBladeAirMobility";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALAIR4FORWARD",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALAIR4FORWARD";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair4forward.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair4forward.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair4forward.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair4forward.id3;
    sounds.shout2.play();
    marth.SIDESPECIALAIR4FORWARD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.SIDESPECIALAIR4FORWARD.interrupt(p, input)) {
      if (player[p].timer > 21 && player[p].timer < 30) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "SIDESPECIALAIR4FORWARD",
          frame: player[p].timer - 22
        });
      }
      dancingBladeAirMobility(p, input);
      player[p].phys.cVel.x = 0;
      if (player[p].timer === 23) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 23 && player[p].timer < 27) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 27) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 50) {
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
    player[p].actionState = "SIDESPECIALGROUND4FORWARD";
  }
};