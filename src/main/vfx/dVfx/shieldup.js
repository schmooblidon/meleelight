import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
export default (posInQueue)=> {
  fg2.strokeStyle = makeColour(255, 255, 255, 0.8 * ((vfxQueue[posInQueue].frames - vfxQueue[posInQueue].timer) / vfxQueue[posInQueue].frames));
  fg2.lineWidth = 10;
  fg2.beginPath();
  fg2.arc((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[1],
      vfxQueue[posInQueue].facing * activeStage.scale + 10 + (5 * (vfxQueue[posInQueue].timer - 1)), twoPi, 0);
  fg2.stroke();
  fg2.lineWidth = 5;
  fg2.beginPath();
  fg2.arc((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[1],
      vfxQueue[posInQueue].facing * activeStage.scale + (5 * (vfxQueue[posInQueue].timer - 1)), twoPi, 0);
  fg2.stroke();
  fg2.lineWidth = 1;
};