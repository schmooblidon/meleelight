import {fg2} from "main/main";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
export default (j) =>{
  fg2.save();
  fg2.strokeStyle = "rgb(47, 194, 214)";
  fg2.lineWidth = 10 - (vfxQueue[j][1] / 3);
  fg2.beginPath();
  fg2.arc((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[1],
      (12 * ((vfxQueue[j][1]) / vfxQueue[j][0].frames) + 3) * (activeStage.scale / 4.5), twoPi, 0);
  fg2.stroke();
  fg2.restore();
};