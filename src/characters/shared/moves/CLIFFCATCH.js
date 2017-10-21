import {playSounds, actionStates, turnOffHitboxes} from "physics/actionStateShortcuts";
import {characterSelections,  player} from "main/main";
import {drawVfx} from "main/vfx/drawVfx";
import {activeStage} from "stages/activeStage";
import {Vec2D} from "../../../main/util/Vec2D";
import {framesData} from "../../../main/characters";
export default {
  name : "CLIFFCATCH",
  canGrabLedge : false,
  canBeGrabbed : false,
  posOffset : [],
  landType : 0,
  init : function(p,input){
    player[p].actionState = "CLIFFCATCH";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.x = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.thrownHitbox = false;
    player[p].phys.fastfalled = false;
    player[p].phys.doubleJumped = false;
    player[p].phys.jumpsUsed = 0;
    player[p].phys.intangibleTimer = 38;
    player[p].phys.ledgeHangTimer = 0;
    player[p].rotation = 0;
    player[p].rotationPoint = new Vec2D(0,0);
    player[p].colourOverlayBool = false;
    player[p].phys.chargeFrames = 0;
    player[p].phys.charging = false;
    turnOffHitboxes(p);
    const l = activeStage.ledge[player[p].phys.onLedge];
    drawVfx({
      name: "cliffcatchspark",
      pos: new Vec2D(activeStage[l[0]][l[1]][l[2]].x, activeStage[l[0]][l[1]][l[2]].y),
      face: player[p].phys.face
    });
    actionStates[characterSelections[p]].CLIFFCATCH.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("CLIFFCATCH",p);
    if (!actionStates[characterSelections[p]].CLIFFCATCH.interrupt(p,input)){
      const l = activeStage.ledge[player[p].phys.onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      player[p].phys.pos = new Vec2D(x+(actionStates[characterSelections[p]].CLIFFCATCH.posOffset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+actionStates[characterSelections[p]].CLIFFCATCH.posOffset[player[p].timer-1][1]);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].CLIFFCATCH){
      actionStates[characterSelections[p]].CLIFFWAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

