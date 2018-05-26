import falcon from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes, fastfall, airDrift} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {drawVfx} from "../../../main/vfx/drawVfx";
import FALLSPECIAL from "../../shared/moves/FALLSPECIAL";
import LANDINGFALLSPECIAL from "../../shared/moves/LANDINGFALLSPECIAL";
import UPSPECIALTHROW from "characters/falcon/moves/UPSPECIALTHROW";
export default {
  name: "UPSPECIAL",
  canPassThrough: true,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: false,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "UPSPECIALCATCH";
    player[p].timer = 0;
    player[p].phys.cVel = new Vec2D(0, 0);
    player[p].phys.fastfalled = false;
    player[p].phys.upbAngleMultiplier = 0;
    turnOffHitboxes(p);
    player[p].phys.landingMultiplier = 30 / 34;
    falcon.UPSPECIALCATCH.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!falcon.UPSPECIALCATCH.interrupt(p, input)) {
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 16) {
      UPSPECIALTHROW.init(p, input);
      return true;
    }
    else {
      return false;
    }
  },
  land: function (p, input) {
  }
};