
import WAIT from "characters/shared/moves/WAIT";
import CATCHCUT from "characters/shared/moves/CATCHCUT";
import {framesData} from "main/characters";
import { characterSelections, player} from "main/main";
import {articles} from "physics/article";
import {sounds} from "main/sfx";
import {turnOffHitboxes, actionStates} from "physics/actionStateShortcuts";

import {hitQueue} from 'physics/hitDetection';
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "THROWUP",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "THROWUP";
    player[p].timer = 0;
    actionStates[characterSelections[player[p].phys.grabbing]].THROWNFALCOUP.init(player[p].phys.grabbing,input);
    turnOffHitboxes(p);
    const frame = framesData[characterSelections[player[p].phys.grabbing]].THROWNFALCOUP;
    player[p].phys.releaseFrame = frame+1;
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
    this.main(p,input);
  },
  main : function(p,input){
    const prevFrame = player[p].timer;
    player[p].timer+=7/player[p].phys.releaseFrame;
    if (!this.interrupt(p,input)){
      if (prevFrame < 14 && player[p].timer >= 14){
        sounds.foxlasercock.play();
      }
      if (prevFrame < 18 && player[p].timer >= 18){
        articles.LASER.init(p,0,18,Math.PI/2,false);
        sounds.foxlaserfire.play();
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(0*player[p].phys.face),player[p].phys.pos.y+18),player[p].phys.face,Math.PI/2);
      }
      else if (prevFrame < 20 && player[p].timer >= 20){
        articles.LASER.init(p,0,18,Math.PI/2,false);
        // rotate 90
        sounds.foxlaserfire.play();
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(0*player[p].phys.face),player[p].phys.pos.y+18),player[p].phys.face,Math.PI/2);
      }
      else if (prevFrame < 24 && player[p].timer >= 24){
        articles.LASER.init(p,0,18,Math.PI/2,false);
        sounds.foxlaserfire.play();
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(0*player[p].phys.face),player[p].phys.pos.y+18),player[p].phys.face,Math.PI/2);
      }
      else if (prevFrame < 33 && player[p].timer >= 33){
        sounds.foxlaserholster.play();
      }
      if (Math.floor(player[p].timer+0.01) === 7){
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }

    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 38){
      player[p].phys.grabbing = -1;
      WAIT.init(p,input);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy !== p){
      CATCHCUT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
