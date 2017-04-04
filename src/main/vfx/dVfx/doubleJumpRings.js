import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
export default (posInQueue)=> {
  fg2.strokeStyle = makeColour(99, 100, 255, 0.7 * ((vfxQueue[posInQueue].frames - vfxQueue[posInQueue].timer) / vfxQueue[posInQueue].frames));
  for (let n = 0; n < vfxQueue[posInQueue].rings.length; n++) {
    fg2.save();
    fg2.scale(1, 0.25);
    fg2.beginPath();
    fg2.arc((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], ((vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[
            1]) * 4, vfxQueue[posInQueue].timer * (40 / 8) + n * activeStage.scale, twoPi, 0);
    fg2.lineWidth = 3;
    fg2.stroke();
    fg2.closePath();
    fg2.restore();
  }
};