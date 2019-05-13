
import WAIT from "characters/shared/moves/WAIT";
import {player} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";

export default {
  name : "CLIFFGETUPSLOW",
  offset : [[-70.43436,-24.82925],[-70.54099,-24.38749],[-70.65172,-23.92874],[-70.75835,-23.48699],[-70.85271,-23.09623],[-70.85271,-23.09623],[-70.86757,-23.3207],[-70.85271,-23.09623],[-70.78938,-22.18307],[-70.71927,-21.24123],[-70.64391,-20.27354],[-70.5648,-19.28282],[-70.48347,-18.2719],[-70.40142,-17.2436],[-70.32018,-16.20073],[-70.24126,-15.14612],[-70.16619,-14.0826],[-70.09647,-13.01298],[-70.03361,-11.94009],[-69.97914,-10.86675],[-69.93457,-9.79578],[-69.90142,-8.73],[-69.93036,-7.57019],[-70.03811,-6.29246],[-70.17525,-5.01263],[-70.29235,-3.84654],[-70.34,-2.91],[-70.34827,-2.15466],[-70.36935,-1.45602],[-70.38699,-0.81569],[-70.38494,-0.23528],[-70.34696,0.28361],[-70.25681,0.73936],[-70.09824,1.13036],[-69.855,1.455],[-68.65326,0.81539],[-66.20674,0]],
  setVelocities : [0.33979,0.34951,0.35656,0.36092,0.3626,0.36159,0.35791,0.35154,0.34249,0.33075,0.31634,0.29924,0.27946,0.25699,0.23184,0.20402,0.1735,0.14031,0.10443,0.06587,0.02463],
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "CLIFFGETUPSLOW";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 49;
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
      if (player[p].timer < 38){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      else {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-38]*player[p].phys.face;
      }
      if (player[p].timer === 38){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [l[0] === "ground" ? 0 : 1, l[1]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 58){
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
