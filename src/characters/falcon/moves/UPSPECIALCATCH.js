import falcon from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes, fastfall, airDrift} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {drawVfx} from "../../../main/vfx/drawVfx";
import FALLSPECIAL from "../../shared/moves/FALLSPECIAL";
import LANDINGFALLSPECIAL from "../../shared/moves/LANDINGFALLSPECIAL";
import UPSPECIALTHROW from "characters/falcon/moves/UPSPECIALTHROW";
import {hitQueue} from 'physics/hitDetection';
export default {
  name: "UPSPECIALCATCH",
  canPassThrough: true,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: false,
  reverseModel: false,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "UPSPECIALCATCH";
    player[p].timer = 0;
    player[p].phys.cVel = new Vec2D(0, 0);
    player[p].phys.fastfalled = false;
    player[p].phys.upbAngleMultiplier = 0;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.falcondivethrowextra.id0;
    player[p].phys.landingMultiplier = 30 / 34;
    this.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!this.interrupt(p, input)) {
      if (player[p].timer == 2){
        player[p].hitboxes.active = [true,false,false,false];
        player[p].hitboxes.frame = 0;
        for (var n=0;n<3;n++) {
          drawVfx({
            name: "firefoxtail",
            pos: new Vec2D(player[p].phys.pos.x+(-0.5+Math.random())*17,player[p].phys.pos.y+5+(-0.5+Math.random())*17),
            face: player[p].phys.face
          });
        }
      }
      if (player[p].timer == 4){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 16) {
      if (player[p].phys.grabbing != -1){
        player[p].hitboxes.id[0] = player[p].charHitboxes.falcondivethrow.id0;
        player[p].hitboxes.active = [true,false,false,false];
        hitQueue.push([player[p].phys.grabbing,p,0,false,true,false]);
        turnOffHitboxes(p);
      }
      UPSPECIALTHROW.init(p, input);
      return true;
    }
    else {
      const grabbing = player[p].phys.grabbing;
      if(grabbing === -1){
        return;
      }
      if (player[p].timer <= 16 && player[grabbing].phys.grabbedBy !== p){
        console.log("exiting");
        UPSPECIALTHROW.init(p,input);
        return true;
      }
      else {
        return false;
      }
    }
  },
  land: function (p, input) {
  }
};