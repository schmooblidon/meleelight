import marth from "./index";
import {reduceByTraction, turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {player} from "../../../main/main";
import {sounds} from "../../../main/sfx";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default{
  name: "DOWNSPECIALGROUND2",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  init: function (p, input) {
    reduceByTraction(p, true);
    player[p].actionState = "DOWNSPECIALGROUND2";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 16;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecialground2.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.downspecialground2.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.downspecialground2.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.downspecialground2.id3;
    sounds.powershield.play();
    sounds.marthcounterclank.play();
    sounds.marthcountershout.play();
    drawVfx("impactLand", player[p].phys.pos, player[p].phys.face);
    drawVfx("powershield", new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y + 8), player[p].phys.face);
    marth.DOWNSPECIALGROUND2.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.DOWNSPECIALGROUND2.interrupt(p, input)) {
      if (player[p].timer === 4) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
      }
      else if (player[p].timer > 4 && player[p].timer < 11) {
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 11) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 36) {
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
  }
};