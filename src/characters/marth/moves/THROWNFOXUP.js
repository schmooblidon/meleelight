import marth from "./index";
import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default  {
  name: "THROWNFOXUP",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-6.22, -2.90], [-5.58, -2.40], [-5.10, -2.15], [-4.84, -2.89], [-4.66, 2.92], [-1.86, 9.18], [-1.86, 9.18], [-1.86, 9.18]],
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
    marth.THROWNFOXUP.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.THROWNFOXUP.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > marth.THROWNFOXUP.offset.length){
          timer = marth.THROWNFOXUP.offset.length -1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + marth.THROWNFOXUP.offset[timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + marth.THROWNFOXUP.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};