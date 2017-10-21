import {mashOut, reduceByTraction, actionStates} from "physics/actionStateShortcuts";

import {characterSelections,  player} from "main/main";
import {sounds} from "main/sfx";
import {drawVfx} from "main/vfx/drawVfx";
import {actionSounds, framesData} from "../../../main/characters";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name : "FURAFURA",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "FURAFURA";
    player[p].timer = 0;
    player[p].phys.stuckTimer = 490;
    drawVfx({
      name: "furaFura",
      pos: new Vec2D(player[p].phys.pos.x + (4 + Math.random() * 2) * player[p].phys.face, player[p].phys.pos.y + 11 + Math.random() * 3),
      face: player[p].phys.face
    });
    player[p].furaLoopID = sounds.furaloop.play();
    actionStates[characterSelections[p]].FURAFURA.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].FURAFURA.interrupt(p,input)){
      if (player[p].timer % 100 === 65){
        sounds[actionSounds[characterSelections[p]].FURAFURA[0][1]].play();
      }
      reduceByTraction(p,true);
      if (player[p].timer % 49 === 0){
        drawVfx({
          name: "furaFura",
          pos: new Vec2D(player[p].phys.pos.x + (3 + Math.random() * 2) * player[p].phys.face, player[p].phys.pos.y + 11 + Math.random() * 3),
          face: player[p].phys.face
        });
      }
      if (player[p].timer % 49 === 20){
        drawVfx({
          name: "furaFura",
          pos: new Vec2D(player[p].phys.pos.x + (5 + Math.random() * 2) * player[p].phys.face, player[p].phys.pos.y + 8 + Math.random() * 3),
          face: player[p].phys.face
        });
      }
      if (player[p].phys.shieldHP > 30){
        player[p].phys.shieldHP = 30;
      }
      player[p].phys.stuckTimer--;
      if (mashOut(p,input)){
        player[p].phys.stuckTimer -= 3;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].phys.stuckTimer <= 0){
      sounds.furaloop.stop(player[p].furaLoopID);
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else if (player[p].timer > framesData[characterSelections[p]].FURAFURA){
      player[p].timer = 1;
      return false;
    }
    else {
      return false;
    }
  }
};

