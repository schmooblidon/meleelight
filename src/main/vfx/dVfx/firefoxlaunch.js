import {vfxQueue} from "main/vfx/vfxQueue";
import {player, fg2} from "main/main";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {drawArrayPathNew} from "../drawArrayPathNew";
import vfx from "main/vfx/vfxData/index";
export default(j)=> {
  const p = vfxQueue[j][4];
  if (player[p].actionState === "UPSPECIALLAUNCH") {
    fg2.save();
    const frame = (player[p].timer - 1) % 4;

    fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
            1]);

    const fireGrad = fg2.createLinearGradient(0, -130, 0, 20);
    let col;
    if (frame % 2) {
      col = "rgb(255, 218, 163)";
      fireGrad.addColorStop(0, "rgb(255, 232, 198)");
      fireGrad.addColorStop(0.6, makeColour(251, 187, 90, 0.9));
      fireGrad.addColorStop(1, makeColour(182, 45, 9, 0.3));
    } else {
      col = "rgb(223, 83, 39)";
      fireGrad.addColorStop(0, "rgb(223, 83, 39)");
      fireGrad.addColorStop(0.6, makeColour(210, 59, 26, 0.9));
      fireGrad.addColorStop(1, makeColour(158, 34, 12, 0.3));
    }
    drawArrayPathNew(fg2, fireGrad, vfxQueue[j][3], 0, 0, vfx.firefoxlaunch.path[frame], 0.35 * (activeStage.scale /
        4.5), 0.35 * (activeStage.scale / 4.5), player[p].rotation, player[p].rotationPoint.x, player[p].rotationPoint
        .y);
    fg2.restore();
  }
};