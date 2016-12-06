import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections,  player} from "main/main";
import {sounds} from "main/sfx";

import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "DOWNBOUND",
  canEdgeCancel : true,
  disableTeeter : true,
  canBeGrabbed : false,
  downed : true,
  init : function(p){
    player[p].actionState = "DOWNBOUND";
    player[p].timer = 0;
    player[p].phys.kVel.y = 0;
    player[p].phys.jabReset = false;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    actionStates[characterSelections[p]].DOWNBOUND.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].DOWNBOUND.interrupt(p)){
      if (player[p].timer == 1){
        reduceByTraction(p,true);
      }
      else {
        player[p].phys.cVel.x = 0;
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > framesData[characterSelections[p]].DOWNBOUND){
      actionStates[characterSelections[p]].DOWNWAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }
};

