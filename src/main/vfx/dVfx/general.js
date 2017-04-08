import {makeColour} from "main/vfx/makeColour";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {drawArrayPath} from "main/vfx/drawArrayPath";
import {fg2} from "main/main";
export default (posInQueue, ang)=> {
  const col = makeColour(vfxQueue[posInQueue].colour[0], vfxQueue[posInQueue].colour[1], vfxQueue[posInQueue].colour[2], 0.8 * ((
      vfxQueue[posInQueue].frames - vfxQueue[posInQueue].timer) / vfxQueue[posInQueue].frames));
  fg2.save();
  fg2.translate((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.rotate(ang);
  drawArrayPath(fg2, col, vfxQueue[posInQueue].face, 0, 0, vfxQueue[posInQueue].path[vfxQueue[posInQueue].timer - 1], 0.2 * (activeStage.scale / 4.5),
      0.2 * (activeStage.scale / 4.5));
  fg2.restore();
};