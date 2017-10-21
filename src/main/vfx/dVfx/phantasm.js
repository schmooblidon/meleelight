import {vfxQueue} from "main/vfx/vfxQueue";
import {drawArrayPathCompress} from "main/render";
import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {activeStage} from "stages/activeStage";
import vfx from "main/vfx/vfxData/index";
export default (posInQueue) =>{
  if (!(vfxQueue[posInQueue].timer % 2)) {
    drawArrayPathCompress( fg2
                         , makeColour(68, 0, 0, 0.75)
                         , vfxQueue[posInQueue].face
                         , ((vfxQueue[posInQueue].newPos.x-0.3) * activeStage.scale) + activeStage.offset[0]
                         , ((vfxQueue[posInQueue].newPos.y-0.3) * -activeStage.scale) + activeStage.offset[1]
                         , vfx.phantasm.path
                         , 0.47 * (activeStage.scale / 4.5)
                         , 0.47 * (activeStage.scale / 4.5)
                         , 0
                         , 0
                         , 0
                         , setToScreen );
    drawArrayPathCompress( fg2
                         , makeColour(0, 244, 0, 0.75)
                         , vfxQueue[posInQueue].face
                         , (vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0]
                         , (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[1]
                         , vfx.phantasm.path
                         , 0.47 * (activeStage.scale / 4.5)
                         , 0.47 * (activeStage.scale / 4.5)
                         , 0
                         , 0
                         , 0
                         , setToScreen );
    drawArrayPathCompress( fg2
                         , makeColour(0, 0, 255, 0.75)
                         , vfxQueue[posInQueue].face
                         , ((vfxQueue[posInQueue].newPos.x+0.3) * activeStage.scale) + activeStage.offset[0]
                         , ((vfxQueue[posInQueue].newPos.y+0.3) * -activeStage.scale) + activeStage.offset[1]
                         , vfx.phantasm.path
                         , 0.47 * (activeStage.scale / 4.5)
                         , 0.47 * (activeStage.scale / 4.5)
                         , 0
                         , 0
                         , 0
                         , setToScreen );
  }
};

function setToScreen () {
  fg2.globalCompositeOperation = "screen";
}