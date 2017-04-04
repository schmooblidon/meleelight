
import WAIT from "characters/shared/moves/WAIT";
import CATCHCUT from "characters/shared/moves/CATCHCUT";
import {framesData} from "main/characters";
import { characterSelections, player} from "main/main";
import {sounds} from "main/sfx";
import {articles} from "physics/article";
import {randomShout, turnOffHitboxes, actionStates} from "physics/actionStateShortcuts";

import {hitQueue} from 'physics/hitDetection';
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "THROWDOWN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "THROWDOWN";
    player[p].timer = 0;
    actionStates[characterSelections[player[p].phys.grabbing]].THROWNFOXDOWN.init(player[p].phys.grabbing);
    const frame = framesData[characterSelections[player[p].phys.grabbing]].THROWNFOXDOWN;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
    randomShout(characterSelections[p]);
    this.main(p,input);
  },
  main : function(p,input){
    const prevFrame = player[p].timer;
    player[p].timer+=33/player[p].phys.releaseFrame;
    if (!this.interrupt(p,input)){
      if (Math.floor(player[p].timer+0.01) === 33){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

      if (prevFrame < 23 && player[p].timer >= 23){
        articles.LASER.init({
          p: p,
          x: 1,
          y: 12,
          rotate: Math.PI * 275 / 180
        });
        sounds.foxlaserfire.play();
        // 275
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(1*player[p].phys.face),player[p].phys.pos.y+12),
          face:player[p].phys.face,
          f:Math.PI*275/180,
          color1:{r:255,g:59,b:59},
          color2:{r:255,g:57,b:87}
        });
      }
      else if (prevFrame < 25 && player[p].timer >= 25){
        articles.LASER.init({
          p: p,
          x: 1,
          y: 16,
          rotate: Math.PI * 260 / 180
        });
        sounds.foxlaserfire.play();
        // 260
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(1*player[p].phys.face),player[p].phys.pos.y+16),
          face:player[p].phys.face,
          f:Math.PI*260/180,
          color1:{r:255,g:59,b:59},
          color2:{r:255,g:57,b:87}
        });
      }
      else if (prevFrame < 28 && player[p].timer >= 28){
        articles.LASER.init({
          p: p,
          x: 2,
          y: 15,
          rotate: Math.PI * 290 / 180
        });
        sounds.foxlaserfire.play();
        // 290
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(2*player[p].phys.face),player[p].phys.pos.y+15),
          face:player[p].phys.face,
          f:Math.PI*290/180,
          color1:{r:255,g:59,b:59},
          color2:{r:255,g:57,b:87}
        });
      }
      else if (prevFrame < 31 && player[p].timer >= 31){
        articles.LASER.init({
          p: p,
          x: 2,
          y: 17,
          rotate: Math.PI * 275 / 180
        });
        sounds.foxlaserfire.play();
        // 275
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(2*player[p].phys.face),player[p].phys.pos.y+17),
          face:player[p].phys.face,
          f:Math.PI*275/180,
          color1:{r:255,g:59,b:59},
          color2:{r:255,g:57,b:87}
        });
      }

    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 43){
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
