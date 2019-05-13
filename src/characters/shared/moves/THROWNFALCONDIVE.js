import {Vec2D} from "main/util/Vec2D";
import {player, characterSelections} from "main/main";
import {actionStates} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "THROWNFALCONDIVE",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  wallJumpAble: false,
  reverseModel: false,
  init : function(p,input){
    player[p].actionState = "THROWNFALCONDIVE";
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.grounded = false;
    player[p].timer = 0;
    drawVfx({
      name: "tech",
      pos: new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y + 10)
    });
    actionStates[characterSelections[p]].THROWNFALCONDIVE.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    player[p].phys.kVel = new Vec2D(0, 0);
    if (!actionStates[characterSelections[p]].THROWNFALCONDIVE.interrupt(p,input)){
    }
  },
  interrupt : function(p,input){
    return false;
  }
};
