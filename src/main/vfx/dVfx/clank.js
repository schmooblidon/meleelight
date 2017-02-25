import {fg2} from "main/main";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
export default (posInQueue) =>{
  fg2.save();
  fg2.strokeStyle = "rgb(47, 214, 114)";
  fg2.lineWidth = 10 - (vfxQueue[posInQueue].timer / 3);
  fg2.beginPath();
  fg2.arc((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[1],
      (12 * ((vfxQueue[posInQueue].timer) / vfxQueue[posInQueue].frames) + 3) * (activeStage.scale / 4.5), twoPi, 0);
  fg2.stroke();
  fg2.restore();
};