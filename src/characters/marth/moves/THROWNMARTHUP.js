import marth from "./index";
import {player} from "../../../main/main";
import {Vec2D} from "../../../main/util/Vec2D";
export default  {
  name: "THROWNMARTHUP",
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  canBeGrabbed: false,
  offset: [[-9.42, 2.73], [-10.14, 2.56], [-10.83, 2.00], [-10.97, 1.82], [-10.74, 1.85], [-10.44, 1.95], [-10.17, 2.05], [-10.08, 2.08], [-11.07, 2.81], [-8.94, 11.00], [-8.94, 11.00]],
  init: function (p, input) {
    player[p].actionState = "THROWNMARTHUP";
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
    marth.THROWNMARTHUP.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    if (!marth.THROWNMARTHUP.interrupt(p, input)) {
      if (player[p].timer > 0) {
        let playerTimer = player[p].timer;
        if(playerTimer > (marth.THROWNMARTHUP.offset.length)){
          playerTimer = marth.THROWNMARTHUP.offset.length -1;
        }
        const grabbedBy = player[p].phys.grabbedBy;
        if(grabbedBy === -1){
          return;
        }
        player[p].phys.pos = new Vec2D(player[grabbedBy].phys.pos.x + marth.THROWNMARTHUP.offset[playerTimer - 1][0] * player[p].phys.face, player[grabbedBy].phys.pos.y + marth.THROWNMARTHUP.offset[playerTimer - 1][1]);
      }
    }
  },
  interrupt: function (p, input) {
    return false;
  }
};