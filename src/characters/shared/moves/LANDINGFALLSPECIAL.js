import {reduceByTraction, aS} from "physics/actionStateShortcuts";
import {cS, drawVfx, player} from "main/main";
import {sounds} from "main/sfx";
export default {
  name : "LANDINGFALLSPECIAL",
  canEdgeCancel : true,
  canGrabLedge : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDINGFALLSPECIAL";
    player[p].timer = 0;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[cS[p]].LANDINGFALLSPECIAL.main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingMultiplier;
    if (!aS[cS[p]].LANDINGFALLSPECIAL.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > 30){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
