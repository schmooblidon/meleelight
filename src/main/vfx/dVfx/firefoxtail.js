import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {twoPi} from "main/render";
export default (j) =>{
  if (vfxQueue[j][5] === undefined || vfxQueue[j][5] === null) {
    vfxQueue[j].push([Math.random(), Math.random(), Math.random(), Math.random()]);
  }
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], ((vfxQueue[j][2].y + 4) * -activeStage.scale) +
      activeStage.offset[1]);
  fg2.fillStyle = makeColour(Math.max(149, 251 - (vfxQueue[j][1] * 5)), Math.max(149, 187 - (vfxQueue[j][1] * 5)),
      Math.min(149, 90 + (vfxQueue[j][1] * 5)), (1 - (vfxQueue[j][1] / 15)));
  fg2.beginPath();
  fg2.arc((-2 + vfxQueue[j][5][0] * 4) * activeStage.scale, (-2 + vfxQueue[j][5][1] * 4) * activeStage.scale, 4 * activeStage.scale,
      0, twoPi);
  fg2.closePath();
  fg2.fill();
  fg2.fillStyle = makeColour(Math.max(149, 223 - (vfxQueue[j][1] * 5)), Math.min(149, 83 + (vfxQueue[j][1] * 5)),
      Math.min(149, 39 + (vfxQueue[j][1] * 5)), (1 - (vfxQueue[j][1] / 15)));
  fg2.beginPath();
  fg2.arc((-2 + vfxQueue[j][5][2] * 4) * activeStage.scale, (-2 + vfxQueue[j][5][3] * 4) * activeStage.scale, 2 * activeStage.scale,
      0, twoPi);
  fg2.closePath();
  fg2.fill();
  fg2.restore();
};