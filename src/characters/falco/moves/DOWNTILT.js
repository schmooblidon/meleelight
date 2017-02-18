
import MOVES from "characters/falco/moves/index";
import DASH from "characters/shared/moves/DASH";
import SMASHTURN from "characters/shared/moves/SMASHTURN";
import TILTTURN from "characters/shared/moves/TILTTURN";
import WALK from "characters/shared/moves/WALK";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import SQUATWAIT from "characters/shared/moves/SQUATWAIT";
import {player} from "main/main";
import {turnOffHitboxes, reduceByTraction, checkForSpecials, checkForTilts, checkForSmashes, checkForJump, checkForDash,
    checkForSmashTurn
    , tiltTurnDashBuffer
} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";

export default {
  name : "DOWNTILT",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "DOWNTILT";
    player[p].timer = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dtilt.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dtilt.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dtilt.id2;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      reduceByTraction(p,true);
      if (player[p].timer === 7){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
      }
      if (player[p].timer > 7 && player[p].timer < 10){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 10){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 29){
      SQUATWAIT.init(p,input);
      return true;
    }
    else if (player[p].timer > 27){
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
      else if (input[p][0].lsX*player[p].phys.face < -0.3 && Math.abs(input[p][0].lsX) > input[p][0].lsY*-1){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
        TILTTURN.init(p,input);
        return true;
      }
      else if (input[p][0].lsX*player[p].phys.face > 0.3 && Math.abs(input[p][0].lsX) > input[p][0].lsY*-1){
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
