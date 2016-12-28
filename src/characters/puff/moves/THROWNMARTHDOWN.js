import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
import puff from "./index";
export default {
  name: "THROWNMARTHDOWN",
  canEdgeCancel: false,
  reverseModel: true,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-10.42, 8.24], [-12.78, 9.07], [-13.1, 9.18], [-13.1, 9.18], [-13.46, 8.44], [-13.71, 6.36], [-12.79, 3.86], [-10.42, 0.27], [-10.42, 0.27]],
  init: function (p, input) {
    player[p].actionState = "THROWNMARTHDOWN";
    if (player[p].phys.grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x, player[player[p].phys.grabbedBy].phys.pos.y);
    puff.THROWNMARTHDOWN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.THROWNMARTHDOWN.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > puff.THROWNMARTHDOWN.offset.length){
          timer = puff.THROWNMARTHDOWN.offset.length -1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + puff.THROWNMARTHDOWN.offset[timer - 1][0] * player[p].phys.face * -1, player[grabbedBy].phys.pos.y + puff.THROWNMARTHDOWN.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};