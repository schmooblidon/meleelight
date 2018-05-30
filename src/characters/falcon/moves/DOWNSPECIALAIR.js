/* eslint-disable */
import DOWNSPECIALAIRENDAIR from "characters/falcon/moves/DOWNSPECIALAIRENDAIR";
import DOWNSPECIALAIRENDGROUND from "characters/falcon/moves/DOWNSPECIALAIRENDGROUND";
import WAIT from "characters/shared/moves/WAIT";
import FALL from "characters/shared/moves/FALL";
import {player} from "main/main";
import {sounds} from "main/sfx";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {gameSettings} from "settings";

export default {
  name : "DOWNSPECIALAIR",
  setVelocities : [[-0.31605,0.20183],[-0.36565,0.27723],[-0.21252,0.33551],[0.24607,0.37668],[0.24607,0.40073],[0.24607,0.40766],[0.24607,0.39748],[0.24607,0.37018],[0.24607,0.32577],[0.24607,0.26424],[0.24607,0.18559],[0.24607,0.08983],[0.24607,-0.02305],[0.24607,-0.15304],[0.24607,-0.30015],[0.24607,-0.46438]],
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  init : function(p,input){
    player[p].actionState = "DOWNSPECIALAIR";
    player[p].timer = 0;
    player[p].phys.fastfalled = false;
    player[p].phys.cVel.y = 0;
    player[p].phys.cVel.x = 0;
    player[p].hitboxes.id[0] = player[p].charHitboxes.falconkickairClean.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.falconkickairClean.id1;
    sounds.falconkickshout.play();
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer < 17) {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-1][0] * player[p].phys.face;
        player[p].phys.cVel.y = this.setVelocities[player[p].timer-1][1];
      }
      else {
        player[p].phys.cVel.x = 1.22542 * player[p].phys.face;
        player[p].phys.cVel.y = -3.81748;
        if (player[p].timer%2){
          drawVfx({
            name: "firefoxtail",
            pos: new Vec2D(player[p].phys.pos.x+3*player[p].phys.face,player[p].phys.pos.y-7),
            face: player[p].phys.face
          });
        }
      }
      if (player[p].timer === 15){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        sounds.falconkick.play();
      }
      if (player[p].timer > 15 && player[p].timer < 30){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 18){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.falconkickairMid.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.falconkickairMid.id1;
      }
      if (player[p].timer === 26){
        player[p].hitboxes.active = [true,true,false,false];
        player[p].hitboxes.frame = 0;
        player[p].hitboxes.id[0] = player[p].charHitboxes.falconkickairLate.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.falconkickairLate.id1;
      }
      if (player[p].timer === 30){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 29){
      DOWNSPECIALAIRENDAIR.init(p,input);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    DOWNSPECIALAIRENDGROUND.init(p,input);
  }
};
