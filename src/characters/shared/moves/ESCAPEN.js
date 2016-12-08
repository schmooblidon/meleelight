import {executeIntangibility, reduceByTraction, playSounds, aS} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {cS,  player} from "main/main";
import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "ESCAPEN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "ESCAPEN";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    aS[cS[p]].ESCAPEN.main(p);
  },
  main : function(p){
    player[p].timer++;
    playSounds("ESCAPEN",p);
    if (!aS[cS[p]].ESCAPEN.interrupt(p)){
      if (player[p].timer == 1){
        sounds.spotdodge.play();
      }
      reduceByTraction(p,true);
      executeIntangibility("ESCAPEN",p);
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[cS[p]].ESCAPEN){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

