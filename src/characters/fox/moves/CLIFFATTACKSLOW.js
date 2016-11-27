/* globals player, stage, cS, Vec2D, sounds, randomShout, turnOffHitboxes */

import WAIT from "characters/shared/moves/WAIT";

export default {
  name : "CLIFFATTACKSLOW",
  offset : [[-70.32,-14.23684],[-70.32,-14.04406],[-70.32,-13.83467],[-70.32,-13.62174],[-70.32,-13.41828],[-70.32,-13.23734],[-70.32,-13.09195],[-70.32,-12.99516],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.94935],[-70.32,-12.91799],[-70.32,-12.86679],[-70.32,-12.79665],[-70.32,-12.70842],[-70.32,-12.603],[-70.32,-12.48127],[-70.32,-12.3441],[-70.32,-12.19237],[-70.32,-12.02697],[-70.32,-11.84876],[-70.32,-11.65864],[-70.32,-11.45747],[-70.32,-11.24615],[-70.32,-11.02554],[-70.32,-10.79653],[-70.32,-10.56],[-70.32,-10.31413],[-70.32,-10.05515],[-70.32,-9.78105],[-70.32,-9.48977],[-70.32,-9.17929],[-70.32,-8.84757],[-70.32,-8.49258],[-70.32,-8.11228],[-70.32,-7.70465],[-70.32,-7.26763],[-70.32,-6.79921],[-70.32,-6.29734],[-70.32,-5.76],[-70.17651,-4.94739],[-69.81816,-3.77266],[-69.35315,-2.46318],[-68.88966,-1.24633],[-68.53587,-0.34948],[-68.26413,0]],
  setVelocities : [0.34921,0.88711,1.15682,1.15835,0.89168,0.35682,0,0,0,0,0,-0.16,-0.32,-0.350399,-0.385,-0.37701],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFATTACKSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 53;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupslow.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupslow.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ledgegetupslow.id1;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      const x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 54){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-54]*player[p].phys.face;
      }
      if (player[p].timer === 54){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer === 57){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        randomShout(cS[p]);
      }
      else if (player[p].timer > 57 && player[p].timer < 60){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 60){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 69){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
