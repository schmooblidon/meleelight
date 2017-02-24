import {player} from "../../../main/main";
import puff from "./index";
import {Vec2D} from "../../../main/util/Vec2D";
export default  {
  name: "THROWNFOXUP",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  offset: [[-6.30, 2.16], [-5.56, 2.71], [-5.19, 2.38], [-3.03, 12.89], [-3.03, 12.89]],
  init: function (p, input) {
    player[p].actionState = "THROWNFOXUP";
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
    puff.THROWNFOXUP.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!puff.THROWNFOXUP.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > puff.THROWNFOXUP.offset.length){
          timer = puff.THROWNFOXUP.offset.length -1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + puff.THROWNFOXUP.offset[timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + puff.THROWNFOXUP.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};