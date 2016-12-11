import {executeIntangibility, reduceByTraction, playSounds, actionStates} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {characterSelections,  player} from "main/main";
import {framesData} from 'main/characters';
import {drawVfx} from "main/vfx/drawVfx";
export default {
  name : "ESCAPEN",
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "ESCAPEN";
    player[p].timer = 0;
    player[p].phys.shielding = false;
    drawVfx("circleDust",player[p].phys.pos,player[p].phys.face);
    actionStates[characterSelections[p]].ESCAPEN.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    playSounds("ESCAPEN",p);
    if (!actionStates[characterSelections[p]].ESCAPEN.interrupt(p,input)){
      if (player[p].timer == 1){
        sounds.spotdodge.play();
      }
      reduceByTraction(p,true);
      executeIntangibility("ESCAPEN",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].ESCAPEN){
      actionStates[characterSelections[p]].WAIT.init(p,input);
      return true;
    }
    else {
      return false;
    }
  }
};

