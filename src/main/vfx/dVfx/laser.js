import {vfxQueue} from "main/vfx/vfxQueue";
import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
export default(j)=> {
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.rotate(-vfxQueue[j][4] * vfxQueue[j][3]);

  fg2.lineWidth = 3;
  if (vfxQueue[j][1] > 3) {
    fg2.strokeStyle = makeColour(255, 59, 59, (1 - (vfxQueue[j][1] - 4) / 6));
    fg2.beginPath();
    fg2.arc(0, 0, (-0.1 + vfxQueue[j][1] * 0.6) * activeStage.scale, 0, twoPi);
    fg2.closePath();
    fg2.stroke();
  }
  fg2.fillStyle = makeColour(255, 57, 87, Math.min(1, (1 - (vfxQueue[j][1] - 4) / 6)));
  fg2.beginPath();
  fg2.moveTo((-vfxQueue[j][1] * 1) * vfxQueue[j][3] * activeStage.scale, (-1.6 - vfxQueue[j][1] * 1.6) * activeStage.scale);
  fg2.lineTo((-2.3 - vfxQueue[j][1] * 1) * vfxQueue[j][3] * activeStage.scale, (-2.4 - vfxQueue[j][1] * 1.6) * activeStage.scale);
  fg2.lineTo((-2.3 - vfxQueue[j][1] * 1) * vfxQueue[j][3] * activeStage.scale, (2.4 + vfxQueue[j][1] * 1.6) * activeStage.scale);
  fg2.lineTo((-vfxQueue[j][1] * 1) * vfxQueue[j][3] * activeStage.scale, (1.6 + vfxQueue[j][1] * 1.6) * activeStage.scale);
  fg2.closePath();
  fg2.fill();
  fg2.restore();
};