import WAIT from "characters/shared/moves/WAIT";
import FALLSPECIAL from "characters/shared/moves/FALLSPECIAL";
import {articles} from "physics/article";
import {sounds} from "main/sfx";
import {turnOffHitboxes} from "physics/actionStateShortcuts";
import { player} from "main/main";
import {drawVfx} from "main/vfx/drawVfx";
import SIDESPECIALGROUNDHIT from "characters/falcon/moves/SIDESPECIALGROUNDHIT";

export default {
  name : "SIDESPECIALGROUND",
  setVelocities1 : [-1.79163,-3.1017,-3.08,-1.72663],
  setVelocities2 : [5.60854,5.2283,4.65846,3.89902,3.376,3.21597,3.05619,2.89666,2.73738,2.57834,2.41955,2.26102,2.10273,1.94468,1.78689,1.62934,1.47205,1.315,1.1582,1.05434,1.00404,0.95493,0.90701,0.86029,0.81476,0.77041,0.72726,0.6853,0.64453,0.60495,0.56656,0.52936,0.49336,0.45854,0.42492,0.39248,0.36124,0.33119,0.30233,0.27466,0.24818,0.22289,0.1988,0.1759,0.15417,0.13366,0.11432,0.09618,0.07923,0.06347,0.0489,0.03552,0.02333,0.01234,0.00253,-0.00607,-0.0135,-0.01973,-0.02478,-0.02863,-0.03128,-0.03275,-0.03303],
  canPassThrough : false,
  canEdgeCancel : false,
  disableTeeter : true,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  specialOnHit: true,
  airborneState : "SIDESPECIALGROUNDTOAIR",
  init : function(p,input){
    player[p].actionState = "SIDESPECIALGROUND";
    player[p].timer = 0;
    player[p].phys.cVel.x = 0;
    player[p].phys.landingMultiplier = 1.5;
    player[p].hitboxes.id[0] = player[p].charHitboxes.raptorboostground.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.raptorboostground.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.raptorboostground.id2;
    this.canEdgeCancel = false;
    turnOffHitboxes(p);
    this.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!this.interrupt(p,input)){
      if (player[p].timer <= 4) {
        player[p].phys.cVel.x = this.setVelocities1[player[p].timer-1] * player[p].phys.face;
      }
      else if (player[p].timer <= 16) {
        player[p].phys.cVel.x = 0;
      }
      else {
        this.canEdgeCancel = true;
        player[p].phys.cVel.x = this.setVelocities2[player[p].timer-17] * player[p].phys.face;
      }
      if (player[p].timer === 15){
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
      SIDESPECIALGROUNDHIT.init(p,input);
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

  },
  onPlayerHit: function (p) {
    player[p].phys.raptorBoost = true;
  }
};
