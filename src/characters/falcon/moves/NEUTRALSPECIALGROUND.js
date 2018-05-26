
import WAIT from "characters/shared/moves/WAIT";
import { player} from "main/main";
import {sounds} from "main/sfx";
import {reduceByTraction} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";

export default {
  name : "NEUTRALSPECIALGROUND",
  setVelocities : [1.40276,1.58423,1.6572,1.62165,1.47759,1.22502,0.86393,0.59178,0.48767,0.39373,0.30995,0.23633,0.17286,0.11956,0.07642,0.04343,0.02061,0.00795,0.00544,0.0071,0.00619,0.00532,0.00451,0.00375,0.00303,0.00238,0.00177,0.00121,0.0007,0.00025,-0.00015,-0.0005,-0.00081,-0.00106,-0.00125,-0.0014,-0.0015,-0.00154,-0.00153,-0.00148,-0.00137,-0.00121,-0.00099,-0.00073,-0.00042,-0.00005],
  canPassThrough : false,
  canEdgeCancel : false,
  disableTeeter : true,
  canBeGrabbed : true,
  airborneState : "NEUTRALSPECIALAIR",
  init : function(p,input){
    player[p].actionState = "NEUTRALSPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer >= 54) {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-54] * player[p].phys.face;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 99){
      WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};
