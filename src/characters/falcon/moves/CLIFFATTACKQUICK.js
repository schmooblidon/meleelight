
import WAIT from "characters/shared/moves/WAIT";
import {player, characterSelections} from "main/main";
import {turnOffHitboxes, randomShout} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFATTACKQUICK",
  offset : [[-70.79152,-21.52067],[-70.72434,-19.80744],[-70.65362,-18.01121],[-70.58200,-16.18664],[-70.51216,-14.38838],[-70.44677,-12.67110],[-70.38850,-11.08945],[-70.34000,-9.69811],[-70.31597,-8.92615],[-70.31864,-8.75587],[-70.33199,-8.57171],[-70.34,-7.75811],[-70.38042,-5.80589],[-70.44778,-3.15836],[-70.46126,-0.62868],[-70.34,0.97],[-70.12101,1.43812],[-69.86411,1.30101],[-69.52269,0.83284],[-69.05019,0.30778],[-67.74982,0]],
  setVelocities : [1.00038,1.31691,1.37077,1.16194,0.79036,0.57482,0.57482,0.74247,0.74248,0.45505,0],
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
      const onLedge = player[p].phys.onLedge;
      if(onLedge === -1){
        this.canGrabLedge = false;
        return;
      }
      const l = activeStage.ledge[onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 22){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      else {
        if (player[p].timer < 33) {
          player[p].phys.cVel.x = this.setVelocities[player[p].timer-22]*player[p].phys.face;
        }
      }
      if (player[p].timer === 22){
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
