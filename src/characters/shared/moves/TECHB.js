import {executeIntangibility, aS} from "physics/actionStateShortcuts";
import {cS, drawVfx, player} from "main/main";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
export default {
  name : "TECHB",
  canEdgeCancel : false,
  canBeGrabbed : true,
  setVelocities : [],
  init : function(p){
    player[p].actionState = "TECHB";
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    aS[cS[p]].TECHB.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].TECHB.interrupt(p)){
      executeIntangibility("TECHB",p);
      player[p].phys.cVel.x = aS[cS[p]].TECHB.setVelocities[player[p].timer-1]*player[p].phys.face;
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[cS[p]].TECHB){
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

