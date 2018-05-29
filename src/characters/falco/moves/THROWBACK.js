
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
  name : "THROWBACK",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "THROWBACK";
    player[p].timer = 0;
    actionStates[characterSelections[player[p].phys.grabbing]].THROWNFALCOBACK.init(player[p].phys.grabbing);
    const frame = framesData[characterSelections[player[p].phys.grabbing]].THROWNFALCOBACK;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwback.id0;
    randomShout(characterSelections[p]);
    this.main(p,input);
  },
  main : function(p,input){
    const prevFrame = player[p].timer;
    player[p].timer+=9/player[p].phys.releaseFrame;
    if (!this.interrupt(p,input)){
      if (prevFrame < 10 && player[p].timer >= 10){
        player[p].phys.face *= -1;
      }
      if (prevFrame < 14 && player[p].timer >= 14){
        sounds.foxlasercock.play();
      }
      if (prevFrame < 15 && player[p].timer >= 15){
        articles.LASER.init({
          p: p,
          x: 5.2,
          y: 10,
          rotate: Math.PI * 0.22,
          isFox: false
        });
        sounds.foxlaserfire.play();
        // 135
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(5.2*player[p].phys.face),player[p].phys.pos.y+10),
          face:player[p].phys.face,
          f:Math.PI*0.22,
          color1:{r:137, g:255, b:255},
          color2:{r:157, g:255, b:255}
        });
      }
      else if (prevFrame < 18 && player[p].timer >= 18){
        articles.LASER.init({
          p: p,
          x: 5.4,
          y: 9.7,
          rotate: Math.PI * 0.20,
          isFox: false
        });
        sounds.foxlaserfire.play();
        // 135
        drawVfx({
          name:"laser",
          pos: new Vec2D(player[p].phys.pos.x+(5.4*player[p].phys.face),player[p].phys.pos.y+9.7),
          face: player[p].phys.face,
          f:Math.PI*0.20,
          color1:{r:137, g:255, b:255},
          color2:{r:157, g:255, b:255}
        });
      }
      else if (prevFrame < 21 && player[p].timer >= 21){
        articles.LASER.init({
          p: p,
          x: 5.3,
          y: 9.8,
          rotate: Math.PI * 0.22,
          isFox: false
        });
        sounds.foxlaserfire.play();
        // 135
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(5.3*player[p].phys.face),player[p].phys.pos.y+9.8),
          face:player[p].phys.face,
          f:Math.PI*0.22,
          color1:{r:137, g:255, b:255},
          color2:{r:157, g:255, b:255}
        });
      }
      if (Math.floor(player[p].timer+0.01) >= 9 && prevFrame < 9){
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
