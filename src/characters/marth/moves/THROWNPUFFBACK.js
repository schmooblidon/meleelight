import marth from "./index";
import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name: "THROWNPUFFBACK",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  reverseModel: true,
  //[1.05,7.14],[3.78,7.55],[10.37,1.56],[13.72,-6.85],[13.66,-9.95],[13.67,-10.28],[13.85,-9.92],[14.04,-9.34],[14.04,-9.34]],
  offset: [[-11.22, -3.35], [-11.51, -3.60], [-11.64, -3.90], [-11.51, -4.11], [-10.99, -4.13], [-9.98, -4.05], [-8.74, -3.92], [-7.52, -3.55], [-6.37, -2.46], [-5.04, -0.22], [-3.44, 2.32], [-1.58, 3.79], [0.31, 4.86], [0.92, 7.14], [2.41, 7.55], [5.89, 1.56], [6.52, -6.85], [6.13, -9.95], [6.14, -10.28], [6.32, -9.92], [6.51, -9.34], [6.51, -9.34]],
  offsetVel: [-0.12755, -1.24035, -3.10533, -2.72023, -0.32654],
  //7.53
  init: function (p, input) {
    player[p].actionState = "THROWNPUFFBACK";
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
    marth.THROWNPUFFBACK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.THROWNPUFFBACK.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > marth.THROWNPUFFBACK.offset.length){
          timer = marth.THROWNPUFFBACK.offset.length - 1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + marth.THROWNPUFFBACK.offset[timer - 1][0] * player[p].phys.face * -1, player[grabbedBy].phys.pos.y + marth.THROWNPUFFBACK.offset[timer - 1][1]);
        /*if (player[p].timer > 13 && player[p].timer < 19){
         player[p].phys.pos.x += marth.THROWNPUFFBACK.offsetVel[player[p].timer-14]*player[p].phys.face;
         }*/
      }

    }
  },
  interrupt: function (p, input) {
    return false;
  }
};