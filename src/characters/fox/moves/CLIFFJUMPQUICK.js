
/* globals player, stage, Vec2D, airDrift, fastfall */
import FALL from "characters/shared/moves/FALL";

export default {
  name : "CLIFFJUMPQUICK",
  offset : [[-70.8428,-14.38776],[-71.49446,-14.32052],[-72.19153,-14.1652],[-72.85054,-13.88868],[-73.38803,-13.45787],[-73.72054,-12.83965],[-73.76461,-12.00094],[-73.50131,-10.89611],[-73.00593,-9.5458],[-72.33633,-8.01628],[-71.55035,-6.37383],[-70.70587,-4.6847],[-69.86075,-3.01518],[-69.07284,-1.43152]],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFJUMPQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 14;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      const x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 15){
        player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-1][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-1][1]);
      }
      if (player[p].timer === 15){
        player[p].phys.cVel = new Vec2D(1.1*player[p].phys.face,4);
      }
      if (player[p].timer > 15){
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
