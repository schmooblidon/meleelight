import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
export default (posInQueue)=> {
  fg2.fillStyle = makeColour(255, 255, 255, 0.7 * ((vfxQueue[posInQueue].frames - vfxQueue[posInQueue].timer) / vfxQueue[posInQueue].frames));
  fg2.beginPath();
  fg2.arc((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[1],
      12 * (activeStage.scale / 4.5), twoPi, 0);
  fg2.fill();
};