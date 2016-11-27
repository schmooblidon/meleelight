/* globals player, stage, Vec2D, airDrift, fastfall */

import FALL from "characters/shared/moves/FALL";

export default {
  name : "CLIFFJUMPSLOW",
  offset : [[-70.24197,-14.37161],[-70.01204,-14.25485],[-69.68486,-14.01434],[-69.31504,-13.61466],[-68.9572,-13.0204],[-68.66598,-12.19617],[-68.49598,-11.10656],[-68.49598,-8.58951],[-69.17776,-4.88456],[-68.95471,-2.05875],[-68.61933,-0.74366],[-68.49973,-0.30766],[-68.72181,-0.92297],[-69.22082,-2.17673],[-69.18517,-2.92594],[-69.0908,-3.15013],[-69.0474,-3.24815],[-69.17303,-2.92594],[-69.01739,-1.4797]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFJUMPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 19;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      const x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 20){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      if (player[p].timer === 20){
        player[p].phys.cVel = new Vec2D(1.1*player[p].phys.face,4);
      }
      if (player[p].timer > 20){
        airDrift(p);
        fastfall(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 51){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      FALL.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
