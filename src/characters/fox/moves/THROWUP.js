/* globals player, aS, cS, turnOffHitboxes, drawVfx, Vec2D, sounds, frames, articles, hitQueue */

import WAIT from "characters/shared/moves/WAIT";
import CATCHCUT from "characters/shared/moves/CATCHCUT";

export default {
  name : "THROWUP",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "THROWUP";
    player[p].timer = 0;
    aS[cS[player[p].phys.grabbing]].THROWNFOXUP.init(player[p].phys.grabbing);
    turnOffHitboxes(p);
    const frame = frames[cS[player[p].phys.grabbing]].THROWNFOXUP;
    player[p].phys.releaseFrame = frame+1;
    player[p].hitboxes.id[0] = player[p].charHitboxes.throwup.id0;
    this.main(p);
  },
  main : function(p){
    const prevFrame = player[p].timer;
    player[p].timer+=7/player[p].phys.releaseFrame;
    if (!this.interrupt(p)){
      if (prevFrame < 13 && player[p].timer >= 13){
        sounds.foxlasercock.play();
      }
      else if (prevFrame < 16 && player[p].timer >= 16){
        articles.LASER.init(p,1.6,18,Math.PI*85/180);
        // rotate 85
        sounds.foxlaserfire.play();
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(1.6*player[p].phys.face),player[p].phys.pos.y+18),player[p].phys.face,Math.PI*85/180);
      }
      else if (prevFrame < 18 && player[p].timer >= 18){
        articles.LASER.init(p,0.5,18,Math.PI/2);
        // rotate 90
        sounds.foxlaserfire.play();
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(0.5*player[p].phys.face),player[p].phys.pos.y+18),player[p].phys.face,Math.PI/2);
      }
      else if (prevFrame < 21 && player[p].timer >= 21){
        articles.LASER.init(p,0,18,Math.PI*87/180);
        // rotate 87
        sounds.foxlaserfire.play();
        drawVfx("laser",new Vec2D(player[p].phys.pos.x+(0*player[p].phys.face),player[p].phys.pos.y+18),player[p].phys.face,Math.PI*87/180);
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
  interrupt : function(p){
    if (player[p].timer > 33){
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
