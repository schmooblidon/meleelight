import {mashOut, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from "main/characters";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "CAPTUREWAIT",
  canEdgeCancel : false,
  canBeGrabbed : false,
  inGrab : true,
  init : function(p){
    player[p].actionState = "CAPTUREWAIT";
    player[p].timer = 0;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face),player[player[p].phys.grabbedBy].phys.pos.y);
    actionStates[characterSelections[p]].CAPTUREWAIT.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CAPTUREWAIT.interrupt(p)){
      player[p].phys.stuckTimer--;
      if (mashOut(p)){
        player[p].phys.stuckTimer -= 3;
        player[p].phys.pos.x += 0.5*Math.sign(Math.random()-0.5);
      }
      else {
        player[p].phys.pos.x = player[player[p].phys.grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face);
      }
    }
  },
  interrupt : function(p){
    if (player[p].phys.stuckTimer < 0){
      actionStates[characterSelections[p]].CATCHCUT.init(player[p].phys.grabbedBy);
      actionStates[characterSelections[p]].CAPTURECUT.init(p);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].CAPTUREWAIT){
      actionStates[characterSelections[p]].CAPTUREWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

