
import SIDESPECIALAIR from "characters/falco/moves/SIDESPECIALAIR";
import WAIT from "characters/shared/moves/WAIT";
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
      if (player[p].timer === 16){
        sounds.phantasm.play();
        sounds.phantasmshout.play();
      }

      if (player[p].timer === 17) {
        player[p].phys.cVel.x = 16.50*player[p].phys.face;
      }

      if (player[p].timer === 18){
        articles.ILLUSION.init(p,0,false);
        if ((input[p][0].b || input[p][1].b) && !input[p][2].b){
          player[p].timer = 20;
        }
      }
      else if (player[p].timer >= 16 && player[p].timer < 20){
        if (input[p][0].b && !input[p][1].b){
          player[p].timer = 20;
        }
      }
      if (player[p].timer === 20){
        player[p].phys.cVel.x = 1.5*player[p].phys.face;
      }
      if (player[p].timer > 20){
        player[p].phys.cVel.x -= 0.1*player[p].phys.face;
        if (player[p].phys.cVel.x*player[p].phys.face < 0) {
          player[p].phys.cVel.x = 0;
        }
      }

      if (player[p].timer >= 18 && player[p].timer <= 21){
        drawVfx("phantasm",player[p].phys.posPrev,player[p].phys.face);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 59){
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
