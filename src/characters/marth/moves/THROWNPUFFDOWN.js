import marth from "./index";
import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default {
  name: "THROWNPUFFDOWN",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  ignoreCollision: true,
  offset: [[-9.84, -3.86], [-7.24, -5.16], [-4.52, -6.41], [-2.68, -7.35], [-0.51, -8.44], [-0.48, -8.42], [-0.58, -8.37], [-0.59, -8.41], [-0.51, -8.47], [-0.54, -8.45], [-0.59, -8.42], [-0.61, -8.41], [-0.57, -8.42], [-0.50, -8.43], [-0.48, -8.46], [-0.49, -8.49], [-0.49, -8.48], [-0.49, -8.44], [-0.50, -8.42], [-0.54, -8.41], [-0.57, -8.44], [-0.56, -8.47], [-0.54, -8.47], [-0.50, -8.44], [-0.46, -8.40], [-0.49, -8.39], [-0.54, -8.42], [-0.52, -8.47], [-0.51, -8.52], [-0.50, -8.50], [-0.52, -8.43], [-0.46, -8.37], [-0.41, -8.38], [-0.47, -8.44], [-0.51, -8.45], [-0.53, -8.43], [-0.54, -8.41], [-0.47, -8.39], [-0.44, -8.43], [-0.45, -8.48], [-0.46, -8.46], [-0.48, -8.43], [-0.49, -8.41], [-0.55, -8.41], [-0.57, -8.43], [-0.57, -8.46], [-0.55, -8.47], [-0.51, -8.45], [-0.48, -8.40], [-0.51, -8.38], [-0.57, -8.39], [-0.55, -8.44], [-0.55, -8.47], [-0.54, -8.46], [-0.53, -8.43], [-0.48, -8.38], [-0.48, -8.38], [-0.52, -8.44], [-0.50, -8.46], [-0.48, -8.50], [-0.51, -8.49], [-0.55, -8.47], [-0.55, -8.47]],
  init: function (p, input) {
    player[p].actionState = "THROWNPUFFDOWN";
    if (player[p].phys.grabbedBy < p) {
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

    marth.THROWNPUFFDOWN.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.THROWNPUFFDOWN.interrupt(p, input)) {
      let timer = player[p].timer;
      if (timer > 0) {
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        if(timer > marth.THROWNPUFFDOWN.offset.length){
          timer = marth.THROWNPUFFDOWN.offset.length -1;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + marth.THROWNPUFFDOWN.offset[timer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + marth.THROWNPUFFDOWN.offset[timer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};