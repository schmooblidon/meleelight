
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
    const grabbing = player[p].phys.grabbing;
    if(grabbing === -1){
      return;
    }
    actionStates[characterSelections[grabbing]].THROWNFOXUP.init(grabbing,input);
    turnOffHitboxes(p);
    const frame = framesData[characterSelections[grabbing]].THROWNFOXUP;
    player[p].phys.releaseFrame = frame+1;
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
    this.main(p,input);
  },
  main : function(p,input){
    const prevFrame = player[p].timer;
    player[p].timer+=7/player[p].phys.releaseFrame;
    if (!this.interrupt(p,input)){
      if (prevFrame < 13 && player[p].timer >= 13){
        sounds.foxlasercock.play();
      }
      else if (prevFrame < 16 && player[p].timer >= 16){
        articles.LASER.init({
          p: p,
          x: 1.6,
          y: 18,
          rotate: Math.PI * 85 / 180
        });
        // rotate 85
        sounds.foxlaserfire.play();
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(1.6*player[p].phys.face),player[p].phys.pos.y+18),
          face:player[p].phys.face,
          f:Math.PI*85/180,
          color1:{r:255,g:59,b:59},
          color2:{r:255,g:57,b:87}
        });
      }
      else if (prevFrame < 18 && player[p].timer >= 18){
        articles.LASER.init({
          p: p,
          x: 0.5,
          y: 18,
          rotate: Math.PI / 2
        });
        // rotate 90
        sounds.foxlaserfire.play();
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(0.5*player[p].phys.face),player[p].phys.pos.y+18),
          face:player[p].phys.face,
          f:Math.PI/2,
          color1:{r:255,g:59,b:59},
          color2:{r:255,g:57,b:87}
        });
      }
      else if (prevFrame < 21 && player[p].timer >= 21){
        articles.LASER.init({
          p: p,
          x: 0,
          y: 18,
          rotate: Math.PI * 87 / 180
        });
        // rotate 87
        sounds.foxlaserfire.play();
        drawVfx({
          name:"laser",
          pos:new Vec2D(player[p].phys.pos.x+(0*player[p].phys.face),player[p].phys.pos.y+18),
          face:player[p].phys.face,
          f:Math.PI*87/180,
          color1:{r:255,g:59,b:59},
          color2:{r:255,g:57,b:87}
        });
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
    if (player[p].timer > 43){
      player[p].phys.grabbing = -1;
      WAIT.init(p,input);
      return true;
    }
    else {
      const grabbing = player[p].phys.grabbing;
      if(grabbing === -1){
        return;
      }
      if (player[p].timer < player[p].phys.releaseFrame && player[grabbing].phys.grabbedBy !== p){
        CATCHCUT.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
  }
};
