
import MOVES from "characters/falcon/moves/index";
import DASH from "characters/shared/moves/DASH";
import SMASHTURN from "characters/shared/moves/SMASHTURN";
import TILTTURN from "characters/shared/moves/TILTTURN";
import WALK from "characters/shared/moves/WALK";
import WAIT from "characters/shared/moves/WAIT";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import {player, characterSelections} from "main/main";
import {sounds} from "main/sfx";
import {reduceByTraction, randomShout, turnOffHitboxes, checkForSpecials, checkForTilts, checkForSmashes, checkForJump,
    checkForDash
    , checkForSmashTurn
    , checkForTiltTurn
    , tiltTurnDashBuffer
} from "physics/actionStateShortcuts";

export default {
  name : "DOWNSMASH",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "DOWNSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dsmash1.id1;
    this.main(p,input);
  },
  main : function(p,input){
    if (player[p].timer === 14){
      if (input[p][0].a || input[p][0].z){
        player[p].phys.charging = true;
        player[p].phys.chargeFrames++;
        if (player[p].phys.chargeFrames === 5){
          sounds.smashcharge.play();
        }
        if (player[p].phys.chargeFrames === 60){
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
    if (!this.interrupt(p,input)){
      reduceByTraction(p,true);

      if (player[p].timer === 19){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        randomShout(characterSelections[p]);
        sounds.normalswing1.play();
      }
      if (player[p].timer > 19 && player[p].timer < 23){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 23){
        turnOffHitboxes(p);
      }
      if (player[p].timer === 29){
        player[p].hitboxes.id[0] = player[p].charHitboxes.dsmash2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.dsmash2.id1;
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing1.play();
      }
      if (player[p].timer > 29 && player[p].timer < 33){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 33){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 49){
      WAIT.init(p,input);
      return true;
    }
    else if (player[p].timer > 44 && !player[p].inCSS){
      const b = checkForSpecials(p,input);
      const t = checkForTilts(p,input);
      const s = checkForSmashes(p,input);
      const j = checkForJump(p,input);
      if (j[0]){
        KNEEBEND.init(p,j[1],input);
        return true;
      }
      else if (b[0]){
        MOVES[b[1]].init(p,input);
        return true;
      }
      else if (s[0]){
        MOVES[s[1]].init(p,input);
        return true;
      }
      else if (t[0]){
        MOVES[t[1]].init(p,input);
        return true;
      }
      else if (checkForDash(p,input)){
        DASH.init(p,input);
        return true;
      }
      else if (checkForSmashTurn(p,input)){
        SMASHTURN.init(p,input);
        return true;
      }
      else if (checkForTiltTurn(p,input)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
        TILTTURN.init(p,input);
        return true;
      }
      else if (Math.abs(input[p][0].lsX) > 0.3){
        WALK.init(p,true,input);
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
