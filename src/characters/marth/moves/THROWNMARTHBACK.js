import marth from "./index";
import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name: "THROWNMARTHBACK",
  canEdgeCancel: false,
  reverseModel: true,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-6.93, 2.63], [-4.37, 2.35], [-1.03, 2.23], [-0.04, 0.73], [1.12, -1.77], [1.23, -2.01], [1.23, -2.01]],
  init: function (p, input) {
    player[p].actionState = "THROWNMARTHBACK";
    if (player[p].phys.grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x, player[player[p].phys.grabbedBy].phys.pos.y);
    marth.THROWNMARTHBACK.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.THROWNMARTHBACK.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > marth.THROWNMARTHBACK.offset.length){
          timer = marth.THROWNMARTHBACK.offset.length -1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + marth.THROWNMARTHBACK.offset[timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + marth.THROWNMARTHBACK.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};