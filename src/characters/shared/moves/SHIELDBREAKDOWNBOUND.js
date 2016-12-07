import {reduceByTraction, actionStates} from "physics/actionStateShortcuts";
import {characterSelections,  player} from "main/main";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "SHIELDBREAKDOWNBOUND",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "SHIELDBREAKDOWNBOUND";
    player[p].timer = 0;
    player[p].phys.cVel.y = 0;
    player[p].phys.kVel.y = 0;
    drawVfx("groundBounce",player[p].phys.pos,player[p].phys.face);
    sounds.bounce.play();
    actionStates[characterSelections[p]].SHIELDBREAKDOWNBOUND.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].SHIELDBREAKDOWNBOUND.interrupt(p,input)){
      player[p].phys.intangibleTimer = 1;
      if (player[p].timer == 1){
        reduceByTraction(p,true);
      }
      else {
        player[p].phys.cVel.x = 0;
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].SHIELDBREAKDOWNBOUND){
      actionStates[characterSelections[p]].SHIELDBREAKSTAND.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

