
import WAIT from "characters/shared/moves/WAIT";
import {player, characterSelections} from "main/main";
import {turnOffHitboxes, randomShout} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFATTACKQUICK",
  offset : [[-71.04,-15.95],[-71.70,-14.85],[-72.18,-13.83],[-72.61,-12.68],[-72.8,-11],[-72.8,-7.73],[-72.8,-4.4],[-71.39,-2.28],[-68.40,-0.66],[-62.95,0]],
  setVelocities : [0.22,0.04,1.83,2.20,2.43,2.54,2.51,2.35,2.06,1.63,1.08,0.39,0,0,0,-0.39,-0.71,-0.86,-1.25,-1.54,-1.74,-1.85,-1.86,-1.78,-1.62,-1.35,-1.00,-0.79,-0.74,-0.62,-0.43],
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "CLIFFATTACKQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 15;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupquick.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupquick.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ledgegetupquick.id2;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      const l = activeStage.ledge[player[p].phys.onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 24){
        if (player[p].timer >= 14){
          player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-14][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-14][1]);
        }
      }
      else {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-24]*player[p].phys.face;
      }
      if (player[p].timer === 24){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer === 25){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
        randomShout(characterSelections[p]);
      }
      else if (player[p].timer > 25 && player[p].timer < 35){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 35){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 54){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }

};
