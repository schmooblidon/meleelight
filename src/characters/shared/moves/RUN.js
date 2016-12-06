import {checkForJump, actionStates} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";
import {characterSelections, player} from "main/main";
import {framesData} from 'main/characters';
export default {
  name : "RUN",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "RUN";
    player[p].timer = 1;
    actionStates[characterSelections[p]].RUN.main(p);
  },
  main : function(p){
    if (player[p].timer > framesData[characterSelections[p]].RUN){
      player[p].timer = 1;
    }
    if (!actionStates[characterSelections[p]].RUN.interrupt(p)){
      var footstep = [false,false];
      if (player[p].timer < 2){
        footstep[0] = true;
      }
      if (player[p].timer < 10){
        footstep[1] = true;
      }
      var tempMax = player[p].inputs.lsX[0] * player[p].charAttributes.dMaxV;

      //Current Run Acceleration = ((MaxRunVel * Xinput) - PreviousFrameVelocity) * (1/(MaxRunVel * 2.5)) * (DRAA + (DRAB/Math.sign(Xinput)))

      var tempAcc = ((player[p].charAttributes.dMaxV * player[p].inputs.lsX[0]) - player[p].phys.cVel.x) * (1/(player[p].charAttributes.dMaxV * 2.5)) * (player[p].charAttributes.dAccA + (player[p].charAttributes.dAccB / Math.sign(player[p].inputs.lsX[0])));


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
  interrupt : function(p){
    var j = checkForJump(p);
    if (player[p].inputs.a[0] && !player[p].inputs.a[1]){
      if (player[p].inputs.lA[0] > 0 || player[p].inputs.rA[0] > 0){
        actionStates[characterSelections[p]].GRAB.init(p);
      }
      else {
        actionStates[characterSelections[p]].ATTACKDASH.init(p);
      }
      return true;
    }
    else if (j[0]){
      actionStates[characterSelections[p]].KNEEBEND.init(p,j[1]);
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && Math.abs(player[p].inputs.lsX[0]) > 0.6){
      player[p].phys.face = Math.sign(player[p].inputs.lsX[0]);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p);
      }
      return true;
    }
    else if (player[p].inputs.b[0] && !player[p].inputs.b[1] && player[p].inputs.lsY[0] < -0.58){
      actionStates[characterSelections[p]].DOWNSPECIALGROUND.init(p);
      return true;
    }
    else if (player[p].inputs.l[0] || player[p].inputs.r[0]){
      actionStates[characterSelections[p]].GUARDON.init(p);
      return true;
    }
    else if (player[p].inputs.lA[0] > 0 || player[p].inputs.rA[0] > 0){
      actionStates[characterSelections[p]].GUARDON.init(p);
      return true;
    }
    else if (Math.abs(player[p].inputs.lsX[0]) < 0.62){
      actionStates[characterSelections[p]].RUNBRAKE.init(p);
      return true;
    }
    else if (player[p].inputs.lsX[0] * player[p].phys.face < -0.3){
      actionStates[characterSelections[p]].RUNTURN.init(p);
      return true;
    }
  }
};

