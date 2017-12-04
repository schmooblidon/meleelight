import marth from "./index";
import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default  {
  name: "THROWNMARTHFORWARD",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  offset: [[-10.23, 2.34], [-11.36, 2.91], [-9.76, 4.86], [-9.49, 5.06], [-9.31, 5.09], [-9.28, 5.01], [-9.49, 4.86], [-10.27, 4.65], [-13.57, 3.61], [-11.63, 1.55], [-9.61, -2.20], [-7.85, -7.66], [-7.85, -7.66]],
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
    marth.THROWNMARTHFORWARD.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.THROWNMARTHFORWARD.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0){
        if(timer > this.offset.length){
          timer = marth.THROWNMARTHFORWARD.offset.length -1;
        }
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + marth.THROWNMARTHFORWARD.offset[timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + marth.THROWNMARTHFORWARD.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};