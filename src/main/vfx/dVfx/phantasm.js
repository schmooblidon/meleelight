import {vfxQueue} from "main/vfx/vfxQueue";
import {drawArrayPathCompress} from "main/render";
import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {activeStage} from "stages/activeStage";
import vfx from "main/vfx/vfxData/index";
export default (j) =>{
  if (!(vfxQueue[j][1] % 2)) {
    drawArrayPathCompress(fg2, makeColour(68, 244, 255, 0.5), vfxQueue[j][3], (vfxQueue[j][2].x * activeStage.scale) + activeStage
            .offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[1], vfx.phantasm.path, 0.47 * (activeStage.scale /
        4.5), 0.47 * (activeStage.scale / 4.5), 0, 0, 0);
  }
};