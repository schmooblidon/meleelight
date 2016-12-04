import {makeColour} from "main/vfx/makeColour";
import {drawArrayPath} from "main/vfx/drawArrayPath";
import {fg2} from "main/main";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
export default (j)=> {
  const col = makeColour(143, 128, 233, 0.7);
  drawArrayPath(fg2, col, vfxQueue[j][3], (vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0] + 10, (vfxQueue[j][2]
          .y * -activeStage.scale) + activeStage.offset[1], vfxQueue[j][0].path1, 0.2 * (activeStage.scale / 4.5), 0.2 * (activeStage.scale /
      4.5));
  drawArrayPath(fg2, col, vfxQueue[j][3], (vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0] + 10, (vfxQueue[j][2]
          .y * -activeStage.scale) + activeStage.offset[1], vfxQueue[j][0].path2, 0.2 * (activeStage.scale / 4.5), 0.2 * (activeStage.scale /
      4.5));
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.rotate(Math.PI);
  drawArrayPath(fg2, col, vfxQueue[j][3], 0, 0, vfxQueue[j][0].path1, 0.2 * (activeStage.scale / 4.5), 0.2 * (activeStage.scale /
      4.5));
  drawArrayPath(fg2, col, vfxQueue[j][3], 0, 0, vfxQueue[j][0].path2, 0.2 * (activeStage.scale / 4.5), 0.2 * (activeStage.scale /
      4.5));
  fg2.restore();
};