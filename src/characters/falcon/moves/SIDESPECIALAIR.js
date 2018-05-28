
import WAIT from "characters/shared/moves/WAIT";
import FALLSPECIAL from "characters/shared/moves/FALLSPECIAL";
import LANDINGFALLSPECIAL from "characters/shared/moves/LANDINGFALLSPECIAL";
import SIDESPECIALAIRHIT from "characters/falcon/moves/SIDESPECIALAIRHIT";
import {articles} from "physics/article";
import {sounds} from "main/sfx";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
import { player} from "main/main";
import {drawVfx} from "main/vfx/drawVfx";

export default {
  name : "SIDESPECIALAIR",
  setVelocities : [2.27937,1.82957,1.65988,1.77032,2.16086,2.40854,2.32754,2.24791,2.16967,2.09282,2.01735,1.94326,1.87056,1.79924,1.72931,1.66076,1.59359,1.52782,1.46342,1.4004,1.33878,1.27853,1.21968,1.1622,1.10611,1.05141,0.99808,0.94615,0.89559,0.84642,0.79864,0.75225,0.70722,0.66359,0.62135,0.58048,0.541,0.50291,0.46619,0.43089,0.39694,0.36437,0.3332,0.30343,0.275,0.248,0.22235,0.19812,0.17523,0.15378,0.13364,0.11496,0.09761,0.08167,0.06713,0.05394,0.04214,0.03175,0.02271,0.01509,0.00881,0.00396,0.00046,-0.00165],
  canPassThrough : false,
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  specialOnHit: true,
  init : function(p,input){
    player[p].actionState = "SIDESPECIALAIR";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.cVel.y = 0;
    player[p].hitboxes.id[0] = player[p].charHitboxes.raptorboostair.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.raptorboostair.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.raptorboostair.id2;
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer >= 16) {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-16] * player[p].phys.face;
      }
      if (player[p].timer >= 30) {
        player[p].phys.cVel.y -= 0.05;
      }
      if (player[p].timer === 17){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
      }
      if (player[p].timer === 35){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p,input){
    if (player[p].phys.raptorBoost) {
      SIDESPECIALAIRHIT.init(p,input);
    }
    else if (player[p].timer > 79){
      if (player[p].phys.grounded){
        WAIT.init(p,input);
      }
      else {
        FALLSPECIAL.init(p,input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    LANDINGFALLSPECIAL.init(p,input);
  },
  onPlayerHit: function (p) {
    player[p].phys.raptorBoost = true;
  }
};
