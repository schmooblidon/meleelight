import {executeIntangibility, reduceByTraction, actionStates, playSounds} from "physics/actionStateShortcuts";
import {characterSelections,  player} from "main/main";
import {sounds} from "main/sfx";
import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "TECHN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "TECHN";
    player[p].timer = 0;
    drawVfx("tech",player[p].phys.pos);
    sounds.tech.play();
    actionStates[characterSelections[p]].TECHN.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("TECH",p);
    if (!actionStates[characterSelections[p]].TECHN.interrupt(p,input)){
      reduceByTraction(p,true);
      executeIntangibility("TECHN",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].TECHN){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

