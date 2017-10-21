import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default  {
  name: "DOWNSPECIALAIR2",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "DOWNSPECIALAIR2";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 16;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.downspecialair2.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.downspecialair2.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.downspecialair2.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.downspecialair2.id3;
    sounds.powershield.play();
    sounds.marthcounterclank.play();
    sounds.marthcountershout.play();
    drawVfx({
      name: "impactLand",
      pos: player[p].phys.pos,
      face: player[p].phys.face
    });
    drawVfx({
      name: "powershield",
      pos: new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y + 8),
      face: player[p].phys.face
    });
    marth.DOWNSPECIALAIR2.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.DOWNSPECIALAIR2.interrupt(p, input)) {
      player[p].phys.cVel.y -= 0.04;
      if (player[p].phys.cVel.y < -1.2) {
        player[p].phys.cVel.y = -1.2;
      }
      const sign = Math.sign(player[p].phys.cVel.x);
      player[p].phys.cVel.x -= sign * 0.0025;
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