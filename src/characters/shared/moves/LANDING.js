import {tiltTurnDashBuffer, checkForTiltTurn, checkForSmashTurn, checkForDash, checkForJump, checkForSmashes,
    checkForTilts
    , checkForSpecials
    , reduceByTraction
    , actionStates
} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {sounds} from "main/sfx";
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "LANDING",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDING";
    player[p].timer = 0;
    drawVfx("impactLand",player[p].phys.pos,player[p].phys.face);
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    actionStates[characterSelections[p]].LANDING.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].LANDING.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 4 && player[p].timer <= 30){
      const b = checkForSpecials(p);
      const t = checkForTilts(p);
      const s = checkForSmashes(p);
      const j = checkForJump(p);
      if (j[0]){
        actionStates[characterSelections[p]].KNEEBEND.init(p,j[1]);
        return true;
      }
      else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
        actionStates[characterSelections[p]].GUARDON.init(p);
        return true;
      }
      else if (player[p].inputs.lA[0] > 0 || player[p].inputs.rA[0] > 0){
        actionStates[characterSelections[p]].GUARDON.init(p);
        return true;
      }
      else if (b[0]){
        actionStates[characterSelections[p]][b[1]].init(p);
        return true;
      }
      else if (s[0]){
        actionStates[characterSelections[p]][s[1]].init(p);
        return true;
      }
      else if (t[0]){
        actionStates[characterSelections[p]][t[1]].init(p);
        return true;
      }
      else if (checkForDash(p)){
        actionStates[characterSelections[p]].DASH.init(p);
        return true;
      }
      else if (checkForSmashTurn(p)){
        actionStates[characterSelections[p]].SMASHTURN.init(p);
        return true;
      }
      else if (checkForTiltTurn(p)){
        player[p].phys.dashbuffer = tiltTurnDashBuffer(p);
        actionStates[characterSelections[p]].TILTTURN.init(p);
        return true;
      }
      else if (Math.abs(player[p].inputs.lsX[0]) > 0.3){
        actionStates[characterSelections[p]].WALK.init(p,true);
        return true;
      }
      else if (player[p].timer === 5 && player[p].inputs.lsY[0] < -0.5){
        actionStates[characterSelections[p]].SQUATWAIT.init(p);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 30){
      actionStates[characterSelections[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
