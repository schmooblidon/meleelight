/* globals player, stage, Vec2D */

import WAIT from "characters/shared/moves/WAIT";

export default {
  name : "CLIFFESCAPESLOW",
  offset : [[-70.32,-14.23684],[-70.32,-14.04406],[-70.32,-13.83467],[-70.32,-13.62174],[-70.32,-13.41828],[-70.32,-13.23734],[-70.32,-13.09195],[-70.32,-12.99516],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.96],[-70.32,-12.94646],[-70.32,-12.90716],[-70.32,-12.84404],[-70.32,-12.75909],[-70.32,-12.65426],[-70.32,-12.53151],[-70.32,-12.3928],[-70.32,-12.24],[-70.32,-12.07538],[-70.32,-11.90058],[-70.32,-11.71768],[-70.32,-11.52864],[-70.32,-11.33542],[-70.32,-11.13999],[-70.32,-10.94429],[-70.32,-10.75031],[-70.32,-10.56],[-70.32,-10.33863],[-70.32,-10.05937],[-70.32,-9.73605],[-70.32,-9.3825],[-70.32,-9.01255],[-70.32,-8.64],[-70.32,-8.29058],[-70.32,-7.96354],[-70.32,-7.63306],[-70.32,-7.27329],[-70.32,-6.85842],[-70.32,-6.3626],[-70.32,-5.76],[-70.17775,-4.87171],[-69.82212,-3.67591],[-69.35983,-2.38155],[-68.89757,-1.19796],[-68.54206,-0.33436],[-68.25794,0]],
  setVelocities : [0.48879,1.49473,2.5425,3.63211,2.55094,2.41367,2.27723,2.14161,2.00682,1.87285,1.7397,1.60738,1.47588,1.34521,1.21536,1.08633,0.95814,0.83076,0.67258,0.49966,0.35163,0.22852,0.13032,0.05701,0.00862,-0.01488],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFESCAPESLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 62;
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
    }
  },
  interrupt : function(p){
    if (player[p].timer > 79){
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
