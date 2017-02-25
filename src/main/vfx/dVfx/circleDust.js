import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {fg2} from "main/main";
import {twoPi} from "main/render";
export default (posInQueue)=> {
  for (let n = 0; n < vfxQueue[posInQueue].circles.length; n++) {
    const x = ((vfxQueue[posInQueue].newPos.x + (vfxQueue[posInQueue].circles[n] * (1 + (vfxQueue[posInQueue].timer / vfxQueue[posInQueue].frames)))) *
        activeStage.scale) + activeStage.offset[0];
    const y = ((vfxQueue[posInQueue].newPos.y + (4 * (0 + (vfxQueue[posInQueue].timer / vfxQueue[posInQueue].frames)))) * -activeStage.scale) + activeStage.offset[
            1];
    fg2.fillStyle = makeColour(255, 255, 255, 0.7 * ((vfxQueue[posInQueue].frames - vfxQueue[posInQueue].timer) / vfxQueue[posInQueue].frames));
    fg2.beginPath();
    fg2.arc(x, y, 12 * (activeStage.scale / 4.5), twoPi, 0);
    fg2.fill();
  }
};