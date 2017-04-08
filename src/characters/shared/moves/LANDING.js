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
  init : function(p,input){
    player[p].actionState = "LANDING";
    player[p].timer = 0;
    drawVfx({
      name: "impactLand",
      pos: player[p].phys.pos,
      face: player[p].phys.face
    });
    drawVfx({
      name: "circleDust",
      pos: player[p].phys.pos,
      face: player[p].phys.face
    });
    sounds.land.play();
    actionStates[characterSelections[p]].LANDING.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].LANDING.interrupt(p,input)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 4 && player[p].timer <= 30){
      const b = checkForSpecials(p,input);
      const t = checkForTilts(p,input);
      const s = checkForSmashes(p,input);
      const j = checkForJump(p,input);
      if (j[0]){
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
      else if (input[p][0].du) {
        actionStates[characterSelections[p]].APPEAL.init(p,input);
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
      else if (Math.abs(input[p][0].lsX) > 0.3){
        actionStates[characterSelections[p]].WALK.init(p,true,input);
        return true;
      }
      else if (player[p].timer === 5 && input[p][0].lsY < -0.5){
        actionStates[characterSelections[p]].SQUATWAIT.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
    else if (player[p].timer > 30){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
