import {reduceByTraction, aS} from "physics/actionStateShortcuts";
import {cS,  player} from "main/main";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "LANDINGATTACKAIRB",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "LANDINGATTACKAIRB";
    player[p].timer = 0;
    if (player[p].phys.lCancel){
      player[p].phys.landingLagScaling = 2;
    }
    else {
      player[p].phys.landingLagScaling = 1;
    }
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    sounds.land.play();
    aS[cS[p]].LANDINGATTACKAIRB.main(p);
  },
  main : function(p){
    player[p].timer += player[p].phys.landingLagScaling;
    if (!aS[cS[p]].LANDINGATTACKAIRB.interrupt(p)){
      reduceByTraction(p,true);
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[cS[p]].LANDINGATTACKAIRB){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
