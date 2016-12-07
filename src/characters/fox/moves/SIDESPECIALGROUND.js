
import SIDESPECIALAIR from "characters/fox/moves/SIDESPECIALAIR";
import WAIT from "characters/shared/moves/WAIT";
import FALLSPECIAL from "characters/shared/moves/FALLSPECIAL";
import {articles} from "physics/article";
import {sounds} from "main/sfx";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
import { player} from "main/main";
import {drawVfx} from "main/vfx/drawVfx";

export default {
  name : "SIDESPECIALGROUND",
  canPassThrough : false,
  canEdgeCancel : true,
  disableTeeter : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  airborneState : "SIDESPECIALAIR",
  init : function(p,input){
    player[p].actionState = "SIDESPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.landingMultiplier = 1.5;
    drawVfx("dashDust",player[p].phys.pos,player[p].phys.face);
    turnOffHitboxes(p);
    sounds.star.play();
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].phys.grounded){
        if (player[p].timer === 21){
          articles.ILLUSION.init(p,1);
          player[p].phys.cVel.x = 18.72*player[p].phys.face;
          if ((input[p].b[0] || input[p].b[1]) && !input[p].b[2]){
            player[p].timer = 24;
          }
        }
        else if (player[p].timer === 22 || player[p].timer === 23){
          if (input[p].b[0] && !input[p].b[1]){
            player[p].timer = 24;
          }
        }
        if (player[p].timer === 24){
          player[p].phys.cVel.x = 2.1*player[p].phys.face;
        }
        if (player[p].timer > 24){
          player[p].phys.cVel.x -= 0.1*player[p].phys.face;
          if (player[p].phys.cVel.x*player[p].phys.face < 0){
            player[p].phys.cVel.x = 0;
          }
        }

        if (player[p].timer === 20){
          sounds.foxillusion1.play();
          sounds.foxillusion2.play();
        }
      }
      else {
        player[p].actionState = "SIDESPECIALAIR";
        player[p].timer--;
        SIDESPECIALAIR.main(p,input);
      }

      if (player[p].timer >= 21 && player[p].timer <= 24){
        drawVfx("illusion",player[p].phys.posPrev,player[p].phys.face);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 63){
      if (player[p].phys.grounded){
        WAIT.init(p,input);
      }
      else {
        FALLSPECIAL.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){

  }
};
