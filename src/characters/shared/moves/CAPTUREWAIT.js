import {mashOut, actionStates} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
import {framesData} from "main/characters";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "CAPTUREWAIT",
  canEdgeCancel : false,
  canBeGrabbed : false,
  inGrab : true,
  init : function(p,input){
    player[p].actionState = "CAPTUREWAIT";
    player[p].timer = 0;
    const grabbedBy = player[p].phys.grabbedBy;
    if(grabbedBy === -1){
      return;
    }
    player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face),player[grabbedBy].phys.pos.y);
    actionStates[characterSelections[p]].CAPTUREWAIT.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].CAPTUREWAIT.interrupt(p,input)){
      player[p].phys.stuckTimer--;
      if (mashOut(p,input)){
        player[p].phys.stuckTimer -= 3;
        player[p].phys.pos.x += 0.5*Math.sign(Math.random()-0.5);
      }
      else {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        player[p].phys.pos.x = player[grabbedBy].phys.pos.x+(-9.04298*player[p].phys.face);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].phys.stuckTimer < 0){
      const grabbedBy = player[p].phys.grabbedBy;
      if(grabbedBy === -1){
        return;
      }
      actionStates[characterSelections[p]].CATCHCUT.init(grabbedBy,input);
      actionStates[characterSelections[p]].CAPTURECUT.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].CAPTUREWAIT){
      actionStates[characterSelections[p]].CAPTUREWAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

