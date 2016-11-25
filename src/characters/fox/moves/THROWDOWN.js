/* globals player, aS, cS, turnOffHitboxes, frames, randomShout, hitQueue,
Vec2D, articles, drawVfx, sounds */

import WAIT from "characters/shared/moves/WAIT";
import CATCHCUT from "characters/shared/moves/CATCHCUT";

export default {
  name : "THROWDOWN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWDOWN";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNFOXDOWN.init(player[p].phys.grabbing);
    const frame = frames[cS[player[p].phys.grabbing]].THROWNFOXDOWN;
    player[p].phys.releaseFrame = frame+1;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
    randomShout(cS[p]);
    this.main(p);
  },
  main : function(p){
    const prevFrame = player[p].timer;
    player[p].timer+=33/player[p].phys.releaseFrame;
    if (!this.interrupt(p)){
      if (Math.floor(player[p].timer+0.01) === 33){
        player[p].hitboxes.id[0] = player[p].charHitboxes.throwdown.id0;
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,true]);
        turnOffHitboxes(p);
      }

      if (prevFrame < 23 && player[p].timer >= 23){
        articles.LASER.init(p,1,12,Math.PI*275/180);
        sounds.foxlaserfire.play();
        // 275
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(1*player[p].phys.face),player[p].phys.pos.y+12),player[p].phys.face,Math.PI*275/180);
      }
      else if (prevFrame < 25 && player[p].timer >= 25){
        articles.LASER.init(p,1,16,Math.PI*260/180);
        sounds.foxlaserfire.play();
        // 260
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(1*player[p].phys.face),player[p].phys.pos.y+16),player[p].phys.face,Math.PI*260/180);
      }
      else if (prevFrame < 28 && player[p].timer >= 28){
        articles.LASER.init(p,2,15,Math.PI*290/180);
        sounds.foxlaserfire.play();
        // 290
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(2*player[p].phys.face),player[p].phys.pos.y+15),player[p].phys.face,Math.PI*290/180);
      }
      else if (prevFrame < 31 && player[p].timer >= 31){
        articles.LASER.init(p,2,17,Math.PI*275/180);
        sounds.foxlaserfire.play();
        // 275
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(2*player[p].phys.face),player[p].phys.pos.y+17),player[p].phys.face,Math.PI*275/180);
      }

    }
  },
  interrupt : function(p){
    if (player[p].timer > 43){
      player[p].phys.grabbing = -1;
      WAIT.init(p);
      return true;
    }
    else if (player[p].timer < player[p].phys.releaseFrame && player[player[p].phys.grabbing].phys.grabbedBy !== p){
      CATCHCUT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};
