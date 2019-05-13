import {vfxQueue} from "main/vfx/vfxQueue";
import {player, fg2} from "main/main";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {drawArrayPathNew} from "../drawArrayPathNew";
import vfx from "main/vfx/vfxData/index";
export default (posInQueue)=> {
  const p = vfxQueue[posInQueue].facing;
  fg2.save();
  const frame = vfxQueue[posInQueue].timer-1;
  fg2.translate(((player[p].phys.pos.x+2*player[p].phys.face) * activeStage.scale) + activeStage.offset[0], ((player[p].phys.pos.y+13) * -activeStage.scale) + activeStage.offset[1]);

  const fireGrad = fg2.createLinearGradient(-130, 0, 80, 0);
  let col;
  if (frame % 2) {
    col = "rgb(255, 218, 163)";
    fireGrad.addColorStop(0, "rgb(255, 232, 198)");
    fireGrad.addColorStop(0.6, makeColour(251, 187, 90, 1));
    fireGrad.addColorStop(1, makeColour(182, 45, 9, 1));
  } else {
    col = "rgb(223, 83, 39)";
    fireGrad.addColorStop(0, "rgb(223, 83, 39)");
    fireGrad.addColorStop(0.6, makeColour(210, 59, 26, 1));
    fireGrad.addColorStop(1, makeColour(158, 34, 12, 1));
  }
  drawArrayPathNew(fg2, fireGrad, vfxQueue[posInQueue].face, 0, 0, vfx.falconpunch.path[frame], 0.23 * (activeStage.scale /
      4.5), 0.23 * (activeStage.scale / 4.5), player[p].rotation, player[p].rotationPoint.x, player[p].rotationPoint
      .y);
  fg2.restore();
};