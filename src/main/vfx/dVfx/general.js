import {makeColour} from "main/vfx/makeColour";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {drawArrayPath} from "main/vfx/drawArrayPath";
import {fg2} from "main/main";
export default (j, ang)=> {
  const col = makeColour(vfxQueue[j][0].colour[0], vfxQueue[j][0].colour[1], vfxQueue[j][0].colour[2], 0.8 * ((
      vfxQueue[j][0].frames - vfxQueue[j][1]) / vfxQueue[j][0].frames));
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.rotate(ang);
  drawArrayPath(fg2, col, vfxQueue[j][3], 0, 0, vfxQueue[j][0].path[vfxQueue[j][1] - 1], 0.2 * (activeStage.scale / 4.5),
      0.2 * (activeStage.scale / 4.5));
  fg2.restore();
};