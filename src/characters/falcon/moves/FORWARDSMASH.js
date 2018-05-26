
import WAIT from "characters/shared/moves/WAIT";
import {player, characterSelections} from "main/main";
import {turnOffHitboxes, reduceByTraction, randomShout} from "physics/actionStateShortcuts";
import {sounds} from "main/sfx";

export default {
  name : "FORWARDSMASH",
  setVelocities : [-1.11304,-0.988,-0.4595,-0.46209,-0.44062,-0.39509,-0.32551,-0.23188,-0.11419,0.02756,0.10871,0.15599,0.2674,0.44294,0.68261,0.98641,1.35433,3.99021,6.03557,3.85735,1.28591,1.28591,-1.76748,-1.66068,0.64071,0.76125,0.19715,0.12143,0.06216,0.01934,-0.00704,-0.01698,-0.0159,-0.0145,-0.01268,-0.01044,-0.00777,-0.00469,-0.00118,0.00275,0.00561,0.00714,0.00872,0.01033,0.012,0.0137,0.01545,0.01688,0.01703,0.01579,0.01317,0.00916,0.00375,0.00118,0.00201,0.00231,0.00207,0.00932,0.02229,0.03206,0.03863,0.04201,0.04218,0.03916],
  canEdgeCancel : false,
  canBeGrabbed : true,
  init : function(p,input){
    player[p].actionState = "FORWARDSMASH";
    player[p].timer = 0;
    player[p].phys.charging = false;
    player[p].phys.chargeFrames = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash1.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash1.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.fsmash1.id2;
    this.main(p,input);
  },
  main : function(p,input){
    if (player[p].timer === 10){
      if (input[p][0].a || input[p][0].z){
        player[p].phys.charging = true;
        player[p].phys.chargeFrames++;
        if (player[p].phys.chargeFrames === 5){
          sounds.smashcharge.play();
        }
        if (player[p].phys.chargeFrames === 60){
          player[p].timer++;
          player[p].phys.charging = false;
        }
      }
      else {
        player[p].timer++;
        player[p].phys.charging = false;
      }
    }
    else {
      player[p].timer++;
      player[p].phys.charging = false;
    }
    if (!this.interrupt(p,input)){
      if (player[p].phys.charging) {
        player[p].phys.cVel.x = 0;
      }
      else {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-1] * player[p].phys.face;
      }

      if (player[p].timer === 12){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        randomShout(characterSelections[p]);
        sounds.normalswing1.play();
      }
      if (player[p].timer > 12 && player[p].timer < 23){
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 17){
        player[p].hitboxes.id[0] = player[p].charHitboxes.fsmash2.id0;
        player[p].hitboxes.id[1] = player[p].charHitboxes.fsmash2.id1;
        player[p].hitboxes.id[2] = player[p].charHitboxes.fsmash2.id2;
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer === 23){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > 64){
      WAIT.init(p,input);
      return true;
    }
    // iasa 60
    else {
      return false;
    }
  }
};
