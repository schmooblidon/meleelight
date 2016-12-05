import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
export default (j) => {
  fg2.fillStyle = makeColour(73, 255, 244, 0.9 * ((vfxQueue[j][0].frames - vfxQueue[j][1]) / vfxQueue[j][0].frames));
  fg2.beginPath();
  fg2.arc((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + 430, (10 + (3 *
      vfxQueue[j][1])) * (activeStage.scale / 4.5), twoPi, 0);
  fg2.fill();
  fg2.fillStyle = "#cd8eff";
  for (let k = 0; k < 3; k++) {
    fg2.beginPath();
    fg2.arc((vfxQueue[j][2].x * activeStage.scale) + 550 + Math.random() * 100, (vfxQueue[j][2].y * -activeStage.scale) + 380 +
        Math.random() * 100, 8 * (activeStage.scale / 4.5), twoPi, 0);
    fg2.fill();
  }
};