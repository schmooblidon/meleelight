import marth from "./index";
import {player, characterSelections} from "../../../main/main";
import {
  turnOffHitboxes, reduceByTraction, randomShout, checkForSpecials, checkForTilts, checkForSmashes, checkForJump,
  checkForDash
  , checkForSmashTurn
  , checkForTiltTurn
  , tiltTurnDashBuffer
} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import WAIT from "../../shared/moves/WAIT";
import KNEEBEND from "../../shared/moves/KNEEBEND";
import DASH from "../../shared/moves/DASH";
import SMASHTURN from "../../shared/moves/SMASHTURN";
import TILTTURN from "../../shared/moves/TILTTURN";
import WALK from "../../shared/moves/WALK";
export default {
  name: "DOWNSMASH",
  canEdgeCancel: false,
  canBeGrabbed: true,
  init: function (p, input) {
    player[p].actionState = "DOWNSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dsmash1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dsmash1.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dsmash1.id3;
    marth.DOWNSMASH.main(p, input);
  },
  main: function (p, input) {
/*eslint eqeqeq:0*/
    if (player[p].timer == 3) {
      if (input[p][0].a || input[p][0].z) {
        player[p].phys.charging = true;
        player[p].phys.chargeFrames++;
/*eslint eqeqeq:0*/
        if (player[p].phys.chargeFrames == 5) {
          sounds.smashcharge.play();
        }
/*eslint eqeqeq:0*/
        if (player[p].phys.chargeFrames == 60) {
          player[p].timer++;
          player[p].phys.charging = false;
        }
      }
      else {
        player[p].timer++;
        player[p].phys.charging = false;
      }
    }
    else {
      player[p].timer++;
      player[p].phys.charging = false;
    }
    if (!marth.DOWNSMASH.interrupt(p, input)) {
      reduceByTraction(p, true);


      if (player[p].timer > 3 && player[p].timer < 11) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "DOWNSMASH1",
          frame: player[p].timer - 4
        });
      }
      if (player[p].timer > 16 && player[p].timer < 26) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "DOWNSMASH2",
          frame: player[p].timer - 17
        });
      }
/*eslint eqeqeq:0*/
      if (player[p].timer == 5) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.sword3.play();
        randomShout(characterSelections[p]);
      }
      if (player[p].timer > 5 && player[p].timer < 8) {
        player[p].hitboxes.frame++;
      }
/*eslint eqeqeq:0*/
      if (player[p].timer == 8) {
        turnOffHitboxes(p);
      }

/*eslint eqeqeq:0*/
      if (player[p].timer == 20) {
        player[p].hitboxes.id[0] = player[p].charHitboxes.dsmash2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.dsmash2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.dsmash2.id2;
        player[p].hitboxes.id[3] = player[p].charHitboxes.dsmash2.id3;
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.sword3.play();
      }
      if (player[p].timer > 20 && player[p].timer < 23) {
        player[p].hitboxes.frame++;
      }
/*eslint eqeqeq:0*/
      if (player[p].timer == 23) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 64) {
      WAIT.init(p, input);
      return true;
    }
    else if (player[p].timer > 61 && !player[p].inCSS) {
      const b = checkForSpecials(p, input);
      const t = checkForTilts(p, input);
      const s = checkForSmashes(p, input);
      const j = checkForJump(p, input);
      if (j[0]) {
        KNEEBEND.init(p, j[1], input);
        return true;
      }
      else if (b[0]) {
        marth[b[1]].init(p, input);
        return true;
      }
      else if (s[0]) {
        marth[s[1]].init(p, input);
        return true;
      }
      else if (t[0]) {
        marth[t[1]].init(p, input);
        return true;
      }
      else if (checkForDash(p, input)) {
        DASH.init(p, input);
        return true;
      }
      else if (checkForSmashTurn(p, input)) {
        SMASHTURN.init(p, input);
        return true;
      }
      else if (checkForTiltTurn(p, input)) {
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p, input);
        TILTTURN.init(p, input);
        return true;
      }
      else if (Math.abs(input[p][0].lsX) > 0.3) {
        WALK.init(p, true, input);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
};