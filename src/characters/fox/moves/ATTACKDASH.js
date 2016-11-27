/* globals player, turnOffHitboxes, sounds, checkForJump, checkForTilts,
checkForDash, checkForSpecials, checkForSmashes, checkForTilts,
checkForTiltTurn, checkForSmashTurn, tiltTurnDashBuffer */

import MOVES from "./index";
import GRAB from "./GRAB";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import DASH from "characters/shared/moves/DASH";
import SMASHTURN from "characters/shared/moves/SMASHTURN";
import TILTTURN from "characters/shared/moves/TILTTURN";
import WALK from "characters/shared/moves/WALK";
import WAIT from "characters/shared/moves/WAIT";

export default {
  name : "ATTACKDASH",
  canEdgeCancel : false,
  setVelocities : [0.99874,1.82126,2.22815,2.43704,1.91481,1.39379,1.36213,1.33162,1.30228,1.27408,1.24704,1.22115,1.19642,1.17284,1.15042,1.12915,1.10902,1.09006,1.06475,1.01691,0.94598,0.85192,0.73477,0.59452,0.43115,0.32167,0.28310,0.24695,0.21323,0.18194,0.15309,0.12666,0.10266,0.08109,0.06194,0.04524,0.03096,0.0191,0.00968],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "ATTACKDASH";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dashattack1.id1;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      player[p].phys.cVel.x = this.setVelocities[player[p].timer-1]*player[p].phys.face;

      if (player[p].timer === 4){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
      }
      if (player[p].timer > 4 && player[p].timer < 18){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 8){
        player[p].hitboxes.id[0] = player[p].charHitboxes.dashattack2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.dashattack2.id1;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer === 18){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 39){
      WAIT.init(p);
      return true;
    }
    else if (player[p].timer < 5 && (player[p].inputs.lAnalog[0] > 0 || player[p].inputs.rAnalog[0] > 0)){
      if (player[p].phys.cVel.x*player[p].phys.face > player[p].charAttributes.dMaxV){
        player[p].phys.cVel.x = player[p].charAttributes.dMaxV*player[p].phys.face;
      }
      GRAB.init(p);
      return true;
    }
    else if (player[p].timer > 35){
      const b = checkForSpecials(p);
      const t = checkForTilts(p);
      const s = checkForSmashes(p);
      const j = checkForJump(p);
      if (j[0]){
        KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (b[0]){
        MOVES[b[1]].init(p);
        return true;
      }
      else if (s[0]){
        MOVES[s[1]].init(p);
        return true;
      }
      else if (t[0]){
        MOVES[t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lStickAxis[0].x) > 0.3){
        WALK.init(p,true);
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
