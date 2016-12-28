import {player} from "../../../main/main";
import puff from "./index";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name: "THROWNFOXBACK",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  reverseModel: true,
  //[1.05,7.14],[3.78,7.55],[10.37,1.56],[13.72,-6.85],[13.66,-9.95],[13.67,-10.28],[13.85,-9.92],[14.04,-9.34],[14.04,-9.34]],
  offset: [[-7.91, 1.71], [-5.60, 1.14], [-1.22, -0.33], [3.34, -1.09], [8.23, 6.71], [8.23, 6.71]],
  //7.53
  init: function (p, input) {
    player[p].actionState = "THROWNFOXBACK";
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
    puff.THROWNFOXBACK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.THROWNFOXBACK.interrupt(p, input)) {

      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > puff.THROWNFOXBACK.offset.length){
          timer = puff.THROWNFOXBACK.offset.length - 1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + puff.THROWNFOXBACK.offset[timer - 1][0] * player[p].phys.face * -1, player[grabbedBy].phys.pos.y + puff.THROWNFOXBACK.offset[timer - 1][1]);
      }

    }
  },
  interrupt: function (p, input) {
    return false;
  }
};