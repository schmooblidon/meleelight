import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
import {blendColours} from "main/vfx/blendColours";
export default (j) =>{
  //rgb(253,255,161)
  //rgb(198, 57, 5)
  const col = blendColours([253, 255, 161], [198, 57, 5], vfxQueue[j][1] / 9);
  fg2.fillStyle = makeColour(col[0], col[1], col[2], 1 - vfxQueue[j][1] / 9);
  fg2.beginPath();
  fg2.arc((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], ((vfxQueue[j][2].y + vfxQueue[j][1]) * -activeStage.scale) +
      activeStage.offset[1], 3 * activeStage.scale, 0, twoPi);
  fg2.closePath();
  fg2.fill();
};