import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {drawArrayPathNew} from "../drawArrayPathNew";
import {fg2} from "main/main";
import vfx from "main/vfx/vfxData/index";
export default (posInQueue) =>{
  fg2.save();
  fg2.translate((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[
          1]);
  const secondFrame = (vfxQueue[posInQueue].facing + 4) % 10;
  drawArrayPathNew(fg2, makeColour(237, 219, 53, 0.3), vfxQueue[posInQueue].face, 0, 0, vfx.firefoxcharge.path[secondFrame],
      0.35 * (activeStage.scale / 4.5), 0.5 * (activeStage.scale / 4.5), 0, 0, 0);
  drawArrayPathNew(fg2, "rgb(255, 218, 163)", vfxQueue[posInQueue].face, 0, 0, vfx.firefoxcharge.path[vfxQueue[posInQueue].facing], 0.35 *
      (activeStage.scale / 4.5), 0.5 * (activeStage.scale / 4.5), 0, 0, 0);
  fg2.restore();
};