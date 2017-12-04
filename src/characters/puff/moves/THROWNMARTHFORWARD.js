import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
import puff from "./index";
export default {
  name: "THROWNMARTHFORWARD",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  offset: [[-11.71, 7.06], [-10.22, 9.68], [-9.84, 9.94], [-9.70, 9.88], [-10.01, 9.67], [-14.00, 8.67], [-11.76, 5.89], [-8.89, -0.35], [-8.89, -0.35]],
  init: function (p, input) {
    player[p].actionState = "THROWNMARTHFORWARD";
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
    player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x, player[grabbedBy].phys.pos.y);
    puff.THROWNMARTHFORWARD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.THROWNMARTHFORWARD.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0){
        if(timer > puff.THROWNMARTHFORWARD.offset.length){
          timer = puff.THROWNMARTHFORWARD.offset.length -1;
        }
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + puff.THROWNMARTHFORWARD.offset[timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + puff.THROWNMARTHFORWARD.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};