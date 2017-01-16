import marth from "./index";
import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default  {
  name: "THROWNMARTHDOWN",
  canEdgeCancel: false,
  reverseModel: true,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-9.23, 3.12], [-11.00, 3.75], [-12.45, 4.26], [-12.67, 4.33], [-12.67, 4.33], [-12.67, 4.33], [-12.92, 3.86], [-13.31, 2.59], [-13.16, 1.05], [-12.50, -0.70], [-11.29, -2.85], [-8.43, -6.34], [-8.43, -6.34]],
  init: function (p, input) {
    player[p].actionState = "THROWNMARTHDOWN";
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
    marth.THROWNMARTHDOWN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.THROWNMARTHDOWN.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > marth.THROWNMARTHDOWN.offset.length){
          timer = marth.THROWNMARTHDOWN.offset.length -1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + marth.THROWNMARTHDOWN.offset[timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + marth.THROWNMARTHDOWN.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};