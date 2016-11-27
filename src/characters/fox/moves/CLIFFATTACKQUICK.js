/* globals player, stage, cS, Vec2D, sounds, randomShout, turnOffHitboxes */

import WAIT from "characters/shared/moves/WAIT";

export default {
  name : "CLIFFATTACKQUICK",
  offset : [[-70.70355,-13.91997],[-71.27906,-12.96],[-71.69882,-12.06759],[-72.07618,-11.06843],[-72.24,-9.6],[-72.24,-6.74399],[-72.24,-3.84],[-71.01049,-1.99348],[-68.39889,-0.57355],[-63.64237,0]],
  setVelocities : [0.1943,0.03352,1.59986,1.91979,2.12469,2.21458,2.18944,2.04928,1.79411,1.42391,0.93869,0.33846,0,0,0,-0.34,-0.61998,-0.75406,-1.08875,-1.3431,-1.5171,-1.61075,-1.62405,-1.557,-1.4096,-1.18185,-0.87376,-0.69279,-0.65007,-0.54367,-0.3736],
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "CLIFFATTACKQUICK";
    player[p].timer = 0;
    player[p].phys.intangibleTimer = 15;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.ledgegetupquick.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.ledgegetupquick.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.ledgegetupquick.id2;
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      const x = stage.ledge[player[p].phys.onLedge][1]?stage.box[stage.ledge[player[p].phys.onLedge][0]].max.x:stage.box[stage.ledge[player[p].phys.onLedge][0]].min.x;
      const y = stage.box[stage.ledge[player[p].phys.onLedge][0]].max.y;
      if (player[p].timer < 24){
        if (player[p].timer >= 14){
          player[p].phys.pos = new Vec2D(x+(this.offset[player[p].timer-14][0]+68.4)*player[p].phys.face,y+this.offset[player[p].timer-14][1]);
        }
      }
      else {
        player[p].phys.cVel.x = this.setVelocities[player[p].timer-24]*player[p].phys.face;
      }
      if (player[p].timer === 24){
        player[p].phys.grounded = true;
        player[p].phys.onSurface = [0,stage.ledge[player[p].phys.onLedge][0]];
        player[p].phys.airborneTimer = 0;
        player[p].phys.pos.y = y;
      }

      if (player[p].timer === 25){
        player[p].hitboxes.active = [true,true,true,false];
        player[p].hitboxes.frame = 0;
        sounds.normalswing2.play();
        // needs 3
        randomShout(cS[p]);
      }
      else if (player[p].timer > 25 && player[p].timer < 35){
        player[p].hitboxes.frame++;
      }
      else if (player[p].timer === 35){
        turnOffHitboxes(p);
      }
    }
  },
  interrupt : function(p){
    if (player[p].timer > 54){
      player[p].phys.onLedge = -1;
      player[p].phys.ledgeRegrabCount = false;
      WAIT.init(p);
      return true;
    }
    else {
      return false;
    }
  }

};
