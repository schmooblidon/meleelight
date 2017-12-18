import {player} from "../../../main/main";
import puff from "./index";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name: "THROWNMARTHBACK",
  canEdgeCancel: false,
  reverseModel: true,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  offset: [[-6.22, 7.33], [-1.72, 7.12], [-0.02, 4.56], [0.80, 2.86], [0.80, 2.86]],
  init: function (p, input) {
    player[p].actionState = "THROWNMARTHBACK";
    const grabbedBy = player[p].phys.grabbedBy;
    if(grabbedBy === -1){
      return;
    }
    if (grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x, player[grabbedBy].phys.pos.y);
    puff.THROWNMARTHBACK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.THROWNMARTHBACK.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > puff.THROWNMARTHBACK.offset.length){
          timer = puff.THROWNMARTHBACK.offset.length -1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + puff.THROWNMARTHBACK.offset[timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + puff.THROWNMARTHBACK.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};