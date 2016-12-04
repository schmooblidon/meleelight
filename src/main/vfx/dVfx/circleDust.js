import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {fg2} from "main/main";
import {twoPi} from "main/render";
export default(j)=> {
  for (let n = 0; n < vfxQueue[j][0].circles.length; n++) {
    const x = ((vfxQueue[j][2].x + (vfxQueue[j][0].circles[n] * (1 + (vfxQueue[j][1] / vfxQueue[j][0].frames)))) *
        activeStage.scale) + activeStage.offset[0];
    const y = ((vfxQueue[j][2].y + (4 * (0 + (vfxQueue[j][1] / vfxQueue[j][0].frames)))) * -activeStage.scale) + activeStage.offset[
            1];
    fg2.fillStyle = makeColour(255, 255, 255, 0.7 * ((vfxQueue[j][0].frames - vfxQueue[j][1]) / vfxQueue[j][0].frames));
    fg2.beginPath();
    fg2.arc(x, y, 12 * (activeStage.scale / 4.5), twoPi, 0);
    fg2.fill();
  }
};