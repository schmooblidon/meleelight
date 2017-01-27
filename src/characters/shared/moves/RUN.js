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
      const footstep = [false, false];
      if (player[p].timer < 2){
        footstep[0] = true;
      }
      if (player[p].timer < 10){
        footstep[1] = true;
      }
      const tempMax = input[p][0].lsX * player[p].charAttributes.dMaxV;

      //Current Run Acceleration = ((MaxRunVel * Xinput) - PreviousFrameVelocity) * (1/(MaxRunVel * 2.5)) * (DRAA + (DRAB/Math.abs(Xinput)))

      player[p].phys.cVel.x += ((player[p].charAttributes.dMaxV * input[p][0].lsX) - player[p].phys.cVel.x) * (1 / (player[p].charAttributes.dMaxV * 2.5)) * (player[p].charAttributes.dAccA + (player[p].charAttributes.dAccB / Math.abs(input[p][0].lsX)));
      if (player[p].phys.cVel.x * player[p].phys.face > tempMax * player[p].phys.face){
        player[p].phys.cVel.x = tempMax;
      }

      const time = (player[p].phys.cVel.x * player[p].phys.face) / player[p].charAttributes.dMaxV;
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
    const j = checkForJump(p, input);
    if (input[p][0].a && !input[p][1].a){
      if (input[p][0].lA > 0 || input[p][0].rA > 0){
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
    else if (input[p][0].b && !input[p][1].b && Math.abs(input[p][0].lsX) > 0.6){
      player[p].phys.face = Math.sign(input[p][0].lsX);
      if (player[p].phys.grounded){
        actionStates[characterSelections[p]].SIDESPECIALGROUND.init(p,input);
      }
      else {
        actionStates[characterSelections[p]].SIDESPECIALAIR.init(p,input);
      }
      return true;
    }
    else if (input[p][0].b && !input[p][1].b && input[p][0].lsY < -0.58){
      actionStates[characterSelections[p]].DOWNSPECIALGROUND.init(p,input);
      return true;
    }
    else if (input[p][0].l || input[p][0].r){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (input[p][0].lA > 0 || input[p][0].rA > 0){
      actionStates[characterSelections[p]].GUARDON.init(p,input);
      return true;
    }
    else if (Math.abs(input[p][0].lsX) < 0.62){
      actionStates[characterSelections[p]].RUNBRAKE.init(p,input);
      return true;
    }
    else if (input[p][0].lsX * player[p].phys.face < -0.3){
      actionStates[characterSelections[p]].RUNTURN.init(p,input);
      return true;
    }
  }
};

