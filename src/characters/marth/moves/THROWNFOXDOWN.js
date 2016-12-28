import marth from "./index";
import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export  default  {
  name: "THROWNFOXDOWN",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-4.30, -2.59], [-1.90, -3.81], [-1.47, -3.92], [-1.42, -3.79], [-1.41, -3.32], [-1.56, -1.14], [-0.61, 1.89], [0.37, 2.60], [1.24, 2.77], [1.46, 2.48], [1.49, 2.02], [1.50, 2.27], [1.50, 2.46], [1.28, 2.59], [-0.02, 5.04], [-0.35, -5.59], [-0.40, -6.30], [-0.39, -5.43], [-0.35, -4.66], [-0.30, -5.00], [-0.22, -5.73], [-0.14, -5.84], [-0.07, -4.33], [-0.07, -6.59], [-0.07, -6.29], [-0.07, -5.99], [-0.07, -5.70], [-0.07, -5.43], [-0.07, -5.17], [-0.07, -4.95], [-0.07, -4.75], [-0.07, -4.58], [-0.07, -4.58]],
  init: function (p, input) {
    player[p].actionState = "THROWNFOXDOWN";
    if (player[p].phys.grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

    marth.THROWNFOXDOWN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.THROWNFOXDOWN.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > marth.THROWNFOXDOWN.offset.length){
          timer = marth.THROWNFOXDOWN.offset.length -1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + marth.THROWNFOXDOWN.offset[timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + marth.THROWNFOXDOWN.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};