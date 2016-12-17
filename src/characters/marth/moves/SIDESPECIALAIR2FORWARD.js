import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {dancingBladeCombo} from "../dancingBladeCombo";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {dancingBladeAirMobility} from "../dancingBladeAirMobility";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALAIR2FORWARD",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALAIR2FORWARD";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair2forward.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair2forward.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair2forward.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair2forward.id3;
    sounds.shout7.play();
    marth.SIDESPECIALAIR2FORWARD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    dancingBladeCombo(p, 17, 33, input);
    if (!marth.SIDESPECIALAIR2FORWARD.interrupt(p, input)) {
      if (player[p].timer > 11 && player[p].timer < 25) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "SIDESPECIALAIR2FORWARD",
          frame: player[p].timer - 12
        });
      }
      dancingBladeAirMobility(p, input);
      if (player[p].timer === 14) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade2.play();
      }
      if (player[p].timer > 14 && player[p].timer < 17) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 17) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 40) {
      if (player[p].phys.grounded) {
        WAIT.init(p, input);
      } else {
        FALL.init(p, input);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade) {
      if (input[p][0].lsY > 0.56) {
        marth.SIDESPECIALAIR3UP.init(p, input);
      }
      else if (input[p][0].lsY < -0.56) {
        marth.SIDESPECIALAIR3DOWN.init(p, input);
      }
      else {
        marth.SIDESPECIALAIR3FORWARD.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND2FORWARD";
  }
};