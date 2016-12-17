import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {drawArrayPathNew} from "../drawArrayPathNew";
import {fg2} from "main/main";
import vfx from "main/vfx/vfxData/index";
export default (j) =>{
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  const secondFrame = (vfxQueue[j][4] + 4) % 10;
  drawArrayPathNew(fg2, makeColour(237, 219, 53, 0.3), vfxQueue[j][3], 0, 0, vfx.firefoxcharge.path[secondFrame],
      0.35 * (activeStage.scale / 4.5), 0.5 * (activeStage.scale / 4.5), 0, 0, 0);
  drawArrayPathNew(fg2, "rgb(255, 218, 163)", vfxQueue[j][3], 0, 0, vfx.firefoxcharge.path[vfxQueue[j][4]], 0.35 *
      (activeStage.scale / 4.5), 0.5 * (activeStage.scale / 4.5), 0, 0, 0);
  fg2.restore();
};