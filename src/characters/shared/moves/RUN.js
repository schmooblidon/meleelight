import {checkForJump, actionStates} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "RUN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "RUN";
    player[p].timer = 1;
    actionStates[characterSelections[p]].RUN.main(p,input);
  },
  main : function(p,input){
    if (player[p].timer > framesData[characterSelections[p]].RUN){
      player[p].timer = 1;
    }
    if (!actionStates[characterSelections[p]].RUN.interrupt(p,input)){
      var footstep = [false,false];
      if (player[p].timer < 2){
        footstep[0] = true;
      }
      if (player[p].timer < 10){
        footstep[1] = true;
      }
      var tempMax = input[p].lsX[0] * player[p].charAttributes.dMaxV;

      //Current Run Acceleration = ((MaxRunVel * Xinput) - PreviousFrameVelocity) * (1/(MaxRunVel * 2.5)) * (DRAA + (DRAB/Math.sign(Xinput)))

      var tempAcc = ((player[p].charAttributes.dMaxV * input[p].lsX[0]) - player[p].phys.cVel.x) * (1/(player[p].charAttributes.dMaxV * 2.5)) * (player[p].charAttributes.dAccA + (player[p].charAttributes.dAccB / Math.sign(input[p].lsX[0])));


      player[p].phys.cVel.x += tempAcc;
      if (player[p].phys.cVel.x * player[p].phys.face > tempMax * player[p].phys.face){
        player[p].phys.cVel.x = tempMax;
      }

      var time = (player[p].phys.cVel.x * player[p].phys.face) / player[p].charAttributes.dMaxV;
      if (time > 0){
        player[p].timer += time;
      }
      if (player[p].timer > framesData[characterSelections[p]].RUN){
        player[p].timer = 1;
      }
      if ((footstep[0] && player[p].timer >= 2) || (footstep[1] && player[p].timer >= 10)){
        sounds.footstep.play();
      }
    }
  },
  interrupt : function(p,input){
    var j = checkForJump(p,input);
    if (input[p].a[0] && !input[p].a[1]){
      if (input[p].lA[0] > 0 || input[p].rA[0] > 0){
        actionStates[characterSelections[p]].GRAB.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].ATTACKDASH.init(p,input);
      }
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1],input);
      return true;
    }
    else if (input[p].b[0] && !input[p].b[1] && Math.abs(input[p].lsX[0]) > 0.6){
      player[p].phys.face = Math.sign(input[p].lsX[0]);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p,input);
      }
      return true;
    }
    else if (input[p].b[0] && !input[p].b[1] && input[p].lsY[0] < -0.58){
      actionStates[characterSelections[p]].DOWNSPECIALGROUND.init(p,input);
      return true;
    }
    else if (input[p].l[0] || input[p].r[0]){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p].lA[0] > 0 || input[p].rA[0] > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (Math.abs(input[p].lsX[0]) < 0.62){
      actionStates[characterSelections[p]].RUNBRAKE.init(p,input);
      return true;
    }
    else if (input[p].lsX[0] * player[p].phys.face < -0.3){
      actionStates[characterSelections[p]].RUNTURN.init(p,input);
      return true;
    }
  }
};

