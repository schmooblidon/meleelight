
import WAIT from "characters/shared/moves/WAIT";
import MOVES from "characters/falcon/moves/index";
import DASH from "characters/shared/moves/DASH";
import SMASHTURN from "characters/shared/moves/SMASHTURN";
import TILTTURN from "characters/shared/moves/TILTTURN";
import WALK from "characters/shared/moves/WALK";
import KNEEBEND from "characters/shared/moves/KNEEBEND";
import SQUATWAIT from "characters/shared/moves/SQUATWAIT";
import {sounds} from "main/sfx";
import {tiltTurnDashBuffer, checkForSmashTurn, checkForDash, checkForJump, checkForSmashes, checkForTilts,
    checkForSpecials
    , reduceByTraction
    , turnOffHitboxes
} from "physics/actionStateShortcuts";
import {player} from "main/main";

export default {
  name : "JAB3",
  setVelocities : [0,0.00024,0.00024,-0.00047,3.76443,3.40589,0.00972,0.00748,0.00538,0.00342,0.0016,-0.0007,-0.0016,-0.00299,-0.00423,-0.00533,-0.00629,-0.0071,0.00051,0.00051,0.0005,0.0005,0.00051,0.00051,0.0005,0.0005,0.0005,0.00051,0.0005,0.0005,0.0005,0.00051],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "JAB3";
    player[p].timer = 0;
    player[p].phys.jabCombo = false;
    player[p].hitboxes.id[0] = player[p].charHitboxes.jab3Clean.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.jab3Clean.id1;
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      player[p].phys.cVel.x = this.setVelocities[player[p].timer-1] * player[p].phys.face;
      if (player[p].timer === 6){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
      }
      if (player[p].timer > 6 && player[p].timer < 13){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 9){
        player[p].hitboxes.id[0] = player[p].charHitboxes.jab3Late.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.jab3Late.id1;
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer === 13){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 32){
      WAIT.init(p,input);
      return true;
    }
    else if (player[p].timer > 22){
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
    // iasa 23
    else {
      return false;
    }
  }
};
