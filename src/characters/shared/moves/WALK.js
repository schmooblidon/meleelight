import {tiltTurnDashBuffer, checkForTiltTurn, checkForSmashTurn, checkForDash, checkForSquat, checkForJump,
    checkForSmashes
    , checkForTilts
    , checkForSpecials
    , reduceByTraction
    , actionStates
} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "WALK",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,addInitV,input){
    player[p].actionState = "WALK";
    player[p].timer = 1;
    if (addInitV){
      const tempInit = player[p].charAttributes.walkInitV * player[p].phys.face;
      if ((tempInit > 0 && player[p].phys.cVel.x < tempInit) || (tempInit < 0 && player[p].phys.cVel.x > tempInit)){
        player[p].phys.cVel.x += player[p].charAttributes.walkInitV * player[p].phys.face;
      }
    }
    actionStates[characterSelections[p]].WALK.main(p,input);
  },
  main : function(p,input){
    if (!actionStates[characterSelections[p]].WALK.interrupt(p,input)){
      const footstep = [false, false];
      if (player[p].timer < 5){
        footstep[0] = true;
      }
      if (player[p].timer < 15){
        footstep[1] = true;
      }

      //Current Walk Acceleration = ((MaxWalkVel * Xinput) - PreviousFrameVelocity) * (1/(MaxWalkVel * 2)) * (InitWalkVel * WalkAcc)
      const tempMax = player[p].charAttributes.walkMaxV * input[p][0].lsX;

      if (Math.abs(player[p].phys.cVel.x) > Math.abs(tempMax)){
        reduceByTraction(p, true);
      }
      else {
        const tempAcc = (tempMax - player[p].phys.cVel.x) * (1/(player[p].charAttributes.walkMaxV*2)) * (player[p].charAttributes.walkInitV + player[p].charAttributes.walkAcc);

        player[p].phys.cVel.x += tempAcc;
        if (player[p].phys.cVel.x * player[p].phys.face > tempMax * player[p].phys.face){
          player[p].phys.cVel.x = tempMax;
        }
      }

      const time = ((player[p].phys.cVel.x * player[p].phys.face) / player[p].charAttributes.walkMaxV) * player[p].charAttributes.walkAnimSpeed;
      if (time > 0){
        player[p].timer += time;
      }
      if ((footstep[0] && player[p].timer >= 5) || (footstep[1] && player[p].timer >= 15)){
        sounds.footstep.play();
      }
    }
  },
  interrupt : function(p,input){
    const b = checkForSpecials(p,input);
    const t = checkForTilts(p,input);
    const s = checkForSmashes(p,input);
    const j = checkForJump(p,input);
    if (player[p].timer > framesData[characterSelections[p]].WALK){
      actionStates[characterSelections[p]].WALK.init(p,false,input);
      return true;
    }
    if (input[p][0].lsX === 0){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (b[0]){
      actionStates[characterSelections[p]][b[1]].init(p,input);
      return true;
    }
    else if (s[0]){
      actionStates[characterSelections[p]][s[1]].init(p,input);
      return true;
    }
    else if (t[0]){
      actionStates[characterSelections[p]][t[1]].init(p,input);
      return true;
    }
    else if (checkForSquat(p,input)){
      actionStates[characterSelections[p]].SQUAT.init(p,input);
      return true;
    }
    else if (checkForDash(p,input)){
      actionStates[characterSelections[p]].DASH.init(p,input);
      return true;
    }
    else if (checkForSmashTurn(p,input)){
      actionStates[characterSelections[p]].SMASHTURN.init(p,input);
      return true;
    }
    else if (checkForTiltTurn(p,input)){
      player[p].phys.dashbuffer = tiltTurnDashBuffer(p,input);
      actionStates[characterSelections[p]].TILTTURN.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
