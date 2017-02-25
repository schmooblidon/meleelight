import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes, reduceByTraction} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {dancingBladeCombo} from "../dancingBladeCombo";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default{
  name: "SIDESPECIALGROUND2UP",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND2UP";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbground2up.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbground2up.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbground2up.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbground2up.id3;
    sounds.shout1.play();
    marth.SIDESPECIALGROUND2UP.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    dancingBladeCombo(p, 17, 32, input);
    if (!marth.SIDESPECIALGROUND2UP.interrupt(p, input)) {
      reduceByTraction(p, true);
      if (player[p].timer > 10 && player[p].timer < 20) {
        drawVfx({
          name: "swing",
          pos: new Vec2D(0, 0),
          face: player[p].phys.face,
          f: {
            pNum: p,
            swingType: "SIDESPECIALGROUND2UP",
            frame: player[p].timer - 11
          }
        });
      }
      if (player[p].timer === 12) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade2.play();
      }
      if (player[p].timer > 12 && player[p].timer < 16) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 16) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 40) {
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
        marth.SIDESPECIALGROUND3UP.init(p, input);
      }
      else if (input[p][0].lsY < -0.56) {
        marth.SIDESPECIALGROUND3DOWN.init(p, input);
      }
      else {
        marth.SIDESPECIALGROUND3FORWARD.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  }
};