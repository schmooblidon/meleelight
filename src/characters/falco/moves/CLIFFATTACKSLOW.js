
import WAIT from "characters/shared/moves/WAIT";
import {player, characterSelections} from "main/main";
import {turnOffHitboxes, randomShout} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFATTACKSLOW",
  offset : [[-70.6,-16.31],[-70.6,-16.09],[-70.6,-15.85],[-70.6,-15.61],[-70.6,-15.38],[-70.6,-15.17],[-70.6,-15.00],[-70.6,-14.89],[-70.6,-14.85],[-70.6,-14.85],[-70.6,-14.85],[-70.6,-14.85],[-70.6,-14.85],[-70.6,-14.85],[-70.6,-14.85],[-70.6,-14.85],[-70.6,-14.85],[-70.6,-14.84],[-70.6,-14.80],[-70.6,-14.74],[-70.6,-14.66],[-70.6,-14.56],[-70.6,-14.44],[-70.6,-14.30],[-70.6,-14.14],[-70.6,-13.97],[-70.6,-13.78],[-70.6,-13.58],[-70.6,-13.36],[-70.6,-13.13],[-70.6,-12.89],[-70.6,-12.63],[-70.6,-12.37],[-70.6,-12.1],[-70.6,-11.82],[-70.6,-11.52],[-70.6,-11.21],[-70.6,-10.87],[-70.6,-10.52],[-70.6,-10.14],[-70.6,-9.73],[-70.6,-9.30],[-70.6,-8.83],[-70.6,-8.33],[-70.6,-7.79],[-70.6,-7.22],[-70.6,-6.6],[-70.44,-5.67],[-70.02,-4.32],[-69.49,-2.82],[-68.96,-1.43],[-68.56,-0.40],[-68.24,0]],
  setVelocities : [0.40,1.02,1.33,1.33,1.02,0.41,0,0,0,0,0,-0.18,-0.37,-0.40,-0.44,-0.43],
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "CLIFFATTACKSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 53;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupslow.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupslow.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ledgegetupslow.id1;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      const l = activeStage.ledge[player[p].phys.onLedge];
      const x = activeStage[l[0]][l[1]][l[2]].x;
      const y = activeStage[l[0]][l[1]][l[2]].y;
      if (player[p].timer < 54){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-54]*player[p].phys.face;
      }
      if (player[p].timer === 54){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer === 57){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        randomShout(characterSelections[p]);
      }
      else if (player[p].timer > 57 && player[p].timer < 60){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 60){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 69){
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
