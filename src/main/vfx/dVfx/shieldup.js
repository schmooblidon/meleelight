import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
export default (j)=> {
  fg2.strokeStyle = makeColour(255, 255, 255, 0.8 * ((vfxQueue[j][0].frames - vfxQueue[j][1]) / vfxQueue[j][0].frames));
  fg2.lineWidth = 10;
  fg2.beginPath();
  fg2.arc((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[1],
      vfxQueue[j][4] * activeStage.scale + 10 + (5 * (vfxQueue[j][1] - 1)), twoPi, 0);
  fg2.stroke();
  fg2.lineWidth = 5;
  fg2.beginPath();
  fg2.arc((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[1],
      vfxQueue[j][4] * activeStage.scale + (5 * (vfxQueue[j][1] - 1)), twoPi, 0);
  fg2.stroke();
  fg2.lineWidth = 1;
};